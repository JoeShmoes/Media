'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating YouTube video scripts.
 *
 * The flow takes a video topic as input and generates a full YouTube video script,
 * including title, hook, and CTA.
 *
 * @exports {generateYouTubeScript} - The main function to generate YouTube scripts.
 * @exports {GenerateYouTubeScriptInput} - The input type for the generateYouTubeScript function.
 * @exports {GenerateYouTubeScriptOutput} - The output type for the generateYouTubeScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYouTubeScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the YouTube video.'),
});

export type GenerateYouTubeScriptInput = z.infer<typeof GenerateYouTubeScriptInputSchema>;

const GenerateYouTubeScriptOutputSchema = z.object({
  title: z.string().describe('The title of the YouTube video.'),
  hook: z.string().describe('The hook to grab viewer attention.'),
  script: z.string().describe('The full script of the YouTube video.'),
  cta: z.string().describe('The call to action for the video.'),
});

export type GenerateYouTubeScriptOutput = z.infer<typeof GenerateYouTubeScriptOutputSchema>;

export async function generateYouTubeScript(input: GenerateYouTubeScriptInput): Promise<GenerateYouTubeScriptOutput> {
  return generateYouTubeScriptFlow(input);
}

const generateYouTubeScriptPrompt = ai.definePrompt({
  name: 'generateYouTubeScriptPrompt',
  input: {schema: GenerateYouTubeScriptInputSchema},
  output: {schema: GenerateYouTubeScriptOutputSchema},
  prompt: `You are an expert YouTube script writer. Generate a compelling YouTube video script based on the given topic.

Topic: {{{topic}}}

The script should include:
- A catchy title
- An engaging hook to grab viewer's attention in the first few seconds
- A detailed script covering the topic
- A clear call to action (CTA) at the end of the video
`,
});

const generateYouTubeScriptFlow = ai.defineFlow(
  {
    name: 'generateYouTubeScriptFlow',
    inputSchema: GenerateYouTubeScriptInputSchema,
    outputSchema: GenerateYouTubeScriptOutputSchema,
  },
  async input => {
    const {output} = await generateYouTubeScriptPrompt(input);
    return output!;
  }
);
