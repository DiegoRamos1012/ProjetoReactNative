import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Agendamento } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrencyBRL } from "../../format";

interface AgendamentosListProps {
  canAccessTools: boolean;
  expanded: boolean;
  onStatusChange?: (agendamentoId: string, novoStatus: string) => void;
}

const AgendamentosList: React.FC<AgendamentosListProps> = ({
  canAccessTools,
  expanded,
  onStatusChange,
}) => {
  // Estado para armazenar os agendamentos buscados do Firestore
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const [atualizandoAgendamento, setAtualizandoAgendamento] = useState<
    string | null
  >(null);

  // Buscar agendamentos quando o componente montar se estiver expandido
  useEffect(() => {
    if (expanded) {
      fetchAgendamentos();
    }
  }, [expanded]);

  // Função para buscar todos os agendamentos
  const fetchAgendamentos = async () => {
    if (!canAccessTools) return;

    setLoadingAgendamentos(true);
    try {
      const agendamentosRef = collection(db, "agendamentos");
      // Ordena por data mais recente primeiro
      const q = query(agendamentosRef, orderBy("data", "desc"));
      const querySnapshot = await getDocs(q);

      const agendamentosList: Agendamento[] = [];
      querySnapshot.forEach((doc) => {
        const agendamentoData = doc.data();

        // Formata os dados do agendamento para exibição
        const agendamento: Agendamento = {
          id: doc.id,
          ...agendamentoData,
          status: agendamentoData.status || "pendente",
          // Garante que a observação seja acessada corretamente
          observacao: agendamentoData.observacao || "",
        };

        agendamentosList.push(agendamento);
      });

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

  // Função para mostrar menu de alteração de status
  const mostrarMenuStatus = (agendamento: Agendamento) => {
    Alert.alert(
      "Alterar Status",
      `Selecione o novo status para o agendamento de ${agendamento.userName}`,
      [
        {
          text: "Pendente",
          onPress: () => alterarStatusAgendamento(agendamento.id, "pendente"),
          style: agendamento.status === "pendente" ? "default" : "default",
        },
        {
          text: "Confirmado",
          onPress: () => alterarStatusAgendamento(agendamento.id, "confirmado"),
          style: agendamento.status === "confirmado" ? "default" : "default",
        },
        {
          text: "Cancelado",
          onPress: () => alterarStatusAgendamento(agendamento.id, "cancelado"),
          style: "destructive",
        },
        {
          text: "Fechar",
          style: "cancel",
        },
      ]
    );
  };

  if (!expanded) return null;

  return (
    <View style={{ maxHeight: 500 }}>
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
        <ScrollView style={{ paddingHorizontal: 10 }}>
          {agendamentos.map((agendamento) => {
            // Verifica e formata a data do agendamento de forma segura
            let dataAgendamento = new Date();
            let formattedDate = "";

            try {
              // Verifica se agendamento.data existe
              if (agendamento.data) {
                // Verifica se é um objeto Timestamp do Firestore
                if (
                  agendamento.data.toDate &&
                  typeof agendamento.data.toDate === "function"
                ) {
                  dataAgendamento = agendamento.data.toDate();
                  // Usar formato de data original
                  formattedDate = format(dataAgendamento, "dd/MM/yyyy", {
                    locale: ptBR,
                  });
                }
                // Verifica se é uma string de data
                else if (typeof agendamento.data === "string") {
                  formattedDate = agendamento.data; // Manter a string original
                }
                // Se for um objeto Date direto
                else if (agendamento.data instanceof Date) {
                  dataAgendamento = agendamento.data;
                  // Usar formato de data original
                  formattedDate = format(dataAgendamento, "dd/MM/yyyy", {
                    locale: ptBR,
                  });
                }
              }
            } catch (err) {
              console.error("Erro ao processar data:", err);
              formattedDate = "Data não disponível"; // Fallback em caso de erro
            }

            return (
              <View
                key={agendamento.id}
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  borderRadius: 12,
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

                  <TouchableOpacity
                    onPress={() => mostrarMenuStatus(agendamento)}
                    disabled={atualizandoAgendamento !== null}
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
                            : "rgba(33, 150, 243, 0.8)",
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
                            : "rgba(33, 150, 243, 0.3)",
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
                        color={colors.barber.lightGold}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: colors.barber.lightGold,
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
    </View>
  );
};

export default AgendamentosList;
