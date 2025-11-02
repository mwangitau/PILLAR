
import { getFirebaseApp } from '@/firebase/server-initialization';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase-admin/firestore';
import { subDays } from 'date-fns';

const app = getFirebaseApp();
const db = getFirestore(app);

export async function getHabitsForReport(userId: string, days: number) {
  const startDate = subDays(new Date(), days);
  const habitsRef = collection(db, `users/${userId}/habits`);
  const q = query(habitsRef, where('createdAt', '>=', startDate.toISOString()));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getJournalEntriesForReport(userId: string, days: number) {
  const startDate = subDays(new Date(), days);
  const journalRef = collection(db, `users/${userId}/journalEntries`);
  const q = query(journalRef, where('date', '>=', startDate.toISOString()), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getFinanceRecordsForReport(userId: string, days: number) {
  const startDate = subDays(new Date(), days);
  const financesRef = collection(db, `users/${userId}/financeRecords`);
  const q = query(financesRef, where('date', '>=', startDate.toISOString()), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
