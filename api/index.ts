// Serverless function entry point for Vercel
import express from 'express';
import { setupAuth } from '../server/auth';
import { registerRoutes } from '../server/routes';
import session from 'express-session';

const app = express();

// Setup session middleware
const sessionOptions: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secure: process.env.NODE_ENV === 'production',
  },
};

app.use(session(sessionOptions));
app.use(express.json());

// Setup authentication
setupAuth(app);

// Register API routes
registerRoutes(app);

// Export the Express app as the default function
export default app;