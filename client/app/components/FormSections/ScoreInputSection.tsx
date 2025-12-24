"use client";

interface ScoreInputSectionProps {
  overallScore: number;
  maxScore: number;
  skills: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
  };
  onOverallScoreChange: (value: number) => void;
  onSkillChange: (skill: string, value: number) => void;
}

export default function ScoreInputSection({
  overallScore,
  maxScore,
  skills,
  onOverallScoreChange,
  onSkillChange,
}: ScoreInputSectionProps) {
  const skillLabels = {
    pronunciation: "Pronunciation",
    fluency: "Fluency",
    vocabulary: "Vocabulary",
    grammar: "Grammar",
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Scores</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Score (0-{maxScore})
        </label>
        <input
          type="number"
          min="0"
          max={maxScore}
          value={overallScore}
          onChange={(e) => onOverallScoreChange(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(skills).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {skillLabels[key as keyof typeof skillLabels]} (0-{maxScore})
            </label>
            <input
              type="number"
              min="0"
              max={maxScore}
              value={value}
              onChange={(e) => onSkillChange(key, Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        ))}
      </div>
    </div>
  );
}

