

class ChallengeController {

    constructor(challengeService) {
        this.challengeService = challengeService;
    }

    getChallenge = async (req, res) => {
        return res.status(200).json({ 
            data: await this.challengeService.getChallenge(req.params.id) 
        });
    }

    testChallenge = async (req, res) => {
        let judgeResult =  await this.challengeService.getTests(req.params.id, req.body.code);        
        return res.status(200).json({ 
            data:  judgeResult
        });
    }

    execute = async (req, res) => {
        let firstTest =  await this.challengeService.execute(req.params.id, req.body.code);        
        return res.status(200).json({ 
            data:  firstTest
        });
    }

    helpAi = async (req, res) => {
        let helpText =  await this.challengeService.helpAi(req, res, req.params.id, req.body.code);        
        return res.status(200).json({ 
            data:  helpText
        });
    }
    
}


export default ChallengeController;