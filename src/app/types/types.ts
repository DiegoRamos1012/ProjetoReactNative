import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;
export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Profile"
>;
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;
export type AdminToolsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AdminTools"
>;

// Compatibilidade com código antigo
export interface HomeScreenPropsLegacy {
  navigation: any;
  route: any;
}

export interface HomeProps extends HomeScreenProps {
  user: User;
  setUser: (user: User | null) => void;
  setShowProfile: (show: boolean) => void;
  navigation: any;
  route: any;
  password?: string;
}

export interface ProfileProps extends ProfileScreenProps {
  user: User;
  setUser: (user: User | null) => void;
}

export interface LoginProps extends Partial<LoginScreenProps> {
  setUser: (user: User | null) => void;
  password: string;
  setPassword: (password: string) => void;
}

export interface AdminToolsProps extends AdminToolsScreenProps {
  user: User;
}

// Interface adicionada do arquivo antigo
export interface ServicesManagementProps {
  navigation: any;
  user: User;
}

export type UserRole = "administrador" | "cliente";

export interface UserData {
  nome?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  dataCadastro?: Date;
  role: UserRole;
  updatedAt?: Date;
  cargo: string;
  icone?: string; // Adicionando campo opcional para ícone
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // Atualizado para aceitar ambos os tipos para compatibilidade
  tempo: string;
  iconName: string;
  observacao?: string; // Observação para o cliente ler
  horarios?: string[]; // Array de horários disponíveis
  // horariosPersonalizados removido ou fixado em false
}

// Tipo para agendamentos
export interface Agendamento {
  id: string;
  userId: string;
  userName: string;
  servico: string;
  preco: string | number;
  data: any; // Aceita timestamp ou string
  data_timestamp?: any; // Para ordenação
  data_exclusao?: any; // Para exclusão
  hora: string;
  barbeiro?: string;
  observacao?: string;
  status: "pendente" | "confirmado" | "cancelado" | "finalizado" | string;
  criado_em: any; // Timestamp do Firestore
  metadados?: Record<string, any>; // Campos adicionais que podem ser úteis
}

export interface InicioProps {
  setUser: (user: User | null) => void;
  user: User;
}
