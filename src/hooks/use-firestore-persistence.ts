
"use client"

import * as React from 'react';
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export function useFirestorePersistence() {
  React.useEffect(() => {
    let persistenceEnabled = false;

    const enablePersistence = async () => {
      if (persistenceEnabled) return;

      try {
        await enableIndexedDbPersistence(db);
        persistenceEnabled = true;
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence failed: multiple tabs open.');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence is not available in this browser.');
        }
      }
    };

    enablePersistence();

  }, []);
}
