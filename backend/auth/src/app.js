import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './routes/auth.route.js';
import config from './config/config.js';

const app = express();

// Middlewares
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Add express-session middleware BEFORE passport.session()
app.use(
  session({
    secret: 'supersecretkey', // 👉 change to a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true only if using HTTPS
  })
);

// 🔹 Initialize passport & session
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('✅ Google profile:', profile.displayName);
      return done(null, profile);
    }
  )
);

// 🔹 Serialize & Deserialize User (required for persistent login sessions)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.use('/api/auth', authRoutes);

export default app;
