import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import globalStyles, { colors } from "../globalStyle/styles";
import { formatDate } from "../../format";
import { sendNotificationToGroup } from "../services/notificationService";

// Tipo para as notificações
interface Notification {
  id: string;
  title: string;
  body: string;
  targetGroup: "all" | "clients" | "staff" | "admin";
  status: "draft" | "scheduled" | "sent";
  scheduledDate?: Date | null;
  createdAt: Date;
  sentAt?: Date | null;
  imageUrl?: string;
  isPromo?: boolean;
}

interface NotificationsPushProps {
  isAdmin: boolean;
}

const NotificationsPush: React.FC<NotificationsPushProps> = ({ isAdmin }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [sending, setSending] = useState(false);

  // Estados para o formulário
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetGroup, setTargetGroup] = useState<
    "all" | "clients" | "staff" | "admin"
  >("all");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [isPromo, setIsPromo] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const notificationsList: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notificationsList.push({
          id: doc.id,
          title: data.title,
          body: data.body,
          targetGroup: data.targetGroup,
          status: data.status,
          scheduledDate: data.scheduledDate
            ? new Date(data.scheduledDate.toDate())
            : null,
          createdAt: new Date(data.createdAt.toDate()),
          sentAt: data.sentAt ? new Date(data.sentAt.toDate()) : null,
          imageUrl: data.imageUrl,
          isPromo: data.isPromo || false,
        });
      });

      setNotifications(notificationsList);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      Alert.alert("Erro", "Não foi possível carregar as notificações");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Erro", "Título e mensagem são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const newNotification = {
        title,
        body,
        targetGroup,
        status: "draft",
        createdAt: new Date(),
        scheduledDate: scheduledDate,
        isPromo,
      };

      await addDoc(collection(db, "notifications"), newNotification);

      // Limpar formulário
      resetForm();
      setModalVisible(false);

      // Atualizar lista
      fetchNotifications();
      Alert.alert("Sucesso", "Notificação criada com sucesso");
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      Alert.alert("Erro", "Não foi possível criar a notificação");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (notification: Notification) => {
    if (!isAdmin) {
      Alert.alert(
        "Permissão Negada",
        "Apenas administradores podem enviar notificações"
      );
      return;
    }

    Alert.alert(
      "Confirmar Envio",
      `Deseja enviar a notificação "${
        notification.title
      }" para ${getTargetGroupName(notification.targetGroup)}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Enviar",
          onPress: async () => {
            try {
              setSending(true);

              // Enviar a notificação usando o serviço
              const sentCount = await sendNotificationToGroup(
                notification.targetGroup,
                notification.title,
                notification.body,
                {
                  notificationId: notification.id,
                  isPromo: notification.isPromo,
                }
              );

              // Atualizar status da notificação no Firestore
              const notificationRef = doc(db, "notifications", notification.id);
              await updateDoc(notificationRef, {
                status: "sent",
                sentAt: new Date(),
                sentCount: sentCount, // Adiciona contagem de envios
              });

              // Atualizar lista local
              setNotifications(
                notifications.map((n) =>
                  n.id === notification.id
                    ? { ...n, status: "sent", sentAt: new Date() }
                    : n
                )
              );

              Alert.alert(
                "Sucesso",
                `Notificação enviada com sucesso para ${sentCount} usuários`
              );
            } catch (error) {
              console.error("Erro ao enviar notificação:", error);
              Alert.alert("Erro", "Não foi possível enviar a notificação");
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteNotification = async (id: string) => {
    if (!isAdmin) {
      Alert.alert(
        "Permissão Negada",
        "Apenas administradores podem excluir notificações"
      );
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta notificação?",
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
              setLoading(true);
              await deleteDoc(doc(db, "notifications", id));

              // Atualizar lista local
              setNotifications(notifications.filter((n) => n.id !== id));
              Alert.alert("Sucesso", "Notificação excluída com sucesso");
            } catch (error) {
              console.error("Erro ao excluir notificação:", error);
              Alert.alert("Erro", "Não foi possível excluir a notificação");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditNotification = (notification: Notification) => {
    if (!isAdmin) {
      Alert.alert(
        "Permissão Negada",
        "Apenas administradores podem editar notificações"
      );
      return;
    }

    if (notification.status === "sent") {
      Alert.alert(
        "Não Permitido",
        "Notificações já enviadas não podem ser editadas"
      );
      return;
    }

    setEditingNotification(notification);
    setTitle(notification.title);
    setBody(notification.body);
    setTargetGroup(notification.targetGroup);
    setScheduledDate(notification.scheduledDate);
    setIsPromo(notification.isPromo || false);
    setModalVisible(true);
  };

  const handleUpdateNotification = async () => {
    if (!editingNotification) return;

    if (!title.trim() || !body.trim()) {
      Alert.alert("Erro", "Título e mensagem são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const notificationRef = doc(db, "notifications", editingNotification.id);

      const updatedData = {
        title,
        body,
        targetGroup,
        scheduledDate,
        isPromo,
      };

      await updateDoc(notificationRef, updatedData);

      // Atualizar lista local
      setNotifications(
        notifications.map((n) =>
          n.id === editingNotification.id ? { ...n, ...updatedData } : n
        )
      );

      // Limpar formulário
      resetForm();
      setModalVisible(false);

      Alert.alert("Sucesso", "Notificação atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar notificação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a notificação");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setTargetGroup("all");
    setScheduledDate(null);
    setIsPromo(false);
    setEditingNotification(null);
  };

  const openNewNotificationModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const getTargetGroupName = (target: string) => {
    switch (target) {
      case "all":
        return "Todos os usuários";
      case "clients":
        return "Apenas clientes";
      case "staff":
        return "Apenas funcionários";
      case "admin":
        return "Apenas administradores";
      default:
        return target;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "scheduled":
        return "Agendada";
      case "sent":
        return "Enviada";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return colors.textLight;
      case "scheduled":
        return colors.notification.reminder;
      case "sent":
        return colors.notification.active;
      default:
        return colors.textLight;
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={globalStyles.notificationItem}>
      <View style={globalStyles.notificationContent}>
        <View style={globalStyles.notificationHeader}>
          <Text style={globalStyles.notificationTitle}>{item.title}</Text>
          <View
            style={[
              globalStyles.notificationStatusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={globalStyles.notificationStatusText}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <Text style={globalStyles.notificationBody}>{item.body}</Text>

        <View style={globalStyles.notificationMeta}>
          <Text style={globalStyles.notificationMetaText}>
            Para: {getTargetGroupName(item.targetGroup)}
          </Text>
          <Text style={globalStyles.notificationMetaText}>
            Criada: {formatDate(item.createdAt)}
          </Text>
          {item.sentAt && (
            <Text style={globalStyles.notificationMetaText}>
              Enviada: {formatDate(item.sentAt)}
            </Text>
          )}
          {item.isPromo && (
            <View style={globalStyles.notificationPromoBadge}>
              <Text style={globalStyles.notificationPromoText}>Promoção</Text>
            </View>
          )}
        </View>
      </View>

      <View style={globalStyles.notificationActions}>
        {item.status !== "sent" && (
          <TouchableOpacity
            style={globalStyles.notificationActionButton}
            onPress={() => handleSendNotification(item)}
          >
            <MaterialIcons name="send" size={18} color={colors.white} />
            <Text style={globalStyles.notificationActionText}>Enviar</Text>
          </TouchableOpacity>
        )}

        {item.status !== "sent" && (
          <TouchableOpacity
            style={[
              globalStyles.notificationActionButton,
              { backgroundColor: colors.button.secondary },
            ]}
            onPress={() => handleEditNotification(item)}
          >
            <MaterialIcons name="edit" size={18} color={colors.white} />
            <Text style={globalStyles.notificationActionText}>Editar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            globalStyles.notificationActionButton,
            { backgroundColor: colors.error },
          ]}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <MaterialIcons name="delete" size={18} color={colors.white} />
          <Text style={globalStyles.notificationActionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Modal para criar/editar notificações
  const renderNotificationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={globalStyles.centeredView}>
        <View style={globalStyles.notificationModalView}>
          <View style={globalStyles.notificationModalHeader}>
            <Text style={globalStyles.notificationModalTitle}>
              {editingNotification ? "Editar Notificação" : "Nova Notificação"}
            </Text>
            <TouchableOpacity
              style={globalStyles.notificationCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={globalStyles.notificationModalContent}>
            <View style={globalStyles.notificationFormGroup}>
              <Text style={globalStyles.notificationFormLabel}>Título</Text>
              <TextInput
                style={globalStyles.notificationFormInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título da notificação"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>

            <View style={globalStyles.notificationFormGroup}>
              <Text style={globalStyles.notificationFormLabel}>Mensagem</Text>
              <TextInput
                style={[
                  globalStyles.notificationFormInput,
                  globalStyles.notificationFormTextarea,
                ]}
                value={body}
                onChangeText={setBody}
                placeholder="Digite a mensagem da notificação"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={globalStyles.notificationFormGroup}>
              <Text style={globalStyles.notificationFormLabel}>
                Destinatários
              </Text>
              <View style={globalStyles.notificationTargetGroup}>
                <TouchableOpacity
                  style={[
                    globalStyles.notificationTargetOption,
                    targetGroup === "all" &&
                      globalStyles.notificationTargetSelected,
                  ]}
                  onPress={() => setTargetGroup("all")}
                >
                  <Text
                    style={[
                      globalStyles.notificationTargetText,
                      targetGroup === "all" &&
                        globalStyles.notificationTargetTextSelected,
                    ]}
                  >
                    Todos
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    globalStyles.notificationTargetOption,
                    targetGroup === "clients" &&
                      globalStyles.notificationTargetSelected,
                  ]}
                  onPress={() => setTargetGroup("clients")}
                >
                  <Text
                    style={[
                      globalStyles.notificationTargetText,
                      targetGroup === "clients" &&
                        globalStyles.notificationTargetTextSelected,
                    ]}
                  >
                    Clientes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    globalStyles.notificationTargetOption,
                    targetGroup === "staff" &&
                      globalStyles.notificationTargetSelected,
                  ]}
                  onPress={() => setTargetGroup("staff")}
                >
                  <Text
                    style={[
                      globalStyles.notificationTargetText,
                      targetGroup === "staff" &&
                        globalStyles.notificationTargetTextSelected,
                    ]}
                  >
                    Funcionários
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    globalStyles.notificationTargetOption,
                    targetGroup === "admin" &&
                      globalStyles.notificationTargetSelected,
                  ]}
                  onPress={() => setTargetGroup("admin")}
                >
                  <Text
                    style={[
                      globalStyles.notificationTargetText,
                      targetGroup === "admin" &&
                        globalStyles.notificationTargetTextSelected,
                    ]}
                  >
                    Admins
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={globalStyles.notificationFormGroup}>
              <View style={globalStyles.notificationSwitchContainer}>
                <Text style={globalStyles.notificationFormLabel}>
                  É uma promoção?
                </Text>
                <Switch
                  value={isPromo}
                  onValueChange={setIsPromo}
                  trackColor={{
                    false: colors.gray,
                    true: colors.notification.promo,
                  }}
                  thumbColor={isPromo ? colors.white : colors.lightGray}
                />
              </View>
              {isPromo && (
                <Text style={globalStyles.notificationFormHelper}>
                  Notificações promocionais aparecem destacadas e podem ter
                  regras especiais de envio
                </Text>
              )}
            </View>

            <View style={globalStyles.notificationFormButtons}>
              <TouchableOpacity
                style={globalStyles.notificationCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.notificationButtonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.notificationSaveButton}
                onPress={
                  editingNotification
                    ? handleUpdateNotification
                    : handleCreateNotification
                }
              >
                <Text style={globalStyles.notificationButtonText}>
                  {editingNotification ? "Atualizar" : "Criar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={globalStyles.notificationsContainer}>
      <View style={globalStyles.notificationsHeader}>
        <TouchableOpacity
          style={globalStyles.addNotificationButton}
          onPress={openNewNotificationModal}
        >
          <MaterialIcons name="add" size={24} color="#000" />
          <Text style={globalStyles.addNotificationButtonText}>
            Nova Notificação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.refreshNotificationsButton}
          onPress={fetchNotifications}
        >
          <MaterialIcons name="refresh" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={globalStyles.notificationsLoadingContainer}>
          <ActivityIndicator size="large" color={colors.button.primary} />
          <Text style={globalStyles.notificationsLoadingText}>
            Carregando notificações...
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={globalStyles.emptyListText}>
              Nenhuma notificação encontrada
            </Text>
          }
        />
      )}

      {renderNotificationModal()}
    </View>
  );
};

export default NotificationsPush;
