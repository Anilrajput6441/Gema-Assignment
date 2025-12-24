import mongoose from "mongoose";

/**
 * Assessment Schema
 * Stores student speaking assessment results
 */
const assessmentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    examType: {
      type: String,
      required: [true, "Exam type is required"],
      enum: ["speechace", "cefr", "ielts", "pte", "toefl", "toeic"],
      default: "speechace",
    },
    testDate: {
      type: Date,
      required: [true, "Test date is required"],
      default: Date.now,
    },
    overallScore: {
      type: Number,
      required: [true, "Overall score is required"],
      min: 0,
    },
    skills: {
      pronunciation: {
        type: Number,
        required: true,
        min: 0,
      },
      fluency: {
        type: Number,
        required: true,
        min: 0,
      },
      vocabulary: {
        type: Number,
        required: true,
        min: 0,
      },
      grammar: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    feedback: {
      overall: {
        type: String,
        default: "",
      },
      pronunciation: {
        type: String,
        default: "",
      },
      fluency: {
        type: String,
        default: "",
      },
      vocabulary: {
        type: String,
        default: "",
      },
      grammar: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;

