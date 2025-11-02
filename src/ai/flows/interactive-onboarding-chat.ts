'use server';

/**
 * @fileOverview Implements an interactive onboarding chat flow using AI to gather user information and build a profile.
 *
 * - interactiveOnboardingChat - A function that initiates and manages the onboarding chat process.
 * - OnboardingChatInput - The input type for the interactiveOnboardingChat function, representing a user message.
 * - OnboardingChatOutput - The return type for the interactiveOnboardingChat function, including the AI's response and updated user profile data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OnboardingChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  profile: z
    .record(z.any())
    .optional()
    .describe('The current user profile as a record of key-value pairs.'),
  isComplete: z
    .boolean()
    .optional()
    .describe('If the onboarding is complete or not.'),
});

export type OnboardingChatInput = z.infer<typeof OnboardingChatInputSchema>;

const OnboardingChatOutputSchema = z.object({
  response: z.string().describe('The AI response to the user message.'),
  profile: z
    .record(z.any())
    .describe('The updated user profile as a record of key-value pairs.'),
  isComplete: z
    .boolean()
    .describe('If the onboarding is complete or not.'),
});

export type OnboardingChatOutput = z.infer<typeof OnboardingChatOutputSchema>;

export async function interactiveOnboardingChat(
  input: OnboardingChatInput
): Promise<OnboardingChatOutput> {
  return interactiveOnboardingChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'onboardingChatPrompt',
  input: {schema: OnboardingChatInputSchema},
  output: {schema: OnboardingChatOutputSchema},
  prompt: `You are an AI assistant designed to onboard new users by asking a series of questions to build a detailed profile.

  The current user profile is: {{{profile}}}
  The user has sent the following message: {{{message}}}

  {% if isComplete %} The user onboarding process is complete.
  {% else %} The user onboarding process is not complete.
  Please ask one question that can help you to complete the user profile. 
  Once you have enough information to onboard the user, set isComplete to true. 
  Return the updated profile and your response to the user. 
  {% endif %}
  `,
});

const interactiveOnboardingChatFlow = ai.defineFlow(
  {
    name: 'interactiveOnboardingChatFlow',
    inputSchema: OnboardingChatInputSchema,
    outputSchema: OnboardingChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
