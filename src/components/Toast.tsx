import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { useColorScheme } from 'react-native';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'info' | 'warning';
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  onDismiss,
}) => {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={20} color="#10B981" />;
      case 'warning':
        return <Ionicons name="alert-circle" size={20} color="#F59E0B" />;
      case 'info':
      default:
        return <Ionicons name="information-circle" size={20} color={theme.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
          Shadows.md,
        ]}
      >
        <View style={styles.iconWrap}>{getIcon()}</View>
        <Text style={[styles.text, { color: theme.text }]} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.closeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: Spacing.three,
    right: Spacing.three,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    maxWidth: 550,
    width: '100%',
  },
  iconWrap: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    marginLeft: 10,
    padding: 2,
  },
});
