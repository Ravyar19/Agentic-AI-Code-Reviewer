const syntaxStyleAgent = require("../services/syntaxStyleAgent");
const logicBugAgent = require("../services/logicBugAgent");

exports.handleCodeReview = async (req, res) => {
  try {
    console.log(
      "Backend received /api/review-code request with body:",
      req.body
    );
    const { code, language } = req.body;

    if (!code || !language) {
      console.error("Validation failed: Code or language missing.");
      return res
        .status(400)
        .json({ message: "Code and language are required." });
    }

    // Call both agents concurrently
    const [syntaxFeedback, logicFeedback] = await Promise.all([
      syntaxStyleAgent.analyzeSyntaxAndStyle(code, language),
      logicBugAgent.analyzeLogicAndBugs(code, language),
    ]);

    // Combine results into a structured response
    res.status(200).json({
      syntaxStyleFeedback: syntaxFeedback,
      logicBugFeedback: logicFeedback,
    });
  } catch (error) {
    console.error("Error during code review in controller:", error);
    // Ensure the error message passed to the frontend is generic enough or well-structured
    let errorMessage = "Failed to review code.";
    if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage, details: error.toString() });
  }
};
