import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles, { colors } from "../globalStyle/styles";

interface TimeSlotManagerProps {
  selectedHorarios: string[];
  setSelectedHorarios: React.Dispatch<React.SetStateAction<string[]>>;
  customHorario: string;
  setCustomHorario: React.Dispatch<React.SetStateAction<string>>;
  onAddCustomHorario: () => void;
  predefinedHorarios: string[];
}

const TimeSlotManager: React.FC<TimeSlotManagerProps> = ({
  selectedHorarios,
  setSelectedHorarios,
  customHorario,
  setCustomHorario,
  onAddCustomHorario,
  predefinedHorarios,
}) => {
  const toggleHorario = (horario: string) => {
    if (selectedHorarios.includes(horario)) {
      setSelectedHorarios(selectedHorarios.filter((h) => h !== horario));
    } else {
      setSelectedHorarios([...selectedHorarios, horario]);
    }
  };

  const removeHorario = (horario: string) => {
    setSelectedHorarios(selectedHorarios.filter((h) => h !== horario));
  };

  return (
    <View style={globalStyles.timeSlotContainer}>
      <Text style={globalStyles.timeSlotTitle}>Horários Disponíveis</Text>
      <Text style={globalStyles.timeSlotSubtitle}>
        Selecione os horários disponíveis:
      </Text>
      <View style={globalStyles.timeSlotPredefinedContainer}>
        {predefinedHorarios.map((horario) => (
          <TouchableOpacity
            key={horario}
            style={[
              globalStyles.timeSlotButton,
              selectedHorarios.includes(horario) &&
                globalStyles.timeSlotButtonSelected,
            ]}
            onPress={() => toggleHorario(horario)}
          >
            <Text
              style={[
                globalStyles.timeSlotText,
                selectedHorarios.includes(horario) &&
                  globalStyles.timeSlotTextSelected,
              ]}
            >
              {horario}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={globalStyles.timeSlotCustomContainer}>
        <Text style={globalStyles.timeSlotSubtitle}>
          Adicionar horário personalizado:
        </Text>
        <View style={globalStyles.timeSlotAddContainer}>
          <TextInput
            style={globalStyles.timeSlotCustomInput}
            value={customHorario}
            onChangeText={setCustomHorario}
            placeholder="00:00"
            keyboardType="numbers-and-punctuation"
          />
          <TouchableOpacity
            style={globalStyles.timeSlotAddButton}
            onPress={onAddCustomHorario}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {selectedHorarios.length > 0 && (
        <View style={globalStyles.timeSlotSelectedContainer}>
          <Text style={globalStyles.timeSlotSubtitle}>
            Horários selecionados:
          </Text>
          <View style={globalStyles.timeSlotChipContainer}>
            {selectedHorarios.sort().map((horario) => (
              <View key={horario} style={globalStyles.timeSlotChip}>
                <Text style={globalStyles.timeSlotChipText}>{horario}</Text>
                <TouchableOpacity onPress={() => removeHorario(horario)}>
                  <MaterialIcons
                    name="close"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default TimeSlotManager;
