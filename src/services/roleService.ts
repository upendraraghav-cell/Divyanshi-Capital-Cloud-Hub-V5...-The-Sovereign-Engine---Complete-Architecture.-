import { db, handleFirestoreError, OperationType, doc, safeGetDoc, setDoc, collection, safeGetDocs } from '@/lib/firebase';
import { Permissions } from '@/lib/rbac';

const COLLECTION = 'roles';

export const RoleService = {
  async getAllRoles(): Promise<Record<string, Permissions>> {
    try {
      const snapshot = await safeGetDocs(collection(db, COLLECTION));
      const roles: Record<string, Permissions> = {};
      snapshot.forEach((doc: any) => {
        roles[doc.id] = doc.data() as Permissions;
      });
      return roles;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
      return {};
    }
  },

  async updateRole(roleName: string, permissions: Permissions) {
    try {
      await setDoc(doc(db, COLLECTION, roleName), permissions);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `roles/${roleName}`);
    }
  },

  async deleteRole(roleName: string) {
    try {
      // Deleting directly is not supported by standard firestore SDK, 
      // Need to delete document. 
      // Wait, setDoc is for update, need deleteDoc
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, COLLECTION, roleName));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `roles/${roleName}`);
    }
  }
};
