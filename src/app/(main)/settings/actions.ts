
"use server";

import { deleteUserAccountFlow } from "@/ai/flows/delete-user-account";

export async function deleteUserAccount(userId: string, onboardingDataId?: string): Promise<void> {
    await deleteUserAccountFlow({ userId, onboardingDataId });
}
