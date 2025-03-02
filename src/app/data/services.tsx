import { Servico } from "../types";
import { MaterialIcons } from "@expo/vector-icons";

export const servicosBarbearia: Servico[] = [
  {
    id: "1",
    nome: "Corte de Cabelo",
    descricao: "Corte tradicional ou moderno",
    preco: "R$35,00",
    duracao: 30,
    iconName: "content-cut",
    tempo: "30 minutos"
  },
  {
    id: "2",
    nome: "Barba",
    descricao: "Aparar e modelar a barba",
    preco: "R$25,00",
    duracao: 20,
    iconName: "face",
    tempo: "20 minutos"
  },
  {
    id: "3",
    nome: "Corte + Barba",
    descricao: "Combinação de corte e barba",
    preco: "R$55,00",
    duracao: 50,
    iconName: "spa",
    tempo: "50 minutos"
  },
];
