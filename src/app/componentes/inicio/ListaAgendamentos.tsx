import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Agendamento } from "../../tipos";
import globalStyles from "../../components/globalStyle/styles";

interface ListaAgendamentosProps {
  agendamentos: Agendamento[];
  carregando: boolean;
  atualizando: boolean;
  mensagemErro: string | null;
}

const ListaAgendamentos: React.FC<ListaAgendamentosProps> = ({
  agendamentos,
  carregando,
  atualizando,
  mensagemErro,
}) => {
  const renderizarConteudo = () => {
    if (carregando && !atualizando) {
      return (
        <Text style={globalStyles.emptyText}>Carregando agendamentos...</Text>
      );
    }

    if (mensagemErro && agendamentos.length === 0) {
      return (
        <Text style={[globalStyles.emptyText, { color: "red" }]}>
          {mensagemErro}
        </Text>
      );
    }

    if (agendamentos.length === 0) {
      return (
        <Text style={globalStyles.emptyText}>
          Você ainda não tem agendamentos.
        </Text>
      );
    }

    return agendamentos.map((agendamento) => (
      <View key={agendamento.id} style={globalStyles.agendamentoItem}>
        <View style={globalStyles.agendamentoInfo}>
          <Text style={globalStyles.agendamentoServico}>
            {agendamento.servico}
          </Text>
          <Text style={globalStyles.agendamentoData}>
            {agendamento.data} às {agendamento.hora}
          </Text>
          <Text style={globalStyles.agendamentoBarbeiro}>
            Barbeiro: {agendamento.barbeiro || "Não definido"}
          </Text>
        </View>
        <MaterialIcons name="event" size={24} color="#333" />
      </View>
    ));
  };

  return (
    <View style={globalStyles.section}>
      <Text style={globalStyles.sectionTitle}>Seus Agendamentos</Text>
      {atualizando && (
        <Text style={[globalStyles.emptyText, { marginBottom: 10 }]}>
          Atualizando agendamentos...
        </Text>
      )}
      {renderizarConteudo()}
    </View>
  );
};

export default ListaAgendamentos;
