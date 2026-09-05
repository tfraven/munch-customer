import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useRouter } from 'expo-router';

interface HeaderLocationProps {
  onOpenAddressModal: () => void;
}

export const HeaderLocation: React.FC<HeaderLocationProps> = ({
  onOpenAddressModal,
}) => {
  const { currentAddress, activeOrder } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      <View style={styles.topRow}>
        {/* Brand & Town Selector */}
        <TouchableOpacity
          style={styles.locationSelector}
          onPress={onOpenAddressModal}
          activeOpacity={0.7}
        >
          <View style={[styles.pinCircle, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="location" size={20} color={theme.primary} />
          </View>
          <View style={styles.addressTextContainer}>
            <View style={styles.deliverToRow}>
              <Text style={[styles.deliverToLabel, { color: theme.textSecondary }]}>
                DELIVER TO • {currentAddress.label.toUpperCase()}
              </Text>
              <Ionicons name="chevron-down" size={14} color={theme.primary} />
            </View>
            <Text
              style={[styles.addressText, { color: theme.text }]}
              numberOfLines={1}
            >
              {currentAddress.street}, {currentAddress.area}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Action icons / Live tracking badge */}
        <View style={styles.actionsRow}>
          {activeOrder && (
            <TouchableOpacity
              style={[styles.liveBadge, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
              onPress={() => router.push(`/tracking/${activeOrder.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.pulseDot, { backgroundColor: theme.primary }]} />
              <MaterialCommunityIcons name="moped" size={16} color={theme.primary} />
              <Text style={[styles.liveBadgeText, { color: theme.primary }]}>
                Track Order
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.two,
  },
  pinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addressTextContainer: {
    flex: 1,
  },
  deliverToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliverToLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  liveBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
