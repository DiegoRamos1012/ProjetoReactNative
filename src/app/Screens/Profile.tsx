import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ProfileProps } from "../types/types";
import globalStyles, { colors } from "../components/globalStyle/styles";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { formatPhoneNumber, formatBirthDate } from "../format";
import { auth } from "../../config/firebaseConfig";
import { updateProfile } from "firebase/auth";
import { useAppointments } from "../hooks/useAppointments";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type ProfileNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const Profile: React.FC<ProfileProps> = ({ navigation, user }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [originalNome, setOriginalNome] = useState(""); // Added state for original name
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { updateUserNameInAppointments } = useAppointments(user);
  const typedNavigation = useNavigation<ProfileNavigationProp>();

  // Buscar dados do usuário no Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user.uid) return;

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.nome) {
            setNome(userData.nome);
            setOriginalNome(userData.nome); // Store original name
          }
          setTelefone(userData.telefone || "");
          setDataNascimento(userData.dataNascimento || "");
          setSexo(userData.sexo || "");

          // Verificar se o usuário é admin
          setIsAdmin(userData.role === "administrador");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleSave = async () => {
    if (!user.uid) return;

    setSaving(true);
    try {
      // Log para verificar se o nome foi alterado
      if (nome !== originalNome) {
        console.log(`Nome de usuário alterado: ${originalNome} -> ${nome}`);

        // Atualizar o displayName do usuário autenticado
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: nome,
          });
          console.log("DisplayName atualizado com sucesso:", nome);

          // Atualizar nome em todos os agendamentos existentes
          await updateUserNameInAppointments(nome);
        }
      } else {
        console.log("Nome de usuário não foi alterado");
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          nome,
          telefone,
          dataNascimento,
          sexo,
          email: user.email,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // Atualiza o nome original após salvar com sucesso
      setOriginalNome(nome);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o perfil. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setTelefone(formatted);
  };

  const handleDateChange = (text: string) => {
    const formatted = formatBirthDate(text);
    setDataNascimento(formatted);
  };

  return (
    <View
      style={{
        backgroundColor: colors.gradient.middle,
        flex: 1,
      }}
    >
      <View
        style={[
          globalStyles.header,
          { backgroundColor: colors.gradient.start },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[globalStyles.backButton, { backgroundColor: "transparent" }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <Text
          style={[
            globalStyles.bannerTitle,
            { marginBottom: 0, color: colors.primary },
          ]}
        >
          Meu Perfil
        </Text>

        <View style={{ flexDirection: "row" }}>
          {/* Botão Notificações */}
          <TouchableOpacity
            onPress={() => typedNavigation.navigate("NotificationSettings")}
            style={[
              globalStyles.backButton,
              { backgroundColor: colors.gradient.start, marginRight: 5 },
            ]}
          >
            <MaterialIcons
              name="notifications"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Botão Admin com estilo padronizado */}
          {isAdmin && (
            <TouchableOpacity
              onPress={() => navigation.navigate("AdminTools")}
              style={[
                globalStyles.backButton,
                { backgroundColor: colors.gradient.start },
              ]}
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Formulário com cores padronizadas */}
      {loading ? (
        <View style={globalStyles.loadingContainer}>
          <View style={globalStyles.loadingCircle}>
            <MaterialIcons
              name="person"
              size={40}
              color={colors.button.primary}
            />
          </View>
          <Text style={globalStyles.loadingText}>Carregando seu perfil</Text>
          <Text style={globalStyles.loadingSubText}>
            Aguarde enquanto buscamos suas informações...
          </Text>
        </View>
      ) : (
        <ScrollView style={globalStyles.profileContent}>
          <View style={globalStyles.sectionEnhanced}>
            <View style={globalStyles.profileAvatarContainer}>
              <View
                style={[
                  globalStyles.profileAvatar,
                  {
                    backgroundColor: "rgba(15, 23, 42, 0.8)", // Fundo escuro similar ao resto da aplicação
                    borderWidth: 2,
                    borderColor: colors.barber.gold, // Borda dourada
                  },
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={60}
                  color="#FFFFFF" // Ícone em branco para contrastar com o fundo escuro
                />
              </View>
              <Text
                style={[
                  globalStyles.userDatetime,
                  { marginTop: 10, color: colors.white },
                ]}
              >
                {user.email}
              </Text>
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Nome</Text>
              <TextInput
                style={globalStyles.formInput}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome completo"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Telefone</Text>
              <TextInput
                style={globalStyles.formInput}
                value={telefone}
                onChangeText={handlePhoneChange}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                maxLength={15}
              />
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Data de Nascimento</Text>
              <TextInput
                style={globalStyles.formInput}
                value={dataNascimento}
                onChangeText={handleDateChange}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Sexo</Text>
              <View style={[globalStyles.radioGroup, { marginBottom: 20 }]}>
                <TouchableOpacity
                  style={[
                    globalStyles.radioButton,
                    {
                      backgroundColor:
                        sexo === "Masculino"
                          ? colors.button.primary
                          : "rgba(30, 41, 59, 0.85)",
                      borderColor:
                        sexo === "Masculino"
                          ? colors.barber.gold
                          : "rgba(212, 175, 55, 0.3)",
                    },
                  ]}
                  onPress={() => setSexo("Masculino")}
                >
                  <Text
                    style={[
                      globalStyles.radioText,
                      {
                        color:
                          sexo === "Masculino"
                            ? colors.white
                            : colors.textLighter,
                      },
                    ]}
                  >
                    Masculino
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    globalStyles.radioButton,
                    {
                      backgroundColor:
                        sexo === "Feminino"
                          ? colors.button.primary
                          : "rgba(30, 41, 59, 0.85)",
                      borderColor:
                        sexo === "Feminino"
                          ? colors.barber.gold
                          : "rgba(212, 175, 55, 0.3)",
                    },
                  ]}
                  onPress={() => setSexo("Feminino")}
                >
                  <Text
                    style={[
                      globalStyles.radioText,
                      {
                        color:
                          sexo === "Feminino"
                            ? colors.white
                            : colors.textLighter,
                      },
                    ]}
                  >
                    Feminino
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                globalStyles.button,
                { backgroundColor: colors.barber.gold, marginTop: 10 },
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={[globalStyles.buttonText, { color: "#000" }]}>
                  SALVAR ALTERAÇÕES
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Profile;
