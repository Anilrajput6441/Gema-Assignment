import Assessment from "../models/Assessment.model.js";

/**
 * Create a new assessment
 */
export const createAssessment = async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    const savedAssessment = await assessment.save();
    res.status(201).json({
      status: "success",
      data: savedAssessment,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get all assessments (or latest one, optionally filtered by exam type)
 */
export const getAssessments = async (req, res) => {
  try {
    const { latest, examType } = req.query;
    
    if (latest === "true") {
      const query = examType ? { examType } : {};
      const assessment = await Assessment.findOne(query).sort({ createdAt: -1 });
      if (!assessment) {
        return res.status(404).json({
          status: "error",
          message: "No assessments found",
        });
      }
      return res.status(200).json({
        status: "success",
        data: assessment,
      });
    }

    const query = examType ? { examType } : {};
    const assessments = await Assessment.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get a specific assessment by ID
 */
export const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        status: "error",
        message: "Assessment not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: assessment,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

