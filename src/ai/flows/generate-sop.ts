'use server';
/**
 * @fileOverview A Genkit flow for generating Standard Operating Procedures (SOPs).
 *
 * - generateSop - A function that handles SOP generation.
 * - GenerateSopInput - The input type for the generateSop function.
 * - GenerateSopOutput - The return type for the generateSop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSopInputSchema = z.object({
  topic: z.string().describe('The topic or process for which to create the SOP.'),
});
export type GenerateSopInput = z.infer<typeof GenerateSopInputSchema>;

const GenerateSopOutputSchema = z.object({
  title: z.string().describe("The official title of the Standard Operating Procedure."),
  steps: z.array(z.object({
    title: z.string().describe("The title of the SOP step."),
    description: z.string().describe("A detailed description of the tasks involved in this step."),
  })).describe("A list of sequential steps that make up the SOP."),
});
export type GenerateSopOutput = z.infer<typeof GenerateSopOutputSchema>;

export async function generateSop(input: GenerateSopInput): Promise<GenerateSopOutput> {
  return generateSopFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSopPrompt',
  input: {schema: GenerateSopInputSchema},
  output: {schema: GenerateSopOutputSchema},
  prompt: `You are an expert at creating clear, concise, and actionable Standard Operating Procedures (SOPs) for businesses.
Based on the following topic, generate a complete SOP.

Topic: {{{topic}}}

The SOP should have a clear title and a series of sequential steps. Each step must have its own title and a detailed description of what needs to be done.
`,
});

const generateSopFlow = ai.defineFlow(
  {
    name: 'generateSopFlow',
    inputSchema: GenerateSopInputSchema,
    outputSchema: GenerateSopOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
