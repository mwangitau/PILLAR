'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { firebaseConfig } from './config';

function MissingFirebaseConfig() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <div className="max-w-2xl rounded-lg border border-destructive bg-card p-8 text-center shadow-lg">
        <h1 className="font-headline text-3xl font-bold text-destructive">
          Firebase Configuration Missing
        </h1>
        <p className="mt-4 text-lg text-card-foreground">
          Your application is not configured to connect to Firebase yet.
        </p>
        <div className="mt-6 text-left text-muted-foreground">
          <p className="font-semibold">To fix this, you need to:</p>
          <ol className="mt-2 list-inside list-decimal space-y-2">
            <li>
              Create a file named <code>.env</code> in the root of your project
              directory.
            </li>
            <li>
              Copy the contents of the <code>.env.example</code> file into your
              new <code>.env</code> file.
            </li>
            <li>
              Replace the placeholder values (like <code>"AIza..."</code> and{' '}
              <code>"your-project-id"</code>) with your actual Firebase project
              credentials. You can find these in your{' '}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline"
              >
                Firebase Console
              </a>{' '}
              (Project Settings {'>'} General {'>'} Your apps {'>'} Web app).
            </li>
            <li>
              <strong>
                Important: After saving the <code>.env</code> file, you must
                stop and restart the development server.
              </strong>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}


export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const isConfigured = useMemo(() => {
    return (
      firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.authDomain
    );
  }, []);

  const firebaseServices = useMemo(() => {
    if (!isConfigured) return null;
    return initializeFirebase();
  }, [isConfigured]);

  if (!isConfigured || !firebaseServices) {
    return <MissingFirebaseConfig />;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
