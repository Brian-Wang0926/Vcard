import axios from "axios";
import authServiceInstance from "../services/auth-service";

export const fetchSavedArticles = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/profile/save-article`,
      { headers: authServiceInstance.authHeader() }
    );
    return response.data.savedArticles;
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    throw error;
  }
};
