import { Servico } from "../types";

export const servicosBarbearia: Servico[] = [
  {
    id: "1",
    nome: "Corte de Cabelo",
    descricao: "Corte tradicional ou moderno",
    preco: "R$35,00",
    iconName: "content-cut",
    tempo: "30 minutos",
  },
  {
    id: "2",
    nome: "Barba",
    descricao: "Aparar e modelar a barba",
    preco: "R$25,00",
    iconName: "face",
    tempo: "20 minutos",
  },
  {
    id: "3",
    nome: "Corte + Barba",
    descricao: "Combinação de corte e barba",
    preco: "R$55,00",
    iconName: "spa",
    tempo: "50 minutos",
  },
];

export default { servicosBarbearia };
