import assessmentsData from "../data/assessments.json";
import fallbackData from "../data/fallback-data.json";
import { generateAllFeedback } from "./feedbackLogic";
import { getExamConfig } from "./examTypes";

const API_BASE_URL = "http://localhost:8000/api";

/**
 * Get userId from localStorage
 */
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
};

/**
 * Get user data from localStorage (helper function)
 */
export const getStoredUserData = () => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

/**
 * Fetch user data from backend
 */
const fetchUserFromBackend = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user from backend:", error);
    return null;
  }
};

/**
 * Get user data from backend (single object with exams array)
 */
export const getUserDataFromBackend = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data.data; // Returns user object with exams array
  } catch (error) {
    console.error("Error fetching user from backend:", error);
    return null;
  }
};

/**
 * Add dynamic feedback to assessment data
 */
const addDynamicFeedback = (assessment: any) => {
  if (!assessment) return assessment;

  const examType = assessment.examType || "speechace";
  const examConfig = getExamConfig(examType);
  const maxScore = examConfig.maxScore;

  // Generate feedback dynamically
  const feedback = generateAllFeedback(
    {
      overall: assessment.overallScore,
      pronunciation: assessment.skills.pronunciation,
      fluency: assessment.skills.fluency,
      vocabulary: assessment.skills.vocabulary,
      grammar: assessment.skills.grammar,
    },
    maxScore
  );

  return {
    ...assessment,
    feedback,
  };
};

/**
 * Get user data - single object with exams array
 */
export const getUserData = async () => {
  try {
    // Check if userId exists in localStorage
    const userId = getUserId();
    
    if (userId) {
      // Fetch from backend - returns single user object with exams array
      const userData = await getUserDataFromBackend(userId);
      if (userData && userData.exams && userData.exams.length > 0) {
        return userData; // Return user object directly
      }
    }

    // Fallback: Use JSON data (already in correct format)
    // assessmentsData is now array of user objects
    if (assessmentsData && Array.isArray(assessmentsData) && assessmentsData.length > 0) {
      // Return first user object (already in correct format)
      return assessmentsData[0];
    }
    
    // If no data, use fallback
    return fallbackData;
  } catch (error) {
    console.warn("Error loading user data:", error);
    // Return fallback data
    return {
      studentName: fallbackData.studentName,
      email: fallbackData.email || "",
      mobile: fallbackData.mobile || "",
      profilePhoto: fallbackData.profilePhoto || "/profile.jpg",
      exams: [{
        _id: "fallback",
        examType: fallbackData.examType,
        testDate: fallbackData.testDate,
        overallScore: fallbackData.overallScore,
        scores: [
          fallbackData.skills.pronunciation,
          fallbackData.skills.fluency,
          fallbackData.skills.vocabulary,
          fallbackData.skills.grammar,
        ],
        createdAt: fallbackData.createdAt || new Date().toISOString(),
        updatedAt: fallbackData.updatedAt || new Date().toISOString(),
      }],
    };
  }
};

/**
 * Get user data - returns single user object with exams array
 * This is the main function to use - returns complete user data at once
 */
export const getAllAssessments = async () => {
  return getUserData();
};

/**
 * Create new assessment (stores in memory/JSON) - DEPRECATED, use submit-exam page
 */
export const createAssessment = async (data: any) => {
  try {
    const newAssessment = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in localStorage as backup
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("assessments");
      const assessments = stored ? JSON.parse(stored) : [];
      assessments.push(newAssessment);
      localStorage.setItem("assessments", JSON.stringify(assessments));
    }

    return { status: "success", data: newAssessment };
  } catch (error: any) {
    throw new Error("Failed to create assessment");
  }
};

