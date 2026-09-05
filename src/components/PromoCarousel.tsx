import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface BannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  code?: string;
  gradientColors: [string, string];
  icon: string;
}

const BANNERS: BannerItem[] = [
  {
    id: 'b1',
    badge: 'TOWN SPECIAL',
    title: 'Flat Rs. 100 OFF',
    subtitle: 'On orders above Rs. 400 with code MUNCHTOWN',
    code: 'MUNCHTOWN',
    gradientColors: ['#FF6B00', '#FF8C38'],
    icon: 'ticket-percent-outline',
  },
  {
    id: 'b2',
    badge: 'COMMUNITY FIRST',
    title: 'Local Stalls 0% Fee',
    subtitle: '100% earnings go directly to our town chefs & riders',
    code: 'FREEDEL',
    gradientColors: ['#059669', '#10B981'],
    icon: 'heart-pulse',
  },
  {
    id: 'b3',
    badge: 'NEW IN TOWN',
    title: 'Free Delivery',
    subtitle: 'On all street chai, bun kabab & snacks above Rs. 250',
    code: 'FREEDEL',
    gradientColors: ['#7C3AED', '#9333EA'],
    icon: 'moped',
  },
];

export const PromoCarousel: React.FC = () => {
  const { applyPromo, showToast } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const handleBannerPress = (banner: BannerItem) => {
    if (banner.code) {
      applyPromo(banner.code);
    } else {
      showToast('Offer active in town!', 'info');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BANNERS.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.9}
            style={[styles.bannerWrapper, Shadows.sm]}
            onPress={() => handleBannerPress(banner)}
          >
            <LinearGradient
              colors={banner.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerCard}
            >
              <View style={styles.bannerLeft}>
                <View style={styles.badgeRow}>
                  <Text style={styles.badgeText}>{banner.badge}</Text>
                </View>
                <Text style={styles.titleText}>{banner.title}</Text>
                <Text style={styles.subtitleText} numberOfLines={2}>
                  {banner.subtitle}
                </Text>
                {banner.code && (
                  <View style={styles.codeTag}>
                    <Ionicons name="pricetag" size={12} color="#FFFFFF" />
                    <Text style={styles.codeText}>Tap to apply {banner.code}</Text>
                  </View>
                )}
              </View>

              <View style={styles.bannerRight}>
                <View style={styles.iconBackdrop}>
                  <MaterialCommunityIcons
                    name={banner.icon as any}
                    size={38}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    gap: 12,
  },
  bannerWrapper: {
    width: 290,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  bannerCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: BorderRadius.xl,
    minHeight: 130,
    alignItems: 'center',
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 8,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    marginBottom: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    lineHeight: 16,
  },
  codeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  codeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  bannerRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackdrop: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
