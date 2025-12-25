"use client";

interface ScoreCardProps {
  overallScore: number;
  maxScore: number;
  examType: string;
  examName: string;
}

export default function ScoreCard({ overallScore, maxScore }: ScoreCardProps) {
  const percentage = (overallScore / maxScore) * 100;

  //====== Determine which GIF to show based on score percentage ======
  const getGifSrc = () => {
    if (percentage >= 83) {
      return "/Ryan Gosling Clap GIF.gif";
    } else if (percentage >= 78) {
      return "/Great Job Success GIF by BEARISH.gif";
    } else {
      return "/Bored School GIF.gif";
    }
  };

  return (
    <div
      className="relative w-full max-w-md h-80 mx-auto overflow-hidden"
      style={{
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        animation: "blob 7s infinite",
      }}
    >
      {/* Animated GIF Background - Changes based on score */}
      <img
        className="absolute inset-0 w-full h-full object-fill"
        src={getGifSrc()}
        alt="Score animation"
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Score Content on Top - Centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white">
        <div className="text-sm font-medium mb-2 drop-shadow-lg">
          OVERALL SCORE
        </div>
        <div className="text-6xl font-bold drop-shadow-lg">
          {overallScore}
          {maxScore !== 200 && <span className="text-4xl">/{maxScore}</span>}
        </div>
      </div>
    </div>
  );
}
