'use server';

/**
 * @fileOverview A business advice AI agent.
 *
 * - getBusinessAdvice - A function that handles the business advice process.
 * - GetBusinessAdviceInput - The input type for the getBusinessAdvice function.
 * - GetBusinessAdviceOutput - The return type for the getBusinessAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetBusinessAdviceInputSchema = z.object({
  question: z.string().describe('The question about the business.'),
  businessContext: z.string().describe('The context of the business.'),
  storedConversations: z.string().describe('Past conversations related to the business.'),
});
export type GetBusinessAdviceInput = z.infer<typeof GetBusinessAdviceInputSchema>;

const GetBusinessAdviceOutputSchema = z.object({
  advice: z.string().describe('The real-time, custom-trained advice based on the business context and stored conversations.'),
});
export type GetBusinessAdviceOutput = z.infer<typeof GetBusinessAdviceOutputSchema>;

export async function getBusinessAdvice(input: GetBusinessAdviceInput): Promise<GetBusinessAdviceOutput> {
  return getBusinessAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getBusinessAdvicePrompt',
  input: {schema: GetBusinessAdviceInputSchema},
  output: {schema: GetBusinessAdviceOutputSchema},
  prompt: `You are a business advisor providing real-time, custom-trained advice based on the business context and stored conversations.

  Business Context: {{{businessContext}}}
  Stored Conversations: {{{storedConversations}}}
  Question: {{{question}}}

  Provide advice: `,
});

const getBusinessAdviceFlow = ai.defineFlow(
  {
    name: 'getBusinessAdviceFlow',
    inputSchema: GetBusinessAdviceInputSchema,
    outputSchema: GetBusinessAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
