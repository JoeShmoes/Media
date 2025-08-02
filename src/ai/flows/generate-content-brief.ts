'use server';
/**
 * @fileOverview A Genkit flow for generating content briefs.
 *
 * - generateContentBrief - A function that handles content brief generation.
 * - GenerateContentBriefInput - The input type for the generateContentBrief function.
 * - GenerateContentBriefOutput - The return type for the generateContentBrief function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentBriefInputSchema = z.object({
  topic: z.string().describe('The topic or title of the content.'),
  type: z.enum(['Blog Post', 'Video Script', 'Social Media Post']).describe('The type of content to create a brief for.'),
});
export type GenerateContentBriefInput = z.infer<typeof GenerateContentBriefInputSchema>;

const GenerateContentBriefOutputSchema = z.object({
  hook: z.string().describe("An engaging hook to grab the audience's attention."),
  talkingPoints: z.array(z.string()).describe("A list of 3-5 key talking points or sections to cover."),
  keywords: z.string().describe("A comma-separated list of relevant SEO keywords for the topic."),
  visuals: z.string().describe("Suggestions for visuals, such as images, charts, or b-roll footage."),
});
export type GenerateContentBriefOutput = z.infer<typeof GenerateContentBriefOutputSchema>;

export async function generateContentBrief(input: GenerateContentBriefInput): Promise<GenerateContentBriefOutput> {
  return generateContentBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentBriefPrompt',
  input: {schema: GenerateContentBriefInputSchema},
  output: {schema: GenerateContentBriefOutputSchema},
  prompt: `You are an expert content strategist. Based on the following topic and content type, generate a detailed content brief.

Topic: {{{topic}}}
Content Type: {{{type}}}

The brief should include:
- An engaging hook to capture attention immediately.
- A list of 3-5 key talking points or sections to structure the content.
- A comma-separated list of relevant SEO keywords.
- Suggestions for visuals (e.g., specific images, types of b-roll, or chart ideas).
`,
});

const generateContentBriefFlow = ai.defineFlow(
  {
    name: 'generateContentBriefFlow',
    inputSchema: GenerateContentBriefInputSchema,
    outputSchema: GenerateContentBriefOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
