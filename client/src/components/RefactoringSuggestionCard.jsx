import { useState, useRef } from "react";
import {
  ArrowsRightLeftIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  BeakerIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const formatRefactoringSuggestions = (suggestions) => {
  if (!suggestions) return "";

  if (
    suggestions
      .toLowerCase()
      .includes("no specific refactoring suggestions found")
  ) {
    return suggestions;
  }

  let formatted = suggestions;

  formatted = formatted.replace(
    /### Refactoring Opportunity #(\d+): ([^\n]*)\n\*\*Impact Level\*\*: (HIGH|MEDIUM|LOW)([^\n]*)/g,
    (_, num, title, level, rest) => {
      const levelColor =
        level === "HIGH"
          ? "bg-red-900 text-red-100"
          : level === "MEDIUM"
          ? "bg-orange-900 text-orange-100"
          : "bg-green-900 text-green-100";

      return `<div class="bg-gray-750 rounded-lg p-4 mb-6 border-l-4 border-teal-500">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-teal-300">Refactoring #${num}: ${title}</h3>
          <span class="inline-block px-2 py-1 text-xs font-medium rounded ${levelColor}">${level} IMPACT</span>
        </div>`;
    }
  );

  formatted =
    formatted
      .replace(
        /\*\*Issue\*\*:/g,
        '<div class="text-sm font-semibold text-gray-400 mt-4 mb-2">ISSUE:</div>'
      )
      .replace(
        /\*\*Original Code\*\*:/g,
        '<div class="text-sm font-semibold text-gray-400 mt-4 mb-2">ORIGINAL CODE:</div>'
      )
      .replace(
        /\*\*Recommended Refactoring\*\*:/g,
        '<div class="text-sm font-semibold text-teal-400 mt-4 mb-2">RECOMMENDED REFACTORING:</div>'
      )
      .replace(
        /\*\*Benefits\*\*:/g,
        '<div class="text-sm font-semibold text-green-400 mt-4 mb-2">BENEFITS:</div>'
      )
      .replace(
        /\*\*Lines\*\*:/g,
        '<div class="text-xs font-semibold text-gray-400 mb-1">LOCATION:</div>'
      )

      .replace(
        /---/g,
        '</div><div class="bg-gray-750 rounded-lg p-4 mb-6 border-l-4 border-teal-500">'
      )

      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, language, code) => {
        return `<div class="relative">
          <div class="absolute top-0 right-0 bg-gray-700 px-2 py-1 text-xs rounded-bl-md font-mono text-gray-300">${
            language || "code"
          }</div>
          <pre class="bg-gray-800 text-gray-300 p-4 pt-6 rounded-md overflow-x-auto border border-gray-700 my-2"><code>${code
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</code></pre>
        </div>`;
      })

      .replace(
        /- ([^\n]+)/g,
        '<div class="flex items-center py-1"><ArrowTrendingUpIcon class="h-4 w-4 text-green-400 mr-2 flex-shrink-0" /><span class="text-gray-300">$1</span></div>'
      )

      .replace(
        /\*\*([^*]+)\*\*/g,
        '<strong class="text-gray-200">$1</strong>'
      ) + "</div>";

  formatted = formatted.replace(
    /<ArrowTrendingUpIcon ([^>]+)\/>/g,
    (_, attrs) => {
      return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" ${attrs}><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>`;
    }
  );

  return formatted;
};

const RefactoringSuggestionCard = ({
  title = "Refactoring Suggestions",
  suggestions,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const suggestionsRef = useRef(null);

  const handleCopy = (e) => {
    e && e.stopPropagation();
    if (typeof suggestions === "string" && suggestions) {
      navigator.clipboard
        .writeText(suggestions)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy suggestions: ", err));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg mb-6 animate-pulse">
        <div className="p-4">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-20 bg-gray-700 rounded w-full mt-3"></div>
        </div>
      </div>
    );
  }

  const noSuggestionsMessage =
    !suggestions ||
    (typeof suggestions === "string" &&
      suggestions
        .toLowerCase()
        .includes("no specific refactoring suggestions found"));

  const countRefactoringOpportunities = () => {
    if (noSuggestionsMessage) return 0;

    const matches = suggestions.match(
      /Refactoring Opportunity #\d+|Refactoring #\d+/g
    );
    return matches ? matches.length : null;
  };

  const opportunityCount = countRefactoringOpportunities();
  const statusColor = noSuggestionsMessage ? "bg-green-500" : "bg-teal-500";

  if (noSuggestionsMessage) {
    return (
      <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg mb-6 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <ArrowsRightLeftIcon className="h-6 w-6 mr-2 text-teal-400" />
            <div>
              <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                {title}
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                  0 suggestions
                </span>
              </h3>
              <p className="text-green-400 text-sm mt-1">
                ✓ No refactoring needed
              </p>
            </div>
          </div>
        </div>
        <div className="h-1 bg-green-500"></div>
        <div className="p-4 border-t border-gray-700">
          <p className="text-gray-300">
            {suggestions ||
              "No specific refactoring suggestions found at this time."}
          </p>
        </div>
      </div>
    );
  }

  const formattedSuggestions = formatRefactoringSuggestions(suggestions);

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg mb-6 overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <ArrowsRightLeftIcon className="h-6 w-6 mr-2 text-teal-400" />
          <div>
            <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
              {title}
              {opportunityCount !== null && (
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-900 text-teal-200">
                  {opportunityCount}{" "}
                  {opportunityCount === 1 ? "suggestion" : "suggestions"}
                </span>
              )}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {suggestions && typeof suggestions === "string" && (
            <button
              onClick={handleCopy}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-all"
              title={copied ? "Copied!" : `Copy ${title}`}
              aria-label={`Copy ${title}`}
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
          <div
            ref={suggestionsRef}
            className="text-sm text-gray-300 font-sans"
            dangerouslySetInnerHTML={{ __html: formattedSuggestions }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default RefactoringSuggestionCard;
