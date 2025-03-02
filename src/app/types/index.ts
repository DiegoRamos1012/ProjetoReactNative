import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { ReactNode } from "react";

export interface Servico {
  tempo: ReactNode;
  id: string;
  nome: string;
  preco: string;
  iconName: string;
  descricao: string;
  duracao: number;
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
}

export interface HomeProps {
  setUser: (user: User | null) => void;
  user: User;
  password: string;
}

export interface profileProps {
  setUser: (user: User | null) => void;
  user: User;
  sexo: string,
  dataNascimento: string,
  telefone: string,
}
