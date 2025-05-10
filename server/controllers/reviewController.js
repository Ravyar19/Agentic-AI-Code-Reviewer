const syntaxStyleAgent = require("../services/syntaxStyleAgent");

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

    const syntaxFeedback = await syntaxStyleAgent.analyzeSyntaxAndStyle(
      code,
      language
    );

    res.status(200).json({
      syntaxStyleFeedback: syntaxFeedback,
    });
  } catch (error) {
    console.error("Error during code review in controller:", error);
    res
      .status(500)
      .json({ message: "Failed to review code.", error: error.message });
  }
};
