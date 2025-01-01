

class ChhallengeService {

  constructor(challengeRepository, judge) {
    this.challengeRepository = challengeRepository;
    this.judge = judge;

  }

  async getChallenge(id) {
    let infoChallenge = await this.challengeRepository.getChallege(id);
    infoChallenge.testCases.forEach(caseInfo => {
      caseInfo.testCase = "---"
      caseInfo.input = "---";
      caseInfo.expectedOutput = "---";
      caseInfo.userOutput = "---";
      caseInfo.passed = "---";
    });
    return infoChallenge;
  }

  async getTests(idChallenge, code) {
    let infoChallenge = await this.challengeRepository.getTests(idChallenge);
    const codeUser = eval(`(${code})`);
    //codeUser()
    const results1 = this.judge.runTests(codeUser, infoChallenge.testCases);

    return results1;
  }

  async execute(id, code) {
    try {
      eval(`(${code})`);
    } catch (error) {
      return {error: error.message}
    }

    try {
    const userCode = eval(`(${code})`);
    const originalConsoleLog = console.log;
    let logOutput = "";
    let salida = "";
    let input = "";
    console.log = function (...args) {
      originalConsoleLog.apply(console, args);
      logOutput = args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      }).join(' ');
      salida = salida + "\n" + logOutput

    };
    let firstTest = await this.challengeRepository.getFirstTest(id);
    input = firstTest.testCases[0].input
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

    return {input: input, userOutput: userOutput === undefined 
      ? "undefined" 
      : userOutput === null 
      ? "null" 
      : userOutput === Infinity 
      ? "Infinity" 
      : userOutput, 
      log: salida};
    } catch (error) {
      return {error: error.message}
    }
  }

}

export default ChhallengeService;