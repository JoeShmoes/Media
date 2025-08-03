
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
import type { Project, Deal, Task, Offer, BrandVoice, Persona, Goal, Note, Client, Transaction } from '@/lib/types';


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

const OfferSchema = z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
});

const BrandVoiceSchema = z.object({
    tone: z.string(),
    style: z.string(),
    examples: z.string(),
});

const PersonaSchema = z.object({
    id: z.string(),
    name: z.string(),
    bio: z.string(),
});

const GoalSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
});

const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
});

const ClientSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
});

const TransactionSchema = z.object({
    id: z.string(),
    type: z.enum(["income", "expense"]),
    amount: z.number(),
    category: z.string(),
});


const GetBusinessAdviceInputSchema = z.object({
  question: z.string().describe('The question about the business. It may contain @-mentions to specify a data context.'),
  businessContext: z.string().describe('The context of the business.'),
  storedConversations: z.string().describe('Past conversations related to the business.'),
  projects: z.array(ProjectSchema).optional().describe("List of all user's projects."),
  deals: z.array(DealSchema).optional().describe("List of all user's sales deals."),
  tasks: z.array(TaskSchema).optional().describe("List of all user's tasks."),
  offers: z.array(OfferSchema).optional().describe("List of all user's created offers."),
  brandVoice: BrandVoiceSchema.optional().describe("The user's defined brand voice."),
  personas: z.array(PersonaSchema).optional().describe("List of all user's customer personas."),
  goals: z.array(GoalSchema).optional().describe("List of all user's business goals."),
  notes: z.array(NoteSchema).optional().describe("List of all user's notes."),
  clients: z.array(ClientSchema).optional().describe("List of all user's clients."),
  transactions: z.array(TransactionSchema).optional().describe("List of all user's financial transactions."),
});
export type GetBusinessAdviceInput = z.infer<typeof GetBusinessAdviceInputSchema>;

const GetBusinessAdviceOutputSchema = z.object({
  advice: z.string().describe('The real-time, custom-trained advice based on the business context and stored conversations.'),
});
export type GetBusinessAdviceOutput = z.infer<typeof GetBusinessAdviceOutputSchema>;

// Tools for the AI to get data
const getProjectsTool = ai.defineTool(
    { name: 'getProjects', description: 'Get a list of all current projects.', outputSchema: z.array(ProjectSchema), },
    async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.projects || []
);
const getDealsTool = ai.defineTool(
    { name: 'getDeals', description: 'Get a list of all current sales deals.', outputSchema: z.array(DealSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.deals || []
);
const getTasksTool = ai.defineTool(
    { name: 'getTasks', description: 'Get a list of all tasks.', outputSchema: z.array(TaskSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.tasks || []
);
const getOffersTool = ai.defineTool(
    { name: 'getOffers', description: 'Get a list of all created offers.', outputSchema: z.array(OfferSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.offers || []
);
const getClientsTool = ai.defineTool(
    { name: 'getClients', description: 'Get a list of all clients.', outputSchema: z.array(ClientSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.clients || []
);
const getFinanceTool = ai.defineTool(
    { name: 'getFinance', description: 'Get a list of all financial transactions.', outputSchema: z.array(TransactionSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.transactions || []
);
const getNotesTool = ai.defineTool(
    { name: 'getNotes', description: 'Get a list of all notes.', outputSchema: z.array(NoteSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.notes || []
);
const getPersonasTool = ai.defineTool(
    { name: 'getPersonas', description: 'Get a list of all customer personas.', outputSchema: z.array(PersonaSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.personas || []
);
const getGoalsTool = ai.defineTool(
    { name: 'getGoals', description: 'Get a list of all business goals.', outputSchema: z.array(GoalSchema), },
     async (_, flow) => flow.state.get<GetBusinessAdviceInput>()?.goals || []
);


export async function getBusinessAdvice(input: GetBusinessAdviceInput): Promise<GetBusinessAdviceOutput> {
  return getBusinessAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getBusinessAdvicePrompt',
  input: {schema: GetBusinessAdviceInputSchema},
  output: {schema: GetBusinessAdviceOutputSchema},
  tools: [getProjectsTool, getDealsTool, getTasksTool, getOffersTool, getPersonasTool, getGoalsTool, getNotesTool, getClientsTool, getFinanceTool],
  prompt: `You are a business advisor providing real-time, custom-trained advice based on the business context and stored conversations.
  The user's question might contain an @-mention to specify a data context. Use the corresponding tool to get the most up-to-date information before answering.
  - @Projects: Use getProjectsTool
  - @Deals: Use getDealsTool
  - @Tasks: Use getTasksTool
  - @Offers: Use getOffersTool
  - @Personas: Use getPersonasTool
  - @Goals: Use getGoalsTool
  - @Notes: Use getNotesTool
  - @Clients: Use getClientsTool
  - @Finance: Use getFinanceTool
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
