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
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Agendamento, Servico } from "../types";

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
      console.log("Iniciando busca de agendamentos para o usuário:", user.uid);

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

  return {
    agendamentos,
    loading,
    refreshing,
    errorMessage,
    fetchAppointments,
    refreshAppointments,
    createAppointment,
  };
};
