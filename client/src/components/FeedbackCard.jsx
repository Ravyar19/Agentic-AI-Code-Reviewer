import { useState, useRef } from "react";
import {
  LightBulbIcon,
  BugAntIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const defaultCategoryIcons = {
  "Syntax & Style": <PencilSquareIcon className="h-6 w-6 mr-2 text-blue-400" />,
  "Logic & Bugs": <BugAntIcon className="h-6 w-6 mr-2 text-red-400" />,
  Default: <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400" />,
};

const FeedbackCard = ({ title, feedback, isLoading, categoryIcon = null }) => {
  const [copied, setCopied] = useState(false);
  const feedbackRef = useRef(null);

  const handleCopy = () => {
    if (typeof feedback === "string" && feedback) {
      navigator.clipboard
        .writeText(feedback)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy feedback: ", err));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  const IconComponent =
    categoryIcon ||
    defaultCategoryIcons[title] ||
    defaultCategoryIcons["Default"];

  const noIssuesMessage =
    typeof feedback === "string" &&
    (feedback.toLowerCase().includes("no syntax or style issues found") ||
      feedback
        .toLowerCase()
        .includes("no major logic or bug issues detected") ||
      feedback
        .toLowerCase()
        .includes("no obvious performance hotspots identified") ||
      feedback.toLowerCase().includes("no issues found"));

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6 mb-8 relative group">
      {feedback && typeof feedback === "string" && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
          title={copied ? "Copied!" : `Copy ${title}`}
          aria-label={`Copy ${title} feedback`}
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-400" />
          ) : (
            <DocumentDuplicateIcon className="h-5 w-5" />
          )}
        </button>
      )}

      <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center pr-12">
        {IconComponent}
        {title}
      </h3>

      {noIssuesMessage ? (
        <p ref={feedbackRef} className="text-gray-400 italic">
          {feedback}
        </p>
      ) : (
        <pre
          ref={feedbackRef}
          className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-md overflow-x-auto"
        >
          {feedback}
        </pre>
      )}
    </div>
  );
};

export default FeedbackCard;
