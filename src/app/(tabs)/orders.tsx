import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing, MaxContentWidth } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ChatModal } from '../../components/ChatModal';
import { RatingModal } from '../../components/RatingModal';
import { useRouter } from 'expo-router';
import { Order, OrderStatus } from '../../types';

export default function OrdersScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const {
    orders,
    activeOrder,
    advanceOrderStatus,
    reorder,
  } = useApp();

  const [selectedChatOrder, setSelectedChatOrder] = useState<Order | null>(null);
  const [selectedRatingOrder, setSelectedRatingOrder] = useState<Order | null>(null);

  const pastOrders = orders.filter(
    (o) => o.status === 'DELIVERED' || o.status === 'CANCELLED'
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ORDER_PLACED':
        return { label: 'Order Placed', color: '#3B82F6', bg: '#EFF6FF' };
      case 'ORDER_ACCEPTED':
        return { label: 'Accepted by Shop', color: '#8B5CF6', bg: '#F5F3FF' };
      case 'PREPARING':
        return { label: 'Preparing in Kitchen', color: '#F59E0B', bg: '#FEF3C7' };
      case 'RIDER_ASSIGNED':
        return { label: 'Rider Assigned', color: '#06B6D4', bg: '#ECFEFF' };
      case 'OUT_FOR_DELIVERY':
        return { label: 'Out for Delivery', color: '#10B981', bg: '#ECFDF5' };
      case 'DELIVERED':
        return { label: 'Delivered', color: '#10B981', bg: '#ECFDF5' };
      case 'CANCELLED':
        return { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' };
    }
  };

  const statusSteps: { key: OrderStatus; label: string }[] = [
    { key: 'ORDER_PLACED', label: 'Placed' },
    { key: 'PREPARING', label: 'Cooking' },
    { key: 'OUT_FOR_DELIVERY', label: 'On Way' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const getStepProgressIndex = (status: OrderStatus) => {
    if (status === 'ORDER_PLACED') return 0;
    if (status === 'ORDER_ACCEPTED' || status === 'PREPARING') return 1;
    if (status === 'RIDER_ASSIGNED' || status === 'OUT_FOR_DELIVERY') return 2;
    if (status === 'DELIVERED') return 3;
    return 0;
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.card }]}
      edges={['top']}
    >
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            My Orders
          </Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Live order tracker & receipt history
          </Text>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Order Banner Card */}
          {activeOrder && (
            <View style={styles.activeSection}>
              <View style={styles.activeHeaderRow}>
                <View style={[styles.livePulseDot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.activeSectionTitle, { color: theme.text }]}>
                  ACTIVE ORDER IN PROGRESS
                </Text>
              </View>

              <View
                style={[
                  styles.activeCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.primary,
                  },
                  Shadows.md,
                ]}
              >
                {/* Vendor & Status Header */}
                <View style={styles.activeVendorRow}>
                  <Image
                    source={{ uri: activeOrder.vendor.imageUrl }}
                    style={styles.vendorThumb}
                  />
                  <View style={styles.activeVendorInfo}>
                    <Text style={[styles.vendorName, { color: theme.text }]}>
                      {activeOrder.vendor.name}
                    </Text>
                    <Text style={[styles.orderNumber, { color: theme.textSecondary }]}>
                      Order #{activeOrder.orderNumber} • Rs. {activeOrder.totalAmount}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: getStatusBadge(activeOrder.status).bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: getStatusBadge(activeOrder.status).color },
                      ]}
                    >
                      {getStatusBadge(activeOrder.status).label}
                    </Text>
                  </View>
                </View>

                {/* 4-Step Progress Bar */}
                <View style={styles.stepperContainer}>
                  <View style={styles.stepperLineBg}>
                    <View
                      style={[
                        styles.stepperLineFill,
                        {
                          width: `${(getStepProgressIndex(activeOrder.status) / (statusSteps.length - 1)) * 100}%`,
                          backgroundColor: theme.primary,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.stepsRow}>
                    {statusSteps.map((step, idx) => {
                      const currentIdx = getStepProgressIndex(activeOrder.status);
                      const isCompleted = idx <= currentIdx;
                      return (
                        <View key={step.key} style={styles.stepCol}>
                          <View
                            style={[
                              styles.stepNode,
                              {
                                backgroundColor: isCompleted
                                  ? theme.primary
                                  : theme.backgroundElement,
                                borderColor: isCompleted
                                  ? theme.primary
                                  : theme.border,
                              },
                            ]}
                          >
                            <Ionicons
                              name={isCompleted ? 'checkmark' : 'ellipse'}
                              size={12}
                              color={isCompleted ? '#FFF' : theme.textMuted}
                            />
                          </View>
                          <Text
                            style={[
                              styles.stepLabel,
                              {
                                color: isCompleted
                                  ? theme.text
                                  : theme.textMuted,
                                fontWeight: isCompleted ? '700' : '500',
                              },
                            ]}
                          >
                            {step.label}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Delivery Handover OTP */}
                <View
                  style={[
                    styles.otpBox,
                    {
                      backgroundColor: theme.primaryLight,
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <View style={styles.otpLeft}>
                    <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
                    <View>
                      <Text style={[styles.otpTitle, { color: theme.primaryDark }]}>
                        Delivery Verification OTP: {activeOrder.deliveryOtp}
                      </Text>
                      <Text style={[styles.otpSub, { color: theme.textSecondary }]}>
                        Share with rider upon receiving food
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Active Action Buttons */}
                <View style={styles.activeActionsRow}>
                  <TouchableOpacity
                    style={[styles.trackMapBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(`/tracking/${activeOrder.id}` as any)}
                  >
                    <Ionicons name="map" size={16} color="#FFFFFF" />
                    <Text style={styles.trackMapBtnText}>Live GPS Map</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.chatBtn,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setSelectedChatOrder(activeOrder)}
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={16}
                      color={theme.text}
                    />
                    <Text style={[styles.chatBtnText, { color: theme.text }]}>
                      Chat
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.advanceBtn,
                      {
                        backgroundColor: theme.secondaryLight,
                        borderColor: theme.secondary,
                      },
                    ]}
                    onPress={() => advanceOrderStatus(activeOrder.id)}
                  >
                    <Ionicons name="play-forward" size={14} color={theme.secondary} />
                    <Text style={[styles.advanceBtnText, { color: theme.secondary }]}>
                      Simulate Next Step
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Past Orders Section */}
          <View style={styles.pastSection}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>
              PAST ORDERS & RECEIPTS ({pastOrders.length})
            </Text>

            {pastOrders.length > 0 ? (
              pastOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                const hasRated = !!ord.ratingGiven;

                return (
                  <View
                    key={ord.id}
                    style={[
                      styles.pastCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      Shadows.sm,
                    ]}
                  >
                    <View style={styles.pastCardHeader}>
                      <View style={styles.pastVendorLeft}>
                        <Image
                          source={{ uri: ord.vendor.imageUrl }}
                          style={styles.pastVendorThumb}
                        />
                        <View>
                          <Text style={[styles.pastVendorName, { color: theme.text }]}>
                            {ord.vendor.name}
                          </Text>
                          <Text style={[styles.pastDate, { color: theme.textSecondary }]}>
                            {new Date(ord.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.statusPill,
                          { backgroundColor: badge.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillText,
                            { color: badge.color },
                          ]}
                        >
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Items Summary */}
                    <View
                      style={[
                        styles.itemsSummaryBox,
                        {
                          backgroundColor: theme.backgroundElement,
                          borderColor: theme.borderLight,
                        },
                      ]}
                    >
                      {ord.items.map((item, i) => (
                        <Text
                          key={i}
                          style={[styles.itemSummaryText, { color: theme.text }]}
                        >
                          {item.quantity}x {item.menuItem.name}
                        </Text>
                      ))}
                      <View
                        style={[
                          styles.receiptDivider,
                          { borderTopColor: theme.borderLight },
                        ]}
                      >
                        <Text style={[styles.totalPaidText, { color: theme.text }]}>
                          Total Paid: Rs. {ord.totalAmount} ({ord.paymentMethod.replace(/_/g, ' ')})
                        </Text>
                      </View>
                    </View>

                    {/* Rating Feedback Display if Rated */}
                    {ord.ratingGiven && (
                      <View style={styles.ratedBox}>
                        <View style={styles.ratedStarsRow}>
                          <Ionicons name="star" size={14} color="#FBBF24" />
                          <Text style={[styles.ratedText, { color: theme.text }]}>
                            Rated: Food {ord.ratingGiven.foodRating}★ • Rider {ord.ratingGiven.riderRating}★
                          </Text>
                        </View>
                        {ord.ratingGiven.reviewComment ? (
                          <Text style={[styles.ratedComment, { color: theme.textSecondary }]}>
                            "{ord.ratingGiven.reviewComment}"
                          </Text>
                        ) : null}
                      </View>
                    )}

                    {/* Actions Row */}
                    <View style={styles.pastActionsRow}>
                      <TouchableOpacity
                        style={[
                          styles.reorderBtn,
                          {
                            backgroundColor: theme.primaryLight,
                            borderColor: theme.primary,
                          },
                        ]}
                        onPress={() => {
                          reorder(ord);
                          router.push('/(tabs)/cart');
                        }}
                      >
                        <Ionicons name="repeat" size={16} color={theme.primary} />
                        <Text style={[styles.reorderBtnText, { color: theme.primary }]}>
                          Re-Order
                        </Text>
                      </TouchableOpacity>

                      {!hasRated && ord.status === 'DELIVERED' && (
                        <TouchableOpacity
                          style={[
                            styles.rateBtn,
                            {
                              backgroundColor: theme.backgroundElement,
                              borderColor: theme.border,
                            },
                          ]}
                          onPress={() => setSelectedRatingOrder(ord)}
                        >
                          <Ionicons name="star-outline" size={16} color="#F59E0B" />
                          <Text style={[styles.rateBtnText, { color: theme.text }]}>
                            Rate Food & Rider
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <View
                style={[
                  styles.emptyPastCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Ionicons name="receipt-outline" size={44} color={theme.textMuted} />
                <Text style={[styles.emptyPastTitle, { color: theme.text }]}>
                  No past orders yet
                </Text>
                <Text style={[styles.emptyPastSub, { color: theme.textSecondary }]}>
                  When you order food from local stalls, your receipts will appear here
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Chat Modal */}
        {selectedChatOrder && (
          <ChatModal
            visible={!!selectedChatOrder}
            order={selectedChatOrder}
            onClose={() => setSelectedChatOrder(null)}
          />
        )}

        {/* Rating Modal */}
        {selectedRatingOrder && (
          <RatingModal
            visible={!!selectedRatingOrder}
            order={selectedRatingOrder}
            onClose={() => setSelectedRatingOrder(null)}
          />
        )}
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
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: 40,
    gap: 16,
  },
  activeSection: {},
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  activeCard: {
    padding: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    gap: 12,
  },
  activeVendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vendorThumb: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    marginRight: 10,
  },
  activeVendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '800',
  },
  orderNumber: {
    fontSize: 12,
    marginTop: 1,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  stepperContainer: {
    marginVertical: 4,
    position: 'relative',
  },
  stepperLineBg: {
    position: 'absolute',
    top: 10,
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: '#E2E8F0',
  },
  stepperLineFill: {
    height: '100%',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    alignItems: 'center',
    width: 60,
  },
  stepNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 10,
  },
  otpBox: {
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  otpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otpTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  otpSub: {
    fontSize: 11,
    marginTop: 1,
  },
  activeActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  trackMapBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    gap: 6,
  },
  trackMapBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  advanceBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  advanceBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pastSection: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pastCard: {
    padding: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: 10,
  },
  pastCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pastVendorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pastVendorThumb: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    marginRight: 10,
  },
  pastVendorName: {
    fontSize: 14,
    fontWeight: '800',
  },
  pastDate: {
    fontSize: 11,
    marginTop: 1,
  },
  itemsSummaryBox: {
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  itemSummaryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  receiptDivider: {
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 6,
  },
  totalPaidText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratedBox: {
    padding: 6,
  },
  ratedStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratedComment: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  pastActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  reorderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  reorderBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  rateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  rateBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyPastCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  emptyPastTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptyPastSub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
