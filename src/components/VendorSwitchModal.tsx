import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface VendorSwitchModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirmClear: () => void;
  newVendorName: string;
}

export const VendorSwitchModal: React.FC<VendorSwitchModalProps> = ({
  visible,
  onCancel,
  onConfirmClear,
  newVendorName,
}) => {
  const { cartVendorName } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.alertCard,
            { backgroundColor: theme.card, borderColor: theme.border },
            Shadows.lg,
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.dangerLight }]}>
            <Ionicons name="warning" size={28} color="#EF4444" />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Replace Cart Items?
          </Text>

          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Your cart already contains items from{' '}
            <Text style={{ fontWeight: '700', color: theme.text }}>
              {cartVendorName || 'another restaurant'}
            </Text>
            . Would you like to clear your cart and start a new order with{' '}
            <Text style={{ fontWeight: '700', color: theme.text }}>
              {newVendorName}
            </Text>
            ?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.border }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: theme.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: theme.danger }]}
              onPress={onConfirmClear}
            >
              <Text style={styles.confirmText}>Clear & Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  alertCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
