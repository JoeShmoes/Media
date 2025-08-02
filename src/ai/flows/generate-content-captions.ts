
'use server';
/**
 * @fileOverview A Genkit flow for generating social media content captions.
 *
 * - generateContentCaptions - A function that handles caption generation.
 * - GenerateContentCaptionsInput - The input type for the generateContentCaptions function.
 * - GenerateContentCaptionsOutput - The return type for the generateContentCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentCaptionsInputSchema = z.object({
  topic: z.string().describe('The topic of the content.'),
  keywords: z.string().describe('A comma-separated list of keywords for the content.'),
  tone: z.string().describe('The desired tone of voice (e.g., "Informative", "Funny", "Witty").'),
  platform: z.enum(["Instagram", "TikTok", "X"]).describe('The target social media platform.'),
});
export type GenerateContentCaptionsInput = z.infer<typeof GenerateContentCaptionsInputSchema>;

const GenerateContentCaptionsOutputSchema = z.object({
  hook: z.string().describe("An engaging hook to grab the audience's attention."),
  caption: z.string().describe("The main caption for the social media post."),
  cta: z.string().describe("A clear call-to-action for the audience."),
  hashtags: z.string().describe("A string of relevant hashtags, separated by spaces."),
});
export type GenerateContentCaptionsOutput = z.infer<typeof GenerateContentCaptionsOutputSchema>;

export async function generateContentCaptions(input: GenerateContentCaptionsInput): Promise<GenerateContentCaptionsOutput> {
  return generateContentCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentCaptionsPrompt',
  input: {schema: GenerateContentCaptionsInputSchema},
  output: {schema: GenerateContentCaptionsOutputSchema},
  prompt: `You are a social media expert. Based on the following information, generate content for a social media post.

Topic: {{{topic}}}
Keywords: {{{keywords}}}
Tone: {{{tone}}}
Platform: {{{platform}}}

The output should include:
- A compelling hook to start the post.
- A main caption that elaborates on the topic.
- A strong call-to-action (CTA).
- A list of relevant hashtags.
`,
});

const generateContentCaptionsFlow = ai.defineFlow(
  {
    name: 'generateContentCaptionsFlow',
    inputSchema: GenerateContentCaptionsInputSchema,
    outputSchema: GenerateContentCaptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
