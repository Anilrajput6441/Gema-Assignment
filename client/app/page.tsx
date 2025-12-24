"use client";

import { useEffect, useState } from "react";
import ScoreCard from "./components/ScoreCard";
import SkillScores from "./components/SkillScores";
import Chart from "./components/Chart";
import FeedbackSection from "./components/FeedbackSection";
import ExamTypeTabs from "./components/ExamTypeTabs";
import UserInfoSection from "./components/UserInfoSection";
import CreateUserLink from "./components/CreateUserLink";
import { getUserData } from "../lib/api";
import { ExamType, getExamConfig } from "../lib/examTypes";
import { generateAllFeedback } from "../lib/feedbackLogic";

interface UserData {
  studentName: string;
  email: string;
  mobile: string;
  profilePhoto: string;
  exams: Array<{
    _id: string;
    examType: ExamType;
    testDate: string;
    overallScore: number;
    scores: number[]; // [pronunciation, fluency, vocabulary, grammar]
    createdAt: string;
    updatedAt: string;
  }>;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentExamType, setCurrentExamType] = useState<ExamType>("speechace");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current exam from userData
  const currentExam = userData?.exams.find(
    (exam) => exam.examType === currentExamType
  ) || userData?.exams[0] || null;

  // Get available exam types
  const availableExamTypes = userData?.exams
    ? (Array.from(new Set(userData.exams.map((e) => e.examType))) as ExamType[])
    : [];

  // If current exam type has no data, switch to first available
  if (currentExam && currentExam.examType !== currentExamType) {
    setCurrentExamType(currentExam.examType);
  }

  const examConfig = currentExam
    ? getExamConfig(currentExam.examType)
    : getExamConfig(currentExamType);

  // Convert scores array to skills object for display
  const skills = currentExam
    ? {
        pronunciation: currentExam.scores[0] || 0,
        fluency: currentExam.scores[1] || 0,
        vocabulary: currentExam.scores[2] || 0,
        grammar: currentExam.scores[3] || 0,
      }
    : {
        pronunciation: 0,
        fluency: 0,
        vocabulary: 0,
        grammar: 0,
      };

  // Generate feedback
  const feedback = currentExam
    ? generateAllFeedback(
        {
          overall: currentExam.overallScore,
          pronunciation: skills.pronunciation,
          fluency: skills.fluency,
          vocabulary: skills.vocabulary,
          grammar: skills.grammar,
        },
        examConfig.maxScore
      )
    : {
        overall: "",
        pronunciation: "",
        fluency: "",
        vocabulary: "",
        grammar: "",
      };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-gray-600">Loading assessment data...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!userData || !currentExam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Student Assessment Report
              </h2>
              <ul className="text-sm text-gray-600 mb-6 space-y-1 list-disc list-inside">
                <li>Create a user account</li>
                <li>Submit exam data for all exam types</li>
                <li>View results with charts and feedback</li>
              </ul>
              <p className="text-gray-600 mb-4">No assessment data available yet.</p>
              <CreateUserLink />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 mb-6">
          View exam results. Switch between exam types using tabs. Data fetched from backend server.
        </p>

        {/* User Info Section */}
        <UserInfoSection
          studentName={userData.studentName}
          testDate={currentExam.testDate}
          mobile={userData.mobile}
          email={userData.email}
          profilePhoto={userData.profilePhoto}
        />

        {/* Summary of scores section with tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Summary of scores
            </h2>
            <ExamTypeTabs
              currentExamType={currentExam.examType}
              onExamTypeChange={(examType) => {
                setCurrentExamType(examType);
              }}
              availableExamTypes={
                availableExamTypes.length > 0 ? availableExamTypes : undefined
              }
            />
          </div>
        </div>

        {/* Overall Score */}
        <div className="mb-6">
          <ScoreCard
            overallScore={currentExam.overallScore}
            maxScore={examConfig.maxScore}
            examType={currentExam.examType}
            examName={examConfig.name}
          />
        </div>

        {/* Score Visualization and Skill Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              SCORE VISUALISATION
            </h3>
            <Chart
              skills={skills}
              chartType="radar"
              maxScore={examConfig.maxScore}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              SKILL WISE SCORE
            </h3>
            <SkillScores skills={skills} maxScore={examConfig.maxScore} />
          </div>
        </div>

        {/* Descriptive Feedback */}
        <div className="mb-6">
          <FeedbackSection feedback={feedback} />
        </div>
      </main>
    </div>
  );
}
