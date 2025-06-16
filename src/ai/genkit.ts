import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Genkit initialization will automatically pick up GOOGLE_API_KEY from process.env
// which is populated from the .env file.
export const ai = genkit({
  plugins: [googleAI()], // GOOGLE_API_KEY from .env is used here by default
  model: 'googleai/gemini-2.0-flash',
});
