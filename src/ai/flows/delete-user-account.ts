
'use server';
/**
 * @fileOverview A flow to delete a user's account and all associated data.
 * 
 * - deleteUserAccountFlow - The main flow function.
 * - DeleteUserAccountInputSchema - The input schema for the flow.
 * - DeleteUserAccountOutputSchema - The output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App } from 'firebase-admin/app';

const DeleteUserAccountInputSchema = z.object({
  userId: z.string().describe("The ID of the user to delete."),
  onboardingDataId: z.string().optional().describe("The ID of the user's onboarding data."),
});
export type DeleteUserAccountInput = z.infer<typeof DeleteUserAccountInputSchema>;

const DeleteUserAccountOutputSchema = z.object({
  success: z.boolean().describe("Whether the user account was deleted successfully."),
});
export type DeleteUserAccountOutput = z.infer<typeof DeleteUserAccountOutputSchema>;

let app: App;
if (!getApps().length) {
  app = initializeApp();
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth(app);

const deleteCollection = async (path: string, batchSize: number = 50) => {
    const collectionRef = db.collection(path);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(query: FirebaseFirestore.Query, resolve: (value: unknown) => void) {
    const snapshot = await query.get();

    if (snapshot.size === 0) {
        return resolve(0);
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(query, resolve);
    });
}


export const deleteUserAccountFlow = ai.defineFlow(
  {
    name: 'deleteUserAccountFlow',
    inputSchema: DeleteUserAccountInputSchema,
    outputSchema: DeleteUserAccountOutputSchema,
  },
  async ({ userId, onboardingDataId }) => {

    // Delete all subcollections
    const subcollections = ['plans', 'habits', 'journalEntries', 'accountabilityPartners', 'financeRecords', 'reports'];
    for (const subcollection of subcollections) {
      await deleteCollection(`users/${userId}/${subcollection}`);
    }

    // Delete user profile
    await db.collection('userProfiles').doc(userId).delete();

    // Delete onboarding data if it exists
    if (onboardingDataId) {
      await db.collection('onboardingData').doc(onboardingDataId).delete();
    }
    
    // Delete user from Auth
    await auth.deleteUser(userId);

    return { success: true };
  }
);
