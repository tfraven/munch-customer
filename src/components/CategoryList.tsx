import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { VendorCategory } from '../types';

interface CategoryItem {
  id: VendorCategory;
  label: string;
  iconType: 'mci' | 'ion' | 'fa5';
  iconName: string;
  bgColor: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'All', label: 'All Eats', iconType: 'mci', iconName: 'silverware-fork-knife', bgColor: '#FFF2EB' },
  { id: 'Street Food', label: 'Street Stalls', iconType: 'mci', iconName: 'food-hot-dog', bgColor: '#FEF3C7' },
  { id: 'Desi Special', label: 'Desi Special', iconType: 'mci', iconName: 'pot-steam', bgColor: '#FEE2E2' },
  { id: 'Fast Food', label: 'Burgers & Fries', iconType: 'mci', iconName: 'hamburger', bgColor: '#E0E7FF' },
  { id: 'Cafes', label: 'Cafes & Brew', iconType: 'ion', iconName: 'cafe', bgColor: '#ECFDF5' },
  { id: 'Chai & Snacks', label: 'Chai & Paratha', iconType: 'mci', iconName: 'tea', bgColor: '#FDF2F8' },
  { id: 'Bakeries', label: 'Bakery & Sweets', iconType: 'mci', iconName: 'cupcake', bgColor: '#FFFBEB' },
  { id: 'Restaurants', label: 'Restaurants', iconType: 'ion', iconName: 'restaurant', bgColor: '#F3E8FF' },
];

export const CategoryList: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const renderIcon = (cat: CategoryItem, isSelected: boolean) => {
    const color = isSelected ? '#FFFFFF' : theme.primary;
    const size = 22;

    if (cat.iconType === 'ion') {
      return <Ionicons name={cat.iconName as any} size={size} color={color} />;
    }
    if (cat.iconType === 'fa5') {
      return <FontAwesome5 name={cat.iconName as any} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={cat.iconName as any} size={size} color={color} />;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        What are you craving?
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: isSelected ? theme.primary : cat.bgColor,
                    borderColor: isSelected ? theme.primary : theme.borderLight,
                  },
                ]}
              >
                {renderIcon(cat, isSelected)}
              </View>
              <Text
                style={[
                  styles.categoryLabel,
                  {
                    color: isSelected ? theme.primary : theme.text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {cat.label}
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
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    gap: 14,
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
});
