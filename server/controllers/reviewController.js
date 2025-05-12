const syntaxStyleAgent = require("../services/syntaxStyleAgent");
const logicBugAgent = require("../services/logicBugAgent");
const refactoringAgent = require("../services/refactoringAgent");
const performanceAgent = require("../services/performanceAgent");
const documentationAgent = require("../services/documentationAgent");
const { fetchRawCodeFromUrl } = require("../utils/gitFetcher");

exports.handleCodeReview = async (req, res) => {
  try {
    let { code, language, fileUrl } = req.body;
    console.log(
      "Backend received /api/review-code request with body:",
      req.body
    );

    if (fileUrl) {
      console.log("Fetching code from URL:", fileUrl);
      try {
        code = await fetchRawCodeFromUrl(fileUrl);
        if (!language && fileUrl) {
          const extension = fileUrl.split(".").pop().toLowerCase();
          if (extension === "js" || extension === "jsx")
            language = "javascript";
          else if (extension === "py") language = "python";
          else if (extension === "ts" || extension === "tsx")
            language = "typescript";
          console.log(`Inferred language as: ${language} from URL extension.`);
        }
      } catch (fetchError) {
        console.error(
          "Error fetching code from URL in controller:",
          fetchError.message
        );
        return res.status(400).json({ message: fetchError.message });
      }
    }

    if (!code || !language) {
      return res.status(400).json({
        message: "Code (or valid File URL) and language are required.",
      });
    }

    const [
      syntaxFeedback,
      logicFeedback,
      refactorSuggestions,
      performanceInsights,
      documentedCodeOutput,
    ] = await Promise.all([
      syntaxStyleAgent.analyzeSyntaxAndStyle(code, language),
      logicBugAgent.analyzeLogicAndBugs(code, language),
      refactoringAgent.suggestRefactors(code, language),
      performanceAgent.identifyPerformanceHotspots(code, language),
      documentationAgent.generateDocumentation(code, language),
    ]);

    res.status(200).json({
      syntaxStyleFeedback: syntaxFeedback,
      logicBugFeedback: logicFeedback,
      refactoringSuggestions: refactorSuggestions,
      performanceInsights: performanceInsights,
      documentedCode: documentedCodeOutput,
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
