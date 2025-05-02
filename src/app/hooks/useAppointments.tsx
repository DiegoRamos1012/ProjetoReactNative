import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { User } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Agendamento, Servico } from "../types/types";
import { formatCurrencyBRL } from "../format";

export const useAppointments = (user: User) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  // Função para buscar agendamentos com retorno de promise
  const fetchAppointments = useCallback(async () => {
    if (!user || !user.uid) {
      console.log(
        "Usuário não autenticado, não é possível buscar agendamentos"
      );
      return;
    }

    try {
      const agendamentosRef = collection(db, "agendamentos");
      const q = query(
        agendamentosRef,
        where("userId", "==", user.uid),
        orderBy("data_timestamp", "desc")
      );

      console.log("Executando consulta ao Firestore...");
      const querySnapshot = await getDocs(q);

      const agendamentosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Agendamento[];

      console.log("Agendamentos encontrados:", agendamentosData.length);
      setAgendamentos(agendamentosData);
      setErrorMessage(null);
    } catch (error: any) {
      console.error("Erro ao buscar agendamentos:", error);

      if (error.message && error.message.includes("requires an index")) {
        console.log("Erro de índice detectado!");
        setErrorMessage(
          "Erro de índice no Firestore. Um administrador precisa configurar o índice."
        );

        Alert.alert(
          "Erro de configuração",
          "Esta consulta requer um índice no Firestore. Um administrador precisa configurá-lo.",
          [{ text: "OK", style: "default" }]
        );
      } else if (
        error.code === "permission-denied" ||
        error.message.includes("Missing or insufficient permissions")
      ) {
        setErrorMessage("Erro de permissão ao acessar agendamentos.");
        Alert.alert(
          "Erro de permissão",
          "Você não tem permissão para acessar estes agendamentos. Por favor, verifique se está conectado corretamente."
        );
      } else {
        setErrorMessage(`Erro: ${error.message || "Erro desconhecido"}`);
        Alert.alert(
          "Erro ao buscar agendamentos",
          error.message || "Erro desconhecido"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Configurar listener para agendamentos em tempo real
  useEffect(() => {
    if (!user || !user.uid) return;

    setLoading(true);

    try {
      const agendamentosRef = collection(db, "agendamentos");
      const q = query(
        agendamentosRef,
        where("userId", "==", user.uid),
        orderBy("data_timestamp", "desc")
      );

      // Criar um listener que atualiza em tempo real
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log("Snapshot recebido - Atualizando agendamentos");
          const agendamentosData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Agendamento[];

          setAgendamentos(agendamentosData);
          setErrorMessage(null);
          setLoading(false);
        },
        (error) => {
          console.error("Erro no listener de agendamentos:", error);
          setErrorMessage(`Erro ao observar agendamentos: ${error.message}`);
          setLoading(false);
        }
      );

      // Cleanup: Remover o listener quando o componente desmontar
      return () => unsubscribe();
    } catch (error: any) {
      console.error("Erro ao configurar listener:", error);
      setLoading(false);
    }
  }, [user]);

  const refreshAppointments = useCallback(() => {
    console.log("Iniciando refresh...");
    setRefreshing(true);
    setErrorMessage(null);

    fetchAppointments()
      .catch((err) => {
        console.error("Erro durante refresh:", err);
      })
      .finally(() => {
        console.log("Refresh concluído");
        setRefreshing(false);
      });
  }, [fetchAppointments]);

  // Função para criar um novo agendamento
  const createAppointment = async (
    servico: Servico,
    dataAgendamento: string,
    hora: string,
    observacao?: string
  ) => {
    if (!user) return false;
    setLoading(true);

    try {
      // Converter a data do formato YYYY-MM-DD para Date
      const [ano, mes, dia] = dataAgendamento.split("-");
      const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

      // Formatar a data para exibição no formato brasileiro
      const dataFormatada = `${dia.padStart(2, "0")}/${mes.padStart(
        2,
        "0"
      )}/${ano}`;

      // Criar o objeto de agendamento com todos os campos necessários
      const agendamento = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        servico: servico.nome,
        preco: servico.preco,
        data: dataFormatada,
        hora: hora,
        status: "pendente",
        observacao: observacao || "", // Garantindo que a observação seja salva
        criado_em: Timestamp.now(),
        data_timestamp: Timestamp.fromDate(dataObj), // Usar a data selecionada pelo usuário
      };

      // Salvar no Firestore
      const docRef = await addDoc(collection(db, "agendamentos"), agendamento);

      console.log("Agendamento salvo com sucesso");
      setLastOperation("create");

      Alert.alert(
        "Agendamento Confirmado",
        `Seu ${servico.nome} foi agendado com sucesso para ${dataFormatada} às ${hora}!`
      );

      // O listener onSnapshot já vai atualizar a lista automaticamente
      return true;
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);

      if (error.code === "permission-denied") {
        Alert.alert(
          "Erro de permissão",
          "Você não tem permissão para criar agendamentos. Verifique se está logado corretamente."
        );
      } else {
        Alert.alert(
          "Erro ao agendar",
          error.message ||
            "Não foi possível criar o agendamento. Tente novamente."
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId: any) => {
    if (!user?.uid) return false;

    try {
      setLoading(true);

      // Em vez de deletar, vamos atualizar o status para "cancelado"
      const appointmentRef = doc(db, "agendamentos", appointmentId);

      // Atualiza o documento com as novas informações
      await updateDoc(appointmentRef, {
        status: "cancelado",
        cancelado_pelo_cliente: true,
        notificado_admin: false,
        data_cancelamento: Timestamp.now(),
      });

      setLastOperation("delete");

      // A atualização virá automaticamente pelo listener onSnapshot

      Alert.alert(
        "Agendamento Cancelado",
        "Seu agendamento foi cancelado com sucesso. Os profissionais foram notificados."
      );

      return true;
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      setErrorMessage(
        "Não foi possível cancelar o agendamento. Tente novamente."
      );
      Alert.alert(
        "Erro ao Cancelar",
        "Ocorreu um erro ao cancelar seu agendamento. Por favor, tente novamente."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Nova função para atualizar o nome do usuário em todos os agendamentos
  const updateUserNameInAppointments = useCallback(
    async (newUserName: string) => {
      if (!user?.uid || !newUserName) return false;

      try {
        setLoading(true);

        // Buscar todos os agendamentos do usuário
        const agendamentosRef = collection(db, "agendamentos");
        const q = query(agendamentosRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("Nenhum agendamento encontrado para atualizar o nome");
          return true;
        }

        // Atualizar o nome em cada agendamento
        const updatePromises = querySnapshot.docs.map(async (document) => {
          const docRef = doc(db, "agendamentos", document.id);
          return updateDoc(docRef, { userName: newUserName });
        });

        await Promise.all(updatePromises);
        console.log(`Nome atualizado em ${querySnapshot.size} agendamentos`);

        // A atualização virá automaticamente pelo listener onSnapshot

        return true;
      } catch (error) {
        console.error("Erro ao atualizar nome nos agendamentos:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Função para remover agendamento do histórico do cliente
  const removeFromHistory = async (appointmentId: string) => {
    if (!user?.uid) return false;

    try {
      setLoading(true);

      // Referência ao documento do agendamento
      const appointmentRef = doc(db, "agendamentos", appointmentId);

      // Primeiro, obter o documento para verificar se é do usuário atual
      const appointmentDoc = await getDoc(appointmentRef);

      if (!appointmentDoc.exists()) {
        throw new Error("Agendamento não encontrado");
      }

      const appointmentData = appointmentDoc.data();

      // Verificar se o agendamento pertence ao usuário
      if (appointmentData.userId !== user.uid) {
        throw new Error("Você não tem permissão para remover este agendamento");
      }

      // Verificar se é um agendamento passado, concluído ou cancelado
      const isPast =
        new Date(appointmentData.data_timestamp.toDate()) < new Date();
      const isCompletedOrCanceled =
        appointmentData.status === "concluido" ||
        appointmentData.status === "cancelado";

      if (!isPast && !isCompletedOrCanceled) {
        throw new Error(
          "Apenas agendamentos passados, concluídos ou cancelados podem ser removidos"
        );
      }

      // Adicionar ao historico_agendamentos para manter registro (opcional)
      await addDoc(collection(db, "historico_agendamentos"), {
        ...appointmentData,
        id_original: appointmentId,
        removido_em: Timestamp.now(),
        removido_por: user.uid,
      });

      // Remover da coleção principal
      await deleteDoc(appointmentRef);

      setLastOperation("remove");

      // A atualização virá automaticamente pelo listener onSnapshot

      Alert.alert(
        "Removido do Histórico",
        "O agendamento foi removido do seu histórico com sucesso!"
      );

      return true;
    } catch (error: any) {
      console.error("Erro ao remover do histórico:", error);
      Alert.alert(
        "Erro ao Remover",
        error.message ||
          "Ocorreu um erro ao remover o agendamento do histórico."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Adicionando função para obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmado":
        return "check-circle";
      case "pendente":
        return "pending";
      case "cancelado":
        return "cancel";
      case "concluido":
        return "task-alt";
      default:
        return "info";
    }
  };

  return {
    agendamentos,
    loading,
    refreshing,
    errorMessage,
    fetchAppointments,
    refreshAppointments,
    createAppointment,
    deleteAppointment,
    getStatusIcon,
    updateUserNameInAppointments,
    removeFromHistory,
    lastOperation,
  };
};

export default useAppointments;
