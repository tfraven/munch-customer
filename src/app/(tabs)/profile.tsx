import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing, MaxContentWidth } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { AddressModal } from '../../components/AddressModal';
import { TOWN_FAQS } from '../../data/mockData';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const {
    user,
    addresses,
    currentAddress,
    favoriteVendorIds,
    vendors,
    showToast,
  } = useApp();

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const favoriteVendors = vendors.filter((v) =>
    favoriteVendorIds.includes(v.id)
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.card }]}
      edges={['top']}
    >
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            My Profile & Settings
          </Text>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Card */}
          <View
            style={[
              styles.profileCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user.name}
              </Text>
              <Text style={[styles.userPhone, { color: theme.textSecondary }]}>
                {user.phone}
              </Text>
              <View style={[styles.townPill, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="location" size={12} color={theme.primary} />
                <Text style={[styles.townPillText, { color: theme.primary }]}>
                  {user.town} Resident
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statBox,
                { backgroundColor: theme.card, borderColor: theme.border },
                Shadows.sm,
              ]}
            >
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {addresses.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Saved Addresses
              </Text>
            </View>

            <View
              style={[
                styles.statBox,
                { backgroundColor: theme.card, borderColor: theme.border },
                Shadows.sm,
              ]}
            >
              <Text style={[styles.statNumber, { color: theme.secondary }]}>
                {favoriteVendorIds.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Favorite Stalls
              </Text>
            </View>

            <View
              style={[
                styles.statBox,
                { backgroundColor: theme.card, borderColor: theme.border },
                Shadows.sm,
              ]}
            >
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
                100%
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                COD Support
              </Text>
            </View>
          </View>

          {/* Saved Addresses Section */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Ionicons name="location-outline" size={20} color={theme.primary} />
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  Saved Delivery Addresses
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAddressModalVisible(true)}
                style={styles.manageLink}
              >
                <Text style={[styles.manageLinkText, { color: theme.primary }]}>
                  + Add / Manage
                </Text>
              </TouchableOpacity>
            </View>

            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[
                  styles.addressItem,
                  { borderTopColor: theme.borderLight },
                ]}
                onPress={() => setAddressModalVisible(true)}
              >
                <View style={styles.addressItemLeft}>
                  <View
                    style={[
                      styles.addressTagPill,
                      {
                        backgroundColor:
                          currentAddress.id === addr.id
                            ? theme.primaryLight
                            : theme.backgroundElement,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.addressTagText,
                        {
                          color:
                            currentAddress.id === addr.id
                              ? theme.primary
                              : theme.textSecondary,
                        },
                      ]}
                    >
                      {addr.label}
                    </Text>
                  </View>
                  <Text
                    style={[styles.addressItemText, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {addr.street}, {addr.area}
                  </Text>
                </View>
                {currentAddress.id === addr.id && (
                  <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Favorite Spots Section */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Ionicons name="heart" size={20} color="#EF4444" />
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  Favorite Food Stalls ({favoriteVendors.length})
                </Text>
              </View>
            </View>

            {favoriteVendors.length > 0 ? (
              favoriteVendors.map((vendor) => (
                <TouchableOpacity
                  key={vendor.id}
                  style={[
                    styles.favRow,
                    { borderTopColor: theme.borderLight },
                  ]}
                  onPress={() => router.push(`/vendor/${vendor.id}` as any)}
                >
                  <Image
                    source={{ uri: vendor.imageUrl }}
                    style={styles.favThumb}
                  />
                  <View style={styles.favInfo}>
                    <Text style={[styles.favName, { color: theme.text }]}>
                      {vendor.name}
                    </Text>
                    <Text style={[styles.favTagline, { color: theme.textSecondary }]}>
                      {vendor.category} • ★ {vendor.rating} ({vendor.deliveryTimeEstimate})
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.noFavsText, { color: theme.textSecondary }]}>
                No favorite food spots added yet. Tap the heart on any stall card!
              </Text>
            )}
          </View>

          {/* Payment & Wallets Section */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderLeft}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={20}
                  color={theme.secondary}
                />
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  Payment & Digital Wallets
                </Text>
              </View>
            </View>

            <View style={[styles.walletItem, { borderTopColor: theme.borderLight }]}>
              <View style={styles.walletLeft}>
                <MaterialCommunityIcons name="cash" size={22} color="#10B981" />
                <View>
                  <Text style={[styles.walletName, { color: theme.text }]}>
                    Cash on Delivery (COD)
                  </Text>
                  <Text style={[styles.walletStatus, { color: '#10B981' }]}>
                    Active • Supported Everywhere in Town
                  </Text>
                </View>
              </View>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </View>

            <View style={[styles.walletItem, { borderTopColor: theme.borderLight }]}>
              <View style={styles.walletLeft}>
                <MaterialCommunityIcons
                  name="cellphone-wireless"
                  size={22}
                  color={theme.primary}
                />
                <View>
                  <Text style={[styles.walletName, { color: theme.text }]}>
                    Easypaisa / JazzCash
                  </Text>
                  <Text style={[styles.walletStatus, { color: theme.textSecondary }]}>
                    Linked: +92 300 1234567
                  </Text>
                </View>
              </View>
              <Text style={[styles.linkedBadge, { color: theme.secondary }]}>
                Linked
              </Text>
            </View>
          </View>

          {/* Town FAQ & Help Section */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={theme.primary}
                />
                <Text style={[styles.sectionHeading, { color: theme.text }]}>
                  Town Delivery FAQ & Help
                </Text>
              </View>
            </View>

            {TOWN_FAQS.map((faq, idx) => {
              const isExpanded = expandedFaqIndex === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.faqItem,
                    { borderTopColor: theme.borderLight },
                  ]}
                  onPress={() =>
                    setExpandedFaqIndex(isExpanded ? null : idx)
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.faqQuestionRow}>
                    <Text style={[styles.faqQuestion, { color: theme.text }]}>
                      {faq.question}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={theme.textSecondary}
                    />
                  </View>
                  {isExpanded && (
                    <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
                      {faq.answer}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Support CTA Card */}
          <View
            style={[
              styles.supportCard,
              { backgroundColor: theme.primaryLight, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="headset" size={28} color={theme.primary} />
            <View style={styles.supportInfo}>
              <Text style={[styles.supportTitle, { color: theme.primaryDark }]}>
                Need Help with an Order?
              </Text>
              <Text style={[styles.supportSub, { color: theme.textSecondary }]}>
                Our town dispatch support team is available 24/7
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.supportBtn, { backgroundColor: theme.primary }]}
              onPress={() => showToast('Connecting to Town Support...', 'info')}
            >
              <Text style={styles.supportBtnText}>Call</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Address Modal */}
        <AddressModal
          visible={addressModalVisible}
          onClose={() => setAddressModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: 40,
    gap: 14,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  userPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  townPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    gap: 4,
    marginTop: 6,
  },
  townPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: 14,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  manageLink: {
    padding: 4,
  },
  manageLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  addressItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  addressTagPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
  },
  addressTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  addressItemText: {
    fontSize: 13,
    flex: 1,
  },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  favThumb: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    marginRight: 10,
  },
  favInfo: {
    flex: 1,
  },
  favName: {
    fontSize: 14,
    fontWeight: '700',
  },
  favTagline: {
    fontSize: 11,
    marginTop: 1,
  },
  noFavsText: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  walletName: {
    fontSize: 13,
    fontWeight: '700',
  },
  walletStatus: {
    fontSize: 11,
    marginTop: 1,
  },
  linkedBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  faqItem: {
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: 12,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  supportSub: {
    fontSize: 11,
    marginTop: 1,
  },
  supportBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
  },
  supportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
