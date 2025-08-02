
'use server';
/**
 * @fileOverview A Genkit flow for comparing two versions of a text document.
 *
 * - compareVersions - A function that handles the version comparison.
 * - CompareVersionsInput - The input type for the compareVersions function.
 * - CompareVersionsOutput - The return type for the compareVersions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { CompareVersionsOutput as CompareVersionsOutputType } from '@/lib/types';


const CompareVersionsInputSchema = z.object({
  originalText: z.string().describe('The original version of the text.'),
  revisedText: z.string().describe('The revised version of the text.'),
});
export type CompareVersionsInput = z.infer<typeof CompareVersionsInputSchema>;

const CompareVersionsOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the changes made between the two versions."),
  diff: z.array(z.object({
    type: z.enum(['added', 'removed', 'unchanged']).describe("The type of change: 'added' for new text, 'removed' for deleted text, and 'unchanged' for text that remains the same."),
    text: z.string().describe("The segment of text corresponding to the change."),
  })).describe("A detailed, color-coded breakdown of the differences between the two versions."),
});
export type CompareVersionsOutput = z.infer<typeof CompareVersionsOutputSchema>;


export async function compareVersions(input: CompareVersionsInput): Promise<CompareVersionsOutputType> {
  return compareVersionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareVersionsPrompt',
  input: {schema: CompareVersionsInputSchema},
  output: {schema: CompareVersionsOutputSchema},
  prompt: `You are an expert at comparing document versions and providing a clear, easy-to-understand diff.
Analyze the two text versions provided below.

Original Text:
---
{{{originalText}}}
---

Revised Text:
---
{{{revisedText}}}
---

First, provide a brief, high-level summary of the main changes.
Then, generate a detailed diff. To do this, break down the revised text into chunks, labeling each chunk as 'added', 'removed', or 'unchanged'.
- 'unchanged' should be used for text that exists in both versions.
- 'added' should be used for new text in the revised version.
- 'removed' should be for text from the original that is no longer present. Combine removed text into logical blocks.

Your goal is to reconstruct the revised text perfectly through the 'added' and 'unchanged' parts of the diff, while also clearly indicating what was 'removed'.
`,
});

const compareVersionsFlow = ai.defineFlow(
  {
    name: 'compareVersionsFlow',
    inputSchema: CompareVersionsInputSchema,
    outputSchema: CompareVersionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
