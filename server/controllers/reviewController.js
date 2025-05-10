const syntaxStyleAgent = require("../services/syntaxStyleAgent");

exports.handleCodeReview = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || language) {
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
    console.error("Error during code review:", error);
    res
      .status(500)
      .json({ message: "Failed to review code.", error: error.message });
  }
};
