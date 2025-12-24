"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface ChartProps {
  skills: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
  };
  chartType?: "bar" | "radar";
  maxScore: number;
}

export default function Chart({ skills, chartType = "bar", maxScore = 9 }: ChartProps) {
  const labels = ["Pronunciation", "Fluency", "Vocabulary", "Grammar"];
  const data = [
    skills.pronunciation,
    skills.fluency,
    skills.vocabulary,
    skills.grammar,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Score",
        data,
        backgroundColor: data.map((score) => {
          const percentage = (score / maxScore) * 100;
          return percentage >= 88
            ? "rgba(34, 197, 94, 0.6)"
            : percentage >= 66
            ? "rgba(234, 179, 8, 0.6)"
            : "rgba(239, 68, 68, 0.6)";
        }),
        borderColor: data.map((score) => {
          const percentage = (score / maxScore) * 100;
          return percentage >= 88
            ? "rgba(34, 197, 94, 1)"
            : percentage >= 66
            ? "rgba(234, 179, 8, 1)"
            : "rgba(239, 68, 68, 1)";
        }),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales:
      chartType === "bar"
        ? {
            y: {
              beginAtZero: true,
              max: maxScore,
              ticks: {
                stepSize: maxScore <= 10 ? 1 : Math.ceil(maxScore / 10),
              },
            },
          }
        : {
            r: {
              beginAtZero: true,
              max: maxScore,
              ticks: {
                stepSize: maxScore <= 10 ? 1 : Math.ceil(maxScore / 10),
              },
            },
          },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const score = context.parsed.y || context.parsed.r;
            return `${score}${maxScore !== 200 ? ` / ${maxScore}` : ""}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-64 pt-4">
      {chartType === "bar" ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Radar data={chartData} options={options} />
      )}
    </div>
  );
}

