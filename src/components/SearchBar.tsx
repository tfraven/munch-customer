import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { useApp, FilterSortOption } from '../context/AppContext';

export const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
  } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const filterChips: { id: FilterSortOption; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All', icon: 'grid-outline' },
    { id: 'RATING_HIGH', label: 'Top Rated ★ 4.8+', icon: 'star' },
    { id: 'FAST_DELIVERY', label: 'Fast (<20 min)', icon: 'flash' },
    { id: 'FREE_DELIVERY', label: 'Free Delivery', icon: 'bicycle' },
    { id: 'BUDGET', label: 'Pocket Friendly', icon: 'wallet-outline' },
  ];

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search food stalls, biryani, chai, burgers..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <TouchableOpacity
              key={chip.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? theme.primary : theme.card,
                  borderColor: isActive ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setActiveFilter(chip.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive ? theme.white : theme.text,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  filterScroll: {
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: 6,
  },
  chipText: {
    fontSize: 12,
  },
});
