'use server';
/**
 * @fileOverview AI-powered application status suggestion flow.
 *
 * - suggestApplicationStatus - A function that suggests an appropriate application status based on job application details.
 * - SuggestApplicationStatusInput - The input type for the suggestApplicationStatus function.
 * - SuggestApplicationStatusOutput - The return type for the suggestApplicationStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestApplicationStatusInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  role: z.string().describe('The role applied for.'),
  dateApplied: z.string().describe('The date when the application was submitted (ISO format).'),
  notes: z.string().describe('Any notes or details about the application process.'),
});
export type SuggestApplicationStatusInput = z.infer<typeof SuggestApplicationStatusInputSchema>;

const SuggestApplicationStatusOutputSchema = z.object({
  suggestedStatus: z
    .enum(['Applied', 'Interviewing', 'Offer', 'Rejected'])
    .describe('The AI-suggested application status.'),
  reason: z.string().describe('The reasoning behind the suggested status.'),
});
export type SuggestApplicationStatusOutput = z.infer<typeof SuggestApplicationStatusOutputSchema>;

export async function suggestApplicationStatus(
  input: SuggestApplicationStatusInput
): Promise<SuggestApplicationStatusOutput> {
  return suggestApplicationStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestApplicationStatusPrompt',
  input: {schema: SuggestApplicationStatusInputSchema},
  output: {schema: SuggestApplicationStatusOutputSchema},
  prompt: `You are an AI assistant helping users manage their job applications by suggesting the most appropriate status for each application.

  Based on the following job application details, suggest an application status from these options: Applied, Interviewing, Offer, Rejected. Also provide a brief reason for your suggestion.

  Company Name: {{{companyName}}}
  Role: {{{role}}}
  Date Applied: {{{dateApplied}}}
  Notes: {{{notes}}}

  Your suggested status should reflect the current stage of the application process based on the information provided. The reasoning should be concise and explain why you chose that status. Focus on extracting key stages of the application like confirmation of applying, scheduling of interviews, receiving a job offer or being notified of rejection from the notes section.

  Ensure that the suggested status is realistic and corresponds to known application processes.`,
});

const suggestApplicationStatusFlow = ai.defineFlow(
  {
    name: 'suggestApplicationStatusFlow',
    inputSchema: SuggestApplicationStatusInputSchema,
    outputSchema: SuggestApplicationStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
