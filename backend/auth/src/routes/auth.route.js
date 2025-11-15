import express from 'express';
import { register ,googleAuthCallback} from '../controllers/auth.controller.js';
import { registerValidationRules } from '../middlewares/validation.middleware.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', registerValidationRules, register);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
    googleAuthCallback
);

export default router;