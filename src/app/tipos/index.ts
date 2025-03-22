import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface Servico {
  id: string;
  nome: string;
  preco: string;
  tempo: string;
  iconName: string;
}

export interface Agendamento {
  id: string;
  userId: string;
  servico: string;
  preco: string;
  data: string;
  hora: string;
  barbeiro: string;
  status: string;
  criado_em: Timestamp;
  data_timestamp: Timestamp;
  iconName?: string; // Adicionando campo opcional para ícone
}

export interface InicioProps {
  setUser: (user: User | null) => void;
  user: User;
}

export default Servico;
