import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  FlatList,
  Vibration,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Servico } from "../../types/types";
import globalStyles, { colors } from "../globalStyle/styles";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import {
  formatCurrencyBRL,
  parseCurrencyValue,
  formatCompactCurrency,
} from "../../format";

// Ícones disponíveis para serviços
const ICONES_DISPONIVEIS = [
  { nome: "Corte", value: "content-cut", tipo: "material" },
  { nome: "Barba", value: "face", tipo: "material" },
  { nome: "Corte + Barba", value: "face-retouching-natural", tipo: "material" },
  { nome: "Pezinho", value: "footprint", tipo: "material-community" },
  { nome: "Alisamento", value: "invert-colors", tipo: "material" },
  { nome: "Luzes", value: "highlight", tipo: "material" },
  { nome: "Corte + Luzes", value: "style", tipo: "material" },
  { nome: "Platinado", value: "palette", tipo: "material" },
  { nome: "Corte + Plat", value: "color-lens", tipo: "material" },
  { nome: "Men Corte", value: "person", tipo: "material" },
  { nome: "Men Crt + Brb", value: "person-outline", tipo: "material" },
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
    ordem: 0, // Adicionado para manter a ordem
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
  // Estado para o modal de confirmação de exclusão de horário
  const [deleteHorarioModalVisible, setDeleteHorarioModalVisible] =
    useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState("");
  const [catalogoHorarios, setCatalogoHorarios] = useState<string[]>([
    ...HORARIOS_PADRAO,
  ]);

  // Estado para reordenação mais simples
  const [isReordering, setIsReordering] = useState(false);
  const [servicosOrdenados, setServicosOrdenados] = useState<Servico[]>([]);

  // Ref para o flatlist
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchServicos();
    carregarCatalogoHorarios();
  }, []);

  // Atualiza a lista ordenada de serviços quando os serviços são carregados
  useEffect(() => {
    if (servicos.length > 0) {
      setServicosOrdenados([...servicos]);
    }
  }, [servicos]);

  // Função para carregar o catálogo completo de horários, incluindo os personalizados
  const carregarCatalogoHorarios = async () => {
    try {
      // Inicializa com os horários padrão
      let todosHorarios = [...HORARIOS_PADRAO];

      // Busca todos os serviços para extrair horários personalizados
      const servicosRef = collection(db, "servicos");
      const servicosSnapshot = await getDocs(servicosRef);

      servicosSnapshot.forEach((doc) => {
        const servico = doc.data() as Servico;
        if (servico.horarios) {
          // Adiciona horários personalizados que não estão nos padrões
          servico.horarios.forEach((horario) => {
            if (!todosHorarios.includes(horario)) {
              todosHorarios.push(horario);
            }
          });
        }
      });

      // Ordena os horários para melhor visualização
      todosHorarios.sort();
      setCatalogoHorarios(todosHorarios);
    } catch (error) {
      console.error("Erro ao carregar catálogo de horários:", error);
    }
  };

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
          ordem: doc.data().ordem || 999, // Default order if not set
        } as Servico);
      });

      // Ordena os serviços pela ordem
      const ordenados = servicosList.sort(
        (a, b) => (a.ordem || 999) - (b.ordem || 999)
      );

      setServicos(ordenados);
      setServicosOrdenados(ordenados);
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
      ordem: servicos.length,
      nome: "",
      descricao: "",
      preco: 0, // Iniciar como number e não como string
      tempo: "",
      iconName: "content-cut",
      observacao: "",
      horarios: [],
    });

    // Reset horários selecionados - Agora usando o catálogo completo
    const initialSelected: { [key: string]: boolean } = {};
    catalogoHorarios.forEach((h) => (initialSelected[h] = false));
    setHorariosSelected(initialSelected);

    setEditandoServico(false);
    setServicosModalVisible(true);
  };

  // Função para iniciar a edição de um serviço existente
  const handleEditServico = (servico: Servico) => {
    setServicoAtual({ ...servico });

    // Configure os horários selecionados - Agora usando o catálogo completo
    const selectedHorarios: { [key: string]: boolean } = {};
    catalogoHorarios.forEach((h) => {
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

      // Recarregar o catálogo de horários para incluir novos personalizados
      await carregarCatalogoHorarios();

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

    // Verifica se o horário já existe
    if (horariosSelected[horarioPersonalizado]) {
      Alert.alert("Horário duplicado", "Este horário já foi adicionado");
      setHorarioPersonalizado("");
      return;
    }

    // Adiciona o horário diretamente à lista de horários selecionados
    setHorariosSelected({
      ...horariosSelected,
      [horarioPersonalizado]: true,
    });

    // Adiciona também ao catálogo de horários se ainda não existir
    if (!catalogoHorarios.includes(horarioPersonalizado)) {
      setCatalogoHorarios([...catalogoHorarios, horarioPersonalizado].sort());
    }

    setHorarioPersonalizado("");
  };

  // Função para alternar a seleção de um horário
  const toggleHorario = (horario: string) => {
    setHorariosSelected({
      ...horariosSelected,
      [horario]: !horariosSelected[horario],
    });
  };

  // Função para abrir o modal de confirmação de exclusão de horário
  const handleLongPressHorario = (horario: string) => {
    setHorarioToDelete(horario);
    setDeleteHorarioModalVisible(true);
  };

  // Função para remover um horário - Corrigido para efetivamente remover o horário
  const removerHorario = () => {
    if (horarioToDelete) {
      // Criar uma cópia do objeto de horários selecionados
      const novosHorariosSelected = { ...horariosSelected };

      // Definir o horário como não selecionado
      novosHorariosSelected[horarioToDelete] = false;
      setHorariosSelected(novosHorariosSelected);

      // Se for um horário personalizado (não está nos padrões), remover do catálogo também
      if (!HORARIOS_PADRAO.includes(horarioToDelete)) {
        const novosCatalogoHorarios = catalogoHorarios.filter(
          (h) => h !== horarioToDelete
        );
        setCatalogoHorarios(novosCatalogoHorarios);
      }

      // Fechar o modal e limpar o estado
      setDeleteHorarioModalVisible(false);
      setHorarioToDelete("");
    }
  };

  // Iniciar modo de reordenação
  const iniciarReordenacao = () => {
    Vibration.vibrate(50); // Feedback tátil
    setIsReordering(true);
    Alert.alert(
      "Modo de Reordenação",
      "Use os botões ⬆️ e ⬇️ para mover os serviços. Toque em 'Salvar Ordem' quando terminar."
    );
  };

  // Funções para mover item para cima ou para baixo
  const moverParaCima = (index: number) => {
    if (index <= 0) return; // Já está no topo

    const novaLista = [...servicosOrdenados];
    const temp = novaLista[index];
    novaLista[index] = novaLista[index - 1];
    novaLista[index - 1] = temp;

    setServicosOrdenados(novaLista);
  };

  const moverParaBaixo = (index: number) => {
    if (index >= servicosOrdenados.length - 1) return; // Já está no final

    const novaLista = [...servicosOrdenados];
    const temp = novaLista[index];
    novaLista[index] = novaLista[index + 1];
    novaLista[index + 1] = temp;

    setServicosOrdenados(novaLista);
  };

  // Função para salvar a ordem atualizada no Firebase
  const salvarOrdemServicos = async () => {
    try {
      setLoadingServicos(true);
      const batch = writeBatch(db);

      servicosOrdenados.forEach((servico, index) => {
        const servicoRef = doc(db, "servicos", servico.id);
        batch.update(servicoRef, { ordem: index });
      });

      await batch.commit();
      Alert.alert("Sucesso", "Ordem dos serviços atualizada com sucesso!");

      // Atualiza os serviços com a nova ordem
      setServicos([...servicosOrdenados]);
      setIsReordering(false);
    } catch (error: any) {
      console.error("Erro ao salvar ordem dos serviços:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar a ordem dos serviços: " +
          (error.message || "Erro desconhecido")
      );
    } finally {
      setLoadingServicos(false);
    }
  };

  // Função para cancelar reordenação
  const cancelarReordenacao = () => {
    setServicosOrdenados([...servicos]);
    setIsReordering(false);
  };

  // Componente para renderizar item com botões de reordenação
  const renderServicoItem = ({
    item,
    index,
  }: {
    item: Servico;
    index: number;
  }) => {
    return (
      <View
        style={[
          globalStyles.servicoListItem,
          isReordering && { backgroundColor: "rgba(58, 81, 153, 0.05)" },
        ]}
      >
        <View style={globalStyles.servicoInfo}>
          {isReordering && (
            <View
              style={{
                marginRight: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 8,
                  backgroundColor: colors.gradient.start,
                  borderRadius: 4,
                  marginBottom: 4,
                }}
                onPress={() => moverParaCima(index)}
                disabled={index === 0}
              >
                <MaterialIcons
                  name="arrow-upward"
                  size={18}
                  color={index === 0 ? "rgba(255,255,255,0.4)" : "#FFF"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 8,
                  backgroundColor: colors.gradient.start,
                  borderRadius: 4,
                }}
                onPress={() => moverParaBaixo(index)}
                disabled={index === servicosOrdenados.length - 1}
              >
                <MaterialIcons
                  name="arrow-downward"
                  size={18}
                  color={
                    index === servicosOrdenados.length - 1
                      ? "rgba(255,255,255,0.4)"
                      : "#FFF"
                  }
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={globalStyles.servicoIconContainerSmall}>
            <MaterialIcons
              name={item.iconName as any}
              size={24}
              color={colors.barber.gold}
            />
          </View>
          <View style={globalStyles.servicoTextContainer}>
            <Text style={globalStyles.servicoNomeItem}>{item.nome}</Text>
            <Text style={globalStyles.servicoPrecoItem}>
              {formatCurrencyBRL(item.preco)}
            </Text>
            <Text style={globalStyles.servicoTempoItem}>{item.tempo}</Text>
          </View>
        </View>
        {!isReordering && (
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
        )}
      </View>
    );
  };

  // O modal para criar/editar serviços
  const renderServicosModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={servicosModalVisible}
      onRequestClose={() => setServicosModalVisible(false)}
    >
      <View style={globalStyles.centeredView}>
        <View style={[globalStyles.serviceFormModalView]}>
          <TouchableOpacity
            style={globalStyles.serviceFormCloseButton}
            onPress={() => setServicosModalVisible(false)}
          >
            <MaterialIcons name="close" size={24} color={colors.white} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ padding: 20 }}
          >
            <Text style={globalStyles.serviceFormTitle}>
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
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
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
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
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
                <View
                  style={[
                    globalStyles.priceInputContainer,
                    { flexDirection: "row", alignItems: "center" },
                  ]}
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
                    style={[globalStyles.formInput, { paddingLeft: 44 }]}
                    value={
                      servicoAtual.preco === 0
                        ? ""
                        : formatCurrencyBRL(servicoAtual.preco, {
                            showCurrency: false,
                            decimals: 2,
                          })
                    }
                    onChangeText={(text) => {
                      // Remove tudo que não for número
                      const numericText = text.replace(/[^0-9]/g, "");

                      // Converte para valor numérico (em centavos)
                      const cents = numericText ? parseInt(numericText) : 0;

                      // Converte centavos para valor real (dividindo por 100)
                      const value = cents / 100;

                      // Atualiza o estado
                      setServicoAtual({ ...servicoAtual, preco: value });
                    }}
                    placeholder="0,00"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                {servicoAtual.preco > 0 && (
                  <Text style={globalStyles.priceHint}>
                    {formatCurrencyBRL(servicoAtual.preco, {
                      showCurrency: true,
                      decimals: 2,
                    })}
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
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
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
                        globalStyles.iconSelector,
                    ]}
                    onPress={() =>
                      setServicoAtual({
                        ...servicoAtual,
                        iconName: icone.value,
                      })
                    }
                  >
                    {icone.tipo === "material" && (
                      <MaterialIcons
                        name={icone.value as any}
                        size={26}
                        color={
                          servicoAtual.iconName === icone.value
                            ? "#fff"
                            : colors.barber.gold
                        }
                      />
                    )}
                    {icone.tipo === "material-community" && (
                      <MaterialCommunityIcons
                        name={icone.value as any}
                        size={26}
                        color={
                          servicoAtual.iconName === icone.value
                            ? "#fff"
                            : colors.barber.gold
                        }
                      />
                    )}
                    {icone.tipo === "font-awesome" && (
                      <FontAwesome5
                        name={icone.value as any}
                        size={26}
                        color={
                          servicoAtual.iconName === icone.value
                            ? "#fff"
                            : colors.barber.gold
                        }
                      />
                    )}
                    <Text
                      style={[
                        {
                          fontSize: 12,
                          marginTop: 4,
                          textAlign: "center",
                          color: colors.textDark,
                        },
                        servicoAtual.iconName === icone.value &&
                          globalStyles.radioTextSelected,
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
                {/* Todos os horários do catálogo, incluindo personalizados */}
                {catalogoHorarios.map((horario) => (
                  <TouchableOpacity
                    key={horario}
                    style={[globalStyles.servicoHorarioOptionContainer]}
                    onPress={() => toggleHorario(horario)}
                    onLongPress={() => handleLongPressHorario(horario)}
                    delayLongPress={500}
                  >
                    <View
                      style={[
                        globalStyles.servicoHorarioOption,
                        horariosSelected[horario] &&
                          globalStyles.servicoHorarioOptionSelected,
                        !HORARIOS_PADRAO.includes(horario)
                          ? { borderColor: colors.button.secondary }
                          : {},
                      ]}
                    >
                      <Text
                        style={[
                          globalStyles.horarioText,
                          horariosSelected[horario] &&
                            globalStyles.horarioTextSelected,
                        ]}
                      >
                        {horario}
                        {!HORARIOS_PADRAO.includes(horario) ? " *" : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Horário personalizado */}
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
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
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

  // Modal de confirmação para excluir horário
  const renderDeleteHorarioModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={deleteHorarioModalVisible}
      onRequestClose={() => setDeleteHorarioModalVisible(false)}
    >
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.horarioDeleteModal}>
          <Text style={globalStyles.horarioDeleteModalTitle}>
            Excluir Horário
          </Text>
          <Text style={globalStyles.horarioDeleteModalText}>
            Deseja remover o horário {horarioToDelete}?
          </Text>
          <View style={globalStyles.horarioDeleteModalButtons}>
            <TouchableOpacity
              style={globalStyles.horarioDeleteCancelButton}
              onPress={() => setDeleteHorarioModalVisible(false)}
            >
              <Text style={globalStyles.horarioDeleteButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.horarioDeleteConfirmButton}
              onPress={removerHorario}
            >
              <Text style={globalStyles.horarioDeleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={globalStyles.servicosHorariosContainer}>
      <View style={globalStyles.servicosContainer}>
        {/* Header com botões de ações */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            style={globalStyles.addServicoButton}
            onPress={handleAddServico}
            disabled={isReordering}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={globalStyles.addServicoButtonText}>
              Adicionar serviço
            </Text>
          </TouchableOpacity>

          {!isReordering && (
            <TouchableOpacity
              style={[
                globalStyles.addServicoButton,
                { backgroundColor: colors.button.secondary },
              ]}
              onPress={iniciarReordenacao}
            >
              <MaterialIcons name="reorder" size={24} color="#fff" />
              <Text style={globalStyles.addServicoButtonText}>Reorganizar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botões de controle para o modo de reordenação */}
        {isReordering && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={[globalStyles.cancelButton, { flex: 1, marginRight: 10 }]}
              onPress={cancelarReordenacao}
            >
              <Text style={globalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.saveButton, { flex: 1 }]}
              onPress={salvarOrdemServicos}
            >
              <Text style={globalStyles.saveButtonText}>Salvar Ordem</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de serviços */}
        {loadingServicos ? (
          <ActivityIndicator
            size="large"
            color={colors.secondary}
            style={globalStyles.loadingIndicator}
          />
        ) : (
          <>
            {isReordering && (
              <Text
                style={{
                  marginBottom: 10,
                  fontStyle: "italic",
                  color: colors.button.primary,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Use os botões para reorganizar a ordem dos serviços
              </Text>
            )}

            <FlatList
              ref={flatListRef}
              data={servicosOrdenados}
              keyExtractor={(item) => item.id}
              renderItem={renderServicoItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
              style={{ maxHeight: 400 }}
              ListEmptyComponent={
                <Text style={globalStyles.emptyListText}>
                  Nenhum serviço cadastrado
                </Text>
              }
            />
          </>
        )}
      </View>

      {renderServicosModal()}
      {renderDeleteHorarioModal()}
    </View>
  );
};

export default ServicosHorarios;
