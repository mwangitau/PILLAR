'use server';
/**
 * @fileOverview A flow to download all of a user's data.
 *
 * - downloadUserDataFlow - The main flow function.
 * - DownloadUserDataInputSchema - The input schema for the flow.
 * - DownloadUserDataOutputSchema - The output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseApp } from '@/firebase/server-initialization';

const DownloadUserDataInputSchema = z.object({
  userId: z.string().describe("The ID of the user whose data should be downloaded."),
});
export type DownloadUserDataInput = z.infer<typeof DownloadUserDataInputSchema>;

const DownloadUserDataOutputSchema = z.object({
  jsonData: z.string().describe("All of the user's data in a single JSON string."),
});
export type DownloadUserDataOutput = z.infer<typeof DownloadUserDataOutputSchema>;


const app = getFirebaseApp();
const db = getFirestore(app);

async function getCollectionData(path: string) {
    const snapshot = await db.collection(path).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export const downloadUserDataFlow = ai.defineFlow(
  {
    name: 'downloadUserDataFlow',
    inputSchema: DownloadUserDataInputSchema,
    outputSchema: DownloadUserDataOutputSchema,
  },
  async ({ userId }) => {
    const userProfile = (await db.collection('userProfiles').doc(userId).get()).data();
    let onboardingData = null;
    if (userProfile?.onboardingDataId) {
        onboardingData = (await db.collection('onboardingData').doc(userProfile.onboardingDataId).get()).data();
    }
    
    const [
        plans, 
        habits, 
        journalEntries, 
        accountabilityPartners, 
        financeRecords, 
        reports
    ] = await Promise.all([
        getCollectionData(`users/${userId}/plans`),
        getCollectionData(`users/${userId}/habits`),
        getCollectionData(`users/${userId}/journalEntries`),
        getCollectionData(`users/${userId}/accountabilityPartners`),
        getCollectionData(`users/${userId}/financeRecords`),
        getCollectionData(`users/${userId}/reports`),
    ]);

    const allData = {
        userProfile,
        onboardingData,
        plans,
        habits,
        journalEntries,
        accountabilityPartners,
        financeRecords,
        reports,
    };

    return { jsonData: JSON.stringify(allData, null, 2) };
  }
);

export async function downloadUserData(input: DownloadUserDataInput): Promise<DownloadUserDataOutput> {
    return downloadUserDataFlow(input);
}
