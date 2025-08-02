
'use server';
/**
 * @fileOverview An AI flow for searching through various asset types.
 *
 * - searchAssets - A function that handles the asset search.
 * - SearchAssetsInput - The input type for the searchAssets function.
 * - SearchAssetsOutput - The return type for the searchAssets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas for the assets, matching their definitions in src/lib/types.ts
const DomainSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  expires: z.string(),
});

const DesignAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Logo", "Font", "Color", "Mockup", "Other"]),
  fileUrl: z.string(),
});

const LegalDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Contract", "NDA", "Template", "Other"]),
  fileUrl: z.string(),
});


const SearchAssetsInputSchema = z.object({
  query: z.string().describe('The user\'s search query.'),
  domains: z.array(DomainSchema).describe('The list of domain assets.'),
  designAssets: z.array(DesignAssetSchema).describe('The list of design assets.'),
  legalDocs: z.array(LegalDocumentSchema).describe('The list of legal documents.'),
});
export type SearchAssetsInput = z.infer<typeof SearchAssetsInputSchema>;

const SearchAssetsOutputSchema = z.object({
  domainIds: z.array(z.string()).describe('A list of domain asset IDs that match the query.'),
  designAssetIds: z.array(z.string()).describe('A list of design asset IDs that match the query.'),
  legalDocIds: z.array(z.string()).describe('A list of legal document IDs that match the query.'),
});
export type SearchAssetsOutput = z.infer<typeof SearchAssetsOutputSchema>;

export async function searchAssets(input: SearchAssetsInput): Promise<SearchAssetsOutput> {
  return searchAssetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchAssetsPrompt',
  input: {schema: SearchAssetsInputSchema},
  output: {schema: SearchAssetsOutputSchema},
  prompt: `You are an intelligent asset search engine. Your task is to analyze the user's query and the provided lists of assets (domains, design assets, legal documents) and identify which assets are relevant.

  User Query: {{{query}}}

  Carefully examine the name, type, and other properties of each asset to determine if it matches the user's query. The query might be a direct keyword search or a natural language question (e.g., "find all my logos", "show me contracts expiring soon").

  Return the IDs of only the assets that are a strong match for the query. If no assets match, return empty arrays.

  Available Domains:
  {{#if domains}}
    {{#each domains}}
      - ID: {{id}}, Name: {{name}}, Provider: {{provider}}
    {{/each}}
  {{else}}
    No domains provided.
  {{/if}}

  Available Design Assets:
  {{#if designAssets}}
    {{#each designAssets}}
      - ID: {{id}}, Name: {{name}}, Type: {{type}}
    {{/each}}
  {{else}}
    No design assets provided.
  {{/if}}
  
  Available Legal Documents:
  {{#if legalDocs}}
    {{#each legalDocs}}
      - ID: {{id}}, Name: {{name}}, Type: {{type}}
    {{/each}}
  {{else}}
    No legal documents provided.
  {{/if}}
`,
});

const searchAssetsFlow = ai.defineFlow(
  {
    name: 'searchAssetsFlow',
    inputSchema: SearchAssetsInputSchema,
    outputSchema: SearchAssetsOutputSchema,
  },
  async input => {
    // If all asset lists are empty, no need to call the AI.
    if (input.domains.length === 0 && input.designAssets.length === 0 && input.legalDocs.length === 0) {
        return { domainIds: [], designAssetIds: [], legalDocIds: [] };
    }
      
    const {output} = await prompt(input);
    return output!;
  }
);
