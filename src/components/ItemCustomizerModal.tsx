import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { MenuItem, SelectedOption } from '../types';

interface ItemCustomizerModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    selectedOptions: SelectedOption[],
    quantity: number,
    specialInstructions?: string
  ) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  visible,
  item,
  onClose,
  onAddToCart,
}) => {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Initialize default options when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSpecialInstructions('');
      const defaults: SelectedOption[] = [];

      item.optionGroups?.forEach((group) => {
        if (group.required && group.options.length > 0) {
          defaults.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: group.options[0].id,
            optionName: group.options[0].name,
            price: group.options[0].price,
          });
        }
      });

      setSelectedOptions(defaults);
    }
  }, [item]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!item) return 0;
    const optionsCost = selectedOptions.reduce((acc, curr) => acc + curr.price, 0);
    return (item.price + optionsCost) * quantity;
  }, [item, selectedOptions, quantity]);

  if (!item) return null;

  const handleSelectRadio = (
    groupId: string,
    groupTitle: string,
    optionId: string,
    optionName: string,
    price: number
  ) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((o) => o.groupId !== groupId);
      return [
        ...filtered,
        { groupId, groupTitle, optionId, optionName, price },
      ];
    });
  };

  const handleToggleCheckbox = (
    groupId: string,
    groupTitle: string,
    optionId: string,
    optionName: string,
    price: number
  ) => {
    setSelectedOptions((prev) => {
      const exists = prev.some(
        (o) => o.groupId === groupId && o.optionId === optionId
      );
      if (exists) {
        return prev.filter(
          (o) => !(o.groupId === groupId && o.optionId === optionId)
        );
      } else {
        return [
          ...prev,
          { groupId, groupTitle, optionId, optionName, price },
        ];
      }
    });
  };

  const isOptionSelected = (groupId: string, optionId: string) => {
    return selectedOptions.some(
      (o) => o.groupId === groupId && o.optionId === optionId
    );
  };

  const handleConfirm = () => {
    onAddToCart(
      item,
      selectedOptions,
      quantity,
      specialInstructions.trim() || undefined
    );
    onClose();
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
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.basePrice, { color: theme.primary }]}>
                Base: Rs. {item.price}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Dish Image preview */}
            <Image source={{ uri: item.imageUrl }} style={styles.previewImage} />

            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {item.description}
            </Text>

            {/* Option Groups */}
            {item.optionGroups?.map((group) => (
              <View
                key={group.id}
                style={[
                  styles.groupCard,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.groupHeader}>
                  <Text style={[styles.groupTitle, { color: theme.text }]}>
                    {group.title}
                  </Text>
                  <Text
                    style={[
                      styles.requiredBadge,
                      {
                        color: group.required ? theme.primary : theme.textMuted,
                      },
                    ]}
                  >
                    {group.required ? 'Required (Select 1)' : 'Optional'}
                  </Text>
                </View>

                {group.options.map((opt) => {
                  const selected = isOptionSelected(group.id, opt.id);
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.optionRow,
                        { borderTopColor: theme.borderLight },
                      ]}
                      onPress={() => {
                        if (group.required) {
                          handleSelectRadio(
                            group.id,
                            group.title,
                            opt.id,
                            opt.name,
                            opt.price
                          );
                        } else {
                          handleToggleCheckbox(
                            group.id,
                            group.title,
                            opt.id,
                            opt.name,
                            opt.price
                          );
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionLeft}>
                        <View
                          style={[
                            group.required ? styles.radioCircle : styles.checkboxSquare,
                            {
                              borderColor: selected ? theme.primary : theme.textMuted,
                              backgroundColor: selected
                                ? theme.primary
                                : 'transparent',
                            },
                          ]}
                        >
                          {selected && (
                            <Ionicons
                              name={group.required ? 'ellipse' : 'checkmark'}
                              size={group.required ? 8 : 12}
                              color="#FFFFFF"
                            />
                          )}
                        </View>
                        <Text style={[styles.optionName, { color: theme.text }]}>
                          {opt.name}
                        </Text>
                      </View>

                      {opt.price > 0 ? (
                        <Text style={[styles.optionPrice, { color: theme.primary }]}>
                          + Rs. {opt.price}
                        </Text>
                      ) : (
                        <Text style={[styles.optionPriceFree, { color: theme.textMuted }]}>
                          Free
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {/* Special Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={[styles.instructionLabel, { color: theme.text }]}>
                Special Instructions
              </Text>
              <TextInput
                style={[
                  styles.instructionsInput,
                  {
                    backgroundColor: theme.backgroundElement,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="e.g. Extra spicy, no onions, pack gravy separately..."
                placeholderTextColor={theme.textMuted}
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
                numberOfLines={2}
              />
            </View>
          </ScrollView>

          {/* Footer Bar */}
          <View
            style={[
              styles.footer,
              {
                backgroundColor: theme.card,
                borderTopColor: theme.border,
              },
            ]}
          >
            {/* Quantity Selector */}
            <View
              style={[
                styles.quantityBox,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.qtyBtn}
              >
                <Ionicons name="remove" size={18} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.qtyText, { color: theme.text }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                style={styles.qtyBtn}
              >
                <Ionicons name="add" size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Add to Cart CTA */}
            <TouchableOpacity
              style={[
                styles.addCtaBtn,
                { backgroundColor: theme.primary },
                Shadows.md,
              ]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.addCtaText}>Add to Cart</Text>
              <View style={styles.ctaPricePill}>
                <Text style={styles.ctaPriceText}>Rs. {totalPrice}</Text>
              </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '85%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  basePrice: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  scrollBody: {
    paddingHorizontal: Spacing.three,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: BorderRadius.lg,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  groupCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  requiredBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  optionPriceFree: {
    fontSize: 12,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  instructionsInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 10,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 6,
    height: 48,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 8,
  },
  addCtaBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  addCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  ctaPricePill: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  ctaPriceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
