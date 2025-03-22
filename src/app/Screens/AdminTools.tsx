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
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { AdminToolsProps, UserData, UserRole, Servico } from "../types";
import globalStyles, { colors } from "../components/globalStyle/styles";
import {
  isUserAdmin,
  changeUserRole,
  canAccessAdminTools,
  changeUserCargo,
} from "../../services/authService";
import { MaterialIcons } from "@expo/vector-icons";
import { CARGOS, getCargoNome, getCargoCor } from "../constants/cargos";
import ServicosHorarios from "../components/admin/ServicosHorarios";

interface UserListItem extends UserData {
  id: string;
}

const AdminTools: React.FC<AdminToolsProps> = ({ navigation, user }) => {
  // Estados existentes
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canAccessTools, setCanAccessTools] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Estados para controlar a expansão/contração das seções
  const [usuariosExpanded, setUsuariosExpanded] = useState(true);
  const [servicosExpanded, setServicosExpanded] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      if (user && user.uid) {
        const admin = await isUserAdmin(user.uid);
        setIsAdmin(admin);
        const hasAccess = await canAccessAdminTools(user.uid);
        setCanAccessTools(hasAccess);
        if (hasAccess) {
          fetchUsers();
          fetchServices();
        } else {
          setLoading(false);
          Alert.alert(
            "Acesso Restrito",
            "Você não tem permissão para acessar esta área.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
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
        usersList.push({ id: doc.id, ...userData });
      });
      setUsers(usersList);
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
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

  // Toggle para expandir/contrair seção de usuários
  const toggleUsuariosSection = () => {
    setUsuariosExpanded(!usuariosExpanded);
    // Se expandir a seção de usuários, minimiza a de serviços para evitar problemas com listas
    if (!usuariosExpanded) {
      setServicosExpanded(false);
    }
  };

  // Toggle para expandir/contrair seção de serviços
  const toggleServicosSection = () => {
    setServicosExpanded(!servicosExpanded);
    // Se expandir a seção de serviços, minimiza a de usuários para evitar problemas com listas
    if (!servicosExpanded) {
      setUsuariosExpanded(false);
    }
  };

  const renderUserItem = ({ item }: { item: UserListItem }) => (
    <View style={globalStyles.userCard}>
      {updatingUserId === item.id && (
        <View style={globalStyles.userCardLoadingOverlay}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={globalStyles.userCardLoadingText}>Atualizando...</Text>
        </View>
      )}
      <View
        style={[
          globalStyles.userInfo,
          updatingUserId === item.id && { opacity: 0.6 },
        ]}
      >
        <Text style={globalStyles.adminUserName}>
          {item.nome || "Sem nome"}
        </Text>
        <Text style={globalStyles.adminUserEmail}>
          Número de telefone: {item.telefone || "Sem número cadastrado"}
        </Text>
        <View style={globalStyles.horizontalLine} />
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
        <Text
          style={[
            globalStyles.userCargo,
            { color: getCargoCor(item.cargo || "cliente") },
          ]}
        >
          Cargo: {getCargoNome(item.cargo || "cliente")}
        </Text>
        {isAdmin && (
          <View style={globalStyles.horizontalButtonsContainer}>
            <TouchableOpacity
              style={[
                globalStyles.roleActionButton,
                { flex: 1, marginRight: 5 },
                updatingUserId === item.id && globalStyles.disabledButton,
              ]}
              onPress={() => handleChangeRole(item.id, item.role)}
              disabled={updatingUserId !== null}
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
                updatingUserId === item.id && globalStyles.disabledButton,
              ]}
              onPress={() =>
                handleOpenCargoModal(item.id, item.nome || "Usuário")
              }
              disabled={updatingUserId !== null}
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

  // ----------------- FUNÇÕES PARA GERENCIAR SERVIÇOS -----------------
  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const servicosRef = collection(db, "servicos");
      const snapshot = await getDocs(servicosRef);
      if (snapshot.empty) {
        setServices(servicosBarbearia);
      } else {
        const servicosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Servico[];
        setServices(servicosData);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      Alert.alert("Erro", "Não foi possível carregar os serviços.");
      setServices(servicosBarbearia);
    } finally {
      setServicesLoading(false);
      setServicesRefreshing(false);
    }
  };

  const saveService = async (servico: Servico) => {
    try {
      await setDoc(doc(db, "servicos", servico.id), servico);
      return true;
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      Alert.alert("Erro", "Não foi possível salvar o serviço.");
      return false;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, "servicos", id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      Alert.alert("Erro", "Não foi possível excluir o serviço.");
      return false;
    }
  };

  const handleAddService = () => {
    setSelectedService(null);
    setShowServiceForm(true);
  };

  const handleEditService = (servico: Servico) => {
    setSelectedService(servico);
    setShowServiceForm(true);
  };

  const handleDeleteService = (servico: Servico) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o serviço "${servico.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const success = await deleteService(servico.id);
            if (success) {
              setServices(removerServico(services, servico.id));
            }
          },
        },
      ]
    );
  };

  const handleSaveService = async (servico: Servico) => {
    const isEditing = !!selectedService;
    if (!isEditing) {
      servico.id = Date.now().toString();
    }
    const success = await saveService(servico);
    if (success) {
      if (isEditing) {
        setServices(editarServico(services, servico));
      } else {
        setServices(adicionarServico(services, servico));
      }
      setShowServiceForm(false);
    }
  };

  const onServicesRefresh = () => {
    setServicesRefreshing(true);
    fetchServices();
  };
  // ------------------------------------------------------------------

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

      {/* Usando FlatList como contêiner principal para evitar nesting issues */}
      <FlatList
        data={[{ key: "mainContent" }]} // Apenas um item para renderizar todo o conteúdo
        renderItem={() => (
          <View style={{ flex: 1 }}>
            {/* Seção de Gerenciamento de Usuários com cabeçalho clicável */}
            <View style={globalStyles.adminContainer}>
              <TouchableOpacity
                style={[
                  globalStyles.adminHeader,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
                onPress={toggleUsuariosSection}
              >
                <Text style={globalStyles.adminTitle}>
                  Gerenciamento de Usuários
                </Text>
                <MaterialIcons
                  name={usuariosExpanded ? "expand-less" : "expand-more"}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>

              {/* Lista de usuários - mostrada apenas quando expandida */}
              {usuariosExpanded && (
                <View style={{ maxHeight: 400 }}>
                  {users.length === 0 ? (
                    <Text style={globalStyles.emptyListText}>
                      Nenhum usuário encontrado
                    </Text>
                  ) : (
                    // Renderizando diretamente com uma key única para cada item
                    <View>
                      {users.map((item) => (
                        <React.Fragment key={item.id}>
                          {renderUserItem({ item })}
                        </React.Fragment>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Seção de Serviços e Horários com cabeçalho clicável */}
            <View
              style={[globalStyles.adminContainer, { marginTop: 15, flex: 1 }]}
            >
              <TouchableOpacity
                style={[
                  globalStyles.adminHeader,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
                onPress={toggleServicosSection}
              >
                <Text style={globalStyles.adminTitle}>Serviços e Horários</Text>
                <MaterialIcons
                  name={servicosExpanded ? "expand-less" : "expand-more"}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>

              {/* Componente de Serviços - mostrado apenas quando expandido */}
              {servicosExpanded && <ServicosHorarios isAdmin={isAdmin} />}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />

      {renderCargoSelectionModal()}
    </View>
  );
};

export default AdminTools;
