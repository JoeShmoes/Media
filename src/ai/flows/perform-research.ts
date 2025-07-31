'use server';
/**
 * @fileOverview A research AI agent that uses Wikipedia.
 *
 * - performResearch - A function that handles the research process.
 * - searchWikipedia - A function that searches for Wikipedia articles.
 * - PerformResearchInput - The input type for the performResearch function.
 * - PerformResearchOutput - The return type for the performResearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wikipedia, { type WikipediaResult } from 'wikipedia';

const PerformResearchInputSchema = z.object({
  topic: z.string().describe('The research topic (article title).'),
  question: z.string().describe('A specific question about the topic.'),
});
export type PerformResearchInput = z.infer<typeof PerformResearchInputSchema>;

const PerformResearchOutputSchema = z.object({
  summary: z.string().describe('A summary of the research findings.'),
  answer: z.string().describe('The answer to the specific question.'),
});
export type PerformResearchOutput = z.infer<typeof PerformResearchOutputSchema>;

const WikipediaSearchInputSchema = z.object({
  topic: z.string().describe('The topic to search for on Wikipedia.'),
});
export type WikipediaSearchInput = z.infer<typeof WikipediaSearchInputSchema>;

const WikipediaSearchResultSchema = z.object({
  pageid: z.number(),
  title: z.string(),
  description: z.string().optional(),
});
export type WikipediaSearchResult = z.infer<typeof WikipediaSearchResultSchema>;


// This function is exported to be used directly by the client component
export async function searchWikipedia(input: WikipediaSearchInput): Promise<WikipediaSearchResult[]> {
  try {
    const searchResult = await wikipedia.search(input.topic, { limit: 5 });
    return searchResult.results.map((r: WikipediaResult) => ({
      pageid: r.pageid,
      title: r.title,
      description: r.description,
    }));
  } catch (error) {
    console.error('Wikipedia search failed:', error);
    return [];
  }
}

const getWikipediaSummary = ai.defineTool(
  {
    name: 'getWikipediaSummary',
    description: 'Get a summary of a Wikipedia article for a given page title.',
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
      console.error('Wikipedia summary fetch failed:', error);
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
  tools: [getWikipediaSummary],
  prompt: `You are a research assistant.
  First, use the getWikipediaSummary tool to find information on the given topic: {{{topic}}}.
  The result will be the summary of the Wikipedia article.
  Then, provide a concise summary of the findings based on the tool's output.
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
