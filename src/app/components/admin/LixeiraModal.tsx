import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../globalStyle/styles";
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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Cabeçalho do Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              <MaterialIcons name="delete" size={22} color="#F44336" />{" "}
              Agendamentos Excluídos
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Conteúdo do Modal */}
          <View style={styles.modalContent}>
            {loadingLixeira ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.button.primary} />
                <Text style={styles.loadingText}>
                  Carregando agendamentos excluídos...
                </Text>
              </View>
            ) : agendamentosExcluidos.length === 0 ? (
              <Text style={styles.emptyText}>
                Não há agendamentos na lixeira.
              </Text>
            ) : (
              <ScrollView style={styles.scrollView}>
                {agendamentosExcluidos.map((agendamento) => (
                  <View key={agendamento.id} style={styles.itemLixeira}>
                    {excluindoAgendamento === agendamento.id && (
                      <View style={styles.itemOverlay}>
                        <ActivityIndicator size="large" color="#F44336" />
                      </View>
                    )}
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemNome}>
                        {agendamento.userName}
                      </Text>
                      <Text style={styles.itemData}>
                        {agendamento.data} às {agendamento.hora}
                      </Text>
                    </View>
                    <Text style={styles.itemServico}>
                      {agendamento.servico}
                    </Text>
                    {agendamento.observacao && (
                      <Text style={styles.itemObservacao}>
                        Obs: {agendamento.observacao}
                      </Text>
                    )}

                    <View style={styles.itemFooter}>
                      <Text style={styles.dataExclusao}>
                        Excluído em:{" "}
                        {formatarData(agendamento.data_exclusao || new Date())}
                      </Text>
                      <View style={styles.itemButtons}>
                        <TouchableOpacity
                          style={[styles.itemButton, styles.restaurarButton]}
                          onPress={() => onRestaurar(agendamento)}
                        >
                          <MaterialIcons
                            name="restore"
                            size={16}
                            color="#FFF"
                          />
                          <Text style={styles.itemButtonText}>Restaurar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.itemButton, styles.excluirButton]}
                          onPress={() => onExcluirPermanente(agendamento)}
                        >
                          <MaterialIcons
                            name="delete-forever"
                            size={16}
                            color="#FFF"
                          />
                          <Text style={styles.itemButtonText}>
                            Excluir permanente
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Rodapé do Modal */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.fecharButton} onPress={onClose}>
              <Text style={styles.fecharButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 15,
    maxHeight: 500,
  },
  scrollView: {
    maxHeight: 450,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.textLight,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: colors.textLight,
  },
  itemLixeira: {
    backgroundColor: "rgba(25, 33, 52, 0.7)",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    position: "relative",
  },
  itemOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  itemData: {
    fontSize: 14,
    color: colors.textLighter,
  },
  itemServico: {
    fontSize: 15,
    color: colors.barber.gold,
    marginBottom: 5,
  },
  itemObservacao: {
    fontSize: 14,
    color: colors.textLighter,
    fontStyle: "italic",
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 8,
    borderRadius: 5,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  dataExclusao: {
    fontSize: 12,
    color: colors.textLight,
  },
  itemButtons: {
    flexDirection: "row",
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 8,
  },
  restaurarButton: {
    backgroundColor: "#4CAF50", // Verde
  },
  excluirButton: {
    backgroundColor: "#F44336", // Vermelho
  },
  itemButtonText: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 5,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  fecharButton: {
    backgroundColor: colors.button.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fecharButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default LixeiraModal;
