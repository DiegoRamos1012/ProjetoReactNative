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
      const q = query(agendamentosRef, orderBy("data_timestamp", "desc"));
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
      const lixeiraRef = collection(db, "agendamentos_lixeira");
      const q = query(lixeiraRef, orderBy("data_exclusao", "desc"));
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
              onExcluir={(agendamento) => {
                // Passar referência para função de excluir do componente pai
                if (agendamento) {
                  // A implementação será passada do componente pai através de props
                }
              }}
            />
          ))}
        </ScrollView>
      )}

      {/* Modais */}
      <StatusModal
        visible={statusModalVisible}
        agendamento={agendamentoSelecionado}
        onClose={() => setStatusModalVisible(false)}
        onStatusChange={(id, status) => {
          if (onStatusChange) {
            onStatusChange(id, status);
            setStatusModalVisible(false);
          }
        }}
      />

      <LixeiraModal
        visible={lixeiraVisible}
        agendamentosExcluidos={agendamentosExcluidos}
        loadingLixeira={loadingLixeira}
        excluindoAgendamento={excluindoAgendamento}
        onClose={() => setLixeiraVisible(false)}
        formatarData={formatarData}
        onRestaurar={() => {
          // Implementação será passada do componente pai
        }}
        onExcluirPermanente={() => {
          // Implementação será passada do componente pai
        }}
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
