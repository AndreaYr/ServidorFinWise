import { getDB } from '../database/mongo.js';
import { ObjectId } from 'mongodb';

class ChallengeRepository {
    constructor() {
        this.collectionName = 'challenges';
    }

    async decrementVerifyAiAids(email) {
        const db = getDB();
        const document = await db.collection("free_ai").findOne(
            { email: email, ai_aids: { $gt: 0 } },
            { projection: { email: 1, ai_aids: 1 } }
        );
    
        return document;
    }

    async decrementAiAids(email) {
        const db = getDB();
        const result = await db.collection("free_ai").updateOne(
            { email: email },
            { $inc: { ai_aids: -1 } }
        );
        return result.modifiedCount > 0 ? "ok" : "not updated";
    }

    async getDescriptionChallenge(id) {
        const db = getDB();
        const description = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) },
            { projection: { _id: 0, description: 1 } });
        return description;
    }

    async getChallege(id) {
        const db = getDB();
        const challengeInfo = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) },
            { projection: { _id: 0, type: 1, code: 1, description: 1, testCases: 1 } });
        return challengeInfo;
    }

    async getTests(id) {
        const db = getDB();
        const challengeTests = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) },
            { projection: { _id: 0, type: 0, code: 0, description: 0 } });
        return challengeTests;
    }

    async getFirstTest(id) {
        const db = getDB();
        const firstTest = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) },
            { projection: { _id: 0, type: 0, code: 0, description: 0, testCases: { $slice: 1 } } });
        return firstTest;
    }
}

export default ChallengeRepository;