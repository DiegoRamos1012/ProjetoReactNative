import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
  addDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Agendamento } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { formatCurrencyBRL } from "../../format";

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

  // Função para alterar o status de um agendamento
  const alterarStatusAgendamento = async (
    agendamentoId: string,
    novoStatus: string
  ) => {
    try {
      setAtualizandoAgendamento(agendamentoId);

      // Atualizar no Firestore
      const agendamentoRef = doc(db, "agendamentos", agendamentoId);
      await updateDoc(agendamentoRef, { status: novoStatus });

      // Atualizar o estado local
      setAgendamentos(
        agendamentos.map((agendamento) =>
          agendamento.id === agendamentoId
            ? { ...agendamento, status: novoStatus }
            : agendamento
        )
      );

      // Callback para o componente pai se fornecido
      if (onStatusChange) {
        onStatusChange(agendamentoId, novoStatus);
      }

      Alert.alert(
        "Sucesso",
        `Status alterado para ${novoStatus.toUpperCase()}`
      );
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      Alert.alert(
        "Erro",
        "Não foi possível alterar o status do agendamento: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setAtualizandoAgendamento(null);
    }
  };

  // Função para excluir um agendamento
  const excluirAgendamento = (agendamento: Agendamento) => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja mover o agendamento de ${agendamento.userName} para a lixeira?`,
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
              setExcluindoAgendamento(agendamento.id);

              // Adicionar à coleção lixeira com timestamp de exclusão
              const agendamentoParaLixeira = {
                ...agendamento,
                data_exclusao: Timestamp.now(),
              };

              await addDoc(
                collection(db, "agendamentos_lixeira"),
                agendamentoParaLixeira
              );

              // Remover da coleção principal
              await deleteDoc(doc(db, "agendamentos", agendamento.id));

              // Atualizar estados
              setAgendamentos(
                agendamentos.filter((a) => a.id !== agendamento.id)
              );
              await fetchAgendamentosExcluidos();

              Alert.alert("Sucesso", "Agendamento movido para a lixeira");
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

  // Função para restaurar um agendamento da lixeira
  const restaurarAgendamento = async (agendamento: Agendamento) => {
    try {
      setExcluindoAgendamento(agendamento.id);

      // Remover o campo data_exclusao
      const { data_exclusao, ...agendamentoRestaurado } = agendamento;

      // Adicionar de volta à coleção principal
      await addDoc(collection(db, "agendamentos"), agendamentoRestaurado);

      // Remover da lixeira
      await deleteDoc(doc(db, "agendamentos_lixeira", agendamento.id));

      // Atualizar estados
      setAgendamentosExcluidos(
        agendamentosExcluidos.filter((a) => a.id !== agendamento.id)
      );
      await fetchAgendamentos();

      Alert.alert("Sucesso", "Agendamento restaurado com sucesso");
    } catch (error: any) {
      console.error("Erro ao restaurar agendamento:", error);
      Alert.alert(
        "Erro",
        "Não foi possível restaurar o agendamento: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setExcluindoAgendamento(null);
    }
  };

  // Função para excluir permanentemente um agendamento
  const excluirPermanentemente = (agendamento: Agendamento) => {
    Alert.alert(
      "Excluir permanentemente",
      "Esta ação não poderá ser desfeita. Deseja excluir permanentemente este agendamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir permanentemente",
          style: "destructive",
          onPress: async () => {
            try {
              setExcluindoAgendamento(agendamento.id);

              // Excluir da lixeira
              await deleteDoc(doc(db, "agendamentos_lixeira", agendamento.id));

              // Atualizar estado
              setAgendamentosExcluidos(
                agendamentosExcluidos.filter((a) => a.id !== agendamento.id)
              );

              Alert.alert("Sucesso", "Agendamento excluído permanentemente");
            } catch (error: any) {
              console.error("Erro ao excluir permanentemente:", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir permanentemente: " +
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

  // Função para mostrar o modal personalizado de alteração de status
  const mostrarMenuStatus = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setStatusModalVisible(true);
  };

  // Função para renderizar o modal personalizado de status
  const renderStatusModal = () => {
    if (!agendamentoSelecionado) return null;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={statusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: colors.gradient.middle,
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              elevation: 5,
              borderWidth: 1,
              borderColor: "rgba(58, 81, 153, 0.3)",
            }}
          >
            {/* Botão X no canto superior direito */}
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                zIndex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: 15,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setStatusModalVisible(false)}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.white,
                marginBottom: 20,
                marginTop: 20,
                textAlign: "center",
              }}
            >
              Alterar Status do Agendamento
            </Text>

            <Text
              style={{
                color: colors.textLighter,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Cliente: {agendamentoSelecionado.userName} / Serviço:{" "}
              {agendamentoSelecionado.servico}
            </Text>

            {/* Botões de status */}
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(255, 193, 7, 0.8)",
                padding: 12,
                borderRadius: 8,
                width: "100%",
                alignItems: "center",
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => {
                alterarStatusAgendamento(agendamentoSelecionado.id, "pendente");
                setStatusModalVisible(false);
              }}
            >
              <MaterialIcons
                name="schedule"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                PENDENTE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(76, 175, 80, 0.8)",
                padding: 12,
                borderRadius: 8,
                width: "100%",
                alignItems: "center",
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => {
                alterarStatusAgendamento(
                  agendamentoSelecionado.id,
                  "confirmado"
                );
                setStatusModalVisible(false);
              }}
            >
              <MaterialIcons
                name="check-circle"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                CONFIRMADO
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(33, 150, 243, 0.8)",
                padding: 12,
                borderRadius: 8,
                width: "100%",
                alignItems: "center",
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => {
                alterarStatusAgendamento(
                  agendamentoSelecionado.id,
                  "finalizado"
                );
                setStatusModalVisible(false);
              }}
            >
              <MaterialIcons
                name="done-all"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                FINALIZADO
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(244, 67, 54, 0.8)",
                padding: 12,
                borderRadius: 8,
                width: "100%",
                alignItems: "center",
                marginBottom: 20,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => {
                alterarStatusAgendamento(
                  agendamentoSelecionado.id,
                  "cancelado"
                );
                setStatusModalVisible(false);
              }}
            >
              <MaterialIcons
                name="cancel"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                CANCELADO
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(97, 97, 97, 0.8)",
                padding: 12,
                borderRadius: 8,
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "500" }}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        <Text style={globalStyles.emptyListText}>
          Nenhum agendamento encontrado
        </Text>
      ) : (
        <ScrollView
          style={{ maxHeight: 600 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {agendamentos.map((agendamento) => {
            // Formatar a data usando a função auxiliar
            const formattedDate = formatarData(agendamento.data);

            // Verificar se temos todos os dados necessários e exibir no console para debug
            console.log("Renderizando agendamento:", {
              id: agendamento.id,
              servico: agendamento.servico,
              userName: agendamento.userName,
              data: formattedDate,
              hora: agendamento.hora,
              preco: agendamento.preco,
              status: agendamento.status,
            });

            return (
              <View
                key={agendamento.id}
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  borderRadius: 12,
                  marginHorizontal: 10,
                  marginBottom: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(58, 81, 153, 0.3)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                  opacity: atualizandoAgendamento === agendamento.id ? 0.7 : 1,
                }}
              >
                {/* Overlay de carregamento quando estiver atualizando este agendamento */}
                {atualizandoAgendamento === agendamento.id && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1,
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <ActivityIndicator
                      size="large"
                      color={colors.button.primary}
                    />
                    <Text
                      style={{
                        marginTop: 10,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Atualizando...
                    </Text>
                  </View>
                )}

                {/* Cabeçalho do card */}
                <View
                  style={{
                    backgroundColor: "rgba(12, 35, 64, 0.95)",
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(58, 81, 153, 0.5)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: colors.white,
                    }}
                  >
                    {agendamento.servico}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => excluirAgendamento(agendamento)}
                      style={{
                        backgroundColor: "rgba(244, 67, 54, 0.2)",
                        padding: 6,
                        borderRadius: 8,
                        marginRight: 8,
                      }}
                      disabled={
                        atualizandoAgendamento !== null ||
                        excluindoAgendamento !== null
                      }
                    >
                      <MaterialIcons
                        name="delete"
                        size={18}
                        color="rgba(244, 67, 54, 0.9)"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => mostrarMenuStatus(agendamento)}
                      disabled={
                        atualizandoAgendamento !== null ||
                        excluindoAgendamento !== null
                      }
                    >
                      <View
                        style={{
                          backgroundColor:
                            agendamento.status === "confirmado"
                              ? "rgba(76, 175, 80, 0.8)"
                              : agendamento.status === "pendente"
                              ? "rgba(255, 193, 7, 0.8)"
                              : agendamento.status === "cancelado"
                              ? "rgba(244, 67, 54, 0.8)"
                              : agendamento.status === "finalizado"
                              ? "rgba(33, 150, 243, 0.8)"
                              : "rgba(158, 158, 158, 0.8)",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor:
                            agendamento.status === "confirmado"
                              ? "rgba(76, 175, 80, 0.3)"
                              : agendamento.status === "pendente"
                              ? "rgba(255, 193, 7, 0.3)"
                              : agendamento.status === "cancelado"
                              ? "rgba(244, 67, 54, 0.3)"
                              : agendamento.status === "finalizado"
                              ? "rgba(33, 150, 243, 0.3)"
                              : "rgba(158, 158, 158, 0.3)",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 12,
                            marginRight: 5,
                          }}
                        >
                          {agendamento.status
                            ? agendamento.status.toUpperCase()
                            : "STATUS"}
                        </Text>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={16}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Corpo do card */}
                <View style={{ padding: 15 }}>
                  {/* Informações do cliente e agendamento */}
                  <View style={{ marginBottom: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <MaterialIcons
                        name="person"
                        size={20}
                        color={colors.textLighter}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: colors.textLighter,
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {agendamento.userName || "Cliente não identificado"}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <MaterialIcons
                        name="calendar-today"
                        size={20}
                        color={colors.textLighter}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: colors.textLighter,
                          fontSize: 15,
                        }}
                      >
                        {formattedDate}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <MaterialIcons
                        name="access-time"
                        size={20}
                        color={colors.textLighter}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: colors.textLighter,
                          fontSize: 15,
                        }}
                      >
                        {agendamento.hora || "Horário não especificado"}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons
                        name="attach-money"
                        size={20}
                        color={colors.barber.gold}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: colors.barber.gold,
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {agendamento.preco
                          ? formatCurrencyBRL(Number(agendamento.preco))
                          : "Preço não informado"}
                      </Text>
                    </View>
                  </View>

                  {/* Observação do cliente */}
                  {agendamento.observacao && (
                    <View
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        borderRadius: 8,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: "rgba(212, 175, 55, 0.3)",
                        marginTop: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 5,
                        }}
                      >
                        <MaterialIcons
                          name="comment"
                          size={18}
                          color={colors.barber.gold}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{
                            color: colors.barber.gold,
                            fontWeight: "500",
                            fontSize: 14,
                          }}
                        >
                          Observação do cliente:
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: colors.barber.lightGold,
                          fontStyle: "italic",
                          marginLeft: 26,
                          lineHeight: 20,
                        }}
                      >
                        "{agendamento.observacao}"
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      {/* Renderizar o modal de status personalizado */}
      {renderStatusModal()}

      {/* Modal da Lixeira */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={lixeiraVisible}
        onRequestClose={() => setLixeiraVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.gradient.middle,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colors.gradient.middle,
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(58, 81, 153, 0.5)",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.white,
              }}
            >
              Lixeira de Agendamentos
            </Text>
            <TouchableOpacity
              onPress={() => setLixeiraVisible(false)}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              }}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {loadingLixeira ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={colors.button.primary} />
              <Text style={{ marginTop: 10, color: colors.textLight }}>
                Carregando itens da lixeira...
              </Text>
            </View>
          ) : agendamentosExcluidos.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="delete-outline"
                size={50}
                color="rgba(255, 255, 255, 0.5)"
              />
              <Text
                style={{
                  marginTop: 15,
                  color: colors.textLight,
                  fontSize: 16,
                  textAlign: "center",
                  padding: 20,
                }}
              >
                A lixeira está vazia
              </Text>
            </View>
          ) : (
            <ScrollView style={{ flex: 1 }}>
              {agendamentosExcluidos.map((agendamento) => {
                const formattedDate = formatarData(agendamento.data);
                const dataExclusao = agendamento.data_exclusao
                  ? formatarData(agendamento.data_exclusao)
                  : "Data desconhecida";

                return (
                  <View
                    key={agendamento.id}
                    style={{
                      backgroundColor: "rgba(15, 23, 42, 0.8)",
                      margin: 10,
                      borderRadius: 10,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: "rgba(58, 81, 153, 0.3)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(12, 35, 64, 0.95)",
                        padding: 12,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: colors.white,
                        }}
                      >
                        {agendamento.servico}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        Excluído em: {dataExclusao}
                      </Text>
                    </View>

                    <View style={{ padding: 15 }}>
                      <Text
                        style={{ color: colors.textLighter, marginBottom: 5 }}
                      >
                        Cliente: {agendamento.userName}
                      </Text>
                      <Text
                        style={{ color: colors.textLighter, marginBottom: 5 }}
                      >
                        Data: {formattedDate} às {agendamento.hora}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 15,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            backgroundColor: "rgba(76, 175, 80, 0.2)",
                            padding: 8,
                            borderRadius: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            marginRight: 5,
                            justifyContent: "center",
                          }}
                          onPress={() => restaurarAgendamento(agendamento)}
                          disabled={excluindoAgendamento !== null}
                        >
                          <MaterialIcons
                            name="restore"
                            size={18}
                            color="rgba(76, 175, 80, 0.9)"
                            style={{ marginRight: 5 }}
                          />
                          <Text style={{ color: "rgba(76, 175, 80, 0.9)" }}>
                            Restaurar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            backgroundColor: "rgba(244, 67, 54, 0.2)",
                            padding: 8,
                            borderRadius: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            marginLeft: 5,
                            justifyContent: "center",
                          }}
                          onPress={() => excluirPermanentemente(agendamento)}
                          disabled={excluindoAgendamento !== null}
                        >
                          <MaterialIcons
                            name="delete-forever"
                            size={18}
                            color="rgba(244, 67, 54, 0.9)"
                            style={{ marginRight: 5 }}
                          />
                          <Text style={{ color: "rgba(244, 67, 54, 0.9)" }}>
                            Excluir
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default AgendamentosList;
