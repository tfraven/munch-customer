import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing, MaxContentWidth } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { HeaderLocation } from '../../components/HeaderLocation';
import { SearchBar } from '../../components/SearchBar';
import { CategoryList } from '../../components/CategoryList';
import { PromoCarousel } from '../../components/PromoCarousel';
import { VendorCard } from '../../components/VendorCard';
import { AddressModal } from '../../components/AddressModal';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const {
    filteredVendors,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeFilter,
    setActiveFilter,
    vendors,
  } = useApp();

  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // Curated lists for home discovery
  const topRatedVendors = vendors.filter((v) => v.rating >= 4.8);
  const fastDeliveryVendors = vendors.filter(
    (v) => v.deliveryTimeEstimate.includes('15') || v.deliveryTimeEstimate.includes('20')
  );

  const isFilteringActive =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'All' ||
    activeFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setActiveFilter('ALL');
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.card }]}
      edges={['top']}
    >
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        {/* Top Location Bar */}
        <HeaderLocation onOpenAddressModal={() => setAddressModalVisible(true)} />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search & Filter Bar */}
          <SearchBar />

          {!isFilteringActive ? (
            <>
              {/* Promotional Banners */}
              <PromoCarousel />

              {/* Food Categories */}
              <CategoryList />

              {/* Horizontal Section: Town Favorites */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionHeading, { color: theme.text }]}>
                    🔥 Town Favorites
                  </Text>
                  <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
                    Most loved food spots in town
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveFilter('RATING_HIGH')}
                  style={styles.seeAllBtn}
                >
                  <Text style={[styles.seeAllText, { color: theme.primary }]}>
                    See all
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={theme.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalFeed}
              >
                {topRatedVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} compact />
                ))}
              </ScrollView>

              {/* Horizontal Section: Fastest Delivery */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionHeading, { color: theme.text }]}>
                    ⚡ Fastest in Town
                  </Text>
                  <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
                    Dispatched & delivered in under 20 mins
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveFilter('FAST_DELIVERY')}
                  style={styles.seeAllBtn}
                >
                  <Text style={[styles.seeAllText, { color: theme.primary }]}>
                    See all
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={theme.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalFeed}
              >
                {fastDeliveryVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} compact />
                ))}
              </ScrollView>

              {/* Main Vertical Feed Header */}
              <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionHeading, { color: theme.text }]}>
                    🍽️ All Restaurants, Stalls & Cafes
                  </Text>
                  <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
                    {vendors.length} local food spots ready to deliver
                  </Text>
                </View>
              </View>
            </>
          ) : (
            /* Search Results Header */
            <View style={styles.searchSummaryRow}>
              <Text style={[styles.searchResultsTitle, { color: theme.text }]}>
                Showing {filteredVendors.length} spots for "{selectedCategory !== 'All' ? selectedCategory : searchQuery || 'Filter'}"
              </Text>
              <TouchableOpacity onPress={resetFilters} style={styles.clearFilterBtn}>
                <Ionicons name="refresh" size={14} color={theme.primary} />
                <Text style={[styles.clearFilterText, { color: theme.primary }]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Vendors Feed */}
          <View style={styles.vendorsFeed}>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))
            ) : (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <MaterialCommunityIcons
                  name="food-off"
                  size={48}
                  color={theme.textMuted}
                />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  No food spots found
                </Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                  Try adjusting your search keywords or category filters
                </Text>
                <TouchableOpacity
                  style={[styles.resetBtn, { backgroundColor: theme.primary }]}
                  onPress={resetFilters}
                >
                  <Text style={styles.resetBtnText}>Clear All Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Address Selection Modal */}
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 1,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  horizontalFeed: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 6,
  },
  searchSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    marginVertical: 10,
  },
  searchResultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  clearFilterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  vendorsFeed: {
    paddingHorizontal: Spacing.three,
    marginTop: 6,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  resetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
