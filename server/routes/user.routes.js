import express from "express";
import {
  createUser,
  submitAllExamData,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";

const router = express.Router();

//====== Create a new user (returns userId) ======
router.post("/", createUser);

//====== Submit all exam data for a user at once ======
router.post("/:userId/exams", submitAllExamData);

//====== Get all users with their exams and scores ======
router.get("/", getAllUsers);

//====== Get a specific user by userId (returns all data) ======
router.get("/:userId", getUserById);

export default router;
