'use server';
/**
 * @fileOverview A Genkit flow for generating a customer persona.
 *
 * - generatePersona - A function that handles persona generation.
 * - GeneratePersonaInput - The input type for the generatePersona function.
 * - GeneratePersonaOutput - The return type for the generatePersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonaInputSchema = z.object({
  audienceDescription: z.string().describe('A brief description of the target audience.'),
});
export type GeneratePersonaInput = z.infer<typeof GeneratePersonaInputSchema>;

const GeneratePersonaOutputSchema = z.object({
  name: z.string().describe("A plausible name for the persona (e.g., 'Startup Steve', 'Marketing Mary')."),
  avatar: z.string().url().describe("A URL for a placeholder avatar image. Use `https://placehold.co/100x100.png`."),
  bio: z.string().describe("A short biography for the persona."),
  goals: z.array(z.string()).describe("A list of 2-3 primary goals for this persona."),
  painPoints: z.array(z.string()).describe("A list of 2-3 primary pain points for this persona."),
});
export type GeneratePersonaOutput = z.infer<typeof GeneratePersonaOutputSchema>;

export async function generatePersona(input: GeneratePersonaInput): Promise<GeneratePersonaOutput> {
  return generatePersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonaPrompt',
  input: {schema: GeneratePersonaInputSchema},
  output: {schema: GeneratePersonaOutputSchema},
  prompt: `You are an expert market researcher. Based on the following target audience description, generate a detailed customer persona.

Target Audience: {{{audienceDescription}}}

Create a realistic persona with a name, a placeholder avatar URL from placehold.co, a bio, 2-3 goals, and 2-3 pain points.
`,
});

const generatePersonaFlow = ai.defineFlow(
  {
    name: 'generatePersonaFlow',
    inputSchema: GeneratePersonaInputSchema,
    outputSchema: GeneratePersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
