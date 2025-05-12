const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateDocumentation(code, language) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    });

    const prompt = `Analyze the following ${language} code and generate professional documentation according to language-specific best practices.

FOR EACH CODE ELEMENT:
- Functions/Methods: Document purpose, parameters, return values, exceptions thrown
- Classes: Document purpose, inheritance relationships, important instance variables
- Complex blocks: Document algorithm logic, performance characteristics
- Constants/Configurations: Document purpose and valid values

DOCUMENTATION SHOULD INCLUDE:
${
  language === "JavaScript"
    ? `
- JSDoc format with @param, @returns, @throws, @example
- Parameter types using TypeScript-style annotations
- Use of @async, @generator tags where applicable
- Code examples for complex functions
- Consider both browser and Node.js environments`
    : ""
}

${
  language === "Java"
    ? `
- Javadoc format with @param, @return, @throws
- Include {@code} and {@link} references where appropriate
- Document checked and unchecked exceptions
- Note thread-safety considerations
- Include @Override annotations where applicable`
    : ""
}

${
  language === "Python"
    ? `
- Google-style, NumPy-style, or reST docstrings as appropriate
- Type hints using Python's typing module
- Include Examples section for complex functions
- Document any raised exceptions
- Note any performance caveats or assumptions`
    : ""
}

DOCUMENTATION PRINCIPLES:
1. Be concise yet complete - prioritize clarity over verbosity
2. Include types (${
      language === "JavaScript"
        ? "via JSDoc annotations"
        : language === "Java"
        ? "as part of the @param and @return tags"
        : language === "Python"
        ? "using PEP 484 type hints where possible"
        : "using language-appropriate format"
    })
3. Explain "why" for complex logic, not just "what"
4. Note edge cases and input validation
5. Preserve any existing comments that add value, incorporating them into new documentation
6. Follow these specific formatting patterns:

${
  language === "JavaScript"
    ? `
/**
 * Brief description of function purpose.
 *
 * @param {Type} name - Description of parameter.
 * @param {Type} [optionalParam=defaultValue] - Description of optional parameter.
 * @returns {ReturnType} Description of return value.
 * @throws {ErrorType} Description of when this error is thrown.
 * @example
 * // Brief example of usage
 * const result = functionName(param1, param2);
 */
`
    : ""
}

${
  language === "Java"
    ? `
/**
 * Brief description of method purpose.
 *
 * <p>Additional details about behavior or implementation if needed.
 *
 * @param name Description of parameter.
 * @return Description of return value.
 * @throws ExceptionType Description of when this exception is thrown.
 * @see RelatedClass#relatedMethod()
 */
`
    : ""
}

${
  language === "Python"
    ? `
def function_name(param1, param2):
    """Brief description of function purpose.

    Extended description if needed.

    Args:
        param1 (type): Description of parameter.
        param2 (type, optional): Description of parameter. Defaults to value.

    Returns:
        type: Description of return value.

    Raises:
        ExceptionType: Description of when this exception is raised.

    Examples:
        >>> function_name(1, 2)
        3
    """
`
    : ""
}

RETURN FORMAT:
The complete original code with appropriate documentation added. Do not modify the functionality of the code, only add or enhance documentation.

CODE TO DOCUMENT:
\`\`\`${language}
${code}
\`\`\``;

    console.log("---- PROMPT SENT TO GEMINI (Documentation) ----");
    console.log("-----------------------------------------------");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let documentedCode = response.text();
    const codeBlockRegex = new RegExp(
      "```(?:" + language + ")?\\n([\\s\\S]*?)\\n```"
    );
    const match = documentedCode.match(codeBlockRegex);
    if (match && match[1]) {
      documentedCode = match[1];
    }

    return documentedCode;
  } catch (error) {
    console.error(
      `Error calling Gemini API in documentationAgent: ${error.message}`
    );
    if (error.response && error.response.data) {
      console.error("Gemini API Error Details:", error.response.data);
      throw new Error(
        `Gemini API Error (Documentation): ${
          error.response.data.error?.message || error.message
        }`
      );
    }
    throw new Error(`Failed to generate documentation: ${error.message}`);
  }
}

module.exports = { generateDocumentation };
