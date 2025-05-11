const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function suggestRefactors(code, language) {
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_NAME || "gemini-pro",
    });

    const prompt = `Analyze the following JavaScript code for refactoring opportunities that would improve:

1. **Readability & Maintainability**:
   - Breaking down complex functions (> 20 lines)
   - Extracting repeated logic into helper functions
   - Converting lengthy if-else chains to switch, object lookups, or polymorphism
   - Improving variable/function naming for self-documentation
   - Adding strategic JSDoc comments for complex logic

2. **Modern JavaScript Patterns**:
   - Converting callbacks to Promises or async/await
   - Replacing imperative loops with functional methods (map, filter, reduce)
   - Using destructuring, spread, and rest operators
   - Implementing module patterns over global objects
   - Converting to ES6+ class syntax where appropriate

3. **Performance Optimization**:
   - Preventing unnecessary re-renders in UI frameworks
   - Memoizing expensive calculations
   - Implementing proper cleanup for event listeners and subscriptions
   - Using appropriate data structures for operations (Map/Set vs Objects/Arrays)
   - Batch DOM operations or utilize requestAnimationFrame

4. **Code Architecture**:
   - Implementing appropriate design patterns (Observer, Factory, Strategy, etc.)
   - Separating concerns (data/UI/business logic)
   - Applying dependency injection principles
   - Converting imperative code to declarative approaches
   - Improving error handling strategies

FORMAT EACH REFACTORING SUGGESTION:
---
### Refactoring Opportunity #[number]: [Title]
**Impact Level**: [HIGH/MEDIUM/LOW] - [Brief impact description]
**Lines**: [line numbers affected]

**Issue**: 
[Detailed explanation of the problem and benefits of refactoring]

**Original Code**:
\`\`\`javascript
[Exact code snippet to refactor]
\`\`\`

**Recommended Refactoring**:
\`\`\`javascript
[Improved code implementation]
\`\`\`

**Benefits**:
- [Key improvement #1]
- [Key improvement #2]
---

If no substantial refactoring opportunities exist, respond only with: "No specific refactoring suggestions found at this time."

CODE TO ANALYZE:
\`\`\`javascript
${code}
\`\`\``;

    console.log("---- PROMPT SENT TO GEMINI (Refactoring) ----");
    console.log(prompt);
    console.log("-------------------------------------------");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error(
      `Error calling Gemini API in refactoringAgent: ${error.message}`
    );
    if (error.response && error.response.data) {
      console.error("Gemini API Error Details:", error.response.data);
      throw new Error(
        `Gemini API Error (Refactoring): ${
          error.response.data.error?.message || error.message
        }`
      );
    }
    throw new Error(`Failed to suggest refactors: ${error.message}`);
  }
}

module.exports = { suggestRefactors };
