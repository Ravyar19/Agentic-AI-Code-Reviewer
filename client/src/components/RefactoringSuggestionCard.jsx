import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

const RefactoringSuggestionCard = ({
  title = "Refactoring Suggestions",
  suggestions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
        <div className="h-20 bg-gray-700 rounded w-full mt-3"></div>
      </div>
    );
  }

  if (
    !suggestions ||
    (typeof suggestions === "string" &&
      suggestions
        .toLowerCase()
        .includes("no specific refactoring suggestions found"))
  ) {
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

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center">
        <ArrowsRightLeftIcon className="h-6 w-6 mr-2 text-teal-400" />
        {title}
      </h3>

      <div
        className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-md overflow-x-auto prose prose-sm prose-invert max-w-none 
                           prose-pre:bg-gray-800 prose-pre:text-gray-200 prose-pre:p-4 prose-pre:rounded-md"
        dangerouslySetInnerHTML={{
          __html: suggestions
            .replace(
              /```(\w+)?\n([\s\S]*?)\n```/g,
              '<pre><code class="language-$1">$2</code></pre>'
            )
            .replace(/---/g, '<hr class="my-4 border-gray-600">'),
        }}
      ></div>
    </div>
  );
};

export default RefactoringSuggestionCard;
