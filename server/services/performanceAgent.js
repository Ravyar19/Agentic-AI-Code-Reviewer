const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function identifyPerformanceHotspots(code, language) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    });

    const prompt = `Analyze the following ${language} code for potential performance bottlenecks and optimization opportunities:

1. **Algorithmic Efficiency**:
   - O(n²) or higher time complexity operations that could be optimized
   - Nested loops that could be flattened or combined
   - Recursive functions without proper termination or memoization
   - Sorting or searching algorithms that aren't optimal for the data characteristics
   - Linear searches where indexed lookups are possible

2. **Data Structure Optimization**:
   ${
     language === "JavaScript"
       ? `
   - Improper use of arrays vs objects/Maps/Sets
   - String concatenation in loops instead of array joins
   - Missing use of TypedArrays for numeric operations`
       : ""
   }
   ${
     language === "Java"
       ? `
   - ArrayList vs LinkedList misuse
   - Excessive boxing/unboxing of primitives
   - StringBuilder vs String concatenation issues
   - Inefficient use of streams or collections`
       : ""
   }
   ${
     language === "Python"
       ? `
   - List comprehensions vs loops
   - Inefficient use of dictionaries or sets
   - Missing use of generators for large sequences
   - Inefficient string operations (+ vs join)`
       : ""
   }
   - Data structures with inappropriate access patterns for the operations performed

3. **Memory Management**:
   ${
     language === "JavaScript"
       ? `
   - Closure-related memory leaks
   - DOM element references not being cleared
   - Missing WeakMap/WeakSet for reference management`
       : ""
   }
   ${
     language === "Java"
       ? `
   - Resource leaks (unclosed streams, connections)
   - Excessive object creation inside loops
   - Missing try-with-resources patterns
   - Large object retention issues`
       : ""
   }
   ${
     language === "Python"
       ? `
   - Improper handling of file resources or connections
   - Issues with circular references
   - List slicing creating unnecessary copies
   - Large dictionaries with high memory overhead`
       : ""
   }
   - Excessive temporary object creation

4. **Language-Specific Optimizations**:
   ${
     language === "JavaScript"
       ? `
   - Blocking the main thread with heavy computations
   - DOM manipulation inefficiencies
   - Synchronous operations that could be async
   - Unoptimized Promise chains or async/await usage`
       : ""
   }
   ${
     language === "Java"
       ? `
   - Thread pool configuration issues
   - Synchronized block scope too large
   - Inefficient exception handling
   - Missing parallelization opportunities`
       : ""
   }
   ${
     language === "Python"
       ? `
   - Global interpreter lock (GIL) bottlenecks
   - Missing use of NumPy for numeric operations
   - Inefficient use of functions like map/filter/reduce
   - Heavy operations that could use multiprocessing`
       : ""
   }

5. **I/O and External Resources**:
   - Unoptimized database queries or excessive database calls
   - Network calls without proper batching or caching
   - File operations without buffering or streaming
   - Missing pagination for large dataset processing

FORMAT EACH PERFORMANCE ISSUE:
---
## Performance Issue #[number]: [Concise Title]
**Severity**: [CRITICAL/HIGH/MEDIUM/LOW]
**Location**: Lines [start]-[end]
**Estimated Impact**: [Quantitative estimate where possible]

**Problem Description**:
[Detailed explanation of the performance bottleneck]

**Code Snippet**:
\`\`\`${language}
[Problematic code]
\`\`\`

**Optimization Strategy**:
[Detailed approach with ${language}-specific techniques]

**Optimized Implementation Concept**:
\`\`\`${language}
// Conceptual approach
[Optimization demonstration]
\`\`\`

**Measurement Approach**:
[Suggestion for how to benchmark or profile this specific issue]
---

If no significant performance issues are identified, respond with:
"No obvious performance hotspots identified in this code. For comprehensive performance assessment, consider runtime profiling with ${
      language === "JavaScript"
        ? "Chrome DevTools Performance panel or Lighthouse"
        : language === "Java"
        ? "JProfiler, YourKit, or VisualVM"
        : language === "Python"
        ? "cProfile, line_profiler, or memory_profiler"
        : "appropriate profiling tools"
    }."

CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\``;

    console.log("---- PROMPT SENT TO GEMINI (Performance) ----");
    console.log(prompt);
    console.log("-------------------------------------------");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error(
      `Error calling Gemini API in performanceAgent: ${error.message}`
    );
    if (error.response && error.response.data) {
      console.error("Gemini API Error Details:", error.response.data);
      throw new Error(
        `Gemini API Error (Performance): ${
          error.response.data.error?.message || error.message
        }`
      );
    }
    throw new Error(
      `Failed to identify performance hotspots: ${error.message}`
    );
  }
}

module.exports = { identifyPerformanceHotspots };
