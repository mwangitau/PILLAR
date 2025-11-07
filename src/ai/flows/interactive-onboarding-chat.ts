
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

// Define a more structured profile
const UserProfileSchema = z.object({
  name: z.string().optional().describe("The user's first name."),
  primaryGoal: z.string().optional().describe("The user's main goal for using the app (e.g., 'build better habits', 'improve my finances')."),
  biggestChallenge: z.string().optional().describe("The biggest challenge currently stopping the user from achieving their goal."),
  preferredAccountability: z.string().optional().describe("How the user likes to be held accountable (e.g., 'gentle reminders', 'strict check-ins')."),
});

const OnboardingChatInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  // Use the new structured schema
  profile: UserProfileSchema.optional().describe('The current user profile data.'),
});

export type OnboardingChatInput = z.infer<typeof OnboardingChatInputSchema>;

const OnboardingChatOutputSchema = z.object({
  response: z.string().describe('The AI response to the user message.'),
  // Use the new structured schema
  profile: UserProfileSchema.describe('The updated user profile data.'),
  isComplete: z
    .boolean()
    .describe('Whether all required profile fields have been gathered.'),
});

export type OnboardingChatOutput = z.infer<typeof OnboardingChatOutputSchema>;

export async function interactiveOnboardingChat(
  input: OnboardingChatInput
): Promise<OnboardingChatOutput> {
  return interactiveOnboardingChatFlow(input);
}

const requiredFields = ['name', 'primaryGoal', 'biggestChallenge', 'preferredAccountability'];

const prompt = ai.definePrompt({
  name: 'onboardingChatPrompt',
  input: {schema: OnboardingChatInputSchema},
  output: {schema: OnboardingChatOutputSchema},
  prompt: `You are an AI assistant for an app called "Pillar". Your goal is to onboard new users by asking questions to build a profile.

You need to collect the following information:
- name: The user's first name.
- primaryGoal: Their main goal for using the app.
- biggestChallenge: What's currently stopping them.
- preferredAccountability: How they like to be held accountable.

Here is the current profile data you have collected:
{{{json profile}}}

The user has just sent the following message:
"{{{message}}}"

RULES:
1.  Analyze the user's message and update the profile with any new information they provided.
2.  After updating, check which required fields are still missing.
3.  Ask ONE clear and friendly question to gather ONE of the missing pieces of information. Do not ask for multiple things at once.
4.  If ALL fields (name, primaryGoal, biggestChallenge, preferredAccountability) have been collected, set "isComplete" to true and make your final response a friendly closing statement like "Thanks, that's everything I need to get your personalized plan ready!"
5.  Always return the full, updated profile object in your response.`,
});

const interactiveOnboardingChatFlow = ai.defineFlow(
  {
    name: 'interactiveOnboardingChatFlow',
    inputSchema: OnboardingChatInputSchema,
    outputSchema: OnboardingChatOutputSchema,
  },
  async ({ message, profile }) => {
    // Ensure profile is a defined object
    const currentProfile = profile || {};

    const { output } = await prompt({ message, profile: currentProfile });
    if (!output) {
      throw new Error('AI failed to generate a valid output.');
    }
    
    // Determine if onboarding is complete
    const updatedProfile = output.profile;
    const isComplete = requiredFields.every(field => 
        updatedProfile[field as keyof typeof updatedProfile] && 
        String(updatedProfile[field as keyof typeof updatedProfile]).trim() !== ''
    );

    // The AI might decide it's complete, but we double-check here for robustness.
    // If our check passes, we force isComplete to be true.
    if (isComplete) {
      output.isComplete = true;
    }

    return output;
  }
);
