"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState("");

  //====== Check if userId already exists in localStorage ======
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      router.push("/submit-exam");
    }
  }, [router]);

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    mobile: "",
    profilePhoto: "/profile.jpg",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      //====== Store userId in localStorage ======
      if (data.data.userId) {
        localStorage.setItem("userId", data.data.userId);
      }

      setSuccess(true);
      setUserId(data.data.userId);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create user. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    alert("User ID copied to clipboard!");
  };

  const handleContinue = () => {
    router.push(`/submit-exam?userId=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-['Roboto_Slab']">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create User Account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Step 1: Create your account. User ID will be saved automatically.
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter mobile number"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating User..." : "Create User"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-gray-800 font-semibold mb-2">
                User created successfully
              </p>
              <p className="text-sm text-gray-600 mb-4">
                User ID saved. You can now proceed to submit exam data.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={userId}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={handleCopyUserId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Continue to Submit Exam
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
