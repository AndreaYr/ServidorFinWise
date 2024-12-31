class AutoJudge {
   
  
    addTestCase(input, expectedOutput) {
      this.testCases.push({ input, expectedOutput });
    }
  
    runTests(userCode, testCases) {
      const results = [];
      for (let i = 0; i < testCases.length; i++) {
        const { input, expectedOutput } = testCases[i];
        try {
          let userOutput;
          if (typeof userCode === 'function') {
            userOutput = userCode(...input);
          } else if (typeof userCode === 'string') {
            const context = {};
            input.forEach((value, index) => {
              context[`input${index + 1}`] = value;
            });
            const fullCode = `
              ${Object.entries(context).map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`).join('\n')}
              ${userCode}
            `;
            userOutput = eval(fullCode);
          } else {
            throw new Error('El código del usuario debe ser una función o una cadena de texto');
          }
  
          const passed = this.compareOutput(userOutput, expectedOutput);
          results.push({
            testCase: i + 1,
            input,
            expectedOutput,
            userOutput: userOutput === undefined 
            ? "undefined" 
            : userOutput === null 
            ? "null" 
            : userOutput === Infinity 
            ? "Infinity" 
            : userOutput,
            passed
          });
        } catch (error) {
          results.push({
            testCase: i + 1,
            input,
            expectedOutput,
            error: error.message,
            passed: false
          });
        }
      }
      return results;
    }
  
    compareOutput(userOutput, expectedOutput) {
      if (Array.isArray(userOutput) && Array.isArray(expectedOutput)) {
        return JSON.stringify(userOutput) === JSON.stringify(expectedOutput);
      }
      return userOutput === expectedOutput;
    }
  }
  
  export default AutoJudge;