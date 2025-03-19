import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { AdminToolsProps, UserData, UserRole } from "../types";
import globalStyles, { colors } from "../components/globalStyle/styles";
import {
  isUserAdmin,
  changeUserRole,
  migrateUsers,
} from "../../services/authService";

interface UserListItem extends UserData {
  id: string;
}

const AdminTools: React.FC<AdminToolsProps> = ({ navigation, user }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && user.uid) {
        const admin = await isUserAdmin(user.uid);
        setIsAdmin(admin);

        if (admin) {
          fetchUsers();
        } else {
          setLoading(false);
          Alert.alert(
            "Acesso Restrito",
            "Você não tem permissão para acessar esta área.",
            [
              {
                text: "OK",
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const usersList: UserListItem[] = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data() as UserData;
        usersList.push({
          id: doc.id,
          ...userData,
        });
      });

      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, currentRole: UserRole) => {
    const newRole =
      currentRole === "administrador" ? "cliente" : "administrador";

    Alert.alert(
      "Alterar Papel",
      `Deseja alterar o papel deste usuário para ${newRole}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              setLoading(true);
              await changeUserRole(userId, newRole);

              // Atualizar a lista de usuários
              setUsers(
                users.map((u) => {
                  if (u.id === userId) {
                    return { ...u, role: newRole };
                  }
                  return u;
                })
              );
              Alert.alert("Sucesso", "Papel do usuário alterado com sucesso!");
            } catch (error) {
              console.error("Erro ao alterar papel:", error);
              Alert.alert(
                "Erro",
                "Não foi possível alterar o papel do usuário."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const checkDatabaseConsistency = async () => {
    try {
      setLoading(true);

      // Verificar coleção "users"
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, limit(1));
      const usersSnapshot = await getDocs(usersQuery);

      // Verificar coleção "usuarios" (antiga, se existir)
      const usuariosRef = collection(db, "usuarios");
      const usuariosQuery = query(usuariosRef, limit(1));
      const usuariosSnapshot = await getDocs(usuariosQuery);

      const hasUsers = !usersSnapshot.empty;
      const hasUsuarios = !usuariosSnapshot.empty;

      if (hasUsuarios) {
        Alert.alert(
          "Verificação de Banco de Dados",
          `Foi encontrada uma coleção antiga "usuarios". Deseja migrar esses dados para a coleção "users"?`,
          [
            {
              text: "Não",
              style: "cancel",
            },
            {
              text: "Sim, migrar",
              onPress: async () => {
                try {
                  await migrateUsers();
                  Alert.alert("Sucesso", "Migração concluída com sucesso!");
                  fetchUsers(); // Atualizar a lista
                } catch (error) {
                  Alert.alert("Erro", "Falha na migração dos dados.");
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Verificação de Banco de Dados",
          hasUsers
            ? "Banco de dados consistente. Usando coleção 'users'."
            : "Nenhuma coleção de usuários encontrada."
        );
      }
    } catch (error) {
      console.error("Erro na verificação do banco:", error);
      Alert.alert("Erro", "Não foi possível verificar o banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: UserListItem }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.nome || "Sem nome"}</Text>
        <Text style={styles.userEmail}>{item.email || "Sem email"}</Text>
        <Text
          style={[
            styles.userRole,
            item.role === "administrador"
              ? styles.adminRole
              : styles.clientRole,
          ]}
        >
          {item.role === "administrador" ? "Administrador" : "Cliente"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleChangeRole(item.id, item.role)}
      >
        <Text style={styles.actionButtonText}>
          {item.role === "administrador" ? "Tornar Cliente" : "Tornar Admin"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAdmin) {
    return null; // Não renderiza nada se não for admin
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciamento de Usuários</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.refreshButton, { marginRight: 8 }]}
            onPress={checkDatabaseConsistency}
          >
            <Text style={styles.refreshButtonText}>Verificar BD</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
            <Text style={styles.refreshButtonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.userList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  headerButtons: {
    flexDirection: "row",
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userList: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: "bold",
  },
  adminRole: {
    color: "#c2410c",
  },
  clientRole: {
    color: "#0891b2",
  },
  actionButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});

export default AdminTools;
