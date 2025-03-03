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
}
