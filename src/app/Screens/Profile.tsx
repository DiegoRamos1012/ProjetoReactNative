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

        {/* Botão Admin com estilo padronizado */}
        {isAdmin && (
          <TouchableOpacity
            onPress={() => navigation.navigate("AdminTools")}
            style={[
              globalStyles.backButton,
              { backgroundColor: colors.button.primary },
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

      {/* Formulário com cores padronizadas */}
      {loading ? (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={globalStyles.profileLoadingText}>
            Carregando dados...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={[
            globalStyles.profileContent,
            { backgroundColor: colors.gradient.middle },
          ]}
        >
          <View style={globalStyles.profileAvatarContainer}>
            <View style={globalStyles.profileAvatar}>
              <MaterialIcons name="person" size={60} color="#FFF" />
            </View>
            <Text style={globalStyles.userEmail}>{user.email}</Text>
          </View>

          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.formLabel}>Nome</Text>
            <TextInput
              style={globalStyles.formInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10} // To account for the format DD/MM/YYYY
            />
          </View>

          <View style={globalStyles.formGroup}>
            <Text style={globalStyles.formLabel}>Sexo</Text>
            <View style={globalStyles.radioGroup}>
              <TouchableOpacity
                style={[
                  globalStyles.radioButton,
                  sexo === "Masculino" && globalStyles.radioSelected,
                ]}
                onPress={() => setSexo("Masculino")}
              >
                <Text
                  style={[
                    globalStyles.radioText,
                    sexo === "Masculino" && globalStyles.radioTextSelected,
                  ]}
                >
                  Masculino
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  globalStyles.radioButton,
                  sexo === "Feminino" && globalStyles.radioSelected,
                ]}
                onPress={() => setSexo("Feminino")}
              >
                <Text
                  style={[
                    globalStyles.radioText,
                    sexo === "Feminino" && globalStyles.radioTextSelected,
                  ]}
                >
                  Feminino
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              globalStyles.agendarButton,
              { backgroundColor: colors.button.primary },
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text
              style={[
                globalStyles.agendarButtonText,
                { color: colors.primary },
              ]}
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default Profile;
