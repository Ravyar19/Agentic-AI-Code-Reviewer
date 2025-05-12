// server/utils/gitFetcher.js
const axios = require("axios");

async function fetchRawCodeFromUrl(fileUrl) {
  try {
    if (
      !fileUrl.includes("raw.githubusercontent.com") &&
      !fileUrl.endsWith(".js") &&
      !fileUrl.endsWith(".py")
    ) {
      console.warn("URL might not be a raw content URL:", fileUrl);
    }

    const response = await axios.get(fileUrl, {
      headers: {
        Accept: "text/plain, application/octet-stream, */*",
      },
      timeout: 10000,
    });

    const contentType = response.headers["content-type"];
    if (contentType && contentType.toLowerCase().includes("text/html")) {
      throw new Error(
        "The URL points to an HTML page, not raw code. Please provide a raw file URL."
      );
    }

    if (typeof response.data !== "string") {
      throw new Error("Fetched content is not in a recognizable text format.");
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching code from URL (${fileUrl}):`, error.message);
    if (error.response) {
      throw new Error(
        `Failed to fetch from URL: Server responded with status ${error.response.status}. Ensure the URL is correct and accessible.`
      );
    } else if (error.request) {
      throw new Error(
        "Failed to fetch from URL: No response from server. Check network or URL."
      );
    }
    throw new Error(
      `Failed to fetch code from URL: ${error.message}. Please ensure it's a valid raw content URL.`
    );
  }
}

module.exports = { fetchRawCodeFromUrl };
