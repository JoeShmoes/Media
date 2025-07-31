'use server';
/**
 * @fileOverview A research AI agent that uses Wikipedia.
 *
 * - performResearch - A function that handles the research process.
 * - PerformResearchInput - The input type for the performResearch function.
 * - PerformResearchOutput - The return type for the performResearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wikipedia from 'wikipedia';

const PerformResearchInputSchema = z.object({
  topic: z.string().describe('The research topic.'),
  question: z.string().describe('A specific question about the topic.'),
});
export type PerformResearchInput = z.infer<typeof PerformResearchInputSchema>;

const PerformResearchOutputSchema = z.object({
  summary: z.string().describe('A summary of the research findings.'),
  answer: z.string().describe('The answer to the specific question.'),
});
export type PerformResearchOutput = z.infer<typeof PerformResearchOutputSchema>;

const searchWikipedia = ai.defineTool(
  {
    name: 'searchWikipedia',
    description: 'Search Wikipedia for a given topic and return a summary of the most relevant page.',
    inputSchema: z.object({ topic: z.string() }),
    outputSchema: z.string(),
  },
  async ({ topic }) => {
    try {
      const page = await wikipedia.page(topic);
      const summary = await page.summary();
      // Return first 3 paragraphs
      return summary.content.split('\n').slice(0, 3).join('\n');
    } catch (error) {
      console.error('Wikipedia search failed:', error);
      return 'Could not find information on this topic.';
    }
  }
);


export async function performResearch(input: PerformResearchInput): Promise<PerformResearchOutput> {
  return performResearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'performResearchPrompt',
  input: {schema: PerformResearchInputSchema},
  output: {schema: PerformResearchOutputSchema},
  tools: [searchWikipedia],
  prompt: `You are a research assistant.
  First, use the searchWikipedia tool to find information on the given topic: {{{topic}}}.
  Then, provide a concise summary of the findings.
  Finally, based on the research, answer the user's specific question: {{{question}}}
  `,
});

const performResearchFlow = ai.defineFlow(
  {
    name: 'performResearchFlow',
    inputSchema: PerformResearchInputSchema,
    outputSchema: PerformResearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
