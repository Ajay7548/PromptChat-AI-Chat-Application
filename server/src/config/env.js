const dotenv = require('dotenv');

dotenv.config();

const requiredVars = ['MONGODB_URI', 'OPENROUTER_API_KEY'];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

const env = Object.freeze({
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
});

module.exports = env;

