import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing, MaxContentWidth } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { VendorCard } from '../../components/VendorCard';
import { FoodItemCard } from '../../components/FoodItemCard';
import { ItemCustomizerModal } from '../../components/ItemCustomizerModal';
import { VendorSwitchModal } from '../../components/VendorSwitchModal';
import { MenuItem, SelectedOption } from '../../types';

interface CuisineGridItem {
  id: string;
  name: string;
  query: string;
  imageUrl: string;
  dishCount: string;
}

const CUISINES: CuisineGridItem[] = [
  {
    id: 'c1',
    name: 'Dum Biryani & Karahi',
    query: 'biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
    dishCount: '8+ dishes',
  },
  {
    id: 'c2',
    name: 'Street Bun Kabab & Roll',
    query: 'bun kabab',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    dishCount: '12+ stalls',
  },
  {
    id: 'c3',
    name: 'Crispy Burgers & Broast',
    query: 'burger',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=300&q=80',
    dishCount: '15+ combos',
  },
  {
    id: 'c4',
    name: 'Shinwari Charcoal BBQ',
    query: 'bbq',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
    dishCount: '10+ platters',
  },
  {
    id: 'c5',
    name: 'Karak Matka Chai & Paratha',
    query: 'chai',
    imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc5058f407b?auto=format&fit=crop&w=300&q=80',
    dishCount: '6+ varieties',
  },
  {
    id: 'c6',
    name: 'Fresh Bakery & Mithai',
    query: 'sweets',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    dishCount: '14+ items',
  },
];

const POPULAR_SEARCHES = [
  'Dum Biryani',
  'Daal Anda Bun Kabab',
  'Zinger Burger',
  'Matka Chai',
  'Malai Boti',
  'Aloo Paratha',
  'Gulab Jamun',
  'Gol Gappay',
];

export default function ExploreScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const {
    vendors,
    menuItems,
    addToCart,
    clearCart,
    getVendorById,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customizerVisible, setCustomizerVisible] = useState(false);
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

  // Search Results
  const matchingVendors = localSearch.trim()
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          v.tagline.toLowerCase().includes(localSearch.toLowerCase()) ||
          v.cuisineTypes.some((c) =>
            c.toLowerCase().includes(localSearch.toLowerCase())
          )
      )
    : [];

  const matchingDishes = localSearch.trim()
    ? menuItems.filter(
        (m) =>
          m.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          m.description.toLowerCase().includes(localSearch.toLowerCase()) ||
          m.category.toLowerCase().includes(localSearch.toLowerCase())
      )
    : [];

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

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.card }]}
      edges={['top']}
    >
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Explore Town Flavors
          </Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Search local food stalls, dishes & authentic cravings
          </Text>

          {/* Search Box */}
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search dishes, stalls, or street chai..."
              placeholderTextColor={theme.textMuted}
              value={localSearch}
              onChangeText={setLocalSearch}
              returnKeyType="search"
            />
            {localSearch.length > 0 && (
              <TouchableOpacity onPress={() => setLocalSearch('')}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {localSearch.trim().length === 0 ? (
            <>
              {/* Popular Searches */}
              <View style={styles.sectionWrap}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Trending Searches in Town
                </Text>
                <View style={styles.chipsWrap}>
                  {POPULAR_SEARCHES.map((chip, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.trendChip,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                        Shadows.sm,
                      ]}
                      onPress={() => setLocalSearch(chip)}
                    >
                      <Ionicons name="trending-up" size={14} color={theme.primary} />
                      <Text style={[styles.trendChipText, { color: theme.text }]}>
                        {chip}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Browse by Cuisine Grid */}
              <View style={styles.sectionWrap}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Browse by Town Cuisines
                </Text>
                <View style={styles.gridContainer}>
                  {CUISINES.map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine.id}
                      style={[
                        styles.gridCard,
                        { backgroundColor: theme.card, borderColor: theme.border },
                        Shadows.sm,
                      ]}
                      onPress={() => setLocalSearch(cuisine.query)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: cuisine.imageUrl }}
                        style={styles.gridImage}
                      />
                      <View style={styles.gridContent}>
                        <Text
                          style={[styles.gridTitle, { color: theme.text }]}
                          numberOfLines={1}
                        >
                          {cuisine.name}
                        </Text>
                        <Text
                          style={[
                            styles.gridSubtitle,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {cuisine.dishCount}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            /* Active Search Results */
            <View style={styles.resultsContainer}>
              <Text style={[styles.resultsHeader, { color: theme.text }]}>
                Results for "{localSearch}"
              </Text>

              {/* Matching Dishes */}
              {matchingDishes.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>
                    DISHES ({matchingDishes.length})
                  </Text>
                  {matchingDishes.map((dish) => (
                    <FoodItemCard
                      key={dish.id}
                      item={dish}
                      onPressAdd={handleDishAddPress}
                    />
                  ))}
                </View>
              )}

              {/* Matching Vendors */}
              {matchingVendors.length > 0 && (
                <View style={styles.resultGroup}>
                  <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>
                    FOOD SPOTS & RESTAURANTS ({matchingVendors.length})
                  </Text>
                  {matchingVendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </View>
              )}

              {matchingDishes.length === 0 && matchingVendors.length === 0 && (
                <View
                  style={[
                    styles.noResultsCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="magnify-close"
                    size={48}
                    color={theme.textMuted}
                  />
                  <Text style={[styles.noResultsTitle, { color: theme.text }]}>
                    No matches for "{localSearch}"
                  </Text>
                  <Text
                    style={[
                      styles.noResultsSub,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Try searching for "Biryani", "Bun Kabab", "Chai", or "Burgers"
                  </Text>
                  <TouchableOpacity
                    style={[styles.clearBtn, { backgroundColor: theme.primary }]}
                    onPress={() => setLocalSearch('')}
                  >
                    <Text style={styles.clearBtnText}>Clear Search</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Customization Bottom Sheet */}
        <ItemCustomizerModal
          visible={customizerVisible}
          item={selectedItem}
          onClose={() => {
            setCustomizerVisible(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleCustomizerAddToCart}
        />

        {/* Vendor Switch Confirmation Modal */}
        <VendorSwitchModal
          visible={switchModalVisible}
          onCancel={() => {
            setSwitchModalVisible(false);
            setPendingItem(null);
          }}
          onConfirmClear={handleConfirmVendorSwitch}
          newVendorName={
            pendingItem ? getVendorById(pendingItem.vendorId)?.name || 'New Shop' : 'New Shop'
          }
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
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionWrap: {
    paddingHorizontal: Spacing.three,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  trendChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  gridContent: {
    padding: 10,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  gridSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  resultsContainer: {
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  resultGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  noResultsCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginVertical: 20,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },
  noResultsSub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  clearBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
