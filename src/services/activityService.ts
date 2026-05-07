import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "@/lib/firebase";

export interface Activity {
  id?: string;
  type: 'ai' | 'system' | 'intelligence' | 'campaign';
  message: string;
  timestamp: any;
}

const COLLECTION = 'activities';

export const ActivityService = {
  /**
   * Logs a new activity to Firestore
   */
  async log(type: Activity['type'], message: string) {
    try {
      await addDoc(collection(db, COLLECTION), {
        type,
        message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION);
    }
  },

  /**
   * Subscribes to the most recent activities
   */
  subscribeToRecent(callback: (activities: Activity[]) => void, max: number = 10) {
    const q = query(
      collection(db, COLLECTION), 
      orderBy("timestamp", "desc"), 
      limit(max)
    );

    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Activity));
      callback(logs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
    });
  }
};
