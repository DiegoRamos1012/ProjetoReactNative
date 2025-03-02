import { Servico } from "../types";

export const servicosBarbearia: Servico[] = [
  {
    id: "1",
    nome: "Corte de Cabelo",
    descricao: "Corte tradicional ou moderno",
    preco: "35",
    duracao: 30,
    imagem: require("../assets/images/corte.jpg"),
  },
  {
    id: "2",
    nome: "Barba",
    descricao: "Aparar e modelar a barba",
    preco: "25",
    duracao: 20,
    imagem: require("../assets/images/barba.jpg"),
  },
  {
    id: "3",
    nome: "Corte + Barba",
    descricao: "Combinação de corte e barba",
    preco: "55",
    duracao: 50,
    imagem: require("../assets/images/combo.jpg"),
  },
];