import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { UserData, UserRole } from "../app/types/types";

/**
 * Realiza o login do usuário com email e senha
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Auth service: Login bem-sucedido");
    return userCredential.user;
  } catch (error: any) {
    console.error("Auth service: Erro no login:", error.code, error.message);
    throw error;
  }
};

/**
 * Registra um novo usuário com nome, email e senha
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Atualiza o perfil do usuário com o nome
    if (name) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }

    console.log("Auth service: Registro bem-sucedido");
    return userCredential.user;
  } catch (error: any) {
    console.error("Auth service: Erro no registro:", error.code, error.message);
    throw error;
  }
};

/**
 * Realiza o logout do usuário atual
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("Auth service: Logout bem-sucedido");
  } catch (error: any) {
    console.error("Auth service: Erro no logout:", error.code, error.message);
    throw error;
  }
};

// Nova função para verificar se um usuário é administrador
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      return userData.role === "administrador";
    }
    return false;
  } catch (error) {
    console.error("Erro ao verificar papel do usuário:", error);
    return false;
  }
};

// Nova função para alterar o papel de um usuário
export const changeUserRole = async (
  userId: string,
  newRole: UserRole
): Promise<void> => {
  try {
    await setDoc(
      doc(db, "users", userId),
      { role: newRole, updatedAt: new Date() },
      { merge: true }
    );
  } catch (error) {
    console.error("Erro ao alterar papel do usuário:", error);
    throw new Error("Não foi possível alterar o papel do usuário.");
  }
};

// Nova função para verificar se um usuário pode acessar ferramentas de administração
export const canAccessAdminTools = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      return (
        userData.role === "administrador" || userData.cargo === "funcionário"
      );
    }
    return false;
  } catch (error) {
    console.error("Erro ao verificar permissões do usuário:", error);
    return false;
  }
};

// Nova função para alterar o cargo de um usuário
export const changeUserCargo = async (
  userId: string,
  newCargo: string
): Promise<void> => {
  try {
    await setDoc(
      doc(db, "users", userId),
      { cargo: newCargo, updatedAt: new Date() },
      { merge: true }
    );
  } catch (error) {
    console.error("Erro ao alterar cargo do usuário:", error);
    throw new Error("Não foi possível alterar o cargo do usuário.");
  }
};
