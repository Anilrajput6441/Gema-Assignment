//====== Generate feedback based on score ranges ======
export const generateFeedback = (score: number, maxScore: number = 9): string => {
  const percentage = (score / maxScore) * 100;
  
  if (score >= 8 || percentage >= 88) {
    return "Excellent performance with strong control.";
  } else if ((score >= 6 && score < 8) || (percentage >= 66 && percentage < 88)) {
    return "Good performance with minor inaccuracies.";
  } else {
    return "Needs improvement.";
  }
};

//====== Generate feedback for all skills and overall ======
export const generateAllFeedback = (
  scores: {
    overall: number;
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
  },
  maxScore: number = 9
) => {
  return {
    overall: generateFeedback(scores.overall, maxScore),
    pronunciation: generateFeedback(scores.pronunciation, maxScore),
    fluency: generateFeedback(scores.fluency, maxScore),
    vocabulary: generateFeedback(scores.vocabulary, maxScore),
    grammar: generateFeedback(scores.grammar, maxScore),
  };
};

