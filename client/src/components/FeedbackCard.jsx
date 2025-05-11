// client/src/components/FeedbackCard.js
import React from "react";
import {
  LightBulbIcon,
  BugAntIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const categoryIcons = {
  "Syntax & Style": <PencilSquareIcon className="h-6 w-6 mr-2 text-blue-400" />,
  "Logic & Bugs": <BugAntIcon className="h-6 w-6 mr-2 text-red-400" />,
  Default: <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-400" />,
};

const FeedbackCard = ({ title, feedback, isLoading }) => {
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

  if (!feedback) {
    return null;
  }

  const noIssues =
    typeof feedback === "string" &&
    (feedback.toLowerCase().includes("no syntax or style issues found") ||
      feedback
        .toLowerCase()
        .includes("no major logic or bug issues detected") ||
      feedback.toLowerCase().includes("no issues found"));

  const IconComponent = categoryIcons[title] || categoryIcons["Default"];

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
        {IconComponent}
        {title}
      </h3>
      {noIssues ? (
        <p className="text-gray-400 italic">{feedback}</p>
      ) : (
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-md overflow-x-auto">
          {feedback}
        </pre>
      )}
    </div>
  );
};

export default FeedbackCard;
