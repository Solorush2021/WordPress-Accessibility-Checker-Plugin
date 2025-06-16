'use server';

/**
 * @fileOverview A flow to suggest alt text for images in a post.
 *
 * - suggestAltText - A function that suggests alt text for images.
 * - SuggestAltTextInput - The input type for the suggestAltText function.
 * - SuggestAltTextOutput - The return type for the suggestAltText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAltTextInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of an image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  existingAltText: z.string().describe('The existing alt text for the image, if any.'),
});
export type SuggestAltTextInput = z.infer<typeof SuggestAltTextInputSchema>;

const SuggestAltTextOutputSchema = z.object({
  suggestedAltText: z.string().describe('The suggested alt text for the image.'),
});
export type SuggestAltTextOutput = z.infer<typeof SuggestAltTextOutputSchema>;

export async function suggestAltText(input: SuggestAltTextInput): Promise<SuggestAltTextOutput> {
  return suggestAltTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAltTextPrompt',
  input: {schema: SuggestAltTextInputSchema},
  output: {schema: SuggestAltTextOutputSchema},
  prompt: `You are an expert in writing alt text for images for visually impaired users.\n\nGiven the following image and existing alt text (if any), suggest alt text that is concise and descriptive.\n\nExisting alt text: {{{existingAltText}}}\nImage: {{media url=imageDataUri}}\n\nSuggested alt text: `,
});

const suggestAltTextFlow = ai.defineFlow(
  {
    name: 'suggestAltTextFlow',
    inputSchema: SuggestAltTextInputSchema,
    outputSchema: SuggestAltTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
