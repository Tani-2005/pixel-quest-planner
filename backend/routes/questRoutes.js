import express from 'express';
import { getQuests, createQuest } from '../controllers/questController.js';

const router = express.Router();

router.route('/').get(getQuests).post(createQuest);

export default router;
