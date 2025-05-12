import { useState, useRef } from "react";
import {
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const DocumentedCodeCard = ({
  title = "Auto-Documented Code",
  codeWithDocs,
  isLoading,
  language = "javascript",
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const codeRef = useRef(null);

  const handleCopy = (e) => {
    e.stopPropagation();
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
      <div className="bg-gray-800 shadow-lg rounded-lg mb-6 animate-pulse">
        <div className="p-4">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-40 bg-gray-700 rounded w-full mt-3"></div>
        </div>
      </div>
    );
  }

  if (!codeWithDocs) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg mb-8 transition-all duration-200 overflow-hidden">
      {/* Card Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <CodeBracketIcon className="h-6 w-6 mr-2 text-green-400" />
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            {title}
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
              Improved
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-all"
            title={copied ? "Copied!" : "Copy Code"}
          >
            {copied ? (
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <DocumentDuplicateIcon className="h-5 w-5" />
            )}
          </button>
          <div className="w-6 h-6 flex items-center justify-center">
            {expanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Status indicator bar */}
      <div
        className={`h-1 bg-green-500 transition-all duration-300 ${
          expanded ? "opacity-100" : "opacity-50"
        }`}
      ></div>

      {/* Card Content */}
      {expanded && (
        <div className="border-t border-gray-700">
          <div className="relative">
            <div className="absolute top-2 right-3 flex space-x-2">
              <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-md">
                {language.toUpperCase()}
              </span>
            </div>
            <SyntaxHighlighter
              ref={codeRef}
              language={language}
              style={atomDark}
              customStyle={{
                margin: 0,
                padding: "2rem 1rem 1rem 1rem",
                borderRadius: "0",
                maxHeight: "90vh",
              }}
              lineNumberStyle={{ color: "#6b7280" }}
              wrapLines={true}
              showLineNumbers={true}
            >
              {codeWithDocs}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentedCodeCard;
