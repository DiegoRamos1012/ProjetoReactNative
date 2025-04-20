import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Servico } from "../../types/types";
import { formatCurrencyBRL } from "../../format";
import globalStyles, { colors } from "../globalStyle/styles";

interface ServicesListProps {
  servicos: Servico[];
  onServicoPress: (servico: Servico) => void;
  loading?: boolean;
}

const ServicesList: React.FC<ServicesListProps> = ({
  servicos,
  onServicoPress,
  loading = false,
}) => {
  // Renderiza um indicador de carregamento enquanto os serviços estão sendo carregados
  if (loading) {
    return (
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Nossos Serviços</Text>
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={{ marginTop: 10, color: colors.textLight }}>
            Carregando serviços...
          </Text>
        </View>
      </View>
    );
  }

  // Se não houver serviços disponíveis
  if (!servicos || servicos.length === 0) {
    return (
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Nossos Serviços</Text>
        <Text style={globalStyles.emptyText}>
          Nenhum serviço encontrado. Entre em contato para mais informações.
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.section}>
      <Text style={globalStyles.sectionTitle}>Nossos Serviços</Text>
      <Text style={globalStyles.sectionSubtitle}>
        Selecione um serviço para agendar
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={globalStyles.servicosList}
      >
        {servicos.map((servico) => (
          <TouchableOpacity
            key={servico.id}
            style={globalStyles.servicoCard}
            onPress={() => onServicoPress(servico)}
          >
            <View style={globalStyles.servicoIconContainer}>
              <MaterialIcons
                name={(servico.iconName || "content-cut") as any}
                size={32}
                color="#2A4A73"
              />
            </View>
            <Text style={globalStyles.servicoNome}>{servico.nome}</Text>
            <Text style={globalStyles.servicoPreco}>
              {typeof servico.preco === "number"
                ? formatCurrencyBRL(servico.preco)
                : servico.preco}
            </Text>
            <Text style={globalStyles.servicoTempo}>{servico.tempo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ServicesList;
