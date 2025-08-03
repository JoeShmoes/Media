
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
import type { Project, Deal, Task } from '@/lib/types';


// Schemas for data structures, consistent with src/lib/types.ts
const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  service: z.string(),
  status: z.string(),
  deadline: z.string().optional(),
  link: z.string().optional(),
});

const DealSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.number(),
  status: z.string(),
  clientName: z.string().optional(),
  notes: z.string().optional(),
});

const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  completed: z.boolean(),
  dueDate: z.string().optional(),
});


const GetBusinessAdviceInputSchema = z.object({
  question: z.string().describe('The question about the business. It may contain @-mentions like @Projects, @Deals, or @Tasks to specify a data context.'),
  businessContext: z.string().describe('The context of the business.'),
  storedConversations: z.string().describe('Past conversations related to the business.'),
  projects: z.array(ProjectSchema).optional().describe("List of all user's projects."),
  deals: z.array(DealSchema).optional().describe("List of all user's sales deals."),
  tasks: z.array(TaskSchema).optional().describe("List of all user's tasks."),
});
export type GetBusinessAdviceInput = z.infer<typeof GetBusinessAdviceInputSchema>;

const GetBusinessAdviceOutputSchema = z.object({
  advice: z.string().describe('The real-time, custom-trained advice based on the business context and stored conversations.'),
});
export type GetBusinessAdviceOutput = z.infer<typeof GetBusinessAdviceOutputSchema>;

// Tools for the AI to get data
const getProjectsTool = ai.defineTool(
    {
        name: 'getProjects',
        description: 'Get a list of all current projects.',
        outputSchema: z.array(ProjectSchema),
    },
    async (_, flow) => {
        return flow.state.get<GetBusinessAdviceInput>()?.projects || [];
    }
);
const getDealsTool = ai.defineTool(
    {
        name: 'getDeals',
        description: 'Get a list of all current sales deals.',
        outputSchema: z.array(DealSchema),
    },
     async (_, flow) => {
        return flow.state.get<GetBusinessAdviceInput>()?.deals || [];
    }
);
const getTasksTool = ai.defineTool(
    {
        name: 'getTasks',
        description: 'Get a list of all tasks.',
        outputSchema: z.array(TaskSchema),
    },
     async (_, flow) => {
        return flow.state.get<GetBusinessAdviceInput>()?.tasks || [];
    }
);


export async function getBusinessAdvice(input: GetBusinessAdviceInput): Promise<GetBusinessAdviceOutput> {
  return getBusinessAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getBusinessAdvicePrompt',
  input: {schema: GetBusinessAdviceInputSchema},
  output: {schema: GetBusinessAdviceOutputSchema},
  tools: [getProjectsTool, getDealsTool, getTasksTool],
  prompt: `You are a business advisor providing real-time, custom-trained advice based on the business context and stored conversations.
  The user's question might contain an @-mention (like @Projects, @Deals, or @Tasks) to specify a data context.
  If the user asks a question that requires information about their projects, deals, or tasks (e.g., "Summarize my @Projects" or "What are my most urgent @Tasks?"), use the provided tools to get the most up-to-date information before answering.
  If the user just asks a general question, answer it based on the business context and conversation history.

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
