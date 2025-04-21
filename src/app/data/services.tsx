import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Servico } from "../types/types";

// Dados padrão de serviços
export const servicosBarbearia: Servico[] = [
  {
    id: "1",
    nome: "Corte de Cabelo",
    descricao: "Corte tradicional masculino",
    preco: 35.00,
    tempo: "30 min",
    iconName: "content-cut",
    horarios: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  },
  {
    id: "2",
    nome: "Barba",
    descricao: "Barba completa com toalha quente",
    preco:  25.00,
    tempo: "20 min",
    iconName: "face",
    horarios: ["09:30", "10:30", "11:30", "14:30", "15:30", "16:30"],
  },
  {
    id: "3",
    nome: "Corte + Barba",
    descricao: "Corte de cabelo e barba completa",
    preco: 55.00,
    tempo: "50 min",
    iconName: "people",
    horarios: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  },
];

// Funções utilitárias para manipular serviços
export const adicionarServico = (servicos: Servico[], novoServico: Servico): Servico[] => {
  return [...servicos, novoServico];
};

export const editarServico = (servicos: Servico[], servicoAtualizado: Servico): Servico[] => {
  return servicos.map((servico) =>
    servico.id === servicoAtualizado.id ? servicoAtualizado : servico
  );
};

export const removerServico = (servicos: Servico[], id: string): Servico[] => {
  return servicos.filter((servico) => servico.id !== id);
};

// Hook para buscar serviços do Firebase
export const useServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServicos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const servicosRef = collection(db, "servicos");
      const snapshot = await getDocs(servicosRef);

      const servicosList: Servico[] = [];
      snapshot.forEach((doc) => {
        servicosList.push({ id: doc.id, ...doc.data() } as Servico);
      });

      setServicos(servicosList);
    } catch (err: any) {
      console.error("Erro ao buscar serviços:", err);
      setError(err.message || "Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a refresh function that can be called externally
  const refreshServicos = useCallback(() => {
    fetchServicos();
  }, [fetchServicos]);

  useEffect(() => {
    fetchServicos();
  }, [fetchServicos]);

  return { servicos, loading, error, refreshServicos };
};

export default useServicos;