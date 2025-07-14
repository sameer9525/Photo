'use server';
/**
 * @fileOverview AI-powered tool that suggests relevant hashtags and emojis for image captions based on the image content.
 *
 * - generateCaption - A function that handles the caption generation process.
 * - GenerateCaptionInput - The input type for the generateCaption function.
 * - GenerateCaptionOutput - The return type for the generateCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate a caption for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  category: z.string().describe('The category of the photo.'),
});
export type GenerateCaptionInput = z.infer<typeof GenerateCaptionInputSchema>;

const GenerateCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated caption for the photo.'),
  hashtags: z.array(z.string()).describe('Suggested hashtags for the photo.'),
  emojis: z.array(z.string()).describe('Suggested emojis for the photo.'),
});
export type GenerateCaptionOutput = z.infer<typeof GenerateCaptionOutputSchema>;

export async function generateCaption(input: GenerateCaptionInput): Promise<GenerateCaptionOutput> {
  return generateCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionPrompt',
  input: {schema: GenerateCaptionInputSchema},
  output: {schema: GenerateCaptionOutputSchema},
  prompt: `You are an AI assistant that generates captions, hashtags, and emojis for photos.

  Given the photo and its category, generate a caption, a list of relevant hashtags, and a list of relevant emojis.

  Photo: {{media url=photoDataUri}}
  Category: {{{category}}}

  The caption should be short and engaging.
  The hashtags should be relevant to the photo and category.
  The emojis should be relevant to the photo and category.
  `,
});

const generateCaptionFlow = ai.defineFlow(
  {
    name: 'generateCaptionFlow',
    inputSchema: GenerateCaptionInputSchema,
    outputSchema: GenerateCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
