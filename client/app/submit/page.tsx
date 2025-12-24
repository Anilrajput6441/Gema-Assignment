"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StudentInfoSection from "../components/FormSections/StudentInfoSection";
import ScoreInputSection from "../components/FormSections/ScoreInputSection";
import ReviewSection from "../components/FormSections/ReviewSection";
import FormNavigation from "../components/FormNavigation";
import { createAssessment } from "../../lib/api";
import { generateAllFeedback } from "../../lib/feedbackLogic";
import { ExamType, getAllExamTypes, getExamConfig } from "../../lib/examTypes";

export default function SubmitPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    studentName: "",
    examType: "speechace" as ExamType,
    testDate: new Date().toISOString().split("T")[0],
    overallScore: 0,
    skills: {
      pronunciation: 0,
      fluency: 0,
      vocabulary: 0,
      grammar: 0,
    },
  });

  const examConfig = getExamConfig(formData.examType);

  const sections = [
    {
      title: "Student Information",
      component: (
        <StudentInfoSection
          studentName={formData.studentName}
          examType={formData.examType}
          testDate={formData.testDate}
          onStudentNameChange={(value) =>
            setFormData({ ...formData, studentName: value })
          }
          onExamTypeChange={(value) => {
            const newConfig = getExamConfig(value);
            // Reset scores when exam type changes
            setFormData({
              ...formData,
              examType: value,
              overallScore: 0,
              skills: {
                pronunciation: 0,
                fluency: 0,
                vocabulary: 0,
                grammar: 0,
              },
            });
          }}
          onTestDateChange={(value) =>
            setFormData({ ...formData, testDate: value })
          }
        />
      ),
    },
    {
      title: "Scores",
      component: (
        <ScoreInputSection
          overallScore={formData.overallScore}
          maxScore={examConfig.maxScore}
          skills={formData.skills}
          onOverallScoreChange={(value) =>
            setFormData({ ...formData, overallScore: value })
          }
          onSkillChange={(skill, value) =>
            setFormData({
              ...formData,
              skills: { ...formData.skills, [skill]: value },
            })
          }
        />
      ),
    },
    {
      title: "Review & Submit",
      component: (
        <ReviewSection
          data={{
            ...formData,
            feedback: generateAllFeedback(
              {
                overall: formData.overallScore,
                pronunciation: formData.skills.pronunciation,
                fluency: formData.skills.fluency,
                vocabulary: formData.skills.vocabulary,
                grammar: formData.skills.grammar,
              },
              examConfig.maxScore
            ),
          }}
          examConfig={examConfig}
        />
      ),
    },
  ];

  const validateCurrentSection = () => {
    if (currentSection === 0) {
      if (!formData.studentName.trim()) {
        setError("Student name is required");
        return false;
      }
      if (!formData.testDate) {
        setError("Test date is required");
        return false;
      }
    } else if (currentSection === 1) {
      if (formData.overallScore < 0 || formData.overallScore > examConfig.maxScore) {
        setError(`Overall score must be between 0 and ${examConfig.maxScore}`);
        return false;
      }
      const skills = Object.values(formData.skills);
      if (skills.some((score) => score < 0 || score > examConfig.maxScore)) {
        setError(`All skill scores must be between 0 and ${examConfig.maxScore}`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentSection()) {
      return;
    }
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Generate feedback
      const feedback = generateAllFeedback(
        {
          overall: formData.overallScore,
          pronunciation: formData.skills.pronunciation,
          fluency: formData.skills.fluency,
          vocabulary: formData.skills.vocabulary,
          grammar: formData.skills.grammar,
        },
        examConfig.maxScore
      );

      // Prepare data for submission
      const submissionData = {
        studentName: formData.studentName,
        examType: formData.examType,
        testDate: new Date(formData.testDate).toISOString(),
        overallScore: formData.overallScore,
        skills: formData.skills,
        feedback,
      };

      const result = await createAssessment(submissionData);
      if (result.status === "success") {
        // Trigger a page refresh to show new data
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit assessment");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            {sections[currentSection].title}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {sections[currentSection].component}

          <FormNavigation
            currentSection={currentSection}
            totalSections={sections.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLastSection={currentSection === sections.length - 1}
          />

          {loading && (
            <div className="mt-4 text-center text-gray-600">
              Submitting assessment...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

