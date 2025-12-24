"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExamType, getAllExamTypes, getExamConfig } from "../../lib/examTypes";

export default function SubmitExamPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const examTypes = getAllExamTypes();

  // Initialize form data for all exam types
  const [formData, setFormData] = useState(() => {
    const initial: Record<
      string,
      {
        examType: ExamType;
        testDate: string;
        overallScore: number;
        skills: {
          pronunciation: number;
          fluency: number;
          vocabulary: number;
          grammar: number;
        };
      }
    > = {};
    examTypes.forEach((type) => {
      initial[type] = {
        examType: type,
        testDate: new Date().toISOString().split("T")[0],
        overallScore: 0,
        skills: {
          pronunciation: 0,
          fluency: 0,
          vocabulary: 0,
          grammar: 0,
        },
      };
    });
    return initial;
  });

  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!userId) {
      setError("User ID is required. Please create a user first.");
      setLoading(false);
      return;
    }

    try {
      // Convert form data to exams array
      const exams = examTypes.map((type) => ({
        examType: type,
        testDate: new Date(formData[type].testDate).toISOString(),
        overallScore: formData[type].overallScore || 0,
        skills: {
          pronunciation: formData[type].skills.pronunciation || 0,
          fluency: formData[type].skills.fluency || 0,
          vocabulary: formData[type].skills.vocabulary || 0,
          grammar: formData[type].skills.grammar || 0,
        },
      }));

      const response = await fetch(
        `http://localhost:8000/api/users/${userId}/exams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exams }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit exam data");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit exam data. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateExamData = (
    examType: ExamType,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [examType]: {
        ...prev[examType],
        [field]: value,
      },
    }));
  };

  const updateSkill = (examType: ExamType, skill: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [examType]: {
        ...prev[examType],
        skills: {
          ...prev[examType].skills,
          [skill]: value,
        },
      },
    }));
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-['Roboto_Slab']">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl border border-gray-200">
          <div>
            <p className="text-gray-800 mb-2">No User ID found</p>
            <p className="text-sm text-gray-600 mb-4">
              Create a user account first before submitting exam data.
            </p>
            <button
              onClick={() => router.push("/create-user")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Go to Create User Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-['Roboto_Slab']">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Submit All Exam Data
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Step 2: Fill exam data for all exam types. Leave blank if not taken.
            All data saved at once.
          </p>
          {userId && (
            <p className="text-xs text-gray-500 text-center mb-6">
              User ID: <span className="font-mono">{userId}</span>
            </p>
          )}

          {success ? (
            <div className="text-center">
              <p className="text-gray-800 font-semibold mb-2">
                Exam data submitted successfully
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Redirecting to home page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {examTypes.map((examType) => {
                const examConfig = getExamConfig(examType);
                const data = formData[examType];

                return (
                  <div
                    key={examType}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      {examConfig.name} ({examConfig.minScore} -{" "}
                      {examConfig.maxScore})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Date
                        </label>
                        <input
                          type="date"
                          value={data.testDate}
                          onChange={(e) =>
                            updateExamData(examType, "testDate", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overall Score
                        </label>
                        <input
                          type="number"
                          min={examConfig.minScore}
                          max={examConfig.maxScore}
                          value={data.overallScore}
                          onChange={(e) =>
                            updateExamData(
                              examType,
                              "overallScore",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pronunciation
                        </label>
                        <input
                          type="number"
                          min={examConfig.minScore}
                          max={examConfig.maxScore}
                          value={data.skills.pronunciation}
                          onChange={(e) =>
                            updateSkill(
                              examType,
                              "pronunciation",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fluency
                        </label>
                        <input
                          type="number"
                          min={examConfig.minScore}
                          max={examConfig.maxScore}
                          value={data.skills.fluency}
                          onChange={(e) =>
                            updateSkill(
                              examType,
                              "fluency",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vocabulary
                        </label>
                        <input
                          type="number"
                          min={examConfig.minScore}
                          max={examConfig.maxScore}
                          value={data.skills.vocabulary}
                          onChange={(e) =>
                            updateSkill(
                              examType,
                              "vocabulary",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grammar
                        </label>
                        <input
                          type="number"
                          min={examConfig.minScore}
                          max={examConfig.maxScore}
                          value={data.skills.grammar}
                          onChange={(e) =>
                            updateSkill(
                              examType,
                              "grammar",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit All Exam Data"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
