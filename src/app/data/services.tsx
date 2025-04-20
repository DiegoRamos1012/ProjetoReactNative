import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Servico } from "../types/types";

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