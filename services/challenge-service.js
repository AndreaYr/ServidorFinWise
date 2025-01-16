import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyD-Q5xGKSe8Wct412NtA7MZ6AAJtrpKAj8");

const prompt = `
A continuación se te pasará el enunciado de un problema de programación en Javascript y el 
código hecho por un estudiante para resolverlo. El código aún no cumple con los requisitos del probelma. 
Asumiendo el rol de un profesor, lo que debes hacer es ayudarle mostrándole pistas sobre el error que aún 
tiene y cómo resolver el problema. Nunca muestres el código que resuleve el problema. Antecede a las 
pistas la siguiente frase: Te ayudaré dándote pistas sobre cómo resolver tú ejercicio:
`

class ChhallengeService {

  constructor(challengeRepository, judge) {
    this.challengeRepository = challengeRepository;
    this.judge = judge;

  }

  async helpAi(req, res, id, code){
    const userEmail = req.userEmail.userEmail;    
    const enunciado = `E, renunciado: ${await this.challengeRepository.getDescriptionChallenge(id)}`;
    const codigo = `código hecho por el estudiante: ${code}`;
    try {
      const vrifyAiAids = await this.challengeRepository.decrementVerifyAiAids(userEmail);
      if (vrifyAiAids){
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt + enunciado + codigo);
        const response = result.response;
        const decremetOk = await this.challengeRepository.decrementAiAids(userEmail);
        return response.text();
      }
      return "No tienes más intentos de IA por hoy. Debes esperar hasta las 12:00 horas"
    } catch (error) {
      return "Ha ocurrido un error al obtener la ayuda de la IA";
    }
    
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
    try {
      let infoChallenge = await this.challengeRepository.getTests(idChallenge);
      const codeUser = eval(`(${code})`);
      const results1 = this.judge.runTests(codeUser, infoChallenge.testCases);
      return results1;
    } catch (error) {      
      return {error: error.message}
    }
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