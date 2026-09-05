import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { Order } from '../types';

interface LiveMapSimulationProps {
  order: Order;
  height?: number;
}

export const LiveMapSimulation: React.FC<LiveMapSimulationProps> = ({
  order,
  height = 260,
}) => {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [riderProgress, setRiderProgress] = useState(0.45); // 0 = vendor, 1 = customer

  // Simulate smooth rider movement on the track
  useEffect(() => {
    if (order.status === 'OUT_FOR_DELIVERY') {
      const interval = setInterval(() => {
        setRiderProgress((prev) => {
          if (prev >= 0.95) return 0.95;
          return prev + 0.03;
        });
      }, 3000);
      return () => clearInterval(interval);
    } else if (order.status === 'DELIVERED') {
      setRiderProgress(1.0);
    } else {
      setRiderProgress(0.1);
    }
  }, [order.status]);

  // Calculate coordinates on a curved path
  // Map dimensions: width is 100%, let's say coordinates from (15%, 75%) to (85%, 25%)
  const startX = 15;
  const startY = 72;
  const endX = 85;
  const endY = 28;

  // Bezier curve point calculation
  const currentX = startX + (endX - startX) * riderProgress;
  const currentY =
    startY +
    (endY - startY) * riderProgress -
    Math.sin(riderProgress * Math.PI) * 20; // curve arc

  return (
    <View
      style={[
        styles.mapContainer,
        {
          height,
          backgroundColor: scheme === 'dark' ? '#121826' : '#E8EEF5',
          borderColor: theme.border,
        },
        Shadows.sm,
      ]}
    >
      {/* Background Town Grid Roads Simulation */}
      <View style={styles.gridOverlay}>
        <View
          style={[
            styles.roadHorizontal,
            { top: '30%', backgroundColor: scheme === 'dark' ? '#1E293B' : '#D1D5DB' },
          ]}
        />
        <View
          style={[
            styles.roadHorizontal,
            { top: '65%', backgroundColor: scheme === 'dark' ? '#1E293B' : '#D1D5DB' },
          ]}
        />
        <View
          style={[
            styles.roadVertical,
            { left: '25%', backgroundColor: scheme === 'dark' ? '#1E293B' : '#D1D5DB' },
          ]}
        />
        <View
          style={[
            styles.roadVertical,
            { left: '70%', backgroundColor: scheme === 'dark' ? '#1E293B' : '#D1D5DB' },
          ]}
        />

        {/* Town Park / Green Zone */}
        <View
          style={[
            styles.parkArea,
            {
              backgroundColor:
                scheme === 'dark'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(16, 185, 129, 0.2)',
            },
          ]}
        >
          <Text style={[styles.areaLabel, { color: '#10B981' }]}>
            Town Central Park
          </Text>
        </View>

        {/* Bazaar area */}
        <View
          style={[
            styles.bazaarArea,
            {
              backgroundColor:
                scheme === 'dark'
                  ? 'rgba(245, 158, 11, 0.08)'
                  : 'rgba(245, 158, 11, 0.15)',
            },
          ]}
        >
          <Text style={[styles.areaLabel, { color: '#D97706' }]}>
            Main Town Bazaar
          </Text>
        </View>
      </View>

      {/* Connecting Route Line */}
      <View style={styles.routeTrack}>
        <View
          style={[
            styles.trackLine,
            {
              borderColor: theme.primary,
            },
          ]}
        />
      </View>

      {/* 1. Vendor Marker (Start) */}
      <View style={[styles.markerContainer, { left: `${startX}%`, top: `${startY}%` }]}>
        <View style={[styles.markerPin, { backgroundColor: '#FF6B00' }, Shadows.md]}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={14} color="#FFF" />
        </View>
        <View style={[styles.markerLabelBox, { backgroundColor: theme.card }, Shadows.sm]}>
          <Text style={[styles.markerLabelText, { color: theme.text }]} numberOfLines={1}>
            {order.vendor.name.split(' ')[0]}
          </Text>
        </View>
      </View>

      {/* 2. Customer Destination Marker (End) */}
      <View style={[styles.markerContainer, { left: `${endX}%`, top: `${endY}%` }]}>
        <View style={[styles.markerPin, { backgroundColor: '#10B981' }, Shadows.md]}>
          <Ionicons name="home" size={14} color="#FFF" />
        </View>
        <View style={[styles.markerLabelBox, { backgroundColor: theme.card }, Shadows.sm]}>
          <Text style={[styles.markerLabelText, { color: theme.text }]} numberOfLines={1}>
            You ({order.deliveryAddress.label})
          </Text>
        </View>
      </View>

      {/* 3. Live Moving Rider Pin */}
      {order.rider && (
        <View
          style={[
            styles.riderContainer,
            {
              left: `${Math.min(90, Math.max(10, currentX))}%`,
              top: `${Math.min(85, Math.max(15, currentY))}%`,
            },
          ]}
        >
          {/* Pulsing Radar Ring */}
          <View
            style={[
              styles.radarRing,
              { borderColor: theme.primary, backgroundColor: theme.primaryLight },
            ]}
          />
          <View style={[styles.riderPin, { backgroundColor: theme.primary }, Shadows.lg]}>
            <MaterialCommunityIcons name="moped" size={18} color="#FFFFFF" />
          </View>
          <View style={[styles.riderTag, { backgroundColor: theme.card }, Shadows.sm]}>
            <Text style={[styles.riderTagText, { color: theme.primary }]}>
              {order.rider.name.split(' ')[0]} (Rider)
            </Text>
          </View>
        </View>
      )}

      {/* Floating Map Status Overlay */}
      <View
        style={[
          styles.statusOverlay,
          { backgroundColor: theme.card, borderColor: theme.border },
          Shadows.md,
        ]}
      >
        <View style={styles.statusOverlayLeft}>
          <View style={[styles.gpsDot, { backgroundColor: '#10B981' }]} />
          <View>
            <Text style={[styles.gpsStatusTitle, { color: theme.text }]}>
              Live GPS Simulation Active
            </Text>
            <Text style={[styles.gpsStatusSub, { color: theme.textSecondary }]}>
              {order.status === 'OUT_FOR_DELIVERY'
                ? `Rider is on ${order.rider?.vehicleModel || 'bike'} • ${order.estimatedDeliveryTime}`
                : order.status === 'PREPARING'
                ? 'Kitchen is packing your fresh food'
                : 'Order confirmed with shop'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.recenterBtn, { backgroundColor: theme.backgroundElement }]}
        >
          <Ionicons name="locate" size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 18,
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
  },
  parkArea: {
    position: 'absolute',
    top: '10%',
    left: '35%',
    width: '28%',
    height: '45%',
    borderRadius: BorderRadius.lg,
    padding: 6,
    justifyContent: 'flex-start',
  },
  bazaarArea: {
    position: 'absolute',
    bottom: '8%',
    right: '10%',
    width: '32%',
    height: '40%',
    borderRadius: BorderRadius.lg,
    padding: 6,
  },
  areaLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  routeTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackLine: {
    width: '75%',
    height: 60,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderRadius: 40,
    transform: [{ rotate: '-25deg' }],
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -16,
    marginTop: -16,
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerLabelBox: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '700',
  },
  riderContainer: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -22,
    marginTop: -22,
  },
  radarRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    top: -4,
    left: -4,
    opacity: 0.7,
  },
  riderPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  riderTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.full,
    marginTop: 3,
  },
  riderTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  statusOverlayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gpsStatusTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  gpsStatusSub: {
    fontSize: 10,
    marginTop: 1,
  },
  recenterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
