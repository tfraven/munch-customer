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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { UserAddress } from '../types';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    addresses,
    currentAddress,
    setCurrentAddress,
    addAddress,
  } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Hostel' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [notes, setNotes] = useState('');

  const handleSelect = (addr: UserAddress) => {
    setCurrentAddress(addr);
    onClose();
  };

  const handleSaveNew = () => {
    if (!street.trim() || !area.trim()) {
      return;
    }
    addAddress({
      label,
      street: street.trim(),
      area: area.trim(),
      city: 'Munch Town',
      notes: notes.trim() || undefined,
      latitude: 31.5220,
      longitude: 74.3550,
    });
    setStreet('');
    setArea('');
    setNotes('');
    setIsAddingNew(false);
    onClose();
  };

  const getLabelIcon = (l: string) => {
    switch (l) {
      case 'Home':
        return 'home';
      case 'Work':
        return 'briefcase';
      case 'Hostel':
        return 'bed';
      default:
        return 'location';
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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                {isAddingNew ? 'Add Delivery Address' : 'Select Delivery Location'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {isAddingNew
                  ? 'Enter location details within Munch Town'
                  : 'Delivering within town coverage'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {!isAddingNew ? (
              <>
                {/* Saved Addresses */}
                <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
                  SAVED ADDRESSES
                </Text>

                {addresses.map((addr) => {
                  const isSelected = currentAddress.id === addr.id;
                  return (
                    <TouchableOpacity
                      key={addr.id}
                      style={[
                        styles.addressCard,
                        {
                          backgroundColor: isSelected
                            ? theme.primaryLight
                            : theme.backgroundElement,
                          borderColor: isSelected ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => handleSelect(addr)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.addressCardLeft}>
                        <View
                          style={[
                            styles.iconCircle,
                            {
                              backgroundColor: isSelected
                                ? theme.primary
                                : theme.card,
                            },
                          ]}
                        >
                          <Ionicons
                            name={getLabelIcon(addr.label) as any}
                            size={18}
                            color={isSelected ? '#FFFFFF' : theme.primary}
                          />
                        </View>

                        <View style={styles.addressInfo}>
                          <View style={styles.labelRow}>
                            <Text
                              style={[
                                styles.addressLabel,
                                {
                                  color: isSelected
                                    ? theme.primaryDark
                                    : theme.text,
                                },
                              ]}
                            >
                              {addr.label}
                            </Text>
                            {isSelected && (
                              <View
                                style={[
                                  styles.activeBadge,
                                  { backgroundColor: theme.primary },
                                ]}
                              >
                                <Text style={styles.activeBadgeText}>ACTIVE</Text>
                              </View>
                            )}
                          </View>

                          <Text
                            style={[styles.streetText, { color: theme.text }]}
                            numberOfLines={2}
                          >
                            {addr.street}, {addr.area}
                          </Text>

                          {addr.notes && (
                            <Text
                              style={[
                                styles.notesText,
                                { color: theme.textMuted },
                              ]}
                              numberOfLines={1}
                            >
                              Note: {addr.notes}
                            </Text>
                          )}
                        </View>
                      </View>

                      <Ionicons
                        name={
                          isSelected
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={20}
                        color={isSelected ? theme.primary : theme.textMuted}
                      />
                    </TouchableOpacity>
                  );
                })}

                {/* Add New Address Button */}
                <TouchableOpacity
                  style={[
                    styles.addNewBtn,
                    {
                      borderColor: theme.primary,
                      backgroundColor: theme.primaryLight,
                    },
                  ]}
                  onPress={() => setIsAddingNew(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle" size={20} color={theme.primary} />
                  <Text style={[styles.addNewText, { color: theme.primary }]}>
                    Add New Address in Town
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Add New Address Form */
              <View style={styles.formContainer}>
                {/* Simulated Map Pin Card */}
                <View
                  style={[
                    styles.mapPreviewCard,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="map-marker-radius"
                    size={32}
                    color={theme.primary}
                  />
                  <Text style={[styles.mapPreviewText, { color: theme.text }]}>
                    GPS Pin: Munch Town Central Zone (Auto-Detected)
                  </Text>
                  <Text style={[styles.mapAccuracy, { color: theme.secondary }]}>
                    ✓ Accuracy within 10 meters
                  </Text>
                </View>

                {/* Label Selector */}
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  Address Tag
                </Text>
                <View style={styles.labelsRow}>
                  {(['Home', 'Work', 'Hostel', 'Other'] as const).map((l) => (
                    <TouchableOpacity
                      key={l}
                      style={[
                        styles.labelChip,
                        {
                          backgroundColor:
                            label === l ? theme.primary : theme.backgroundElement,
                          borderColor:
                            label === l ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => setLabel(l)}
                    >
                      <Text
                        style={[
                          styles.labelChipText,
                          {
                            color: label === l ? '#FFF' : theme.text,
                            fontWeight: label === l ? '700' : '500',
                          },
                        ]}
                      >
                        {l}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Street Input */}
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  House / Flat / Street Address *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="e.g. House 14, Street 3, Block C"
                  placeholderTextColor={theme.textMuted}
                  value={street}
                  onChangeText={setStreet}
                />

                {/* Area Input */}
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  Town Area / Neighborhood *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="e.g. Model Town / Satellite Town / Main Bazaar"
                  placeholderTextColor={theme.textMuted}
                  value={area}
                  onChangeText={setArea}
                />

                {/* Delivery Notes */}
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  Rider Directions / Landmark (Optional)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="e.g. Near Mosque gate, 2nd floor, call on arrival"
                  placeholderTextColor={theme.textMuted}
                  value={notes}
                  onChangeText={setNotes}
                />

                {/* Action Buttons */}
                <View style={styles.formActionRow}>
                  <TouchableOpacity
                    style={[
                      styles.cancelBtn,
                      { borderColor: theme.border },
                    ]}
                    onPress={() => setIsAddingNew(false)}
                  >
                    <Text style={[styles.cancelBtnText, { color: theme.text }]}>
                      Back
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.saveBtn,
                      {
                        backgroundColor:
                          street && area ? theme.primary : theme.textMuted,
                      },
                      Shadows.md,
                    ]}
                    disabled={!street || !area}
                    onPress={handleSaveNew}
                  >
                    <Text style={styles.saveBtnText}>Save & Deliver Here</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    maxHeight: '80%',
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
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  addressCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  activeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  streetText: {
    fontSize: 13,
    lineHeight: 18,
  },
  notesText: {
    fontSize: 11,
    marginTop: 2,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 8,
    marginBottom: 24,
    gap: 8,
  },
  addNewText: {
    fontSize: 14,
    fontWeight: '700',
  },
  formContainer: {
    paddingBottom: 20,
  },
  mapPreviewCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 14,
  },
  mapPreviewText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  mapAccuracy: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  labelChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  labelChipText: {
    fontSize: 12,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 8,
  },
  formActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    height: 46,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
