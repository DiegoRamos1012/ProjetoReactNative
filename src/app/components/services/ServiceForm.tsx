import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Servico } from "../../types/types";
import { colors } from "../globalStyle/styles"; // também importamos globalStyles se necessário
import TimeSlotManager from "./TimeSlotManager";
import globalStyles from "../globalStyle/styles";

// Define horarios padrão para serviços
const horariosDisponiveis = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

interface ServiceFormProps {
  service: Servico | null;
  onSave: (service: Servico) => void;
  onCancel: () => void;
}

const availableIcons = [
  "content-cut",
  "face",
  "spa",
  "style",
  "brush",
  "local-laundry-service",
  "local-bar",
  "local-cafe",
  "coffee",
  "free-breakfast",
  "emoji-emotions",
];

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSave,
  onCancel,
}) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoInput, setPrecoInput] = useState("");
  const [tempo, setTempo] = useState("");
  const [iconName, setIconName] = useState("content-cut");
  const [selectedHorarios, setSelectedHorarios] = useState<string[]>([]);
  const [customHorario, setCustomHorario] = useState("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    if (service) {
      setNome(service.nome);
      setDescricao(service.descricao || "");
      // Convert number to string for display in the input
      setPrecoInput(`R$ ${String(service.preco).replace(".", ",")}`);
      setTempo(service.tempo);
      setIconName(service.iconName);
      setSelectedHorarios(service.horarios || []);
      setObservacao(service.observacao || "");
    } else {
      setNome("");
      setDescricao("");
      setPrecoInput("R$ ");
      setTempo("");
      setIconName("content-cut");
      setSelectedHorarios([]);
      setObservacao("");
    }
  }, [service]);

  const handleSave = () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome do serviço é obrigatório");
      return;
    }
    if (!precoInput.trim() || precoInput === "R$ ") {
      Alert.alert("Erro", "O preço do serviço é obrigatório");
      return;
    }
    if (!tempo.trim()) {
      Alert.alert("Erro", "O tempo de duração é obrigatório");
      return;
    }

    // Convert price string to number for saving
    let precoNumerico: number;
    try {
      // Remove currency symbol and convert comma to dot
      const precoLimpo = precoInput.replace("R$ ", "").replace(",", ".");
      precoNumerico = parseFloat(precoLimpo);

      if (isNaN(precoNumerico)) {
        Alert.alert("Erro", "Formato de preço inválido");
        return;
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao processar o preço");
      return;
    }

    const updatedService: Servico = {
      id: service?.id || "",
      nome,
      descricao,
      preco: precoNumerico,
      tempo,
      iconName,
      horarios: selectedHorarios,
      observacao,
      ordem: 0,
    };
    onSave(updatedService);
  };

  const handleAddCustomHorario = () => {
    const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    if (!horarioRegex.test(customHorario)) {
      Alert.alert("Formato Inválido", "Use o formato HH:MM (ex: 14:30)");
      return;
    }

    if (selectedHorarios.includes(customHorario)) {
      Alert.alert("Horário Duplicado", "Este horário já está na lista");
      return;
    }

    setSelectedHorarios([...selectedHorarios, customHorario]);
    setCustomHorario("");
  };

  return (
    <View style={globalStyles.servicosContainer}>
      <Text style={globalStyles.serviceFormTitle}>
        {service ? "Editar Serviço" : "Novo Serviço"}
      </Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={globalStyles.serviceFormGroup}>
          <Text style={globalStyles.serviceFormLabel}>Nome do Serviço*</Text>
          <TextInput
            style={globalStyles.serviceFormInput}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Corte de Cabelo"
          />
        </View>

        <View style={globalStyles.serviceFormGroup}>
          <Text style={globalStyles.serviceFormLabel}>Descrição</Text>
          <TextInput
            style={[
              globalStyles.serviceFormInput,
              globalStyles.serviceFormTextArea,
            ]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o serviço"
            multiline
            numberOfLines={3}
          />
        </View>
        <View style={globalStyles.serviceFormGroup}>
          <Text style={globalStyles.serviceFormLabel}>Preço*</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Text
              style={{
                position: "absolute",
                left: 12,
                fontSize: 16,
                color: colors.barber.gold,
                fontWeight: "500",
                zIndex: 1,
              }}
            >
              R$
            </Text>
            <TextInput
              style={[globalStyles.serviceFormInput, { paddingLeft: 44 }]}
              value={precoInput.replace("R$ ", "")}
              onChangeText={(text) => setPrecoInput(`R$ ${text}`)}
              placeholder="0,00"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        <View style={globalStyles.serviceFormGroup}>
          <Text style={globalStyles.serviceFormLabel}>Duração*</Text>
          <TextInput
            style={globalStyles.serviceFormInput}
            value={tempo}
            onChangeText={setTempo}
            placeholder="Ex: 30 min"
          />
        </View>

        <View style={globalStyles.serviceFormGroup}>
          <Text style={globalStyles.serviceFormLabel}>Observação</Text>
          <TextInput
            style={[
              globalStyles.serviceFormInput,
              globalStyles.serviceFormTextArea,
            ]}
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Observação para o cliente"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={globalStyles.serviceFormGroup}>
          <Text style={globalStyles.serviceFormLabel}>Ícone</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={globalStyles.iconSelector}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {availableIcons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  globalStyles.iconButtonServices,
                  iconName === icon && globalStyles.selectedIconButtonServices,
                ]}
                onPress={() => setIconName(icon)}
              >
                <MaterialIcons
                  name={icon as any}
                  size={28}
                  color={iconName === icon ? "white" : colors.secondary}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TimeSlotManager
          selectedHorarios={selectedHorarios}
          setSelectedHorarios={setSelectedHorarios}
          customHorario={customHorario}
          setCustomHorario={setCustomHorario}
          onAddCustomHorario={handleAddCustomHorario}
          predefinedHorarios={horariosDisponiveis}
        />

        <View
          style={[globalStyles.serviceFormButtonContainer, { marginTop: 30 }]}
        >
          <TouchableOpacity
            style={globalStyles.serviceFormCancelButton}
            onPress={onCancel}
          >
            <Text style={globalStyles.serviceFormCancelButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.serviceFormSaveButton}
            onPress={handleSave}
          >
            <Text style={globalStyles.serviceFormSaveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ServiceForm;
