import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const apiService = {
  submitCodeForReview: async (data) => {
    // data here is { code, language }
    try {
      console.log(
        "Submitting to API:",
        `${API_BASE_URL}/review-code`,
        "with data:",
        data
      );
      const response = await axios.post(`${API_BASE_URL}/review-code`, data);
      return response.data;
    } catch (error) {
      console.error(
        "Error submitting code for review:",
        error.response || error.message || error
      );
      // Log the detailed error object
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        throw new Error(
          error.response.data.message ||
            `Request failed with status ${error.response.status}`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        throw new Error(
          "No response received from server. Check server logs and network."
        );
      } else {
        console.error("Error message:", error.message);
        throw new Error(error.message || "Error in setting up the request.");
      }
    }
  },
};

export default apiService;
