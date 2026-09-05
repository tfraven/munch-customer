import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing, MaxContentWidth } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { AddressModal } from '../../components/AddressModal';
import { PromoModal } from '../../components/PromoModal';
import { useRouter } from 'expo-router';
import { PaymentMethod } from '../../types';

export default function CartScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const {
    cart,
    cartVendorName,
    cartVendorId,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    serviceFee,
    discountAmount,
    totalAmount,
    appliedPromo,
    removePromo,
    restaurantNotes,
    setRestaurantNotes,
    riderNotes,
    setRiderNotes,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    currentAddress,
    placeOrder,
  } = useApp();

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [promoModalVisible, setPromoModalVisible] = useState(false);

  const handleCheckout = () => {
    const newOrder = placeOrder();
    if (newOrder) {
      router.push(`/tracking/${newOrder.id}` as any);
    }
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: string; badge?: string }[] = [
    {
      id: 'CASH_ON_DELIVERY',
      label: 'Cash on Delivery (COD)',
      icon: 'cash-multiple',
      badge: 'RECOMMENDED FOR TOWN',
    },
    {
      id: 'EASYPAISA',
      label: 'Easypaisa Mobile Wallet',
      icon: 'cellphone-wireless',
    },
    {
      id: 'JAZZCASH',
      label: 'JazzCash Wallet',
      icon: 'wallet-outline',
    },
    {
      id: 'CREDIT_DEBIT_CARD',
      label: 'Debit / Credit Card',
      icon: 'credit-card-outline',
    },
  ];

  if (cart.length === 0) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.card }]}
        edges={['top']}
      >
        <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Your Cart
            </Text>
          </View>

          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="bag-handle" size={54} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Your cart is empty
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Explore local food stalls, biryani pots, and chai corners in town!
            </Text>
            <TouchableOpacity
              style={[
                styles.browseBtn,
                { backgroundColor: theme.primary },
                Shadows.md,
              ]}
              onPress={() => router.push('/' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.browseBtnText}>Browse Food in Town</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.card }]}
      edges={['top']}
    >
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Review Your Order
            </Text>
            <Text style={[styles.headerVendor, { color: theme.primary }]}>
              From: {cartVendorName}
            </Text>
          </View>
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={[styles.clearBtnText, { color: theme.danger }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cart Items List */}
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              ORDER ITEMS ({cart.length})
            </Text>

            {cart.map((item) => (
              <View
                key={item.cartItemId}
                style={[
                  styles.itemRow,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  Shadows.sm,
                ]}
              >
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: theme.text }]}>
                    {item.menuItem.name}
                  </Text>

                  {/* Selected Options Summary */}
                  {item.selectedOptions.length > 0 && (
                    <Text style={[styles.itemOptions, { color: theme.textSecondary }]}>
                      {item.selectedOptions.map((o) => o.optionName).join(', ')}
                    </Text>
                  )}

                  {/* Special note if any */}
                  {item.specialInstructions && (
                    <Text style={[styles.itemNote, { color: theme.primary }]}>
                      Note: "{item.specialInstructions}"
                    </Text>
                  )}

                  <Text style={[styles.itemPrice, { color: theme.text }]}>
                    Rs. {item.itemTotalPrice}
                  </Text>
                </View>

                {/* Quantity Controls */}
                <View
                  style={[
                    styles.qtyContainer,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => updateCartItemQuantity(item.cartItemId, -1)}
                    style={styles.qtyBtn}
                  >
                    <Ionicons
                      name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                      size={16}
                      color={item.quantity === 1 ? theme.danger : theme.text}
                    />
                  </TouchableOpacity>

                  <Text style={[styles.qtyNumber, { color: theme.text }]}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => updateCartItemQuantity(item.cartItemId, 1)}
                    style={styles.qtyBtn}
                  >
                    <Ionicons name="add" size={16} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Add more items link */}
            {cartVendorId && (
              <TouchableOpacity
                style={styles.addMoreRow}
                onPress={() => router.push(`/vendor/${cartVendorId}` as any)}
              >
                <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
                <Text style={[styles.addMoreText, { color: theme.primary }]}>
                  + Add more items from {cartVendorName}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Delivery Address Review */}
          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <View style={styles.cardBoxHeader}>
              <View style={styles.cardBoxHeaderLeft}>
                <Ionicons name="location" size={20} color={theme.primary} />
                <Text style={[styles.boxTitle, { color: theme.text }]}>
                  Delivery Address
                </Text>
              </View>
              <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
                <Text style={[styles.changeLink, { color: theme.primary }]}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.addressText, { color: theme.text }]}>
              {currentAddress.label}: {currentAddress.street}, {currentAddress.area}
            </Text>
            {currentAddress.notes && (
              <Text style={[styles.addressNotes, { color: theme.textMuted }]}>
                Directions: {currentAddress.notes}
              </Text>
            )}
          </View>

          {/* Special Instructions Fields */}
          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <View style={styles.cardBoxHeader}>
              <View style={styles.cardBoxHeaderLeft}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={18}
                  color={theme.primary}
                />
                <Text style={[styles.boxTitle, { color: theme.text }]}>
                  Instructions for Restaurant
                </Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.instructionInput,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. Make it spicy, no onions, extra disposable spoons..."
              placeholderTextColor={theme.textMuted}
              value={restaurantNotes}
              onChangeText={setRestaurantNotes}
            />

            <View style={[styles.cardBoxHeader, { marginTop: 14 }]}>
              <View style={styles.cardBoxHeaderLeft}>
                <MaterialCommunityIcons
                  name="moped"
                  size={18}
                  color={theme.secondary}
                />
                <Text style={[styles.boxTitle, { color: theme.text }]}>
                  Instructions for Delivery Rider
                </Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.instructionInput,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="e.g. Call when outside gate, bring change for Rs. 1000..."
              placeholderTextColor={theme.textMuted}
              value={riderNotes}
              onChangeText={setRiderNotes}
            />
          </View>

          {/* Promo Voucher Voucher Box */}
          <TouchableOpacity
            style={[
              styles.cardBox,
              {
                backgroundColor: appliedPromo
                  ? theme.secondaryLight
                  : theme.card,
                borderColor: appliedPromo ? theme.secondary : theme.border,
              },
              Shadows.sm,
            ]}
            onPress={() => setPromoModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.cardBoxHeader}>
              <View style={styles.cardBoxHeaderLeft}>
                <Ionicons
                  name="pricetag"
                  size={20}
                  color={appliedPromo ? theme.secondary : theme.primary}
                />
                <View>
                  <Text
                    style={[
                      styles.boxTitle,
                      {
                        color: appliedPromo ? theme.secondary : theme.text,
                      },
                    ]}
                  >
                    {appliedPromo
                      ? `Promo "${appliedPromo.code}" Applied`
                      : 'Apply Promo Voucher'}
                  </Text>
                  <Text style={[styles.promoSub, { color: theme.textSecondary }]}>
                    {appliedPromo
                      ? `Saved Rs. ${discountAmount} on this order!`
                      : 'Tap to enter or select town discount codes'}
                  </Text>
                </View>
              </View>

              {appliedPromo ? (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    removePromo();
                  }}
                >
                  <Text style={[styles.removePromoText, { color: theme.danger }]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              )}
            </View>
          </TouchableOpacity>

          {/* Payment Method Selector */}
          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <Text style={[styles.boxTitle, { color: theme.text, marginBottom: 10 }]}>
              Select Payment Method
            </Text>

            {paymentMethods.map((pm) => {
              const isSelected = selectedPaymentMethod === pm.id;
              return (
                <TouchableOpacity
                  key={pm.id}
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: isSelected
                        ? theme.primaryLight
                        : theme.backgroundElement,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedPaymentMethod(pm.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentOptionLeft}>
                    <MaterialCommunityIcons
                      name={pm.icon as any}
                      size={22}
                      color={isSelected ? theme.primary : theme.textSecondary}
                    />
                    <View>
                      <Text
                        style={[
                          styles.paymentLabel,
                          {
                            color: isSelected
                              ? theme.primaryDark
                              : theme.text,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}
                      >
                        {pm.label}
                      </Text>
                      {pm.badge && (
                        <Text style={[styles.pmBadge, { color: theme.primary }]}>
                          {pm.badge}
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
          </View>

          {/* Bill Summary Breakdown */}
          <View
            style={[
              styles.cardBox,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.sm,
            ]}
          >
            <Text style={[styles.boxTitle, { color: theme.text, marginBottom: 12 }]}>
              Bill Details
            </Text>

            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: theme.textSecondary }]}>
                Item Subtotal
              </Text>
              <Text style={[styles.billValue, { color: theme.text }]}>
                Rs. {cartSubtotal}
              </Text>
            </View>

            <View style={styles.billRow}>
              <View style={styles.billFeeInfo}>
                <Text style={[styles.billLabel, { color: theme.textSecondary }]}>
                  Town Delivery Fee (Flat ~3 km)
                </Text>
              </View>
              <Text
                style={[
                  styles.billValue,
                  {
                    color: deliveryFee === 0 ? '#10B981' : theme.text,
                    fontWeight: deliveryFee === 0 ? '700' : '500',
                  },
                ]}
              >
                {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
              </Text>
            </View>

            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: theme.textSecondary }]}>
                Platform Service Fee
              </Text>
              <Text style={[styles.billValue, { color: theme.text }]}>
                Rs. {serviceFee}
              </Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: '#10B981' }]}>
                  Promo Savings ({appliedPromo?.code})
                </Text>
                <Text style={[styles.billValue, { color: '#10B981', fontWeight: '800' }]}>
                  - Rs. {discountAmount}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.billTotalRow,
                { borderTopColor: theme.border },
              ]}
            >
              <View>
                <Text style={[styles.grandTotalLabel, { color: theme.text }]}>
                  Grand Total
                </Text>
                <Text style={[styles.taxInclusive, { color: theme.textMuted }]}>
                  Inclusive of all town taxes & fees
                </Text>
              </View>
              <Text style={[styles.grandTotalValue, { color: theme.primary }]}>
                Rs. {totalAmount}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Floating Checkout Footer */}
        <View
          style={[
            styles.checkoutFooter,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.border,
            },
            Shadows.lg,
          ]}
        >
          <View style={styles.footerPriceInfo}>
            <Text style={[styles.footerTotalLabel, { color: theme.textSecondary }]}>
              Pay via {selectedPaymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'Wallet'}
            </Text>
            <Text style={[styles.footerTotalVal, { color: theme.text }]}>
              Rs. {totalAmount}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.placeOrderBtn,
              { backgroundColor: theme.primary },
              Shadows.md,
            ]}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Address Modal */}
        <AddressModal
          visible={addressModalVisible}
          onClose={() => setAddressModalVisible(false)}
        />

        {/* Promo Modal */}
        <PromoModal
          visible={promoModalVisible}
          onClose={() => setPromoModalVisible(false)}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerVendor: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: 110,
    gap: 14,
  },
  sectionCard: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemOptions: {
    fontSize: 11,
    marginTop: 2,
  },
  itemNote: {
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 4,
    height: 36,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 6,
  },
  addMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  addMoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardBox: {
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  cardBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardBoxHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  addressNotes: {
    fontSize: 11,
    marginTop: 2,
  },
  instructionInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    marginTop: 4,
  },
  promoSub: {
    fontSize: 11,
    marginTop: 2,
  },
  removePromoText: {
    fontSize: 13,
    fontWeight: '700',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentLabel: {
    fontSize: 13,
  },
  pmBadge: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 1,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billFeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  billLabel: {
    fontSize: 13,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  taxInclusive: {
    fontSize: 10,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerPriceInfo: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  footerTotalVal: {
    fontSize: 20,
    fontWeight: '800',
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 280,
  },
  browseBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.lg,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
