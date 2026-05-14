import express from 'express';
import { getProfile, createOrUpdateProfile } from '../controllers/profileController.js';

const router = express.Router();

router.route('/').post(createOrUpdateProfile);
router.route('/:userId').get(getProfile);

export default router;
