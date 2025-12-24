import express from "express";
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
} from "../controllers/assessment.controller.js";

const router = express.Router();

// Create new assessment
router.post("/", createAssessment);

// Get all assessments or latest
router.get("/", getAssessments);

// Get assessment by ID
router.get("/:id", getAssessmentById);

export default router;

