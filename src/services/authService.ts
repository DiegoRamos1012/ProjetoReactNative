import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  if (email === "") {
    throw new Error("E-mail não pode ser vazio");
  } else if (!email.includes("@")) {
    throw new Error("E-mail inválido");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    // Map Firebase errors to user-friendly messages
    if (error.code === "auth/invalid-credential") {
      throw new Error(
        "E-mail ou senha incorretos. Por favor, tente novamente."
      );
    } else if (error.code === "auth/user-not-found") {
      throw new Error(
        "Não existe usuário com este e-mail. Deseja se cadastrar?"
      );
    } else if (error.code === "auth/wrong-password") {
      throw new Error(
        "Senha incorreta. Por favor, verifique e tente novamente."
      );
    } else if (error.code === "auth/user-disabled") {
      throw new Error(
        "Esta conta foi desativada. Entre em contato com o suporte."
      );
    } else if (error.code === "auth/network-request-failed") {
      throw new Error("Erro de conexão com a internet. Verifique sua conexão.");
    } else {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  // Validate inputs
  if (email === "") {
    throw new Error("E-mail não pode ser vazio");
  } else if (!email.includes("@")) {
    throw new Error("E-mail inválido");
  }

  if (name.trim() === "") {
    throw new Error("Nome não pode ser vazio");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: name,
      email: email,
      dataCadastro: new Date(),
    });

    return user;
  } catch (error: any) {
    // Map Firebase errors to user-friendly messages
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Este e-mail já está sendo usado por outra conta.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("A senha é muito fraca. Utilize uma senha mais forte.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("O formato do e-mail é inválido.");
    } else if (error.code === "auth/network-request-failed") {
      throw new Error("Erro de conexão com a internet. Verifique sua conexão.");
    } else {
      throw new Error(`Erro ao cadastrar: ${error.message}`);
    }
  }
};
