"use client";

import { useEffect, useState } from "react";
import ScoreCard from "./components/ScoreCard";
import SkillScores from "./components/SkillScores";
import Chart from "./components/Chart";
import FeedbackSection from "./components/FeedbackSection";
import ExamTypeTabs from "./components/ExamTypeTabs";
import UserInfoSection from "./components/UserInfoSection";
import { getAllAssessments } from "../lib/api";
import { ExamType, getExamConfig } from "../lib/examTypes";

interface AssessmentData {
  _id?: string;
  studentName: string;
  examType?: ExamType;
  testDate: string;
  mobile?: string;
  email?: string;
  profilePhoto?: string;
  overallScore: number;
  skills: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
  };
  feedback: {
    overall: string;
    pronunciation: string;
    fluency: string;
    vocabulary: string;
    grammar: string;
  };
}

export default function Home() {
  const [allAssessments, setAllAssessments] = useState<AssessmentData[]>([]);
  const [currentExamType, setCurrentExamType] = useState<ExamType>("speechace");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assessments = await getAllAssessments();
        setAllAssessments(assessments || []);
      } catch (error) {
        console.error("Error loading assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh data when component mounts or when assessments might have changed
  useEffect(() => {
    const handleStorageChange = () => {
      getAllAssessments().then((data) => {
        setAllAssessments(data || []);
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      // Also check periodically for changes
      const interval = setInterval(handleStorageChange, 1000);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  // Get current assessment for selected exam type
  const currentData =
    allAssessments.find(
      (assessment) => (assessment.examType || "speechace") === currentExamType
    ) ||
    allAssessments[0] ||
    null;

  // Get available exam types from assessments
  const availableExamTypes = Array.from(
    new Set(allAssessments.map((a) => a.examType || "speechace"))
  ) as ExamType[];

  // If current exam type has no data, try to find one that does
  if (!currentData && allAssessments.length > 0) {
    const firstAvailable = allAssessments[0];
    if (firstAvailable?.examType) {
      setCurrentExamType(firstAvailable.examType as ExamType);
    }
  }

  // Re-fetch current data after exam type might have changed
  const updatedCurrentData =
    allAssessments.find(
      (assessment) => (assessment.examType || "speechace") === currentExamType
    ) ||
    allAssessments[0] ||
    null;

  const finalData = updatedCurrentData || currentData;
  const finalExamConfig = finalData?.examType
    ? getExamConfig(finalData.examType as ExamType)
    : getExamConfig(currentExamType);

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

  if (!finalData && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-gray-600 mb-4">
                No assessment data available
              </div>
              <a
                href="/submit"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Submit your first assessment
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!finalData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Section */}
        <UserInfoSection
          studentName={finalData.studentName}
          testDate={finalData.testDate}
          mobile={finalData.mobile}
          email={finalData.email}
          profilePhoto={finalData.profilePhoto}
        />

        {/* Summary of scores section with tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Summary of scores
            </h2>
            <ExamTypeTabs
              currentExamType={
                (finalData.examType as ExamType) || currentExamType
              }
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
            overallScore={finalData.overallScore}
            maxScore={finalExamConfig.maxScore}
            examType={finalData.examType || "speechace"}
            examName={finalExamConfig.name}
          />
        </div>

        {/* Score Visualization and Skill Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              SCORE VISUALISATION
            </h3>
            <Chart
              skills={finalData.skills}
              chartType="radar"
              maxScore={finalExamConfig.maxScore}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              SKILL WISE SCORE
            </h3>
            <SkillScores
              skills={finalData.skills}
              maxScore={finalExamConfig.maxScore}
            />
          </div>
        </div>

        {/* Descriptive Feedback */}
        <div className="mb-6">
          <FeedbackSection feedback={finalData.feedback} />
        </div>
      </main>
    </div>
  );
}
