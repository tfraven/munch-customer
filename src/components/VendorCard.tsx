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
import { Vendor } from '../types';
import { useApp } from '../context/AppContext';
import { useRouter } from 'expo-router';

interface VendorCardProps {
  vendor: Vendor;
  compact?: boolean;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  compact = false,
}) => {
  const { isFavorite, toggleFavorite } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const favorited = isFavorite(vendor.id);

  const getStatusColor = () => {
    switch (vendor.status) {
      case 'OPEN':
        return '#10B981';
      case 'BUSY':
        return '#F59E0B';
      case 'CLOSED':
        return '#EF4444';
    }
  };

  const handlePress = () => {
    router.push(`/vendor/${vendor.id}` as any);
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactCard,
          { backgroundColor: theme.card, borderColor: theme.border },
          Shadows.sm,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image source={{ uri: vendor.imageUrl }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={[styles.compactName, { color: theme.text }]} numberOfLines={1}>
            {vendor.name}
          </Text>
          <View style={styles.compactMetaRow}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {vendor.rating}
              </Text>
            </View>
            <Text style={[styles.dot, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.compactTime, { color: theme.textSecondary }]}>
              {vendor.deliveryTimeEstimate}
            </Text>
          </View>
          <Text style={[styles.compactTagline, { color: theme.textMuted }]} numberOfLines={1}>
            {vendor.tagline}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        Shadows.md,
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: vendor.coverImageUrl || vendor.imageUrl }} style={styles.image} />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(vendor.id);
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={20}
            color={favorited ? '#EF4444' : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Discount Badge */}
        {vendor.discountBadge && (
          <View style={styles.discountBadge}>
            <Ionicons name="pricetag" size={12} color="#FFFFFF" />
            <Text style={styles.discountBadgeText}>{vendor.discountBadge}</Text>
          </View>
        )}

        {/* Status indicator */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: 'rgba(0,0,0,0.7)' },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{vendor.status}</Text>
        </View>
      </View>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {vendor.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={13} color="#FBBF24" />
            <Text style={styles.ratingValue}>{vendor.rating}</Text>
            <Text style={styles.reviewCount}>({vendor.reviewCount})</Text>
          </View>
        </View>

        <Text style={[styles.tagline, { color: theme.textSecondary }]} numberOfLines={1}>
          {vendor.tagline}
        </Text>

        {/* Cuisine tags */}
        <View style={styles.cuisineRow}>
          {vendor.cuisineTypes.slice(0, 3).map((cuisine, idx) => (
            <View
              key={idx}
              style={[
                styles.cuisinePill,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <Text style={[styles.cuisineText, { color: theme.textSecondary }]}>
                {cuisine}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom Logistics Meta */}
        <View style={[styles.metaRow, { borderTopColor: theme.borderLight }]}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {vendor.deliveryTimeEstimate}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {vendor.distanceKm} km
            </Text>
          </View>

          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="moped"
              size={15}
              color={vendor.isFreeDelivery ? '#10B981' : theme.textSecondary}
            />
            <Text
              style={[
                styles.metaText,
                {
                  color: vendor.isFreeDelivery ? '#10B981' : theme.textSecondary,
                  fontWeight: vendor.isFreeDelivery ? '700' : '500',
                },
              ]}
            >
              {vendor.isFreeDelivery || vendor.deliveryFee === 0
                ? 'FREE'
                : `Rs. ${vendor.deliveryFee}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.three,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoContainer: {
    padding: 14,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.md,
    gap: 3,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  reviewCount: {
    fontSize: 11,
    color: '#B45309',
  },
  tagline: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  cuisineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  cuisinePill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
  },
  cuisineText: {
    fontSize: 11,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Compact Style (e.g. for horizontal trending feeds)
  compactCard: {
    width: 220,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
  },
  compactImage: {
    width: '100%',
    height: 110,
  },
  compactContent: {
    padding: 10,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '700',
  },
  compactMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dot: {
    fontSize: 10,
  },
  compactTime: {
    fontSize: 11,
  },
  compactTagline: {
    fontSize: 11,
    marginTop: 2,
  },
});
