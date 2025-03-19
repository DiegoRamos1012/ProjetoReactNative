import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { UserData, UserRole } from "../app/types";

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
    const user = userCredential.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Option 1: Block login
      await auth.signOut();
      throw new Error(
        "Sua conta foi excluída. Entre em contato com o suporte."
      );
    }

    return user;
  } catch (error: any) {
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

    // Create user document in Firestore with role defaulting to "cliente"
    await setDoc(doc(db, "users", user.uid), {
      nome: name,
      email: email,
      dataCadastro: new Date(),
      role: "cliente", // Default role
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

// Função auxiliar para migrar usuários da coleção antiga (se necessário)
export const migrateUsers = async (): Promise<void> => {
  try {
    const usuariosRef = collection(db, "usuarios");
    const snapshot = await getDocs(usuariosRef);

    if (snapshot.empty) {
      console.log("Não há usuários para migrar.");
      return;
    }

    const batch = writeBatch(db);
    let count = 0;

    snapshot.forEach((docSnapshot) => {
      const userData = docSnapshot.data();
      // Cria ou atualiza o documento na coleção "users"
      const userRef = doc(db, "users", docSnapshot.id);
      batch.set(
        userRef,
        {
          ...userData,
          role: "cliente", // Define como cliente por padrão
          updatedAt: new Date(),
          migratedAt: new Date(),
        },
        { merge: true }
      );

      count++;
    });

    await batch.commit();
    console.log(`${count} usuário(s) migrados com sucesso.`);
  } catch (error) {
    console.error("Erro ao migrar usuários:", error);
    throw new Error("Falha ao migrar usuários da coleção antiga.");
  }
};
