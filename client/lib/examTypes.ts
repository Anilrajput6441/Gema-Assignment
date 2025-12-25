//====== Exam type definitions with their score ranges and configurations ======

export type ExamType = "speechace" | "cefr" | "ielts" | "pte" | "toefl" | "toeic";

export interface ExamConfig {
  name: string;
  maxScore: number;
  minScore: number;
  scoreLabel: string;
  color: string;
}

export const EXAM_TYPES: Record<ExamType, ExamConfig> = {
  speechace: {
    name: "Speechace",
    maxScore: 9,
    minScore: 0,
    scoreLabel: "/9",
    color: "blue",
  },
  cefr: {
    name: "CEFR",
    maxScore: 6, // A1, A2, B1, B2, C1, C2
    minScore: 1,
    scoreLabel: "",
    color: "purple",
  },
  ielts: {
    name: "IELTS",
    maxScore: 9,
    minScore: 0,
    scoreLabel: "/9",
    color: "red",
  },
  pte: {
    name: "PTE",
    maxScore: 90,
    minScore: 0,
    scoreLabel: "/90",
    color: "green",
  },
  toefl: {
    name: "TOEFL",
    maxScore: 120,
    minScore: 0,
    scoreLabel: "/120",
    color: "orange",
  },
  toeic: {
    name: "TOEIC",
    maxScore: 200,
    minScore: 0,
    scoreLabel: "/200",
    color: "indigo",
  },
};

//====== Get exam type configuration ======
export const getExamConfig = (examType: ExamType): ExamConfig => {
  return EXAM_TYPES[examType];
};

//====== Get all exam types as array ======
export const getAllExamTypes = (): ExamType[] => {
  return Object.keys(EXAM_TYPES) as ExamType[];
};

//====== Convert score from one exam type to another (approximate) ======
export const convertScore = (
  score: number,
  fromExam: ExamType,
  toExam: ExamType
): number => {
  const fromConfig = EXAM_TYPES[fromExam];
  const toConfig = EXAM_TYPES[toExam];

  // Normalize to 0-1 range
  const normalized = (score - fromConfig.minScore) / (fromConfig.maxScore - fromConfig.minScore);

  // Convert to target range
  return Math.round(
    normalized * (toConfig.maxScore - toConfig.minScore) + toConfig.minScore
  );
};

