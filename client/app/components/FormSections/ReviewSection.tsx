"use client";

import { ExamConfig } from "../../../lib/examTypes";

interface ReviewSectionProps {
  data: {
    studentName: string;
    examType?: string;
    testDate: string;
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
  };
  examConfig: ExamConfig;
}

export default function ReviewSection({ data, examConfig }: ReviewSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Review & Submit
      </h3>
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <span className="font-semibold text-gray-700">Student Name: </span>
          <span className="text-gray-600">{data.studentName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Exam Type: </span>
          <span className="text-gray-600">{examConfig.name}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Test Date: </span>
          <span className="text-gray-600">
            {new Date(data.testDate).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Overall Score: </span>
          <span className="text-gray-600">
            {data.overallScore}
            {examConfig.maxScore !== 200 && ` / ${examConfig.maxScore}`}
          </span>
        </div>
        <div className="mt-4">
          <span className="font-semibold text-gray-700">Skill Scores: </span>
          <div className="mt-2 space-y-2 ml-4">
            <div>
              Pronunciation: {data.skills.pronunciation}
              {examConfig.maxScore !== 200 && ` / ${examConfig.maxScore}`}
            </div>
            <div>
              Fluency: {data.skills.fluency}
              {examConfig.maxScore !== 200 && ` / ${examConfig.maxScore}`}
            </div>
            <div>
              Vocabulary: {data.skills.vocabulary}
              {examConfig.maxScore !== 200 && ` / ${examConfig.maxScore}`}
            </div>
            <div>
              Grammar: {data.skills.grammar}
              {examConfig.maxScore !== 200 && ` / ${examConfig.maxScore}`}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <span className="font-semibold text-gray-700">Feedback: </span>
          <div className="mt-2 space-y-2 ml-4 text-sm text-gray-600">
            <div>
              <strong>Overall:</strong> {data.feedback.overall}
            </div>
            <div>
              <strong>Pronunciation:</strong> {data.feedback.pronunciation}
            </div>
            <div>
              <strong>Fluency:</strong> {data.feedback.fluency}
            </div>
            <div>
              <strong>Vocabulary:</strong> {data.feedback.vocabulary}
            </div>
            <div>
              <strong>Grammar:</strong> {data.feedback.grammar}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

