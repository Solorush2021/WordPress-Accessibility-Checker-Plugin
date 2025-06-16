
'use server';

/**
 * @fileOverview Analyzes WordPress post content for accessibility issues using GenAI.
 *
 * - analyzeAccessibility - A function that analyzes content for accessibility issues.
 * - AnalyzeAccessibilityInput - The input type for the analyzeAccessibility function.
 * - AnalyzeAccessibilityOutput - The return type for the analyzeAccessibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAccessibilityInputSchema = z.object({
  content: z.string().describe('The content of the WordPress post to analyze.'),
});
export type AnalyzeAccessibilityInput = z.infer<typeof AnalyzeAccessibilityInputSchema>;

const AnalyzeAccessibilityOutputSchema = z.object({
  issues: z.array(
    z.object({
      type: z.string().describe('The type of accessibility issue.'),
      message: z.string().describe('A detailed description of the issue.'),
      location: z.string().optional().describe('The location of the issue in the content.'),
    })
  ).describe('A list of accessibility issues found in the content.'),
  score: z.number().describe('An accessibility score for the content (0-100).'),
  suggestions: z.array(z.string()).describe('Suggestions for improving the content accessibility.'),
});
export type AnalyzeAccessibilityOutput = z.infer<typeof AnalyzeAccessibilityOutputSchema>;

export async function analyzeAccessibility(input: AnalyzeAccessibilityInput): Promise<AnalyzeAccessibilityOutput> {
  return analyzeAccessibilityFlow(input);
}

const analyzeAccessibilityPrompt = ai.definePrompt({
  name: 'analyzeAccessibilityPrompt',
  input: {schema: AnalyzeAccessibilityInputSchema},
  output: {schema: AnalyzeAccessibilityOutputSchema},
  prompt: `You are an accessibility expert analyzing WordPress post content.

  Analyze the following content for common accessibility issues, such as missing alt text, 
  insufficient color contrast, and improper heading structure. Provide a score between 0-100, where 100 means perfect accessibility.

  Content: {{{content}}}
  
  Output a list of issues, suggestions and a score. The issues should have a type, message, and optionally a location.
  The score should be a number between 0 and 100.
  The suggestions should be a list of strings.
  `,
});

const analyzeAccessibilityFlow = ai.defineFlow(
  {
    name: 'analyzeAccessibilityFlow',
    inputSchema: AnalyzeAccessibilityInputSchema,
    outputSchema: AnalyzeAccessibilityOutputSchema,
  },
  async (input: AnalyzeAccessibilityInput): Promise<AnalyzeAccessibilityOutput> => {
    const result = await analyzeAccessibilityPrompt(input);
    if (!result.output) {
      console.error('Accessibility analysis flow: No output received from prompt.', { input, result });
      // Genkit should ideally throw if output schema is not met.
      // If it reaches here, it means the prompt resolved but output is falsy.
      throw new Error('Analysis did not produce the expected output structure.');
    }
    return result.output;
  }
);
