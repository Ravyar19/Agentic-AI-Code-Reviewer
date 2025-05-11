const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeLogicAndBugs(code, language) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    });
    const prompt = `Analyze the following JavaScript code for logical flaws and potential bugs:

1. **Data Flow Issues**:
   - Undefined/null value handling
   - Type coercion problems
   - Improper destructuring
   - Array bounds violations

2. **Asynchronous Pitfalls**:
   - Promise chain errors
   - Missing await keywords
   - Race conditions
   - Callback hell structures
   - Unhandled rejections

3. **State Management**:
   - Mutation side effects
   - Closure variable capture issues
   - Event listener memory leaks
   - React/framework-specific state problems

4. **Edge Cases**:
   - Empty collections handling
   - Browser compatibility issues
   - Boundary conditions (zero, empty string, etc.)
   - Error handling gaps

5. **Performance Concerns**:
   - Inefficient algorithms (O(n²) where O(n) is possible)
   - DOM manipulation bottlenecks
   - Memory-intensive operations
   - Render blocking code

FORMAT REQUIREMENTS:
- Number each issue and include precise line number(s)
- Explain the potential runtime impact or failure scenario
- Provide a specific code example demonstrating the fix
- Prioritize issues as [CRITICAL], [SIGNIFICANT], or [MINOR]

If no significant logical issues are found, respond only with: "No major logic or bug issues detected."

CODE TO ANALYZE:
\`\`\`javascript
${code}
\`\`\``;

    console.log("---- PROMPT SENT TO GEMINI (Logic & Bugs) ----");
    console.log(prompt);
    console.log("---------------------------------------------");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error(
      `Error calling Gemini API in logicBugAgent: ${error.message}`
    );
    if (error.response && error.response.data) {
      console.error("Gemini API Error Details:", error.response.data);
      throw new Error(
        `Gemini API Error (Logic & Bugs): ${
          error.response.data.error?.message || error.message
        }`
      );
    }
    throw new Error(`Failed to analyze for logic and bugs: ${error.message}`);
  }
}

module.exports = { analyzeLogicAndBugs };
