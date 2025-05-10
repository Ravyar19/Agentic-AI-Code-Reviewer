const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeSyntaxAndStyle(code, language) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    });

    const prompt = `Analyze this JavaScript code for:

    1. **Syntax errors**: Identify code that would cause runtime errors or exceptions
    2. **Style violations**: Evaluate against modern JavaScript conventions including:
       - ESLint/Airbnb/Standard JS guideline adherence
       - Proper indentation (2 or 4 spaces consistently)
       - Naming conventions (camelCase for variables/functions, PascalCase for classes)
       - ES6+ feature usage where appropriate (const/let vs var, arrow functions, etc.)
       - Comment quality and JSDoc compliance
    3. **Anti-patterns**: Flag problematic practices such as:
       - Global variable pollution
       - Unnecessary closures or complex nesting
       - Memory leaks or performance bottlenecks
       - Callback hell (vs. Promises/async-await)
    
    FORMAT REQUIREMENTS:
    - List each issue with exact line number(s)
    - Categorize as [CRITICAL], [MAJOR], or [MINOR]
    - Provide corrected code snippets for each issue
    - Include only the issues list - no introduction or conclusion
    
    If the code has no issues, respond only with: "No syntax or style issues found."
    
    CODE TO ANALYZE:
    \`\`\`javascript
    ${code}
    \`\`\``;

    console.log("---- PROMPT SENT TO GEMINI ----");
    console.log(prompt);
    console.log("-------------------------------");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error(
      `Error calling Gemini API in syntaxStyleAgent: ${error.message}`
    );
    if (error.response && error.response.data) {
      console.error("Gemini API Error Details:", error.response.data);
      throw new Error(
        `Gemini API Error: ${
          error.response.data.error?.message || error.message
        }`
      );
    }
    throw new Error(`Failed to analyze syntax and style: ${error.message}`);
  }
}

module.exports = { analyzeSyntaxAndStyle };
