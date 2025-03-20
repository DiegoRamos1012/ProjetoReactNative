// ...existing code...

import { User } from "firebase/auth";

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  tempo: string;
  iconName: string;
  horarios?: string[]; // Horários disponíveis para este serviço
}

// Interface para as props do componente de gerenciamento de serviços
export interface ServicesManagementProps {
  navigation: any;
  user: User;
}

export interface ProfileProps {
  user: User;
  setUser: (user: User | null) => void;
  navigation: any;
}

// ...existing code...
