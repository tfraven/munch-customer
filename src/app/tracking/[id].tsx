import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing, MaxContentWidth } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LiveMapSimulation } from '../../components/LiveMapSimulation';
import { ChatModal } from '../../components/ChatModal';
import { RatingModal } from '../../components/RatingModal';
import { OrderStatus } from '../../types';

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const {
    orders,
    advanceOrderStatus,
    cancelOrder,
    showToast,
  } = useApp();

  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: theme.text }]}>
            Order tracking not available
          </Text>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/' as any)}
          >
            <Text style={styles.backBtnText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCallRider = () => {
    if (order.rider?.phone) {
      showToast(`Calling rider ${order.rider.name}...`, 'info');
      Linking.openURL(`tel:${order.rider.phone}`).catch(() => {});
    }
  };

  const handleCallShop = () => {
    if (order.vendor.phone) {
      showToast(`Calling ${order.vendor.name}...`, 'info');
      Linking.openURL(`tel:${order.vendor.phone}`).catch(() => {});
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'ORDER_PLACED':
        return {
          title: 'Order Placed & Sent to Kitchen',
          sub: 'Waiting for vendor to accept',
          stepIndex: 0,
        };
      case 'ORDER_ACCEPTED':
        return {
          title: 'Order Accepted by Kitchen',
          sub: 'Chef has received your ticket',
          stepIndex: 1,
        };
      case 'PREPARING':
        return {
          title: 'Preparing & Packing Fresh Food',
          sub: 'Food is being cooked hot in kitchen',
          stepIndex: 1,
        };
      case 'RIDER_ASSIGNED':
        return {
          title: 'Rider Assigned & Reached Shop',
          sub: `${order.rider?.name || 'Rider'} is collecting your parcel`,
          stepIndex: 2,
        };
      case 'OUT_FOR_DELIVERY':
        return {
          title: 'Rider is On The Way!',
          sub: `Arriving in approx ${order.estimatedDeliveryTime}`,
          stepIndex: 2,
        };
      case 'DELIVERED':
        return {
          title: 'Order Delivered Successfully!',
          sub: 'Enjoy your hot meal & please rate your rider',
          stepIndex: 3,
        };
      case 'CANCELLED':
        return {
          title: 'Order Cancelled',
          sub: 'This order was cancelled',
          stepIndex: 0,
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  const stepsList = [
    { label: 'Order Confirmed', icon: 'receipt' },
    { label: 'Cooking & Packing', icon: 'pot-steam' },
    { label: 'Out for Delivery', icon: 'moped' },
    { label: 'Delivered', icon: 'check-circle' },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.card }]}
      edges={['top']}
    >
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Live Order Tracker
            </Text>
            <Text style={[styles.orderNumberText, { color: theme.textSecondary }]}>
              Order #{order.orderNumber}
            </Text>
          </View>
          <TouchableOpacity onPress={handleCallShop} style={styles.callShopBtn}>
            <Ionicons name="call-outline" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Interactive Live Map Simulation */}
          <LiveMapSimulation order={order} height={250} />

          {/* Status Headline Banner */}
          <View
            style={[
              styles.statusBanner,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <View style={styles.statusHeaderRow}>
              <View style={styles.statusTitleWrap}>
                <Text style={[styles.statusMainTitle, { color: theme.text }]}>
                  {statusInfo.title}
                </Text>
                <Text style={[styles.statusSubtitle, { color: theme.textSecondary }]}>
                  {statusInfo.sub}
                </Text>
              </View>
              <View style={[styles.etaPill, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="time" size={14} color={theme.primary} />
                <Text style={[styles.etaText, { color: theme.primary }]}>
                  {order.status === 'DELIVERED' ? 'Done' : order.estimatedDeliveryTime}
                </Text>
              </View>
            </View>

            {/* Stepper Progression */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperBg}>
                <View
                  style={[
                    styles.stepperFill,
                    {
                      width: `${(statusInfo.stepIndex / (stepsList.length - 1)) * 100}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>

              <View style={styles.stepperNodesRow}>
                {stepsList.map((step, idx) => {
                  const isDone = idx <= statusInfo.stepIndex;
                  return (
                    <View key={idx} style={styles.stepNodeItem}>
                      <View
                        style={[
                          styles.stepDot,
                          {
                            backgroundColor: isDone
                              ? theme.primary
                              : theme.backgroundElement,
                            borderColor: isDone ? theme.primary : theme.border,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={step.icon as any}
                          size={12}
                          color={isDone ? '#FFFFFF' : theme.textMuted}
                        />
                      </View>
                      <Text
                        style={[
                          styles.stepNodeText,
                          {
                            color: isDone ? theme.text : theme.textMuted,
                            fontWeight: isDone ? '700' : '500',
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
          </View>

          {/* Secure Handover OTP Box */}
          <View
            style={[
              styles.otpCard,
              { backgroundColor: theme.primaryLight, borderColor: theme.primary },
            ]}
          >
            <View style={styles.otpLeft}>
              <Ionicons name="key-outline" size={24} color={theme.primary} />
              <View>
                <Text style={[styles.otpBadgeTitle, { color: theme.primaryDark }]}>
                  DELIVERY OTP: {order.deliveryOtp}
                </Text>
                <Text style={[styles.otpBadgeSub, { color: theme.textSecondary }]}>
                  Give this 4-digit pin to rider upon food delivery
                </Text>
              </View>
            </View>
          </View>

          {/* Rider Profile Card */}
          {order.rider && (
            <View
              style={[
                styles.riderCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                Shadows.sm,
              ]}
            >
              <View style={styles.riderHeader}>
                <Image
                  source={{ uri: order.rider.avatarUrl }}
                  style={styles.riderAvatar}
                />
                <View style={styles.riderInfo}>
                  <View style={styles.riderNameRow}>
                    <Text style={[styles.riderName, { color: theme.text }]}>
                      {order.rider.name}
                    </Text>
                    <View style={styles.riderRatingPill}>
                      <Ionicons name="star" size={12} color="#FBBF24" />
                      <Text style={styles.riderRatingText}>
                        {order.rider.rating}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.riderVehicle, { color: theme.textSecondary }]}>
                    {order.rider.vehicleModel} • {order.rider.vehicleNumber}
                  </Text>
                </View>
              </View>

              {/* Action buttons: Call & Chat */}
              <View style={styles.riderActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.riderActionBtn,
                    {
                      backgroundColor: theme.primaryLight,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={handleCallRider}
                >
                  <Ionicons name="call" size={16} color={theme.primary} />
                  <Text style={[styles.riderActionText, { color: theme.primary }]}>
                    Call Rider
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.riderActionBtn,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setChatModalVisible(true)}
                >
                  <Ionicons
                    name="chatbubbles-outline"
                    size={16}
                    color={theme.text}
                  />
                  <Text style={[styles.riderActionText, { color: theme.text }]}>
                    In-App Chat
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Delivery & Order Details Summary */}
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              Order Summary
            </Text>

            <View style={styles.summaryItemRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Restaurant:
              </Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>
                {order.vendor.name}
              </Text>
            </View>

            <View style={styles.summaryItemRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Delivering To:
              </Text>
              <Text
                style={[styles.summaryVal, { color: theme.text, flex: 1, textAlign: 'right' }]}
                numberOfLines={1}
              >
                {order.deliveryAddress.street}, {order.deliveryAddress.area}
              </Text>
            </View>

            <View style={styles.summaryItemRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Payment:
              </Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>
                Rs. {order.totalAmount} ({order.paymentMethod.replace(/_/g, ' ')})
              </Text>
            </View>

            {/* Items list */}
            <View
              style={[
                styles.itemsListContainer,
                { borderTopColor: theme.borderLight },
              ]}
            >
              {order.items.map((it, idx) => (
                <View key={idx} style={styles.orderItemLine}>
                  <Text style={[styles.orderItemQty, { color: theme.primary }]}>
                    {it.quantity}x
                  </Text>
                  <Text style={[styles.orderItemName, { color: theme.text }]}>
                    {it.menuItem.name}
                  </Text>
                  <Text style={[styles.orderItemPrice, { color: theme.text }]}>
                    Rs. {it.itemTotalPrice}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Interactive Demo Simulator Helper */}
          <View
            style={[
              styles.demoBox,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.demoTitle, { color: theme.text }]}>
              🚀 Demo Progression Simulator
            </Text>
            <Text style={[styles.demoSub, { color: theme.textSecondary }]}>
              Simulate live kitchen & rider updates in real time
            </Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={[styles.simStepBtn, { backgroundColor: theme.primary }]}
                onPress={() => advanceOrderStatus(order.id)}
              >
                <Ionicons name="play-forward" size={14} color="#FFFFFF" />
                <Text style={styles.simStepText}>Advance Next Stage</Text>
              </TouchableOpacity>

              {order.status === 'DELIVERED' && (
                <TouchableOpacity
                  style={[styles.rateTriggerBtn, { backgroundColor: theme.secondary }]}
                  onPress={() => setRatingModalVisible(true)}
                >
                  <Ionicons name="star" size={14} color="#FFFFFF" />
                  <Text style={styles.rateTriggerText}>Rate Food & Rider</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>

        {/* In-App Chat Modal */}
        <ChatModal
          visible={chatModalVisible}
          order={order}
          onClose={() => setChatModalVisible(false)}
        />

        {/* Dual Rating Modal */}
        <RatingModal
          visible={ratingModalVisible}
          order={order}
          onClose={() => setRatingModalVisible(false)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 6,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  orderNumberText: {
    fontSize: 11,
    marginTop: 1,
  },
  callShopBtn: {
    padding: 6,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: 40,
    gap: 14,
  },
  statusBanner: {
    padding: 16,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: 14,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusTitleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  statusMainTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stepperContainer: {
    marginTop: 4,
    position: 'relative',
  },
  stepperBg: {
    position: 'absolute',
    top: 14,
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: '#E2E8F0',
  },
  stepperFill: {
    height: '100%',
  },
  stepperNodesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepNodeItem: {
    alignItems: 'center',
    width: 68,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNodeText: {
    fontSize: 10,
    textAlign: 'center',
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  otpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  otpBadgeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  otpBadgeSub: {
    fontSize: 11,
    marginTop: 1,
  },
  riderCard: {
    padding: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: 12,
  },
  riderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  riderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riderName: {
    fontSize: 15,
    fontWeight: '800',
  },
  riderRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  riderRatingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  riderVehicle: {
    fontSize: 12,
    marginTop: 2,
  },
  riderActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  riderActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  riderActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryCard: {
    padding: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemsListContainer: {
    borderTopWidth: 1,
    marginTop: 6,
    paddingTop: 8,
    gap: 6,
  },
  orderItemLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderItemQty: {
    fontSize: 12,
    fontWeight: '800',
    marginRight: 6,
  },
  orderItemName: {
    fontSize: 12,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: '700',
  },
  demoBox: {
    padding: 14,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 6,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  demoSub: {
    fontSize: 11,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  simStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  simStepText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  rateTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  rateTriggerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
