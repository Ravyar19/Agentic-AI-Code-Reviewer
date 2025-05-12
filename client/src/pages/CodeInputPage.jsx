import { useState, useRef } from "react";
import FeedbackCard from "../components/FeedbackCard";
import RefactoringSuggestionCard from "../components/RefactoringSuggestionCard";
import {
  SparklesIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CpuChipIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import apiService from "../services/apiService";

// --- Helper Components ---

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

const DocumentedCodeCard = ({
  title = "Auto-Documented Code",
  codeWithDocs,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const handleCopy = () => {
    if (codeWithDocs) {
      navigator.clipboard
        .writeText(codeWithDocs)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-40 bg-gray-700 rounded w-full mt-3"></div>
      </div>
    );
  }
  if (!codeWithDocs) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6 mb-8 relative group">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title={copied ? "Copied!" : "Copy Code"}
      >
        {copied ? (
          <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-400" />
        ) : (
          <DocumentDuplicateIcon className="h-5 w-5" />
        )}
      </button>
      <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center pr-12">
        <DocumentDuplicateIcon className="h-6 w-6 mr-2 text-green-400" />
        {title}
      </h3>
      <pre
        ref={codeRef}
        className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-md overflow-x-auto max-h-96"
      >
        {codeWithDocs}
      </pre>
    </div>
  );
};

// --- Main Page Component ---

function CodeInputPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [fileUrl, setFileUrl] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "typescript", name: "TypeScript" },
  ];

  const instructions = `1. Select language, then paste code, upload file, or enter a raw file URL.\n2. Get AI feedback on syntax, style, logic, bugs, refactoring, performance, and documentation.`;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileUrl(""); // Clear URL if a file is uploaded
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleUrlChange = (event) => {
    const newUrl = event.target.value;
    setFileUrl(newUrl);
    if (newUrl) {
      setFileName("");
      setCode("");
    }
  };

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    if (newCode) {
      setFileName("");
      setFileUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCode = code.trim();
    const trimmedUrl = fileUrl.trim();

    if (!trimmedCode && !trimmedUrl) {
      setError(
        "Please paste code, upload a file, or provide a valid raw file URL."
      );
      return;
    }
    setIsLoading(true);
    setError("");
    setReviewResult(null);
    try {
      const payload = { language };
      if (trimmedUrl) {
        payload.fileUrl = trimmedUrl;
      } else {
        payload.code = trimmedCode;
      }
      const data = await apiService.submitCodeForReview(payload);
      setReviewResult(data);
    } catch (err) {
      setError(err.message || "Failed to get review.");
      console.error("Review submission error:", err);
    }
    setIsLoading(false);
  };

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
                  accept=".js,.jsx,.py,.ts,.tsx,.java,.c,.cpp,.cs,.go,.php,.rb,.rs,.swift,.kt"
                />
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="fileUrl"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Or Enter Raw File URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="url"
                name="fileUrl"
                id="fileUrl"
                className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md shadow-sm py-2.5 px-3 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., https://raw.githubusercontent.com/..."
                value={fileUrl}
                onChange={handleUrlChange}
                disabled={!!fileName} // Disable if a file is selected
              />
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
              onChange={handleCodeChange}
              rows="15"
              className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm disabled:opacity-50 disabled:bg-gray-600"
              placeholder="// Paste code, upload file, or use URL..."
              disabled={!!fileName || !!fileUrl} // Disable if file or URL is used
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading || (!code.trim() && !fileUrl.trim())}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
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
            <FeedbackCard title="Syntax & Style" isLoading={true} />
            <FeedbackCard title="Logic & Bugs" isLoading={true} />
            <RefactoringSuggestionCard isLoading={true} />
            <FeedbackCard
              title="Performance Insights"
              isLoading={true}
              categoryIcon={
                <CpuChipIcon className="h-6 w-6 mr-2 text-sky-400" />
              }
            />
            <DocumentedCodeCard isLoading={true} />
          </div>
        )}

        {!isLoading && reviewResult && (
          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 flex items-center">
              <CheckCircleIcon className="h-8 w-8 mr-3 text-green-400" />
              Review Analysis Complete
            </h2>
            {reviewResult.documentedCode && (
              <DocumentedCodeCard codeWithDocs={reviewResult.documentedCode} />
            )}
            {reviewResult.syntaxStyleFeedback && (
              <FeedbackCard
                title="Syntax & Style"
                feedback={reviewResult.syntaxStyleFeedback}
              />
            )}
            {reviewResult.logicBugFeedback && (
              <FeedbackCard
                title="Logic & Bugs"
                feedback={reviewResult.logicBugFeedback}
              />
            )}
            {reviewResult.refactoringSuggestions && (
              <RefactoringSuggestionCard
                suggestions={reviewResult.refactoringSuggestions}
              />
            )}
            {reviewResult.performanceInsights && (
              <FeedbackCard
                title="Performance Insights"
                feedback={reviewResult.performanceInsights}
                categoryIcon={
                  <CpuChipIcon className="h-6 w-6 mr-2 text-sky-400" />
                }
              />
            )}
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} AI Code Reviewer. Powered by Gemini
          & Ravyar Aram.
        </p>
      </footer>
    </div>
  );
}

export default CodeInputPage;
