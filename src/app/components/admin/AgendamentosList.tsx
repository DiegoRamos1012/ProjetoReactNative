import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Agendamento } from "../../types/types";
import { colors } from "../globalStyle/styles";
import { MaterialIcons } from "@expo/vector-icons";

// Componentes divididos
import AgendamentoCard from "./AgendamentoCard";
import LixeiraModal from "./LixeiraModal";
import StatusModal from "./StatusModal";

// Função para formatar data sem usar date-fns
const formatarData = (data: any): string => {
  try {
    // Se for timestamp do Firestore
    if (data && data.toDate && typeof data.toDate === "function") {
      const date = data.toDate();
      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    // Se for string
    if (typeof data === "string") {
      return data;
    }

    // Se for Date
    if (data instanceof Date) {
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    return "Data não disponível";
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return "Data não disponível";
  }
};

interface AgendamentosListProps {
  canAccessTools: boolean;
  expanded: boolean;
  onStatusChange?: (agendamentoId: string, novoStatus: string) => void;
  onClose?: () => void;
}

const AgendamentosList: React.FC<AgendamentosListProps> = ({
  canAccessTools,
  expanded,
  onStatusChange,
  onClose,
}) => {
  // Estado para armazenar os agendamentos buscados do Firestore
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const [atualizandoAgendamento, setAtualizandoAgendamento] = useState<
    string | null
  >(null);

  // Estados para o modal personalizado de status
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<Agendamento | null>(null);

  // Estados para gerenciar a lixeira
  const [agendamentosExcluidos, setAgendamentosExcluidos] = useState<
    Agendamento[]
  >([]);
  const [lixeiraVisible, setLixeiraVisible] = useState(false);
  const [loadingLixeira, setLoadingLixeira] = useState(false);
  const [excluindoAgendamento, setExcluindoAgendamento] = useState<
    string | null
  >(null);

  // Buscar agendamentos quando o componente montar se estiver expandido
  useEffect(() => {
    if (expanded) {
      fetchAgendamentos();
      fetchAgendamentosExcluidos();
    }
  }, [expanded]);

  // Função para buscar todos os agendamentos
  const fetchAgendamentos = async () => {
    if (!canAccessTools) return;

    setLoadingAgendamentos(true);
    try {
      const agendamentosRef = collection(db, "agendamentos");
      // Ordena por data mais recente primeiro
      const q = query(
        agendamentosRef,
        where("data_exclusao", "==", null), // Filtra apenas os não excluídos
        orderBy("data_timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      const agendamentosList: Agendamento[] = [];
      querySnapshot.forEach((doc) => {
        const agendamentoData = doc.data();

        // Formata os dados do agendamento para exibição
        const agendamento: Agendamento = {
          id: doc.id,
          ...agendamentoData,
          status: agendamentoData.status || "pendente",
          observacao: agendamentoData.observacao || "",
          userId: agendamentoData.userId || "",
          userName: agendamentoData.userName || "",
          servico: agendamentoData.servico || "",
          preco: agendamentoData.preco || "",
          data: agendamentoData.data || "",
          hora: agendamentoData.hora || "",
          barbeiro: agendamentoData.barbeiro || "",
          criado_em: agendamentoData.criado_em || Timestamp.now(),
          data_timestamp: agendamentoData.data_timestamp || Timestamp.now(),
        };

        agendamentosList.push(agendamento);
      });

      console.log(`Agendamentos encontrados: ${agendamentosList.length}`);
      setAgendamentos(agendamentosList);
    } catch (error: any) {
      console.error("Erro ao buscar agendamentos:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os agendamentos: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setLoadingAgendamentos(false);
    }
  };

  // Função para buscar agendamentos excluídos
  const fetchAgendamentosExcluidos = async () => {
    if (!canAccessTools) return;

    setLoadingLixeira(true);
    try {
      const agendamentosRef = collection(db, "agendamentos");
      const q = query(
        agendamentosRef,
        where("data_exclusao", "!=", null),
        orderBy("data_exclusao", "desc")
      );
      const querySnapshot = await getDocs(q);

      const lixeiraList: Agendamento[] = [];
      querySnapshot.forEach((doc) => {
        const agendamentoData = doc.data();
        lixeiraList.push({
          id: doc.id,
          ...agendamentoData,
        } as Agendamento);
      });

      setAgendamentosExcluidos(lixeiraList);
    } catch (error: any) {
      console.error("Erro ao buscar lixeira:", error);
    } finally {
      setLoadingLixeira(false);
    }
  };

  // Função para mostrar o modal personalizado de alteração de status
  const mostrarMenuStatus = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setStatusModalVisible(true);
  };

  // Função para alterar o status do agendamento
  const handleStatusChange = async (
    agendamentoId: string,
    novoStatus: string
  ) => {
    setAtualizandoAgendamento(agendamentoId);
    try {
      const agendamentoRef = doc(db, "agendamentos", agendamentoId);
      await updateDoc(agendamentoRef, {
        status: novoStatus,
      });

      // Atualiza o estado local para refletir a mudança imediatamente
      setAgendamentos((prevAgendamentos) =>
        prevAgendamentos.map((agendamento) =>
          agendamento.id === agendamentoId
            ? { ...agendamento, status: novoStatus }
            : agendamento
        )
      );

      // Notifica o componente pai se necessário
      if (onStatusChange) {
        onStatusChange(agendamentoId, novoStatus);
      }

      Alert.alert("Sucesso", "Status do agendamento atualizado com sucesso.");
      setStatusModalVisible(false);
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o status: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setAtualizandoAgendamento(null);
    }
  };

  // Função para excluir agendamento (mover para lixeira)
  const handleExcluir = async (agendamento: Agendamento) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja mover este agendamento para a lixeira?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            setExcluindoAgendamento(agendamento.id);
            try {
              const agendamentoRef = doc(db, "agendamentos", agendamento.id);

              // Marcar como excluído com timestamp
              await updateDoc(agendamentoRef, {
                data_exclusao: Timestamp.now(),
                status: "cancelado",
              });

              // Atualizar estado local de agendamentos (remover o excluído)
              setAgendamentos((prev) =>
                prev.filter((a) => a.id !== agendamento.id)
              );

              // Buscar novamente os agendamentos excluídos para atualizar a lixeira
              await fetchAgendamentosExcluidos();

              Alert.alert("Sucesso", "Agendamento movido para a lixeira.");
            } catch (error: any) {
              console.error("Erro ao excluir agendamento:", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir o agendamento: " +
                  (error.message || "Erro desconhecido")
              );
            } finally {
              setExcluindoAgendamento(null);
            }
          },
        },
      ]
    );
  };

  // Função para restaurar agendamento da lixeira
  const handleRestaurar = async (agendamento: Agendamento) => {
    try {
      const agendamentoRef = doc(db, "agendamentos", agendamento.id);

      // Remover o marcador de exclusão
      await updateDoc(agendamentoRef, {
        data_exclusao: null,
        status: "pendente",
      });

      // Atualizar estado local da lixeira
      setAgendamentosExcluidos((prev) =>
        prev.filter((a) => a.id !== agendamento.id)
      );

      // Buscar novamente os agendamentos ativos
      await fetchAgendamentos();

      Alert.alert("Sucesso", "Agendamento restaurado com sucesso.");
    } catch (error: any) {
      console.error("Erro ao restaurar agendamento:", error);
      Alert.alert(
        "Erro",
        "Não foi possível restaurar o agendamento: " +
          (error.message || "Erro desconhecido")
      );
    }
  };

  // Função para excluir permanentemente
  const handleExcluirPermanente = async (agendamento: Agendamento) => {
    Alert.alert(
      "Confirmar exclusão permanente",
      "Esta ação não poderá ser desfeita. Deseja excluir permanentemente este agendamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const agendamentoRef = doc(db, "agendamentos", agendamento.id);
              await deleteDoc(agendamentoRef);

              // Atualizar estado local da lixeira
              setAgendamentosExcluidos((prev) =>
                prev.filter((a) => a.id !== agendamento.id)
              );

              Alert.alert("Sucesso", "Agendamento excluído permanentemente.");
            } catch (error: any) {
              console.error("Erro ao excluir permanentemente:", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir permanentemente o agendamento: " +
                  (error.message || "Erro desconhecido")
              );
            }
          },
        },
      ]
    );
  };

  if (!expanded) return null;

  return (
    <View style={{ flex: 1 }}>
      {/* Botão da lixeira fixo no topo */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 10,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(97, 97, 97, 0.8)",
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            elevation: 2,
            marginRight: 8,
          }}
          onPress={() => setLixeiraVisible(true)}
        >
          <MaterialIcons
            name="delete"
            size={18}
            color="#fff"
            style={{ marginRight: 5 }}
          />
          <Text style={{ color: "#fff", fontWeight: "500" }}>Lixeira</Text>
          {agendamentosExcluidos.length > 0 && (
            <View
              style={{
                backgroundColor: "rgba(244, 67, 54, 0.9)",
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 5,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                {agendamentosExcluidos.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loadingAgendamentos ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.button.primary} />
          <Text style={{ marginTop: 10, color: colors.textLight }}>
            Carregando agendamentos...
          </Text>
        </View>
      ) : agendamentos.length === 0 ? (
        <Text style={styles.emptyListText}>Nenhum agendamento encontrado</Text>
      ) : (
        <ScrollView
          style={{ maxHeight: 600 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {agendamentos.map((agendamento) => (
            <AgendamentoCard
              key={agendamento.id}
              agendamento={agendamento}
              formatarData={formatarData}
              atualizandoAgendamento={atualizandoAgendamento}
              excluindoAgendamento={excluindoAgendamento}
              mostrarMenuStatus={mostrarMenuStatus}
              onExcluir={handleExcluir}
            />
          ))}
        </ScrollView>
      )}

      {/* Modais */}
      <StatusModal
        visible={statusModalVisible}
        agendamento={agendamentoSelecionado}
        onClose={() => setStatusModalVisible(false)}
        onStatusChange={handleStatusChange}
      />

      <LixeiraModal
        visible={lixeiraVisible}
        agendamentosExcluidos={agendamentosExcluidos}
        loadingLixeira={loadingLixeira}
        excluindoAgendamento={excluindoAgendamento}
        onClose={() => setLixeiraVisible(false)}
        formatarData={formatarData}
        onRestaurar={handleRestaurar}
        onExcluirPermanente={handleExcluirPermanente}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyListText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: colors.textLight,
  },
});

export default AgendamentosList;
