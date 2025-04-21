import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Servico } from "../../types/types";
// Fix incorrect import path for globalStyles
import globalStyles, { colors } from "../globalStyle/styles";
import { MaterialIcons } from "@expo/vector-icons";
import {
  formatCurrencyBRL,
  parseCurrencyValue,
  formatCompactCurrency,
} from "../../format";

// Ícones disponíveis para serviços
const ICONES_DISPONIVEIS = [
  { nome: "Tesoura", value: "content-cut" },
  { nome: "Barba", value: "face" },
  { nome: "Combo", value: "spa" },
  { nome: "Cabelo", value: "brush" },
  { nome: "Lavagem", value: "opacity" },
  { nome: "Massagem", value: "pan-tool" },
  { nome: "Tratamento", value: "healing" },
  { nome: "Coloração", value: "color-lens" },
];

// Horários padrão para seleção
const HORARIOS_PADRAO = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

interface ServicosHorariosProps {
  isAdmin: boolean;
}

const ServicosHorarios: React.FC<ServicosHorariosProps> = ({ isAdmin }) => {
  // Estados para gerenciamento de serviços
  const [servicosModalVisible, setServicosModalVisible] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loadingServicos, setLoadingServicos] = useState(false);

  // Estados para edição de serviço
  const [servicoAtual, setServicoAtual] = useState<Servico>({
    id: "",
    nome: "",
    descricao: "",
    preco: 0, // Iniciar como number e não como string
    tempo: "",
    iconName: "content-cut",
    observacao: "",
    horarios: [],
  });

  // Estado para controlar horários selecionados
  const [horariosSelected, setHorariosSelected] = useState<{
    [key: string]: boolean;
  }>({});
  const [horarioPersonalizado, setHorarioPersonalizado] = useState("");
  const [editandoServico, setEditandoServico] = useState(false);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    setLoadingServicos(true);
    try {
      const servicosRef = collection(db, "servicos");
      const servicosSnapshot = await getDocs(servicosRef);

      const servicosList: Servico[] = [];
      servicosSnapshot.forEach((doc) => {
        servicosList.push({
          id: doc.id,
          ...doc.data(),
        } as Servico);
      });

      setServicos(servicosList);
    } catch (error: any) {
      console.error("Erro ao buscar serviços:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar a lista de serviços: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setLoadingServicos(false);
    }
  };

  // Função para iniciar a adição de um novo serviço
  const handleAddServico = () => {
    setServicoAtual({
      id: "",
      nome: "",
      descricao: "",
      preco: 0, // Iniciar como number e não como string
      tempo: "",
      iconName: "content-cut",
      observacao: "",
      horarios: [],
    });

    // Reset horários selecionados
    const initialSelected: { [key: string]: boolean } = {};
    HORARIOS_PADRAO.forEach((h) => (initialSelected[h] = false));
    setHorariosSelected(initialSelected);

    setEditandoServico(false);
    setServicosModalVisible(true);
  };

  // Função para iniciar a edição de um serviço existente
  const handleEditServico = (servico: Servico) => {
    setServicoAtual({ ...servico });

    // Configure os horários selecionados
    const selectedHorarios: { [key: string]: boolean } = {};
    HORARIOS_PADRAO.forEach((h) => {
      selectedHorarios[h] = servico.horarios?.includes(h) || false;
    });
    setHorariosSelected(selectedHorarios);

    setEditandoServico(true);
    setServicosModalVisible(true);
  };

  // Função para salvar um serviço (novo ou editado)
  const salvarServico = async () => {
    if (!servicoAtual.nome || !servicoAtual.preco || !servicoAtual.tempo) {
      Alert.alert(
        "Campos obrigatórios",
        "Nome, preço e tempo são obrigatórios"
      );
      return;
    }

    // Coletar horários selecionados
    const horariosAtivos = Object.entries(horariosSelected)
      .filter(([_, isSelected]) => isSelected)
      .map(([horario]) => horario);

    try {
      setLoadingServicos(true);

      const servicoData = {
        ...servicoAtual,
        horarios: horariosAtivos,
        // Remover a propriedade horariosPersonalizados
        // ou definir explicitamente como false
        horariosPersonalizados: false,
      };

      if (editandoServico && servicoAtual.id) {
        // Atualizar serviço existente
        await updateDoc(doc(db, "servicos", servicoAtual.id), servicoData);
        Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
      } else {
        // Criar novo serviço
        const docRef = await addDoc(collection(db, "servicos"), servicoData);
        // Atualizar o ID após criar
        await updateDoc(doc(db, "servicos", docRef.id), { id: docRef.id });
        Alert.alert("Sucesso", "Novo serviço criado com sucesso!");
      }

      // Atualizar a lista de serviços
      fetchServicos();
      setServicosModalVisible(false);
    } catch (error: any) {
      console.error("Erro ao salvar serviço:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o serviço: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setLoadingServicos(false);
    }
  };

  // Função para excluir um serviço
  const handleDeleteServico = (servico: Servico) => {
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir o serviço "${servico.nome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoadingServicos(true);
              await deleteDoc(doc(db, "servicos", servico.id));
              Alert.alert("Sucesso", "Serviço excluído com sucesso!");
              fetchServicos();
            } catch (error: any) {
              console.error("Erro ao excluir serviço:", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir o serviço: " +
                  (error.message || "Erro desconhecido")
              );
            } finally {
              setLoadingServicos(false);
            }
          },
        },
      ]
    );
  };

  // Função para adicionar um horário personalizado
  const adicionarHorarioPersonalizado = () => {
    if (!horarioPersonalizado) return;

    // Validar formato do horário (HH:MM)
    const horarioRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horarioRegex.test(horarioPersonalizado)) {
      Alert.alert("Formato inválido", "Use o formato HH:MM (ex: 14:30)");
      return;
    }

    setHorariosSelected({
      ...horariosSelected,
      [horarioPersonalizado]: true,
    });

    setHorarioPersonalizado("");
  };

  // Função para alternar a seleção de um horário
  const toggleHorario = (horario: string) => {
    setHorariosSelected({
      ...horariosSelected,
      [horario]: !horariosSelected[horario],
    });
  };

  // Componente para renderizar serviços na lista
  const renderServicoItem = ({ item }: { item: Servico }) => (
    <View style={globalStyles.servicoListItem}>
      <View style={globalStyles.servicoInfo}>
        <View style={globalStyles.servicoIconContainerSmall}>
          <MaterialIcons
            name={item.iconName as any}
            size={24}
            color={colors.secondary}
          />
        </View>
        <View style={globalStyles.servicoTextContainer}>
          <Text style={globalStyles.servicoNomeItem}>{item.nome}</Text>
          {/* Exibir preço formatado */}
          <Text style={globalStyles.servicoPrecoItem}>
            {formatCurrencyBRL(item.preco)}
          </Text>
          <Text style={globalStyles.servicoTempoItem}>{item.tempo}</Text>
        </View>
      </View>
      <View style={globalStyles.servicoActions}>
        <TouchableOpacity
          style={globalStyles.editButton}
          onPress={() => handleEditServico(item)}
        >
          <MaterialIcons name="edit" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={globalStyles.deleteButton}
          onPress={() => handleDeleteServico(item)}
        >
          <MaterialIcons name="delete" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // O modal para criar/editar serviços
  const renderServicosModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={servicosModalVisible}
      onRequestClose={() => setServicosModalVisible(false)}
    >
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.servicoModalView}>
          <TouchableOpacity
            style={globalStyles.closeButton}
            onPress={() => setServicosModalVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <ScrollView>
            <Text style={globalStyles.servicoModalTitle}>
              {editandoServico ? "Editar Serviço" : "Novo Serviço"}
            </Text>

            {/* Nome do serviço */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Nome do serviço *</Text>
              <TextInput
                style={globalStyles.formInput}
                value={servicoAtual.nome}
                onChangeText={(text) =>
                  setServicoAtual({ ...servicoAtual, nome: text })
                }
                placeholder="Ex: Corte de Cabelo"
              />
            </View>

            {/* Descrição */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Descrição</Text>
              <TextInput
                style={[globalStyles.formInput, { textAlignVertical: "top" }]}
                value={servicoAtual.descricao}
                onChangeText={(text) =>
                  setServicoAtual({ ...servicoAtual, descricao: text })
                }
                placeholder="Descreva o serviço"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Preço e Tempo (lado a lado) */}
            <View style={globalStyles.formRow}>
              <View
                style={[globalStyles.formGroup, { flex: 1, marginRight: 10 }]}
              >
                <Text style={globalStyles.formLabel}>Preço *</Text>
                <View style={globalStyles.priceInputContainer}>
                  <TextInput
                    style={[
                      globalStyles.formInput,
                      { paddingRight: 45 }, // Adiciona espaço para o ícone
                    ]}
                    value={
                      servicoAtual.preco > 0
                        ? formatCurrencyBRL(servicoAtual.preco, {
                            showCurrency: true,
                            decimals: 2,
                          })
                        : ""
                    }
                    onChangeText={(text) => {
                      // Usa a função aprimorada de parsing
                      const numericValue = parseCurrencyValue(text);

                      // Atualizar o estado com o valor numérico
                      setServicoAtual({ ...servicoAtual, preco: numericValue });
                    }}
                    placeholder="R$ 0,00"
                    keyboardType="numeric"
                  />
                  {servicoAtual.preco > 0 && (
                    <TouchableOpacity
                      style={globalStyles.priceClearButton}
                      onPress={() =>
                        setServicoAtual({ ...servicoAtual, preco: 0 })
                      }
                    >
                      <MaterialIcons
                        name="close"
                        size={16}
                        color={colors.textLight}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {servicoAtual.preco > 1000 && (
                  <Text style={globalStyles.priceHint}>
                    {formatCompactCurrency(servicoAtual.preco)}
                  </Text>
                )}
              </View>
              <View style={[globalStyles.formGroup, { flex: 1 }]}>
                <Text style={globalStyles.formLabel}>Tempo *</Text>
                <TextInput
                  style={globalStyles.formInput}
                  value={servicoAtual.tempo}
                  onChangeText={(text) =>
                    setServicoAtual({ ...servicoAtual, tempo: text })
                  }
                  placeholder="Ex: 30 minutos"
                />
              </View>
            </View>

            {/* Seleção de ícone */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Ícone</Text>
              <ScrollView horizontal style={globalStyles.iconSelector}>
                {ICONES_DISPONIVEIS.map((icone) => (
                  <TouchableOpacity
                    key={icone.value}
                    style={[
                      globalStyles.iconOption,
                      servicoAtual.iconName === icone.value &&
                        globalStyles.iconSelected,
                    ]}
                    onPress={() =>
                      setServicoAtual({
                        ...servicoAtual,
                        iconName: icone.value,
                      })
                    }
                  >
                    <MaterialIcons
                      name={icone.value as any}
                      size={26}
                      color={
                        servicoAtual.iconName === icone.value ? "#fff" : "#333"
                      }
                    />
                    <Text
                      style={[
                        globalStyles.iconText,
                        servicoAtual.iconName === icone.value &&
                          globalStyles.iconTextSelected,
                      ]}
                    >
                      {icone.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Horários disponíveis */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Horários disponíveis</Text>
              <View style={globalStyles.horariosGrid}>
                {HORARIOS_PADRAO.map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[
                      globalStyles.horarioOption,
                      horariosSelected[horario] && globalStyles.horarioSelected,
                    ]}
                    onPress={() => toggleHorario(horario)}
                  >
                    <Text
                      style={[
                        globalStyles.horarioText,
                        horariosSelected[horario] &&
                          globalStyles.horarioTextSelected,
                      ]}
                    >
                      {horario}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Horário personalizado - mantido para administradores adicionarem */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>
                Adicionar horário específico
              </Text>
              <View style={globalStyles.horarioPersonalizadoContainer}>
                <TextInput
                  style={[globalStyles.formInput, { flex: 1, marginRight: 10 }]}
                  value={horarioPersonalizado}
                  onChangeText={setHorarioPersonalizado}
                  placeholder="HH:MM (Ex: 14:30)"
                  keyboardType="numbers-and-punctuation"
                />
                <TouchableOpacity
                  style={globalStyles.addHorarioButton}
                  onPress={adicionarHorarioPersonalizado}
                >
                  <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remover completamente a seção de Horários personalizados */}
            {/* Botões de ação */}
            <View style={globalStyles.buttonContainer}>
              <TouchableOpacity
                style={globalStyles.cancelButton}
                onPress={() => setServicosModalVisible(false)}
              >
                <Text style={globalStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.saveButton}
                onPress={salvarServico}
              >
                <Text style={globalStyles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={globalStyles.servicosHorariosContainer}>
      <View style={globalStyles.servicosContainer}>
        {/* Botão de adicionar novo serviço */}
        <TouchableOpacity
          style={globalStyles.addServicoButton}
          onPress={handleAddServico}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={globalStyles.addServicoButtonText}>
            Adicionar novo serviço
          </Text>
        </TouchableOpacity>

        {/* Lista de serviços */}
        {loadingServicos ? (
          <ActivityIndicator
            size="large"
            color={colors.secondary}
            style={globalStyles.loadingIndicator}
          />
        ) : (
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            {servicos.length === 0 ? (
              <Text style={globalStyles.emptyListText}>
                Nenhum serviço cadastrado
              </Text>
            ) : (
              <View style={globalStyles.servicosListContainer}>
                {servicos.map((item) => (
                  <React.Fragment key={item.id}>
                    {renderServicoItem({ item })}
                  </React.Fragment>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {renderServicosModal()}
    </View>
  );
};

export default ServicosHorarios;
