import { useState, useRef } from "react";
import {
  LightBulbIcon,
  BugAntIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const defaultCategoryIcons = {
  "Syntax & Style": <PencilSquareIcon className="h-6 w-6 mr-2 text-blue-400" />,
  "Logic & Bugs": <BugAntIcon className="h-6 w-6 mr-2 text-red-400" />,
  "Performance Insights": (
    <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400" />
  ),
  Default: <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400" />,
};

const formatCodeBlock = (content) => {
  const formattedContent = content.replace(
    /```(\w+)?\s*([\s\S]*?)```/g,
    (_, language, code) => {
      return `<div class="bg-gray-800 rounded-md mb-4 mt-2">
                <div class="flex items-center justify-between px-4 py-2 bg-gray-700 rounded-t-md">
                  <span class="text-xs font-mono text-gray-300">${
                    language || "code"
                  }</span>
                </div>
                <pre class="p-4 overflow-x-auto"><code>${code
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")}</code></pre>
              </div>`;
    }
  );

  return formattedContent;
};

const formatAnalysisText = (text) => {
  if (!text) return "";

  if (
    text.includes("No issues") ||
    text.includes("No major") ||
    text.includes("No obvious")
  ) {
    return text;
  }

  let formatted = text
    .replace(
      /(\d+\.) ([^\n]+)/g,
      '<h3 class="text-lg font-medium text-indigo-300 mt-4 mb-2">$1 $2</h3>'
    )

    .replace(
      /\*\*Category:\*\*/g,
      '<span class="block text-sm text-gray-400 mt-3 mb-1">Category:</span>'
    )
    .replace(
      /\*\*Line Numbers:\*\*/g,
      '<span class="block text-sm text-gray-400 mb-1">Line Numbers:</span>'
    )
    .replace(
      /\*\*Potential Runtime Impact:\*\*/g,
      '<span class="block text-sm text-gray-400 mb-1">Potential Impact:</span>'
    )
    .replace(
      /\*\*Priority:\*\*/g,
      '<span class="block text-sm text-gray-400 mb-1">Priority:</span>'
    )
    .replace(
      /\*\*Code Example Demonstrating Fix:\*\*/g,
      '<div class="text-sm text-teal-400 mt-3 mb-1">Solution:</div>'
    )
    .replace(
      /\*\*Reasoning:\*\*/g,
      '<div class="text-sm text-indigo-400 mt-3 mb-1">Reasoning:</div>'
    )

    .replace(
      /\[CRITICAL\]/g,
      '<span class="inline-block px-2 py-0.5 text-xs font-medium bg-red-900 text-red-200 rounded">CRITICAL</span>'
    )
    .replace(
      /\[MAJOR\]/g,
      '<span class="inline-block px-2 py-0.5 text-xs font-medium bg-orange-900 text-orange-200 rounded">MAJOR</span>'
    )
    .replace(
      /\[MINOR\]/g,
      '<span class="inline-block px-2 py-0.5 text-xs font-medium bg-yellow-900 text-yellow-200 rounded">MINOR</span>'
    )

    .split("\n\n")
    .join("</p><p class='mb-3'>")

    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-200">$1</strong>')

    .replace(
      /- ([^\n]+)/g,
      '<li class="ml-5 list-disc text-gray-300 my-1">$1</li>'
    );

  formatted = formatCodeBlock(formatted);

  if (!formatted.startsWith("<")) {
    formatted = `<p class='mb-3'>${formatted}</p>`;
  }

  return formatted;
};

const FeedbackCard = ({ title, feedback, isLoading, categoryIcon = null }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const feedbackRef = useRef(null);

  const handleCopy = (e) => {
    e && e.stopPropagation();
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
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 animate-pulse">
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

  const getIssuesCount = () => {
    if (noIssuesMessage) return 0;

    const patterns = [
      /\d+\.\s+["']?[\w\s]+"?/g,
      /\*\*Issue\s+#\d+\*\*/g,
      /\[CRITICAL\]|\[MAJOR\]|\[MINOR\]/g,
    ];

    for (const pattern of patterns) {
      const matches = feedback.match(pattern);
      if (matches && matches.length > 0) {
        return matches.length;
      }
    }

    return null;
  };

  const issuesCount = getIssuesCount();
  const statusColor = noIssuesMessage ? "bg-green-500" : "bg-blue-500";

  const formattedFeedback = formatAnalysisText(feedback);

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg mb-6 overflow-hidden">
      {/* Card Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {IconComponent}
          <div>
            <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
              {title}
              {issuesCount !== null && (
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    noIssuesMessage
                      ? "bg-green-900 text-green-200"
                      : "bg-blue-900 text-blue-200"
                  }`}
                >
                  {issuesCount} {issuesCount === 1 ? "issue" : "issues"}
                </span>
              )}
            </h3>
            {noIssuesMessage && (
              <p className="text-green-400 text-sm mt-1">
                ✓ No issues detected
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feedback && typeof feedback === "string" && (
            <button
              onClick={handleCopy}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-all"
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
          <div className="w-6 h-6 flex items-center justify-center">
            {expanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      <div className={`h-1 ${statusColor}`}></div>

      {expanded && (
        <div className="p-6 border-t border-gray-700 max-h-[600px] overflow-y-auto styled-scrollbar">
          {noIssuesMessage ? (
            <p ref={feedbackRef} className="text-gray-300">
              {feedback}
            </p>
          ) : (
            <div
              ref={feedbackRef}
              className="text-sm text-gray-300 font-sans"
              dangerouslySetInnerHTML={{ __html: formattedFeedback }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
