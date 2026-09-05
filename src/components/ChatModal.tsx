import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface ChatModalProps {
  visible: boolean;
  order: Order;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  visible,
  order,
  onClose,
}) => {
  const { chatMessages, sendMessage, user } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [activeTab, setActiveTab] = useState<'RIDER' | 'VENDOR'>('RIDER');
  const [inputText, setInputText] = useState('');

  const orderMessages = chatMessages.filter(
    (m) =>
      m.orderId === order.id &&
      (m.senderType === 'CUSTOMER' || m.senderType === activeTab)
  );

  const quickReplies =
    activeTab === 'RIDER'
      ? [
        'Please ring the doorbell',
        'Bring change for Rs. 1000',
        'Call when at main gate',
        'Where are you now?',
      ]
      : [
        'Please add extra chutney',
        'Make it less spicy',
        'Pack in spill-proof box',
        'How much prep time left?',
      ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendMessage(order.id, text, activeTab);
    setInputText('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerInfo}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Live In-App Support & Chat
              </Text>
              <Text style={[styles.orderRef, { color: theme.textSecondary }]}>
                Order #{order.orderNumber}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Recipient Toggle: Rider vs Restaurant */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                {
                  backgroundColor:
                    activeTab === 'RIDER'
                      ? theme.primary
                      : theme.backgroundElement,
                  borderColor:
                    activeTab === 'RIDER' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setActiveTab('RIDER')}
            >
              <MaterialCommunityIcons
                name="moped"
                size={18}
                color={activeTab === 'RIDER' ? '#FFF' : theme.text}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'RIDER' ? '#FFF' : theme.text,
                    fontWeight: activeTab === 'RIDER' ? '700' : '500',
                  },
                ]}
              >
                Rider ({order.rider?.name?.split(' ')[0] || 'Assigned'})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                {
                  backgroundColor:
                    activeTab === 'VENDOR'
                      ? theme.primary
                      : theme.backgroundElement,
                  borderColor:
                    activeTab === 'VENDOR' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setActiveTab('VENDOR')}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={18}
                color={activeTab === 'VENDOR' ? '#FFF' : theme.text}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'VENDOR' ? '#FFF' : theme.text,
                    fontWeight: activeTab === 'VENDOR' ? '700' : '500',
                  },
                ]}
              >
                {order.vendor.name.split(' ')[0]} Kitchen
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Reply Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickReplyScroll}
          >
            {quickReplies.map((qr, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.quickReplyChip,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => handleSend(qr)}
              >
                <Text style={[styles.quickReplyText, { color: theme.textSecondary }]}>
                  {qr}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Messages Scroll Area */}
          <ScrollView
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {orderMessages.map((msg) => {
              const isMe = msg.senderType === 'CUSTOMER';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubbleWrapper,
                    isMe ? styles.bubbleRight : styles.bubbleLeft,
                  ]}
                >
                  {!isMe && (
                    <Text
                      style={[
                        styles.senderNameLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {msg.senderName}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      {
                        backgroundColor: isMe
                          ? theme.primary
                          : theme.backgroundElement,
                        borderColor: isMe ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: isMe ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {msg.message}
                    </Text>
                  </View>
                  <Text style={[styles.timestamp, { color: theme.textMuted }]}>
                    {msg.timestamp}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Box */}
          <View
            style={[
              styles.inputBar,
              {
                backgroundColor: theme.card,
                borderTopColor: theme.border,
              },
            ]}
          >
            <TextInput
              style={[
                styles.chatInput,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={`Message ${activeTab === 'RIDER' ? 'Rider' : 'Restaurant'}...`}
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor: inputText.trim()
                    ? theme.primary
                    : theme.textMuted,
                },
              ]}
              disabled={!inputText.trim()}
              onPress={() => handleSend()}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  orderRef: {
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  tabBtnText: {
    fontSize: 12,
  },
  quickReplyScroll: {
    paddingHorizontal: Spacing.three,
    gap: 8,
    paddingBottom: 8,
  },
  quickReplyChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  messagesContainer: {
    paddingVertical: 12,
    gap: 10,
  },
  messageBubbleWrapper: {
    maxWidth: '80%',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderNameLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
    marginLeft: 4,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 9,
    marginTop: 2,
    marginHorizontal: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  chatInput: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 13,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
