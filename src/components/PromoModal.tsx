import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { PROMO_CODES } from '../data/mockData';

interface PromoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ visible, onClose }) => {
  const { applyPromo, appliedPromo, removePromo } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleApplyInput = () => {
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode.trim());
    if (res.success) {
      setInputCode('');
      setErrorMessage('');
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleApplyPreset = (code: string) => {
    const res = applyPromo(code);
    if (res.success) {
      setErrorMessage('');
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                Apply Promo Voucher
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Save on your local Munch order
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Input Box */}
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: errorMessage ? '#EF4444' : theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Enter voucher code (e.g. MUNCHTOWN)"
                placeholderTextColor={theme.textMuted}
                value={inputCode}
                onChangeText={(t) => {
                  setInputCode(t.toUpperCase());
                  setErrorMessage('');
                }}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[
                  styles.applyBtn,
                  { backgroundColor: inputCode.trim() ? theme.primary : theme.textMuted },
                ]}
                disabled={!inputCode.trim()}
                onPress={handleApplyInput}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Currently Applied Promo */}
            {appliedPromo && (
              <View
                style={[
                  styles.appliedCard,
                  {
                    backgroundColor: theme.secondaryLight,
                    borderColor: theme.secondary,
                  },
                ]}
              >
                <View style={styles.appliedLeft}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.secondary} />
                  <View>
                    <Text style={[styles.appliedCode, { color: theme.secondary }]}>
                      {appliedPromo.code} APPLIED
                    </Text>
                    <Text style={[styles.appliedDesc, { color: theme.text }]}>
                      {appliedPromo.description}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={removePromo} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Available Deals */}
            <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
              AVAILABLE TOWN COUPONS
            </Text>

            {PROMO_CODES.map((promo) => {
              const isApplied = appliedPromo?.code === promo.code;
              return (
                <View
                  key={promo.code}
                  style={[
                    styles.promoCard,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: isApplied ? theme.secondary : theme.border,
                    },
                  ]}
                >
                  <View style={styles.promoCardLeft}>
                    <View style={[styles.codeBadge, { backgroundColor: theme.card }]}>
                      <Ionicons name="pricetag" size={14} color={theme.primary} />
                      <Text style={[styles.codeBadgeText, { color: theme.primary }]}>
                        {promo.code}
                      </Text>
                    </View>
                    <Text style={[styles.promoDesc, { color: theme.text }]}>
                      {promo.description}
                    </Text>
                    <Text style={[styles.minOrderText, { color: theme.textMuted }]}>
                      Min order: Rs. {promo.minOrder}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.presetApplyBtn,
                      {
                        backgroundColor: isApplied
                          ? theme.secondaryLight
                          : theme.primary,
                        borderColor: isApplied
                          ? theme.secondary
                          : theme.primary,
                      },
                    ]}
                    onPress={() =>
                      isApplied ? removePromo() : handleApplyPreset(promo.code)
                    }
                  >
                    <Text
                      style={[
                        styles.presetApplyText,
                        {
                          color: isApplied ? theme.secondary : '#FFFFFF',
                        },
                      ]}
                    >
                      {isApplied ? 'Applied' : 'Apply'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '75%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    fontWeight: '700',
  },
  applyBtn: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  appliedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  appliedCode: {
    fontSize: 13,
    fontWeight: '800',
  },
  appliedDesc: {
    fontSize: 12,
    marginTop: 1,
  },
  removeBtn: {
    padding: 6,
  },
  removeBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 10,
  },
  promoCardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  codeBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    gap: 4,
    marginBottom: 4,
  },
  codeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  promoDesc: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  minOrderText: {
    fontSize: 11,
    marginTop: 2,
  },
  presetApplyBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  presetApplyText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
