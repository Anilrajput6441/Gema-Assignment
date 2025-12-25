import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//====== Load users from JSON file ======
const loadUsers = () => {
  try {
    const filePath = path.join(__dirname, "../data/users.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

//====== Save users to JSON file ======
const saveUsers = (users) => {
  try {
    const filePath = path.join(__dirname, "../data/users.json");
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
    throw error;
  }
};

//====== Create a new user (Returns user ID for submitting exam data) ======
export const createUser = async (req, res) => {
  try {
    const { studentName, email, mobile, profilePhoto } = req.body;

    // Validation
    if (!studentName || !email) {
      return res.status(400).json({
        status: "error",
        message: "Student name and email are required",
      });
    }

    // Check if user already exists
    const users = loadUsers();
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(200).json({
        status: "success",
        message: "User already exists",
        data: {
          userId: existingUser.userId,
          studentName: existingUser.studentName,
          email: existingUser.email,
        },
      });
    }

    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      userId,
      studentName,
      email: email.toLowerCase(),
      mobile: mobile || "",
      profilePhoto: profilePhoto || "",
      exams: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        userId: newUser.userId,
        studentName: newUser.studentName,
        email: newUser.email,
        message: "Copy this userId to submit exam data",
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create user. Please try again.",
      error: error.message,
    });
  }
};

//====== Submit all exam data for a user at once ======
export const submitAllExamData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { exams } = req.body; // Array of all exams

    // Validation
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    if (!exams || !Array.isArray(exams)) {
      return res.status(400).json({
        status: "error",
        message: "Exams array is required",
      });
    }

    // Load users
    const users = loadUsers();
    const user = users.find((u) => u.userId === userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found. Please create user first.",
      });
    }

    // Process all exams
    const processedExams = exams.map((exam) => {
      // Convert skills object to scores array if needed
      let scores;
      if (exam.skills) {
        scores = [
          exam.skills.pronunciation || 0,
          exam.skills.fluency || 0,
          exam.skills.vocabulary || 0,
          exam.skills.grammar || 0,
        ];
      } else if (exam.scores && Array.isArray(exam.scores)) {
        scores = exam.scores;
      } else {
        scores = [0, 0, 0, 0];
      }

      return {
        _id: exam._id || `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        examType: exam.examType || "",
        testDate: exam.testDate || new Date().toISOString(),
        overallScore: exam.overallScore || 0,
        scores: scores,
        createdAt: exam.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Replace all exams for the user
    user.exams = processedExams;
    user.updatedAt = new Date().toISOString();

    // Save users
    saveUsers(users);

    res.status(201).json({
      status: "success",
      message: "All exam data submitted successfully",
      data: {
        userId: user.userId,
        studentName: user.studentName,
        totalExams: user.exams.length,
      },
    });
  } catch (error) {
    console.error("Error submitting exam data:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to submit exam data. Please try again.",
      error: error.message,
    });
  }
};

//====== Get all users with their exams and scores ======
export const getAllUsers = async (req, res) => {
  try {
    const users = loadUsers();
    res.status(200).json({
      status: "success",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

//====== Get a specific user by userId ======
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const users = loadUsers();

    const user = users.find((u) => u.userId === userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};
