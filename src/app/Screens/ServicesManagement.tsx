import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Servico, ServicesManagementProps } from "../types";
import globalStyles, { colors } from "../components/globalStyle/styles";
import {
  servicosBarbearia,
  adicionarServico,
  editarServico,
  removerServico,
} from "../data/services";
import ServiceForm from "../components/services/ServiceForm";
import { isUserAdmin } from "../../services/authService";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const ServicesManagement: React.FC<ServicesManagementProps> = ({
  navigation,
  user,
}) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedService, setSelectedService] = useState<Servico | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar se o usuário é administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      const admin = await isUserAdmin(user.uid);
      setIsAdmin(admin);
      if (!admin) {
        Alert.alert(
          "Acesso Restrito",
          "Você não tem permissão para acessar esta área.",
          [{ text: "Entendi", onPress: () => navigation.goBack() }]
        );
      }
    };

    checkAdminStatus();
    fetchServices();
  }, [user.uid, navigation]);

  // Buscar serviços do Firestore
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const servicosRef = collection(db, "servicos");
      const snapshot = await getDocs(servicosRef);

      if (snapshot.empty) {
        // Se não houver serviços no Firestore, usar os serviços padrão
        setServicos(servicosBarbearia);
      } else {
        const servicosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Servico[];

        setServicos(servicosData);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      Alert.alert("Erro", "Não foi possível carregar os serviços.");
      setServicos(servicosBarbearia); // Usar serviços padrão em caso de erro
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Função para salvar um serviço no Firestore
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

  // Função para excluir um serviço do Firestore
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
    setShowForm(true);
  };

  const handleEditService = (servico: Servico) => {
    setSelectedService(servico);
    setShowForm(true);
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
              setServicos(removerServico(servicos, servico.id));
            }
          },
        },
      ]
    );
  };

  const handleSaveService = async (servico: Servico) => {
    // Verificar se está adicionando ou editando
    const isEditing = !!selectedService;

    // Gerar ID se for um novo serviço
    if (!isEditing) {
      servico.id = Date.now().toString();
    }

    // Salvar no Firestore
    const success = await saveService(servico);

    if (success) {
      if (isEditing) {
        // Atualizar serviço existente
        setServicos(editarServico(servicos, servico));
      } else {
        // Adicionar novo serviço
        setServicos(adicionarServico(servicos, servico));
      }
      setShowForm(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciamento de Serviços</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Novo Serviço</Text>
        </TouchableOpacity>
      </View>

      {showForm ? (
        <ServiceForm
          service={selectedService}
          onSave={handleSaveService}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <MaterialIcons
                  name={item.iconName as any}
                  size={30}
                  color={colors.primary}
                />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.nome}</Text>
                <Text style={styles.serviceDescription}>{item.descricao}</Text>
                <View style={styles.serviceDetails}>
                  <Text style={styles.servicePrice}>{item.preco}</Text>
                  <Text style={styles.serviceDuration}>{item.tempo}</Text>
                </View>
                <Text style={styles.serviceHorarios}>
                  Horários: {item.horarios?.length || 0} disponíveis
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEditService(item)}>
                  <MaterialIcons name="edit" size={24} color={colors.primary} />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.primary,
    marginLeft: 5,
    fontWeight: "bold",
  },
  serviceCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1", // fundo estiloso
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#FFD54F",
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: "row",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 16,
  },
  serviceDuration: {
    fontSize: 14,
    color: colors.textLight,
  },
  serviceHorarios: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: "italic",
  },
  actionButtons: {
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});

export default ServicesManagement;
