import express from 'express';
import { registerUser, getUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/').post(registerUser);
router.route('/:id').get(getUser);

export default router;
