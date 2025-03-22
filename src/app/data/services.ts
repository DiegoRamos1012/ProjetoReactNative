import { Servico } from "../types";

// Exemplos de horários disponíveis para todos os serviços
export const horariosDisponiveis = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Lista de serviços da barbearia
export const servicosBarbearia: Servico[] = [
  // ...existing code...
];

// Funções para manipular serviços no estado local (depois serão integradas com Firebase)
export const adicionarServico = (
  servicos: Servico[],
  novoServico: Servico
): Servico[] => {
  return [...servicos, { ...novoServico, id: Date.now().toString() }];
};

export const editarServico = (
  servicos: Servico[],
  servicoEditado: Servico
): Servico[] => {
  return servicos.map((servico) =>
    servico.id === servicoEditado.id ? servicoEditado : servico
  );
};

export const removerServico = (servicos: Servico[], id: string): Servico[] => {
  return servicos.filter((servico) => servico.id !== id);
};
