import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Genkit initialization depends on GOOGLE_API_KEY from process.env,
// which Next.js populates from the .env file for server-side execution.

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  // This warning is for server logs. The user will see the Genkit error in the UI if the key is missing.
  console.warn(
    'WARNING: GOOGLE_API_KEY is not set in the environment. Genkit AI features will likely fail. ' +
    'Ensure your .env file is correctly set up at the project root and contains GOOGLE_API_KEY, ' +
    'and that your Next.js server has been restarted after creating/modifying the .env file.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey, // Explicitly pass the API key
    }),
  ],
  model: 'googleai/gemini-1.5-flash-latest', // Updated to a common and recent model
});

