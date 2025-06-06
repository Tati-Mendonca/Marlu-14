export const errors: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha inválidos.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/email-already-in-use": "E-mail já está em uso.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/popup-closed-by-user": "O login foi cancelado.",
};

export function getFirebaseErrorMessage(code: string) {
  return errors[code] || "Ocorreu um erro. Tente novamente.";
}