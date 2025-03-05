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
import { ProfileProps } from "../types";
import globalStyles, { colors } from "../components/globalStyle/styles";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { formatPhoneNumber, formatBirthDate } from "../format";

const Profile: React.FC<ProfileProps> = ({ navigation, user }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState(user.displayName || "");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");

  // Buscar dados do usuário no Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user.uid) return;

      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setTelefone(userData.telefone || "");
          setDataNascimento(userData.dataNascimento || "");
          setSexo(userData.sexo || "");
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
    <View style={globalStyles.homeContainer}>
      <View style={globalStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={globalStyles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[globalStyles.bannerTitle, { marginBottom: 0 }]}>
          Meu Perfil
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={globalStyles.profileLoadingText}>
            Carregando dados...
          </Text>
        </View>
      ) : (
        <ScrollView style={globalStyles.profileContent}>
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
                  sexo === "M" && globalStyles.radioSelected,
                ]}
                onPress={() => setSexo("M")}
              >
                <Text
                  style={[
                    globalStyles.radioText,
                    sexo === "M" && globalStyles.radioTextSelected,
                  ]}
                >
                  Masculino
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  globalStyles.radioButton,
                  sexo === "F" && globalStyles.radioSelected,
                ]}
                onPress={() => setSexo("F")}
              >
                <Text
                  style={[
                    globalStyles.radioText,
                    sexo === "F" && globalStyles.radioTextSelected,
                  ]}
                >
                  Feminino
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={globalStyles.agendarButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={globalStyles.agendarButtonText}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default Profile;
