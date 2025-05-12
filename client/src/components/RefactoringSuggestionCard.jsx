import { useState, useRef } from "react";
import {
  ArrowsRightLeftIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const RefactoringSuggestionCard = ({
  title = "Refactoring Suggestions",
  suggestions,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const suggestionsRef = useRef(null);

  const handleCopy = () => {
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
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-20 bg-gray-700 rounded w-full mt-3"></div>
      </div>
    );
  }

  const noSuggestionsMessage =
    !suggestions ||
    (typeof suggestions === "string" &&
      suggestions
        .toLowerCase()
        .includes("no specific refactoring suggestions found"));

  if (noSuggestionsMessage) {
    return (
      <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
          <ArrowsRightLeftIcon className="h-6 w-6 mr-2 text-teal-400" />
          {title}
        </h3>
        <p className="text-gray-400 italic">
          {suggestions ||
            "No specific refactoring suggestions found at this time."}
        </p>
      </div>
    );
  }

  const sanitizeCode = (code) => {
    return code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const processedSuggestions = suggestions
    .replace(/---/g, '<hr class="my-4 border-gray-600">')
    .replace(
      /```(\w+)?\n([\s\S]*?)\n```/g,
      (match, lang, code) =>
        `<pre class="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto"><code class="language-${
          lang || ""
        }">${sanitizeCode(code)}</code></pre>`
    );

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6 mb-8 relative group">
      {suggestions && typeof suggestions === "string" && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
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

      <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center pr-12">
        <ArrowsRightLeftIcon className="h-6 w-6 mr-2 text-teal-400" />
        {title}
      </h3>

      <div
        ref={suggestionsRef}
        className="text-sm text-gray-300 whitespace-pre-wrap font-mono prose prose-sm prose-invert max-w-none prose-pre:m-0 prose-pre:p-0 prose-hr:border-gray-600"
        dangerouslySetInnerHTML={{ __html: processedSuggestions }}
      ></div>
    </div>
  );
};

export default RefactoringSuggestionCard;
