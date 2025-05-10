const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeSyntaxAndStyle(code, language) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    });

    const prompt = `Analyze this ${language} code for syntax errors, adherence to common styling conventions (e.g., indentation, naming conventions for ${language}), and suggest improvements. Provide feedback as a list of issues with line numbers if possible. Do not provide any introductory or concluding remarks, only the list of issues. If there are no issues, say "No syntax or style issues found.". Code:

${code}`;
    console.log("---- PROMPT SENT TO GEMINI ----");
    console.log(prompt);
    console.log("-------------------------------");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error(
      `Error calling Gemini API in syntaxStyleAgent: ${error.message}`
    );
    if (error.response && error.response.data) {
      console.error("Gemini API Error Details:", error.response.data);
      throw new Error(
        `Gemini API Error: ${
          error.response.data.error?.message || error.message
        }`
      );
    }
    throw new Error(`Failed to analyze syntax and style: ${error.message}`);
  }
}

module.exports = { analyzeSyntaxAndStyle };
