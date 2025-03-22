import { useState, useCallback } from "react";
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
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Agendamento, Servico } from "../types";
import { servicosBarbearia } from "../data/services";

export const useAppointments = (user: User) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      console.log(
        `Consulta concluída. Documentos encontrados: ${querySnapshot.size}`
      );

      const agendamentosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Agendamento[];

      console.log("Agendamentos processados:", agendamentosData.length);
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

  const createAppointment = useCallback(
    async (servico: Servico, hora: string) => {
      if (!user || !user.uid) {
        Alert.alert(
          "Erro",
          "Você precisa estar logado para fazer um agendamento"
        );
        return;
      }

      setLoading(true);

      try {
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString("pt-BR");

        const novoAgendamento = {
          userId: user.uid,
          userName: user.displayName,
          servico: servico.nome,
          preco: servico.preco,
          data: dataFormatada,
          hora: hora,
          status: "confirmado",
          criado_em: Timestamp.now(),
          data_timestamp: Timestamp.now(),
        };

        console.log("Salvando agendamento:", novoAgendamento);

        const agendamentosRef = collection(db, "agendamentos");
        const docRef = await addDoc(agendamentosRef, novoAgendamento);

        console.log("Agendamento salvo com ID:", docRef.id);

        Alert.alert(
          "Agendamento Confirmado",
          `Seu ${servico.nome} foi agendado com sucesso para hoje às ${hora}!`
        );

        // Atualizar a lista de agendamentos
        await fetchAppointments();
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
    },
    [user, fetchAppointments]
  );

  const deleteAppointment = async (appointmentId: any) => {
    if (!user?.uid) return false;

    try {
      setLoading(true);

      // Deletar o documento do Firestore
      await deleteDoc(doc(db, "agendamentos", appointmentId));

      // Atualizar a lista de agendamentos removendo o item excluído
      setAgendamentos((prevAgendamentos) =>
        prevAgendamentos.filter(
          (agendamento) => agendamento.id !== appointmentId
        )
      );

      return true;
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      setErrorMessage(
        "Não foi possível excluir o agendamento. Tente novamente."
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

        // Atualizar a lista local de agendamentos
        setAgendamentos((prevAgendamentos) =>
          prevAgendamentos.map((agendamento) => ({
            ...agendamento,
            userName: newUserName,
          }))
        );

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

  const getServiceIcon = (servicoNome: string) => {
    const servico = servicosBarbearia.find((s) => s.nome === servicoNome);
    return servico?.iconName || "content-cut"; // Retorna "content-cut" como padrão
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
    getServiceIcon,
    getStatusIcon, // Exportando a nova função
    updateUserNameInAppointments,
  };
};

export default useAppointments;
