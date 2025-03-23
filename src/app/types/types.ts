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
  preco: number;
  tempo: string;
  iconName: string;
  observacao?: string; // Observação para o cliente ler
  horarios?: string[]; // Array de horários disponíveis
  // horariosPersonalizados removido ou fixado em false
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
  observacao_cliente: string; // Observação do cliente
  iconName?: string; // Adicionando campo opcional para ícone
}
export interface InicioProps {
  setUser: (user: User | null) => void;
  user: User;
}
