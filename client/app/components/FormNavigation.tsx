"use client";

interface FormNavigationProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isLastSection: boolean;
}

export default function FormNavigation({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSubmit,
  isLastSection,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentSection === 0}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          currentSection === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Previous
      </button>

      <div className="text-sm text-gray-600">
        Section {currentSection + 1} of {totalSections}
      </div>

      {isLastSection ? (
        <button
          type="button"
          onClick={onSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
}

