
'use server';
/**
 * @fileOverview A research AI agent that uses Wikipedia and Google Search.
 *
 * - performResearch - A function that handles the research process.
 * - searchWikipedia - A function that searches for Wikipedia articles.
 * - PerformResearchInput - The input type for the performResearch function.
 * - PerformResearchOutput - The return type for the performResearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wikipedia, { type WikipediaResult, type WikipediaSummary } from 'wikipedia';

const PerformResearchInputSchema = z.object({
  topic: z.string().describe('The research topic (e.g., article title or search query).'),
  question: z.string().describe('A specific question about the topic.'),
  engine: z.enum(['wikipedia', 'google']).describe('The search engine to use.'),
});
export type PerformResearchInput = z.infer<typeof PerformResearchInputSchema>;

const PerformResearchOutputSchema = z.object({
  summary: z.string().describe('A summary of the research findings.'),
  answer: z.string().describe('The answer to the specific question.'),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
  })).optional().describe('A list of sources used for the research.'),
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

const getWikipediaSummaryTool = ai.defineTool(
  {
    name: 'getWikipediaSummary',
    description: 'Get a summary of a Wikipedia article for a given page title. Use this for broad, factual topics.',
    inputSchema: z.object({ topic: z.string() }),
    outputSchema: z.string(),
  },
  async ({ topic }) => {
    try {
      const page = await wikipedia.page(topic);
      const summary = await page.summary();
      // Return first 3 paragraphs
      return summary.extract;
    } catch (error) {
      console.error('Wikipedia summary fetch failed:', error);
      return 'Could not find information on this topic.';
    }
  }
);

// This function is exported to be used directly by the client component
export async function getWikipediaSummaryForClient({ topic }: { topic: string }): Promise<string> {
  try {
    const page = await wikipedia.page(topic);
    const summary = await page.summary();
    return summary.extract;
  } catch (error) {
    console.error('Wikipedia summary fetch failed:', error);
    return 'Could not fetch summary for this topic.';
  }
}

const googleSearchTool = ai.defineTool(
  {
    name: 'googleSearch',
    description: 'Perform a Google search for a given query. Use this for current events, opinions, or topics not well-covered by Wikipedia.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.any(),
  },
  async ({ query }) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    if (!apiKey || !searchEngineId) {
      return 'Google Search is not configured.';
    }
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Search API failed with status: ${response.status}`);
      }
      const data = await response.json();
      const results = data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) || [];
      return results.slice(0, 5); // Return top 5 results
    } catch (error) {
      console.error('Google Search failed:', error);
      return 'An error occurred during the Google search.';
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
  tools: [getWikipediaSummaryTool, googleSearchTool],
  prompt: `You are a research assistant.
  Based on the user's chosen search engine, use the appropriate tool to find information on the given topic.
  - If engine is 'wikipedia', use getWikipediaSummaryTool with the topic: {{{topic}}}.
  - If engine is 'google', use googleSearchTool with the query: {{{topic}}}.

  The result will be the summary of the Wikipedia article or a list of Google search results.
  
  Based on the information you receive:
  1. Provide a concise summary of the findings.
  2. Answer the user's specific question: {{{question}}}
  3. If you used Google Search, list the URLs of the top 3 most relevant sources you used to formulate your answer.
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
