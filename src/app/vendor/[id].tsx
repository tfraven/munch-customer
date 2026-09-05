import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing, MaxContentWidth } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FoodItemCard } from '../../components/FoodItemCard';
import { ItemCustomizerModal } from '../../components/ItemCustomizerModal';
import { VendorSwitchModal } from '../../components/VendorSwitchModal';
import { MenuItem, SelectedOption } from '../../types';

export default function VendorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const {
    getVendorById,
    getMenuItemsByVendor,
    isFavorite,
    toggleFavorite,
    addToCart,
    clearCart,
    cart,
    cartVendorId,
    cartSubtotal,
    cartCount,
  } = useApp();

  const vendor = getVendorById(id || '');
  const menuItems = getMenuItemsByVendor(id || '');

  const [searchInShop, setSearchInShop] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customizerVisible, setCustomizerVisible] = useState(false);
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

  const favorited = vendor ? isFavorite(vendor.id) : false;

  // Extract unique categories from menu
  const menuCategories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((m) => m.category)));
    return ['All', ...cats];
  }, [menuItems]);

  // Filtered menu
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchInShop.trim()) {
        const q = searchInShop.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchInShop]);

  if (!vendor) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: theme.text }]}>
            Shop not found
          </Text>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDishAddPress = (dish: MenuItem) => {
    if (dish.optionGroups && dish.optionGroups.length > 0) {
      setSelectedItem(dish);
      setCustomizerVisible(true);
    } else {
      const res = addToCart(dish, [], 1);
      if (res.requiresVendorClear) {
        setPendingItem(dish);
        setSwitchModalVisible(true);
      }
    }
  };

  const handleCustomizerAddToCart = (
    item: MenuItem,
    selectedOptions: SelectedOption[],
    quantity: number,
    specialInstructions?: string
  ) => {
    const res = addToCart(item, selectedOptions, quantity, specialInstructions);
    if (res.requiresVendorClear) {
      setPendingItem(item);
      setSwitchModalVisible(true);
    }
  };

  const handleConfirmVendorSwitch = () => {
    clearCart();
    setSwitchModalVisible(false);
    if (pendingItem) {
      if (pendingItem.optionGroups && pendingItem.optionGroups.length > 0) {
        setSelectedItem(pendingItem);
        setCustomizerVisible(true);
      } else {
        addToCart(pendingItem, [], 1);
      }
      setPendingItem(null);
    }
  };

  const isCartFromThisVendor = cart.length > 0 && cartVendorId === vendor.id;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.card }]}
      edges={['top']}
    >
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Cover Image */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: vendor.coverImageUrl || vendor.imageUrl }}
              style={styles.heroImage}
            />

            {/* Navigation Overlay Buttons */}
            <TouchableOpacity
              style={styles.floatingNavBtnLeft}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingNavBtnRight}
              onPress={() => toggleFavorite(vendor.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={22}
                color={favorited ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>

            {/* Discount Badge */}
            {vendor.discountBadge && (
              <View style={styles.heroDiscountBadge}>
                <Ionicons name="pricetag" size={12} color="#FFFFFF" />
                <Text style={styles.heroDiscountText}>{vendor.discountBadge}</Text>
              </View>
            )}
          </View>

          {/* Shop Information Card */}
          <View
            style={[
              styles.infoCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              Shadows.md,
            ]}
          >
            <View style={styles.nameHeaderRow}>
              <Text style={[styles.vendorName, { color: theme.text }]}>
                {vendor.name}
              </Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={13} color="#FBBF24" />
                <Text style={styles.ratingNumber}>{vendor.rating}</Text>
                <Text style={styles.ratingCount}>({vendor.reviewCount})</Text>
              </View>
            </View>

            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              {vendor.tagline}
            </Text>

            {/* Address & Hours */}
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={15} color={theme.textSecondary} />
              <Text style={[styles.addressText, { color: theme.textSecondary }]}>
                {vendor.location.address}, {vendor.location.townArea}
              </Text>
            </View>

            <View style={styles.hoursRow}>
              <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.hoursText, { color: theme.textSecondary }]}>
                Hours: {vendor.openingHours}
              </Text>
            </View>

            {/* Metrics Chips */}
            <View
              style={[
                styles.metricsGrid,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.borderLight,
                },
              ]}
            >
              <View style={styles.metricItem}>
                <Ionicons name="bicycle-outline" size={18} color={theme.primary} />
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  Delivery Fee
                </Text>
                <Text style={[styles.metricVal, { color: theme.text }]}>
                  {vendor.isFreeDelivery ? 'FREE' : `Rs. ${vendor.deliveryFee}`}
                </Text>
              </View>

              <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />

              <View style={styles.metricItem}>
                <Ionicons name="timer-outline" size={18} color={theme.primary} />
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  Est. Time
                </Text>
                <Text style={[styles.metricVal, { color: theme.text }]}>
                  {vendor.deliveryTimeEstimate}
                </Text>
              </View>

              <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />

              <View style={styles.metricItem}>
                <MaterialCommunityIcons
                  name="storefront-outline"
                  size={18}
                  color={theme.primary}
                />
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  Distance
                </Text>
                <Text style={[styles.metricVal, { color: theme.text }]}>
                  {vendor.distanceKm} km
                </Text>
              </View>
            </View>
          </View>

          {/* Search inside shop */}
          <View style={styles.searchWrap}>
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons name="search" size={18} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder={`Search in ${vendor.name}...`}
                placeholderTextColor={theme.textMuted}
                value={searchInShop}
                onChangeText={setSearchInShop}
              />
              {searchInShop.length > 0 && (
                <TouchableOpacity onPress={() => setSearchInShop('')}>
                  <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {menuCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catPill,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                    Shadows.sm,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.text,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Menu Items Feed */}
          <View style={styles.menuItemsFeed}>
            <Text style={[styles.menuHeading, { color: theme.text }]}>
              {selectedCategory === 'All' ? 'Full Menu & Daily Specials' : selectedCategory} ({filteredMenuItems.length})
            </Text>

            {filteredMenuItems.map((dish) => (
              <FoodItemCard
                key={dish.id}
                item={dish}
                onPressAdd={handleDishAddPress}
              />
            ))}
          </View>
        </ScrollView>

        {/* Floating Cart Button if Cart has items */}
        {isCartFromThisVendor && (
          <View
            style={[
              styles.floatingCartContainer,
              {
                backgroundColor: theme.card,
                borderTopColor: theme.border,
              },
              Shadows.lg,
            ]}
          >
            <TouchableOpacity
              style={[styles.floatingCartBtn, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/(tabs)/cart')}
              activeOpacity={0.85}
            >
              <View style={styles.floatingCartLeft}>
                <View style={styles.cartCountPill}>
                  <Text style={styles.cartCountText}>{cartCount}</Text>
                </View>
                <View>
                  <Text style={styles.floatingCartTitle}>View Basket</Text>
                  <Text style={styles.floatingCartSub}>
                    Subtotal: Rs. {cartSubtotal}
                  </Text>
                </View>
              </View>

              <View style={styles.floatingCartRight}>
                <Text style={styles.checkoutPrompt}>Checkout</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Customization Modal */}
        <ItemCustomizerModal
          visible={customizerVisible}
          item={selectedItem}
          onClose={() => {
            setCustomizerVisible(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleCustomizerAddToCart}
        />

        {/* Vendor Switch Confirmation */}
        <VendorSwitchModal
          visible={switchModalVisible}
          onCancel={() => {
            setSwitchModalVisible(false);
            setPendingItem(null);
          }}
          onConfirmClear={handleConfirmVendorSwitch}
          newVendorName={vendor.name}
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  heroContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  floatingNavBtnLeft: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingNavBtnRight: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroDiscountBadge: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  heroDiscountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  infoCard: {
    marginHorizontal: Spacing.three,
    marginTop: -24,
    padding: 16,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  ratingCount: {
    fontSize: 11,
    color: '#B45309',
  },
  tagline: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  addressText: {
    fontSize: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  hoursText: {
    fontSize: 11,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: 14,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 28,
  },
  searchWrap: {
    paddingHorizontal: Spacing.three,
    marginTop: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    gap: 8,
  },
  catPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
  },
  menuItemsFeed: {
    paddingHorizontal: Spacing.three,
  },
  menuHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.three,
    borderTopWidth: 1,
  },
  floatingCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartCountPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  floatingCartTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  floatingCartSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkoutPrompt: {
    color: '#FFFFFF',
    fontSize: 14,
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
