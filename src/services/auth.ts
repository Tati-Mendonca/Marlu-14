import { auth } from "@/config/firebase";
import { getFirebaseErrorMessage } from "@/utils/Errors";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { saveUserIfNotExists } from "./user";

function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string"
  )
}

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveUserIfNotExists(userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      return { user: null, error: errorMessage };
    }
    return { user: null, error: "Ocorreu um erro inesperado. Tente novamente." };
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
     await saveUserIfNotExists(result.user);
    return { user: result.user, error: null };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      return { user: null, error: errorMessage };
    }
    return { user: null, error: "Ocorreu um erro inesperado. Tente novamente." };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      return { error: errorMessage };
    }
    return { error: "Erro ao fazer logout. Tente novamente." };
  }
};

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    if (isFirebaseError(error)) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      return { user: null, error: errorMessage };
    }
    return { user: null, error: "Ocorreu um erro inesperado. Tente novamente." };
  }
};
