import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export const saveUserIfNotExists = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || null,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      role: "user", 
    });
  }
};

export const getUserRole = async (uid: string): Promise<string | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return data.role || null;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar role do usuário:", error);
    return null;
  }
};
