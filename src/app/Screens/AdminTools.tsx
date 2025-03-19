import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
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
import { CARGOS, getCargoNome, getCargoCor } from "../constants/cargos";

interface UserListItem extends UserData {
  id: string;
}

const AdminTools: React.FC<AdminToolsProps> = ({ navigation, user }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canAccessTools, setCanAccessTools] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  // Novo estado para rastrear o ID do usuário sendo atualizado
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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
      "Alterar função",
      `Deseja alterar o função deste usuário para ${newRole}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              // Definir o ID do usuário sendo atualizado em vez de loading global
              setUpdatingUserId(userId);

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
              // Limpar o ID do usuário sendo atualizado
              setUpdatingUserId(null);
            }
          },
        },
      ]
    );
  };

  // Função para abrir o modal de seleção de cargo
  const handleOpenCargoModal = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setModalVisible(true);
  };

  // Função para alterar o cargo de um usuário
  const handleChangeCargo = async (userId: string, newCargo: string) => {
    // Verificar se o usuário atual é administrador
    if (!isAdmin) {
      Alert.alert(
        "Permissão Negada",
        "Apenas administradores podem alterar cargos de usuários."
      );
      return;
    }

    try {
      // Definir o ID do usuário sendo atualizado em vez de loading global
      setUpdatingUserId(userId);
      setModalVisible(false);

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

      Alert.alert("Sucesso", `Cargo alterado para ${getCargoNome(newCargo)}`);
    } catch (error) {
      console.error("Erro ao alterar cargo:", error);
      Alert.alert("Erro", "Não foi possível alterar o cargo do usuário.");
    } finally {
      // Limpar o ID do usuário sendo atualizado
      setUpdatingUserId(null);
    }
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
      {/* Mostrar loading spinner quando este usuário específico estiver sendo atualizado */}
      {updatingUserId === item.id && (
        <View style={globalStyles.userCardLoadingOverlay}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={globalStyles.userCardLoadingText}>Atualizando...</Text>
        </View>
      )}

      <View
        style={[
          globalStyles.userInfo,
          updatingUserId === item.id && { opacity: 0.6 }, // Diminuir opacidade quando carregando
        ]}
      >
        <Text style={globalStyles.adminUserName}>
          {item.nome || "Sem nome"}
        </Text>
        <Text style={globalStyles.adminUserEmail}>
          Número de telefone: {item.telefone || "Sem número cadastrado"}
        </Text>
        <View style={globalStyles.horizontalLine} />

        {/* Exibir role */}
        <Text
          style={[
            globalStyles.userRole,
            item.role === "administrador"
              ? globalStyles.adminRoleText
              : globalStyles.clientRoleText,
          ]}
        >
          Tipo: {item.role === "administrador" ? "Administrador" : "Cliente"}
        </Text>

        {/* Exibir cargo usando o nome e cor definidos nas constantes */}
        <Text
          style={[
            globalStyles.userCargo,
            { color: getCargoCor(item.cargo || "cliente") },
          ]}
        >
          Cargo: {getCargoNome(item.cargo || "cliente")}
        </Text>

        {/* Botões lado a lado */}
        {isAdmin && (
          <View style={globalStyles.horizontalButtonsContainer}>
            <TouchableOpacity
              style={[
                globalStyles.roleActionButton,
                { flex: 1, marginRight: 5 },
                updatingUserId === item.id && globalStyles.disabledButton, // Desabilitar visualmente durante o carregamento
              ]}
              onPress={() => handleChangeRole(item.id, item.role)}
              disabled={updatingUserId !== null} // Desabilitar todos os botões durante qualquer atualização
            >
              <Text style={globalStyles.roleActionButtonText}>
                {item.role === "administrador"
                  ? "Remover Admin"
                  : "Tornar Admin"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.cargoActionButton,
                { flex: 1, marginLeft: 5 },
                updatingUserId === item.id && globalStyles.disabledButton, // Desabilitar visualmente durante o carregamento
              ]}
              onPress={() =>
                handleOpenCargoModal(item.id, item.nome || "Usuário")
              }
              disabled={updatingUserId !== null} // Desabilitar todos os botões durante qualquer atualização
            >
              <Text style={globalStyles.cargoActionButtonText}>
                Atribuir Cargo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // Modal de seleção de cargo
  const renderCargoSelectionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.cargoModal}>
          <Text style={globalStyles.cargoModalTitle}>
            Selecione o Cargo para {selectedUserName}
          </Text>

          <ScrollView style={globalStyles.cargoOptionsList}>
            {CARGOS.map((cargo) => (
              <TouchableOpacity
                key={cargo.id}
                style={[
                  globalStyles.cargoOption,
                  users.find((u) => u.id === selectedUserId)?.cargo ===
                    cargo.id && globalStyles.cargoOptionSelected,
                ]}
                onPress={() => handleChangeCargo(selectedUserId, cargo.id)}
              >
                <View style={globalStyles.cargoRadioOuter}>
                  {users.find((u) => u.id === selectedUserId)?.cargo ===
                    cargo.id && <View style={globalStyles.cargoRadioInner} />}
                </View>
                <View>
                  <Text
                    style={[
                      globalStyles.cargoText,
                      { fontWeight: "bold", color: cargo.cor },
                    ]}
                  >
                    {cargo.nome}
                  </Text>
                  <Text style={globalStyles.cargoText}>{cargo.descricao}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={globalStyles.cargoModalClose}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
              FECHAR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
          <Text style={globalStyles.adminTitle}>
            {" "}
             Gerenciamento de Usuários
          </Text>
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

      <View style={[globalStyles.adminContainer, { marginTop: 15 }]}>
        {/* Cabeçalho da Nova Seção */}
        <View style={globalStyles.adminHeader}>
          <Text style={globalStyles.adminTitle}>           Serviços e horários</Text>
        </View>

        {/* Corpo da Nova Seção */}
        <View style={globalStyles.adminSectionContent}>
          {/* Conteúdo específico da nova seção */}
          {/* Pode ser outro FlatList, formulários, ou outros componentes */}
        </View>
      </View>

      {renderCargoSelectionModal()}
    </View>
  );
};

export default AdminTools;
