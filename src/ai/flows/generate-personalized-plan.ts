'use server';

/**
 * @fileOverview AI flow for generating a personalized plan based on user profile, onboarding answers, and prompt templates.
 *
 * - generatePersonalizedPlan - A function that generates a personalized plan.
 * - PersonalizedPlanInput - The input type for the generatePersonalizedPlan function.
 * - PersonalizedPlanOutput - The return type for the generatePersonalizedPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedPlanInputSchema = z.object({
  userProfile: z.string().describe('The user profile data.'),
  onboardingAnswers: z.string().describe('The answers to onboarding questions.'),
  promptTemplates: z.string().describe('The selected prompt templates.'),
});
export type PersonalizedPlanInput = z.infer<typeof PersonalizedPlanInputSchema>;

const PersonalizedPlanOutputSchema = z.object({
  identityAdvice: z.string().describe('Tailored advice on identity.'),
  dailyRoutineAdvice: z.string().describe('Tailored advice on daily routines.'),
  habitAdvice: z.string().describe('Tailored advice on habits.'),
  sobrietyAdvice: z.string().describe('Tailored advice on sobriety.'),
  accountabilityAdvice: z.string().describe('Tailored advice on accountability.'),
});
export type PersonalizedPlanOutput = z.infer<typeof PersonalizedPlanOutputSchema>;

export async function generatePersonalizedPlan(
  input: PersonalizedPlanInput
): Promise<PersonalizedPlanOutput> {
  return generatePersonalizedPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedPlanPrompt',
  input: {schema: PersonalizedPlanInputSchema},
  output: {schema: PersonalizedPlanOutputSchema},
  prompt: `You are an AI assistant designed to generate personalized plans for users based on their profile, answers to onboarding questions, and a selection of prompt templates.

User Profile: {{{userProfile}}}
Onboarding Answers: {{{onboardingAnswers}}}
Prompt Templates: {{{promptTemplates}}}

Generate tailored advice on identity, daily routines, habits, sobriety, and accountability based on the provided information. Return the advice in the structured JSON format.`,
});

const generatePersonalizedPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedPlanFlow',
    inputSchema: PersonalizedPlanInputSchema,
    outputSchema: PersonalizedPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
