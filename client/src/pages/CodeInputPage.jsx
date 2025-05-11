import { useState } from "react";
import FeedbackCard from "../components/FeedbackCard";
import {
  SparklesIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import apiService from "../services/apiService";

const GlobalLoader = ({ text = "Reviewing..." }) => (
  <div className="flex items-center justify-center space-x-2 py-3">
    <svg
      className="animate-spin h-5 w-5 text-blue-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span className="text-gray-300">{text}</span>
  </div>
);

function CodeInputPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [reviewResult, setReviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Code input cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError("");
    setReviewResult(null);
    try {
      const data = await apiService.submitCodeForReview({ code, language });
      setReviewResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to get review. Please check the console for more details."
      );
      console.error("Review submission error:", err);
    }
    setIsLoading(false);
  };

  const instructions = `1. Select the programming language.\n2. Paste your code or upload a file.\n3. Click "Submit for Review" to get AI-powered feedback on syntax, style, logic, and potential bugs.`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-8 px-4 selection:bg-purple-500 selection:text-white">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Agentic AI Code Reviewer
        </h1>
        <p className="mt-3 text-lg text-gray-400">
          Get AI-powered insights into your code.
        </p>
      </header>

      <main className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-lg p-6 md:p-10">
        <div className="mb-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
          <h3 className="text-md font-semibold text-purple-300 mb-2">
            How to use:
          </h3>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
            {instructions}
          </pre>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Select Language
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md shadow-sm py-2.5 px-3 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Or Upload File
              </label>
              <label className="w-full flex items-center px-4 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm tracking-wide cursor-pointer hover:bg-gray-600 hover:text-white">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                <span className="truncate max-w-xs">
                  {fileName || "Choose a file..."}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".js,.py,.ts,.tsx,.java,.c,.cpp,.cs,.go,.php,.rb,.rs,.swift,.kt"
                />{" "}
                {/* Added more common extensions */}
              </label>
            </div>
          </div>
          <div>
            <label
              htmlFor="codeInput"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Paste your code here:
            </label>
            <textarea
              id="codeInput"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows="15"
              className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder={`// Start typing or paste your ${language} code here...`}
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]" // Added min-width
            >
              {isLoading ? (
                <GlobalLoader />
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Submit for Review
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900/70 border border-red-700 text-red-200 rounded-md flex items-start">
            <ExclamationCircleIcon className="h-6 w-6 mr-3 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Error Reviewing Code</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {isLoading && !reviewResult && (
          <div className="mt-8">
            <FeedbackCard
              title="Syntax & Style"
              feedback={null}
              isLoading={true}
            />
            <FeedbackCard
              title="Logic & Bugs"
              feedback={null}
              isLoading={true}
            />
          </div>
        )}

        {!isLoading && reviewResult && (
          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 flex items-center">
              <CheckCircleIcon className="h-8 w-8 mr-3 text-green-400" />
              Review Analysis Complete
            </h2>
            <FeedbackCard
              title="Syntax & Style"
              feedback={reviewResult.syntaxStyleFeedback}
              isLoading={false}
            />
            <FeedbackCard
              title="Logic & Bugs"
              feedback={reviewResult.logicBugFeedback}
              isLoading={false}
            />
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} AI Code Reviewer. Powered by Gemini
          & You.
        </p>
      </footer>
    </div>
  );
}

export default CodeInputPage;
