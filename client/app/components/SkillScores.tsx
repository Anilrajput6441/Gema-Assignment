"use client";

interface SkillScoresProps {
  skills: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
  };
  maxScore: number;
}

export default function SkillScores({ skills, maxScore }: SkillScoresProps) {
  const skillLabels = {
    pronunciation: "Pronunciation",
    fluency: "Fluency",
    vocabulary: "Vocabulary",
    grammar: "Grammar",
  };

  const getColor = (score: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 88) return "bg-green-500";
    if (percentage >= 66) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 pt-4">
      {Object.entries(skills).map(([key, score]) => (
        <div key={key}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">
              {skillLabels[key as keyof typeof skillLabels]}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {score}
              {maxScore !== 200 && ` / ${maxScore}`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getColor(score)}`}
              style={{ width: `${Math.min((score / maxScore) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

