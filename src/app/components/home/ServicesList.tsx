import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Servico } from "../../types";
import globalStyles from "../globalStyle/styles";

interface ServicesListProps {
  servicos: Servico[];
  onServicoPress: (servico: Servico) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  servicos,
  onServicoPress,
}) => {
  return (
    <View style={globalStyles.section}>
      <Text style={globalStyles.sectionTitle}>Nossos Serviços</Text>
      <Text style={globalStyles.sectionSubtitle}>
        Selecione um serviço para agendar
      </Text>

      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.servicoCard}
            onPress={() => onServicoPress(item)}
          >
            <View style={globalStyles.servicoIconContainer}>
              <MaterialIcons
                name={item.iconName as any}
                size={40}
                color="#2A4A73"
              />
            </View>
            <Text style={globalStyles.servicoNome}>{item.nome}</Text>
            <Text style={globalStyles.servicoPreco}>{item.preco}</Text>
            <Text style={globalStyles.servicoTempo}>{item.tempo}</Text>
          </TouchableOpacity>
        )}
        style={globalStyles.servicosList}
      />
    </View>
  );
};

export default ServicesList;
