"use client";

import { ExamType, getAllExamTypes, getExamConfig } from "../../lib/examTypes";

interface ExamTypeTabsProps {
  currentExamType: ExamType;
  onExamTypeChange: (examType: ExamType) => void;
  availableExamTypes?: ExamType[];
}

export default function ExamTypeTabs({
  currentExamType,
  onExamTypeChange,
  availableExamTypes,
}: ExamTypeTabsProps) {
  // Always show all exam types, but highlight which ones have data
  const allExamTypes = getAllExamTypes();
  const examTypes = availableExamTypes && availableExamTypes.length > 0 
    ? allExamTypes.filter(type => availableExamTypes.includes(type) || type === currentExamType)
    : allExamTypes;

  return (
    <div className="flex space-x-1">
      {examTypes.map((examType) => {
        const config = getExamConfig(examType);
        const isActive = currentExamType === examType;
        const hasData = availableExamTypes?.includes(examType) ?? true;

        return (
          <button
            key={examType}
            onClick={() => onExamTypeChange(examType)}
            className={`
              px-4 py-2 font-medium text-sm whitespace-nowrap transition-all duration-200
              rounded-lg
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : hasData
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 cursor-pointer"
              }
            `}
          >
            {config.name}
          </button>
        );
      })}
    </div>
  );
}

