import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, globalStyles } from "../globalStyle/styles";
import { Agendamento } from "../../types/types";

interface LixeiraModalProps {
  visible: boolean;
  agendamentosExcluidos: Agendamento[];
  loadingLixeira: boolean;
  excluindoAgendamento: string | null;
  onClose: () => void;
  formatarData: (data: any) => string;
  onRestaurar: (agendamento: Agendamento) => void;
  onExcluirPermanente: (agendamento: Agendamento) => void;
}

const LixeiraModal: React.FC<LixeiraModalProps> = ({
  visible,
  agendamentosExcluidos,
  loadingLixeira,
  excluindoAgendamento,
  onClose,
  formatarData,
  onRestaurar,
  onExcluirPermanente,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={globalStyles.lixeiraModalCenteredView}>
        <View style={globalStyles.lixeiraModalView}>
          {/* Cabeçalho do Modal */}
          <View style={globalStyles.lixeiraModalHeader}>
            <Text style={globalStyles.lixeiraModalTitle}>
              <MaterialIcons name="delete" size={22} color="#F44336" />{" "}
              Agendamentos Excluídos
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={globalStyles.lixeiraCloseButton}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Conteúdo do Modal */}
          <View style={globalStyles.lixeiraModalContent}>
            {loadingLixeira ? (
              <View style={globalStyles.lixeiraLoadingContainer}>
                <ActivityIndicator size="large" color={colors.button.primary} />
                <Text style={globalStyles.lixeiraLoadingText}>
                  Carregando agendamentos excluídos...
                </Text>
              </View>
            ) : agendamentosExcluidos.length === 0 ? (
              <Text style={globalStyles.lixeiraEmptyText}>
                Não há agendamentos na lixeira.
              </Text>
            ) : (
              <ScrollView style={globalStyles.lixeiraScrollView}>
                {agendamentosExcluidos.map((agendamento) => (
                  <View
                    key={agendamento.id}
                    style={globalStyles.lixeiraItemLixeira}
                  >
                    {excluindoAgendamento === agendamento.id && (
                      <View style={globalStyles.lixeiraItemOverlay}>
                        <ActivityIndicator size="large" color="#F44336" />
                      </View>
                    )}
                    <View style={globalStyles.lixeiraItemHeader}>
                      <Text style={globalStyles.lixeiraItemNome}>
                        {agendamento.userName}
                      </Text>
                      <Text style={globalStyles.lixeiraItemData}>
                        {agendamento.data} às {agendamento.hora}
                      </Text>
                    </View>
                    <Text style={globalStyles.lixeiraItemServico}>
                      {agendamento.servico}
                    </Text>
                    {agendamento.observacao && (
                      <Text style={globalStyles.lixeiraItemObservacao}>
                        Obs: {agendamento.observacao}
                      </Text>
                    )}

                    <View style={globalStyles.lixeiraItemFooter}>
                      <Text style={globalStyles.lixeiraDataExclusao}>
                        Excluído em:{" "}
                        {formatarData(agendamento.data_exclusao || new Date())}
                      </Text>
                      <View style={globalStyles.lixeiraItemButtons}>
                        <TouchableOpacity
                          style={[
                            globalStyles.lixeiraItemButton,
                            globalStyles.lixeiraRestaurarButton,
                          ]}
                          onPress={() => onRestaurar(agendamento)}
                        >
                          <MaterialIcons
                            name="restore"
                            size={16}
                            color="#FFF"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            globalStyles.lixeiraItemButton,
                            globalStyles.lixeiraExcluirButton,
                          ]}
                          onPress={() => onExcluirPermanente(agendamento)}
                        >
                          <MaterialIcons
                            name="delete-forever"
                            size={16}
                            color="#FFF"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Rodapé do Modal */}
          <View style={globalStyles.lixeiraModalFooter}>
            <TouchableOpacity
              style={globalStyles.lixeiraFecharButton}
              onPress={onClose}
            >
              <Text style={globalStyles.lixeiraFecharButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LixeiraModal;
