"use client";

import { ExamType, getAllExamTypes, getExamConfig } from "../../../lib/examTypes";

interface StudentInfoSectionProps {
  studentName: string;
  examType: ExamType;
  testDate: string;
  onStudentNameChange: (value: string) => void;
  onExamTypeChange: (value: ExamType) => void;
  onTestDateChange: (value: string) => void;
}

export default function StudentInfoSection({
  studentName,
  examType,
  testDate,
  onStudentNameChange,
  onExamTypeChange,
  onTestDateChange,
}: StudentInfoSectionProps) {
  const examTypes = getAllExamTypes();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Student Information
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Name
        </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter student name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exam Type
        </label>
        <select
          value={examType}
          onChange={(e) => onExamTypeChange(e.target.value as ExamType)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {examTypes.map((type) => {
            const config = getExamConfig(type);
            return (
              <option key={type} value={type}>
                {config.name}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Date
        </label>
        <input
          type="date"
          value={testDate}
          onChange={(e) => onTestDateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
}

