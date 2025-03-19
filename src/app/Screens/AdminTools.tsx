import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { AdminToolsProps, UserData, UserRole } from "../types";
import globalStyles, { colors } from "../components/globalStyle/styles";
import {
  isUserAdmin,
  changeUserRole,
  canAccessAdminTools,
  changeUserCargo,
} from "../../services/authService";
import { MaterialIcons } from "@expo/vector-icons";

interface UserListItem extends UserData {
  id: string;
}

const AdminTools: React.FC<AdminToolsProps> = ({ navigation, user }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canAccessTools, setCanAccessTools] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      if (user && user.uid) {
        // Verificar se é administrador (para controle de alteração de cargos)
        const admin = await isUserAdmin(user.uid);
        setIsAdmin(admin);

        // Verificar se pode acessar ferramentas de administração (admin OU funcionário)
        const hasAccess = await canAccessAdminTools(user.uid);
        setCanAccessTools(hasAccess);

        if (hasAccess) {
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

    checkPermissions();
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
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);

      if (
        error.code === "permission-denied" ||
        error.message?.includes("Missing or insufficient permissions")
      ) {
        Alert.alert(
          "Erro de Permissão",
          "Você não tem permissão para acessar a lista de usuários. É necessário atualizar as regras de segurança do Firestore para permitir que administradores acessem todos os usuários."
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível carregar a lista de usuários: " +
            (error.message || "Erro desconhecido")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, currentRole: UserRole) => {
    // Verificar se o usuário atual é administrador
    if (!isAdmin) {
      Alert.alert(
        "Permissão Negada",
        "Apenas administradores podem alterar papéis de usuários."
      );
      return;
    }

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

  // Função auxiliar para capitalizar a primeira letra
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Nova função para alterar cargo do usuário com alerta com primeira letra maiúscula
  const handleChangeCargo = async (userId: string, currentCargo: string) => {
    // Verificar se o usuário atual é administrador
    if (!isAdmin) {
      Alert.alert(
        "Permissão Negada",
        "Apenas administradores podem alterar cargos de usuários."
      );
      return;
    }

    // Determinar o próximo cargo na rotação
    let newCargo = "cliente";
    if (currentCargo === "cliente") {
      newCargo = "funcionário";
    } else if (currentCargo === "funcionário") {
      newCargo = "cliente";
    }

    Alert.alert(
      "Alterar Cargo",
      `Deseja alterar o cargo deste usuário para ${capitalize(newCargo)}?`,
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
              await changeUserCargo(userId, newCargo);

              // Atualizar a lista de usuários
              setUsers(
                users.map((u) => {
                  if (u.id === userId) {
                    return { ...u, cargo: newCargo };
                  }
                  return u;
                })
              );
              Alert.alert("Sucesso", "Cargo do usuário alterado com sucesso!");
            } catch (error) {
              console.error("Erro ao alterar cargo:", error);
              Alert.alert(
                "Erro",
                "Não foi possível alterar o cargo do usuário."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle refresh - pull down to refresh functionality
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar lista de usuários:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderUserItem = ({ item }: { item: UserListItem }) => (
    <View style={globalStyles.userCard}>
      <View style={globalStyles.userInfo}>
        <Text style={globalStyles.adminUserName}>
          {item.nome || "Sem nome"}
        </Text>
        <Text style={globalStyles.adminUserEmail}>
          {item.email || "Sem email"}
        </Text>

        {/* Exibir role */}
        <Text
          style={[
            globalStyles.userRole,
            item.role === "administrador"
              ? globalStyles.adminRoleText
              : globalStyles.clientRoleText,
          ]}
        >
          Papel: {item.role === "administrador" ? "Administrador" : "Cliente"}
        </Text>

        {/* Exibir cargo com primeira letra maiúscula */}
        <Text
          style={[
            globalStyles.userCargo,
            item.cargo === "funcionário"
              ? globalStyles.funcionarioCargo
              : globalStyles.clienteCargo,
          ]}
        >
          Cargo: {capitalize(item.cargo || "cliente")}
        </Text>
      </View>
      <View style={globalStyles.actionButtonsContainer}>
        {/* Botão de alterar papel (só visível para admins) */}
        {isAdmin && (
          <TouchableOpacity
            style={[globalStyles.roleActionButton, { marginBottom: 8 }]}
            onPress={() => handleChangeRole(item.id, item.role)}
          >
            <Text style={globalStyles.roleActionButtonText}>
              {item.role === "administrador" ? "Remover Admin" : "Tornar Admin"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Botão de alterar cargo (só visível para admins) */}
        {isAdmin && (
          <TouchableOpacity
            style={globalStyles.cargoActionButton}
            onPress={() => handleChangeCargo(item.id, item.cargo || "cliente")}
          >
            <Text style={globalStyles.cargoActionButtonText}>
              {item.cargo === "funcionário"
                ? "Remover Funcionário"
                : "Tornar Funcionário"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={globalStyles.profileLoadingText}>
          Carregando usuários...
        </Text>
      </View>
    );
  }

  if (!canAccessTools) {
    return null;
  }

  return (
    <View style={globalStyles.homeContainer}>
      {/* Header com botão de voltar */}
      <View style={globalStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={globalStyles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[globalStyles.bannerTitle, { marginBottom: 0 }]}>
          Administração
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={globalStyles.adminContainer}>
        <View style={globalStyles.adminHeader}>
          <Text style={globalStyles.adminTitle}>Gerenciamento de Usuários</Text>
        </View>

        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={globalStyles.userList}
          ListEmptyComponent={
            <Text style={globalStyles.emptyListText}>
              Nenhum usuário encontrado
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.secondary]}
              tintColor={colors.secondary}
            />
          }
        />
      </View>
    </View>
  );
};

export default AdminTools;
