const syntaxStyleAgent = require("../services/syntaxStyleAgent");
const logicBugAgent = require("../services/logicBugAgent");
const refactoringAgent = require("../services/refactoringAgent");
const performanceAgent = require("../services/performanceAgent");

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

    const [
      syntaxFeedback,
      logicFeedback,
      refactorSuggestions,
      performanceInsights,
    ] = await Promise.all([
      syntaxStyleAgent.analyzeSyntaxAndStyle(code, language),
      logicBugAgent.analyzeLogicAndBugs(code, language),
      refactoringAgent.suggestRefactors(code, language),
      performanceAgent.identifyPerformanceHotspots(code, language),
    ]);

    res.status(200).json({
      syntaxStyleFeedback: syntaxFeedback,
      logicBugFeedback: logicFeedback,
      refactoringSuggestions: refactorSuggestions,
      performanceInsights: performanceInsights,
    });
  } catch (error) {
    console.error("Error during code review in controller:", error);
    let errorMessage = "Failed to review code.";
    if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage, details: error.toString() });
  }
};
