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

// NOVOS IMPORTS PARA SERVIÇOS
import ServiceForm from "../components/services/ServiceForm";
import {
  servicosBarbearia,
  adicionarServico,
  editarServico,
  removerServico,
} from "../data/services";

interface UserListItem extends UserData {
  id: string;
}

const AdminTools: React.FC<AdminToolsProps> = ({ navigation, user }) => {
  // Estados de usuários
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canAccessTools, setCanAccessTools] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // NOVOS ESTADOS PARA SERVIÇOS
  const [services, setServices] = useState<Servico[]>([]);
  const [selectedService, setSelectedService] = useState<Servico | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesRefreshing, setServicesRefreshing] = useState(false);

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

      {/* Seção de gerenciamento de usuários */}
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

      {/* Nova Seção: Serviços e horários */}
      <View style={[globalStyles.adminContainer, { marginTop: 15, flex: 2 }]}>
        {/* Cabeçalho da nova seção utilizando os novos estilos */}
        <View style={globalStyles.adminSectionHeader}>
          <Text style={globalStyles.adminSectionTitle}>
            Serviços e horários
          </Text>
          <TouchableOpacity
            style={globalStyles.adminAddButton}
            onPress={handleAddService}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text style={globalStyles.adminAddButtonText}>Novo Serviço</Text>
          </TouchableOpacity>
        </View>

        <View style={[globalStyles.adminSectionContent, { flex: 1 }]}>
          {showServiceForm ? (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <ServiceForm
                service={selectedService}
                onSave={handleSaveService}
                onCancel={() => setShowServiceForm(false)}
              />
            </ScrollView>
          ) : servicesLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={services}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={servicesRefreshing}
                  onRefresh={onServicesRefresh}
                  colors={[colors.primary]}
                />
              }
              renderItem={({ item }) => (
                <View style={globalStyles.serviceCard}>
                  <View style={globalStyles.serviceIconContainer}>
                    <MaterialIcons
                      name={item.iconName as any}
                      size={30}
                      color={colors.primary}
                    />
                  </View>
                  <View style={globalStyles.serviceInfo}>
                    <Text style={globalStyles.serviceName}>{item.nome}</Text>
                    <Text style={globalStyles.serviceDescription}>
                      {item.descricao}
                    </Text>
                    <View style={globalStyles.serviceDetails}>
                      <Text style={globalStyles.servicePrice}>
                        {item.preco}
                      </Text>
                      <Text style={globalStyles.serviceDuration}>
                        {item.tempo}
                      </Text>
                    </View>
                    <Text style={globalStyles.serviceHorarios}>
                      Horários: {item.horarios?.length || 0} disponíveis
                    </Text>
                  </View>
                  <View style={globalStyles.actionButtons}>
                    <TouchableOpacity onPress={() => handleEditService(item)}>
                      <MaterialIcons
                        name="edit"
                        size={24}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteService(item)}>
                      <MaterialIcons name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>

      {renderCargoSelectionModal()}
    </View>
  );
};

export default AdminTools;
