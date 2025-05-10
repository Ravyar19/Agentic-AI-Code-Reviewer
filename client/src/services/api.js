import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const apiService = {
  submitCodeForReview: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/review-code`, data);
      return response.data;
    } catch (error) {
      console.error(
        "Error submitting code for review:",
        error.response || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network error or server is down.";
      throw new Error(errorMessage);
    }
  },
};
