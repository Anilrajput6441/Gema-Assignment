"use client";

interface FeedbackSectionProps {
  feedback: {
    overall: string;
    pronunciation: string;
    fluency: string;
    vocabulary: string;
    grammar: string;
  };
}

export default function FeedbackSection({ feedback }: FeedbackSectionProps) {
  const feedbackItems = [
    { label: "Overall", text: feedback.overall },
    { label: "Pronunciation", text: feedback.pronunciation },
    { label: "Fluency", text: feedback.fluency },
    { label: "Vocabulary", text: feedback.vocabulary },
    { label: "Grammar", text: feedback.grammar },
  ];

  return (
    <div className="pt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">DESCRIPTIVE FEEDBACK</h2>
      <div className="space-y-3">
        {feedbackItems.map((item, index) => (
          <div key={item.label} className="pb-3 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start gap-4">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider min-w-[100px] pt-1">
                {item.label}
              </span>
              <p className="text-gray-600 text-sm leading-6 flex-1">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

