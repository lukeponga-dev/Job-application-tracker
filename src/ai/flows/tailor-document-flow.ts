'use server';
/**
 * @fileOverview AI-powered CV and cover letter tailoring flow.
 *
 * - tailorDocuments - A function that tailors a CV and cover letter based on a job description.
 * - TailorDocumentsInput - The input type for the tailorDocuments function.
 * - TailorDocumentsOutput - The return type for the tailorDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorDocumentsInputSchema = z.object({
  cv: z.string().describe('The user\'s current CV or resume.'),
  jobDescription: z.string().describe('The job description for the target role.'),
  companyName: z.string().describe('The name of the company.'),
  role: z.string().describe('The name of the role.'),
});
export type TailorDocumentsInput = z.infer<typeof TailorDocumentsInputSchema>;

const TailorDocumentsOutputSchema = z.object({
  tailoredCv: z.string().describe('The tailored CV, rewritten to match the job description.'),
  tailoredCoverLetter: z.string().describe('The tailored cover letter, written for the job application.'),
});
export type TailorDocumentsOutput = z.infer<typeof TailorDocumentsOutputSchema>;

export async function tailorDocuments(
  input: TailorDocumentsInput
): Promise<TailorDocumentsOutput> {
  return tailorDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tailorDocumentsPrompt',
  input: {schema: TailorDocumentsInputSchema},
  output: {schema: TailorDocumentsOutputSchema},
  prompt: `You are an expert career coach. Your task is to help a user tailor their CV and write a compelling cover letter for a specific job application.

You will be given the user's current CV, the company name, the role, and the job description.

Analyze the job description to identify the key requirements, skills, and qualifications.
Then, rewrite the user's CV to highlight the most relevant experiences and skills that match the job description. Use strong action verbs and quantify achievements where possible. The tone should be professional and confident.

Next, write a cover letter for the application. The cover letter should be:
- Addressed to the hiring manager (if not available, use a generic greeting).
- Structured with an introduction, body, and conclusion.
- The introduction should state the position being applied for and where it was seen.
- The body should connect the user's experience and skills directly to the requirements in the job description, providing specific examples.
- The conclusion should reiterate interest in the role, express eagerness for an interview, and include a professional closing.

User's CV:
{{{cv}}}

Company Name: {{{companyName}}}
Role: {{{role}}}
Job Description:
{{{jobDescription}}}
`,
});

const tailorDocumentsFlow = ai.defineFlow(
  {
    name: 'tailorDocumentsFlow',
    inputSchema: TailorDocumentsInputSchema,
    outputSchema: TailorDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
