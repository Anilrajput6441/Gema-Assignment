import assessmentsData from "../data/assessments.json";
import fallbackData from "../data/fallback-data.json";

const API_BASE_URL = "http://localhost:8000/api";

//====== Get userId from localStorage ======
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
};

//====== Fetch user data from backend ======
const getUserDataFromBackend = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user from backend:", error);
    return null;
  }
};

//====== Get user data - single object with exams array ======
export const getUserData = async () => {
  try {
    const userId = getUserId();

    if (userId) {
      const userData = await getUserDataFromBackend(userId);
      if (userData && userData.exams && userData.exams.length > 0) {
        return userData;
      }
    }

    //====== Fallback: Use JSON data ======
    if (assessmentsData?.length > 0) {
      return assessmentsData[0];
    }

    //====== Final fallback ======
    return fallbackData;
  } catch (error) {
    console.warn("Error loading user data:", error);
    return fallbackData;
  }
};
