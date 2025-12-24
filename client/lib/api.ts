import assessmentsData from "../data/assessments.json";
import fallbackData from "../data/fallback-data.json";
import { generateAllFeedback } from "./feedbackLogic";
import { getExamConfig } from "./examTypes";

// Load assessments from JSON file and localStorage
const loadAssessments = (): any[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("assessments");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn("Error parsing stored assessments:", e);
      }
    }
  }
  return [...assessmentsData];
};

let assessments: any[] = loadAssessments();

/**
 * Add dynamic feedback to assessment data
 */
const addDynamicFeedback = (assessment: any) => {
  if (!assessment) return assessment;
  
  const examType = assessment.examType || "speechace";
  const examConfig = getExamConfig(examType);
  const maxScore = examConfig.maxScore;
  
  // Generate feedback dynamically if not present or if we want to regenerate
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
 * Get assessment data from JSON
 */
export const getAssessment = async (id?: string, examType?: string) => {
  try {
    let assessment;
    if (id) {
      assessment = assessments.find((a) => a._id === id);
    } else {
      if (examType) {
        assessment = assessments
          .filter((a) => a.examType === examType)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      } else {
        assessment = assessments.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
      }
    }
    
    const result = assessment || fallbackData;
    return addDynamicFeedback(result);
  } catch (error) {
    console.warn("Error loading assessment data:", error);
    return addDynamicFeedback(fallbackData);
  }
};

/**
 * Create new assessment (stores in memory/JSON)
 */
export const createAssessment = async (data: any) => {
  try {
    const newAssessment = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assessments.push(newAssessment);
    
    // Store in localStorage as backup
    if (typeof window !== "undefined") {
      localStorage.setItem("assessments", JSON.stringify(assessments));
    }

    return { status: "success", data: newAssessment };
  } catch (error: any) {
    throw new Error("Failed to create assessment");
  }
};

/**
 * Get all assessments (optionally filtered by exam type)
 */
export const getAllAssessments = async (examType?: string) => {
  try {
    // Always reload from localStorage to get latest data
    assessments = loadAssessments();

    let result = assessments;
    if (examType) {
      result = assessments.filter((a) => a.examType === examType);
    }
    
    // Add dynamic feedback to all assessments
    return result.map((assessment) => addDynamicFeedback(assessment));
  } catch (error) {
    console.warn("Error loading assessments:", error);
    return [];
  }
};

