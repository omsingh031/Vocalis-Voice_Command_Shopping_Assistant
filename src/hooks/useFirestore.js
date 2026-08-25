import { useState, useEffect } from 'react';
import { db, isFirebaseReady, ensureAnonymousSession } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

export function useFirestore() {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isFirebaseReady) {
      setIsReady(true); // Let local mode take over
      return;
    }

    let unsubs = [];
    ensureAnonymousSession().then((user) => {
      setUid(user.uid);

      const itemsRef = collection(db, `users/${user.uid}/items`);
      unsubs.push(
        onSnapshot(itemsRef, (snapshot) => {
          setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
      );

      const historyRef = collection(db, `users/${user.uid}/history`);
      unsubs.push(
        onSnapshot(historyRef, (snapshot) => {
          setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
      );

      const inventoryRef = collection(db, `users/${user.uid}/inventory`);
      unsubs.push(
        onSnapshot(inventoryRef, (snapshot) => {
          setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
      );

      setIsReady(true);
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const addOrUpdateItem = async (item) => {
    if (!isFirebaseReady || !uid) return;
    const itemRef = doc(db, `users/${uid}/items`, item.id);
    await setDoc(itemRef, item);
  };

  const removeFirestoreItem = async (itemId) => {
    if (!isFirebaseReady || !uid) return;
    const itemRef = doc(db, `users/${uid}/items`, itemId);
    await deleteDoc(itemRef);
  };

  const addHistoryEntry = async (entry) => {
    if (!isFirebaseReady || !uid) return;
    // Generate a random ID for history entry if not provided
    const entryId = entry.id || Date.now().toString();
    const historyRef = doc(db, `users/${uid}/history`, entryId);
    await setDoc(historyRef, { ...entry, id: entryId });
  };

  const moveItemsToInventory = async (itemsToMove, newInventoryState) => {
    if (!isFirebaseReady || !uid) return;
    const batch = writeBatch(db);

    // Remove from shopping list
    itemsToMove.forEach(item => {
      const itemRef = doc(db, `users/${uid}/items`, item.id);
      batch.delete(itemRef);
    });

    // Update inventory
    newInventoryState.forEach(invItem => {
      const invRef = doc(db, `users/${uid}/inventory`, invItem.id);
      batch.set(invRef, invItem);
    });

    await batch.commit();
  };

  const clearAllItems = async (itemsToClear) => {
    if (!isFirebaseReady || !uid) return;
    const batch = writeBatch(db);
    itemsToClear.forEach(item => {
      const itemRef = doc(db, `users/${uid}/items`, item.id);
      batch.delete(itemRef);
    });
    await batch.commit();
  };

  const syncLocalState = async (localItems, localHistory, localInventory) => {
    if (!isFirebaseReady || !uid) return;
    
    // We only want to sync up if Firestore is empty to migrate from local to cloud.
    // However, for simplicity right now we will just use the CRUD operations
    // individually from the components, and not do bulk syncing on load unless requested.
  };

  return {
    items,
    history,
    inventory,
    isReady,
    addOrUpdateItem,
    removeFirestoreItem,
    addHistoryEntry,
    moveItemsToInventory,
    clearAllItems
  };
}
