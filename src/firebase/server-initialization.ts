
import {initializeApp, getApps, App} from 'firebase-admin/app';

// This is a temporary solution to avoid a circular dependency.
// It is critical that this file is not imported by any client-side code.
export function getFirebaseApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }
  return initializeApp();
}
