import express from 'express';
import { register ,googleAuthCallback , login} from '../controllers/auth.controller.js';
import { registerValidationRules , loginValidationRules} from '../middlewares/validation.middleware.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', registerValidationRules, register);

router.post('/login', loginValidationRules, login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
    googleAuthCallback
);

export default router;