import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { MenuItem } from '../types';

interface FoodItemCardProps {
  item: MenuItem;
  onPressAdd: (item: MenuItem) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  onPressAdd,
}) => {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const hasOptions = item.optionGroups && item.optionGroups.length > 0;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        Shadows.sm,
      ]}
    >
      <View style={styles.contentLeft}>
        {/* Badges & Indicators */}
        <View style={styles.indicatorRow}>
          {/* Veg / Non-Veg Icon */}
          <View
            style={[
              styles.vegIndicator,
              { borderColor: item.isVeg ? '#10B981' : '#EF4444' },
            ]}
          >
            <View
              style={[
                styles.vegDot,
                { backgroundColor: item.isVeg ? '#10B981' : '#EF4444' },
              ]}
            />
          </View>

          {item.isBestseller && (
            <View style={styles.bestsellerBadge}>
              <Ionicons name="star" size={10} color="#D97706" />
              <Text style={styles.bestsellerText}>BESTSELLER</Text>
            </View>
          )}

          {item.isSpicy && (
            <View style={styles.spicyBadge}>
              <MaterialCommunityIcons name="chili-hot" size={11} color="#EF4444" />
              <Text style={styles.spicyText}>Spicy</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.text }]}>
            Rs. {item.price}
          </Text>
          {item.originalPrice && (
            <Text style={[styles.originalPrice, { color: theme.textMuted }]}>
              Rs. {item.originalPrice}
            </Text>
          )}
        </View>

        {/* Description */}
        <Text
          style={[styles.description, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>

      {/* Right Image + Add Button Container */}
      <View style={styles.contentRight}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: item.isAvailable ? theme.primaryLight : theme.backgroundElement,
              borderColor: item.isAvailable ? theme.primary : theme.border,
            },
          ]}
          disabled={!item.isAvailable}
          onPress={() => onPressAdd(item)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.addButtonText,
              {
                color: item.isAvailable ? theme.primary : theme.textMuted,
              },
            ]}
          >
            {item.isAvailable ? 'ADD' : 'OUT'}
          </Text>
          {item.isAvailable && (
            <Ionicons name="add" size={14} color={theme.primary} />
          )}
        </TouchableOpacity>

        {hasOptions && item.isAvailable && (
          <Text style={[styles.customizableText, { color: theme.textMuted }]}>
            customizable
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.two,
    alignItems: 'center',
  },
  contentLeft: {
    flex: 1,
    paddingRight: 12,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  vegIndicator: {
    width: 15,
    height: 15,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  bestsellerText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  spicyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  spicyText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B91C1C',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  contentRight: {
    alignItems: 'center',
    width: 100,
  },
  image: {
    width: 95,
    height: 85,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
  },
  addButton: {
    marginTop: -16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: 2,
    minWidth: 78,
    backgroundColor: '#FFF',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  customizableText: {
    fontSize: 9,
    marginTop: 4,
    fontWeight: '500',
  },
});
