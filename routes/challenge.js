import express from 'express';
import ChallengeController from '../controllers/challenge-controller.js';
import ChallengeService from '../services/challenge-service.js';
import ChallengeRepository from '../repositories/challenge-repository.js';
import AutoJudge from '../utils/judge.js';


const router = express.Router();
const challengeRepository = new ChallengeRepository(
    "mongodb://localhost:27017", "autojudge", "challenges");
const judge = new AutoJudge();
const challengeService = new ChallengeService(challengeRepository, judge);

const challengeController = new ChallengeController(challengeService);
router.get('/info/:id', challengeController.getChallenge);
router.post('/test/:id', challengeController.testChallenge);
router.post('/execute/:id', challengeController.execute);

export default router;
