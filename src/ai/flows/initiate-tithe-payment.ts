'use server';
/**
 * @fileOverview A flow to simulate initiating a tithe payment via M-Pesa.
 * 
 * - initiateTithePayment - The main flow function.
 * - InitiateTithePaymentInput - The input type for the flow.
 * - InitiateTithePaymentOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from '@/firebase/server-initialization';

const InitiateTithePaymentInputSchema = z.object({
  userId: z.string().describe("The ID of the user initiating the payment."),
  amount: z.number().positive().describe("The amount to be paid."),
});
export type InitiateTithePaymentInput = z.infer<typeof InitiateTithePaymentInputSchema>;

const InitiateTithePaymentOutputSchema = z.object({
  success: z.boolean().describe("Whether the payment was successfully initiated."),
  transactionId: z.string().optional().describe("The mock transaction ID."),
  message: z.string().describe("A message to the user."),
});
export type InitiateTithePaymentOutput = z.infer<typeof InitiateTithePaymentOutputSchema>;

// This is a mock function. In a real app, this would interact with a payment gateway API.
async function mockMpesaApiCall(userId: string, amount: number): Promise<{ success: boolean; transactionId?: string }> {
  console.log(`Simulating M-Pesa payment initiation for user ${userId} of amount ${amount}`);
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate a successful transaction
  const success = Math.random() > 0.1; // 90% success rate
  if (success) {
    return {
      success: true,
      transactionId: `PILLAR_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };
  } else {
    return { success: false };
  }
}

export async function initiateTithePayment(input: InitiateTithePaymentInput): Promise<InitiateTithePaymentOutput> {
    return initiateTithePaymentFlow(input);
}

export const initiateTithePaymentFlow = ai.defineFlow(
  {
    name: 'initiateTithePaymentFlow',
    inputSchema: InitiateTithePaymentInputSchema,
    outputSchema: InitiateTithePaymentOutputSchema,
  },
  async ({ userId, amount }) => {
    const result = await mockMpesaApiCall(userId, amount);

    if (result.success && result.transactionId) {
      // If the mock payment was successful, add a corresponding transaction to Firestore.
      try {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        
        const financeRecord = {
            userProfileId: userId,
            date: new Date().toISOString(),
            description: `Tithe Payment (M-Pesa)`,
            type: 'tithe',
            amount: -Math.abs(amount), // Tithe is an expense
        };
        await addDoc(collection(db, `users/${userId}/financeRecords`), financeRecord);

        return {
          success: true,
          transactionId: result.transactionId,
          message: `Payment of Ksh ${amount} initiated successfully. Your records have been updated.`,
        };

      } catch (error) {
        console.error("Failed to save tithe transaction to Firestore:", error);
        // Even if saving to our DB fails, the payment gateway was technically successful.
        // In a real-world scenario, you'd need robust error handling/retry logic here.
        return {
            success: false,
            message: "Your payment was processed, but we failed to update your local records. Please add it manually.",
        }
      }
    }

    return {
      success: false,
      message: "Payment initiation failed. Please try again.",
    };
  }
);
