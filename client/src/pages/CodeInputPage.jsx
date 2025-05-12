import { useState, useRef, useEffect } from "react";
import FeedbackCard from "../components/FeedbackCard";
import RefactoringSuggestionCard from "../components/RefactoringSuggestionCard";
import DocumentedCodeCard from "../components/DocumentedCodeCard";
import {
  SparklesIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  DocumentDuplicateIcon as DocDuplicateIcon,
  CheckCircleIcon,
  CpuChipIcon,
  LinkIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  BoltIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  BugAntIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import apiService from "../services/apiService";

// --- Helper Components ---

const GlobalLoader = ({ text = "Analyzing your code...", progress }) => (
  <div className="flex flex-col items-center justify-center py-3">
    <div className="flex items-center space-x-3 mb-3">
      <svg
        className="animate-spin h-5 w-5 text-indigo-400"
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
      <span className="text-lg font-medium text-indigo-200">{text}</span>
    </div>
    {progress && (
      <div className="w-64 bg-gray-700 rounded-full h-2.5 mb-4">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )}
  </div>
);

const AnalysisStep = ({ icon, title, status, details }) => {
  const iconMap = {
    pending: <div className="h-6 w-6 text-gray-400">{icon}</div>,
    processing: (
      <ArrowPathIcon className="h-6 w-6 text-blue-400 animate-spin" />
    ),
    completed: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
    error: <XMarkIcon className="h-6 w-6 text-red-400" />,
  };

  return (
    <div className="flex items-center space-x-3 py-2">
      <div className="flex-shrink-0">{iconMap[status] || iconMap.pending}</div>
      <div className="flex-grow">
        <div className="font-medium text-gray-300">{title}</div>
        {details && <div className="text-sm text-gray-400">{details}</div>}
      </div>
    </div>
  );
};

const AnalysisProgress = ({ steps }) => (
  <div className="max-w-md mx-auto mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
      <BoltIcon className="h-5 w-5 mr-2 text-indigo-400" />
      Analysis Progress
    </h3>
    <div className="space-y-1">
      {steps.map((step, index) => (
        <AnalysisStep key={index} {...step} />
      ))}
    </div>
  </div>
);

// --- Main Page Component ---

function CodeInputPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [fileUrl, setFileUrl] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [activeTab, setActiveTab] = useState("code");
  const [simpleMode, setSimpleMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState([
    {
      icon: <PencilSquareIcon />,
      title: "Syntax & Style Analysis",
      status: "pending",
    },
    {
      icon: <BugAntIcon />,
      title: "Logic & Bug Detection",
      status: "pending",
    },
    {
      icon: <ArrowsRightLeftIcon />,
      title: "Refactoring Suggestions",
      status: "pending",
    },
    {
      icon: <CpuChipIcon />,
      title: "Performance Analysis",
      status: "pending",
    },
    {
      icon: <DocDuplicateIcon />,
      title: "Documentation Generation",
      status: "pending",
    },
  ]);

  // Simulated progress during analysis
  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slowly increase up to 90%, then wait for the actual completion
          if (prev >= 90) {
            return prev;
          }
          return Math.min(prev + Math.random() * 5, 90);
        });
      }, 800);
    } else if (progress > 0) {
      // When loading is done, quickly complete the progress bar
      setProgress(100);
      setTimeout(() => setProgress(0), 600);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  // Update analysis steps to show progress
  useEffect(() => {
    if (isLoading && !reviewResult) {
      // Simulate the different steps being processed
      const stepTimeout = setTimeout(() => {
        setAnalysisSteps((steps) => {
          const newSteps = [...steps];
          const pendingSteps = newSteps.filter(
            (step) => step.status === "pending"
          );
          if (pendingSteps.length > 0) {
            // Find the first pending step and set it to processing
            const firstPendingIndex = newSteps.findIndex(
              (step) => step.status === "pending"
            );
            if (firstPendingIndex !== -1) {
              newSteps[firstPendingIndex] = {
                ...newSteps[firstPendingIndex],
                status: "processing",
              };

              // Check if any previous step is still processing, set it to completed
              for (let i = 0; i < firstPendingIndex; i++) {
                if (newSteps[i].status === "processing") {
                  newSteps[i] = {
                    ...newSteps[i],
                    status: "completed",
                  };
                }
              }
            }
          }
          return newSteps;
        });
      }, 2000);

      return () => clearTimeout(stepTimeout);
    } else if (!isLoading && reviewResult) {
      setAnalysisSteps((steps) =>
        steps.map((step) => ({ ...step, status: "completed" }))
      );
    } else if (!isLoading) {
      setAnalysisSteps([
        {
          icon: <PencilSquareIcon />,
          title: "Syntax & Style Analysis",
          status: "pending",
        },
        {
          icon: <BugAntIcon />,
          title: "Logic & Bug Detection",
          status: "pending",
        },
        {
          icon: <ArrowsRightLeftIcon />,
          title: "Refactoring Suggestions",
          status: "pending",
        },
        {
          icon: <CpuChipIcon />,
          title: "Performance Analysis",
          status: "pending",
        },
        {
          icon: <DocDuplicateIcon />,
          title: "Documentation Generation",
          status: "pending",
        },
      ]);
    }
  }, [isLoading, reviewResult]);

  const languages = [
    { id: "javascript", name: "JavaScript", icon: "js" },
    { id: "python", name: "Python", icon: "py" },
    { id: "typescript", name: "TypeScript", icon: "ts" },
    { id: "java", name: "Java", icon: "java" },
    { id: "csharp", name: "C#", icon: "cs" },
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

  const handleClearAll = () => {
    setCode("");
    setFileUrl("");
    setFileName("");
    setReviewResult(null);
    setError("");
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
      // Mark all steps as error
      setAnalysisSteps((steps) =>
        steps.map((step) => ({ ...step, status: "error" }))
      );
    }
    setIsLoading(false);
  };

  // Function to detect language from file extension
  const detectLanguageFromFileName = (filename) => {
    if (!filename) return null;

    const extension = filename.split(".").pop().toLowerCase();
    const extensionMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
    };

    return extensionMap[extension] || null;
  };

  // Effect to auto-detect language when a file is selected
  useEffect(() => {
    if (fileName) {
      const detectedLanguage = detectLanguageFromFileName(fileName);
      if (
        detectedLanguage &&
        languages.some((lang) => lang.id === detectedLanguage)
      ) {
        setLanguage(detectedLanguage);
      }
    }
  }, [fileName]);

  // Move to top of page when results are loaded
  useEffect(() => {
    if (reviewResult) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [reviewResult]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex flex-col items-center py-8 px-4 selection:bg-indigo-500 selection:text-white">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
          AI Code Reviewer
        </h1>
        <p className="mt-3 text-lg text-gray-300">
          Smart insights to improve your code quality
        </p>
      </header>

      <main className="w-full max-w-5xl">
        {!isLoading && !reviewResult && (
          <div className="bg-gray-800 shadow-2xl rounded-xl p-6 md:p-8 border border-gray-700">
            <div className="mb-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
              <h3 className="text-md font-semibold text-indigo-300 mb-2 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-indigo-400" />
                How to use:
              </h3>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                {instructions}
              </pre>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <label className="mr-2 text-sm font-medium text-gray-300">
                    Language:
                  </label>
                  <div className="relative">
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md shadow-sm py-2 pl-3 pr-10 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
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

                <div className="flex-grow"></div>

                <div className="flex items-center">
                  <label className="relative inline-flex items-center mr-5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={simpleMode}
                      onChange={() => setSimpleMode(!simpleMode)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span className="ml-2 text-sm font-medium text-gray-300">
                      Simple Mode
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex border-b border-gray-700">
                  <button
                    type="button"
                    className={`py-3 px-4 text-sm font-medium flex items-center ${
                      activeTab === "code"
                        ? "text-indigo-400 border-b-2 border-indigo-500"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("code")}
                  >
                    <CodeBracketIcon className="h-5 w-5 mr-2" />
                    Code Editor
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-4 text-sm font-medium flex items-center ${
                      activeTab === "file"
                        ? "text-indigo-400 border-b-2 border-indigo-500"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("file")}
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    className={`py-3 px-4 text-sm font-medium flex items-center ${
                      activeTab === "url"
                        ? "text-indigo-400 border-b-2 border-indigo-500"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("url")}
                  >
                    <LinkIcon className="h-5 w-5 mr-2" />
                    URL
                  </button>
                </div>

                <div className="p-4">
                  {activeTab === "code" && (
                    <textarea
                      id="codeInput"
                      value={code}
                      onChange={handleCodeChange}
                      rows="15"
                      className="w-full bg-gray-900 border-0 text-gray-200 rounded-md shadow-inner p-4 focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                      placeholder="// Paste your code here..."
                      disabled={!!fileName || !!fileUrl}
                    />
                  )}

                  {activeTab === "file" && (
                    <div className="py-10 flex flex-col items-center justify-center">
                      <label className="w-full max-w-md flex flex-col items-center px-4 py-6 bg-gray-700 text-gray-300 rounded-lg shadow-lg tracking-wide border-2 border-dashed border-gray-500 cursor-pointer hover:bg-gray-600 hover:border-indigo-500 transition-all duration-300">
                        <DocumentTextIcon className="w-12 h-12 mb-3 text-indigo-400" />
                        <span className="text-base font-semibold mb-1">
                          {fileName || "Choose a file or drag & drop"}
                        </span>
                        <span className="text-sm text-gray-400">
                          JS, JSX, TS, TSX, PY, Java, C#, Go, PHP, Ruby files
                          supported
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".js,.jsx,.py,.ts,.tsx,.java,.c,.cpp,.cs,.go,.php,.rb,.rs,.swift,.kt"
                        />
                      </label>
                      {fileName && (
                        <div className="mt-4 flex items-center">
                          <span className="text-sm text-gray-300 bg-gray-700 py-1 px-3 rounded-lg">
                            {fileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFileName("")}
                            className="ml-2 text-gray-400 hover:text-gray-200"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "url" && (
                    <div className="py-8">
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
                          className="w-full bg-gray-900 border-0 text-gray-200 rounded-md shadow-inner py-3 px-4 pl-10 focus:ring-1 focus:ring-indigo-500"
                          placeholder="e.g., https://raw.githubusercontent.com/..."
                          value={fileUrl}
                          onChange={handleUrlChange}
                          disabled={!!fileName}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Enter the URL to a raw file (like GitHub raw content
                        URLs)
                      </p>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Example URLs:
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                          <li className="flex items-center">
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1 text-gray-500" />
                            https://raw.githubusercontent.com/username/repo/main/file.js
                          </li>
                          <li className="flex items-center">
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1 text-gray-500" />
                            https://gist.githubusercontent.com/username/gist-id/raw/file.py
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                >
                  Clear All
                </button>

                <button
                  type="submit"
                  disabled={
                    isLoading || (!code.trim() && !fileUrl.trim() && !fileName)
                  }
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] transition-all duration-300"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Analyze Code
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-900/70 border border-red-700 text-red-200 rounded-md flex items-start">
                <ExclamationCircleIcon className="h-6 w-6 mr-3 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Error Analyzing Code</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {isLoading && !reviewResult && (
          <div className="mb-6 bg-gray-800 border border-gray-700 shadow-xl rounded-xl p-8 text-center">
            <GlobalLoader progress={progress} />
            <AnalysisProgress steps={analysisSteps} />
            <p className="mt-6 text-sm text-gray-400">
              The AI is analyzing your code. This may take a few moments...
            </p>
          </div>
        )}

        {!isLoading && reviewResult && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-100 flex items-center">
                <CheckCircleIcon className="h-8 w-8 mr-3 text-green-400" />
                Code Analysis Results
              </h2>
              <button
                onClick={handleClearAll}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
              >
                Analyze New Code
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Conditionally include DocumentedCode based on simple mode */}
              {!simpleMode && reviewResult.documentedCode && (
                <DocumentedCodeCard
                  codeWithDocs={reviewResult.documentedCode}
                  language={language}
                />
              )}

              {/* Always include critical feedback */}
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

              {/* Conditionally include performance insights based on simple mode */}
              {!simpleMode && reviewResult.performanceInsights && (
                <FeedbackCard
                  title="Performance Insights"
                  feedback={reviewResult.performanceInsights}
                  categoryIcon={
                    <CpuChipIcon className="h-6 w-6 mr-2 text-sky-400" />
                  }
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm max-w-xl">
        <p>
          &copy; {new Date().getFullYear()} AI Code Reviewer. Powered by Gemini
          Pro.
        </p>
        <p className="mt-1 text-xs text-gray-600">
          Your code is analyzed securely and never stored beyond the analysis
          session.
        </p>
      </footer>
    </div>
  );
}

export default CodeInputPage;
