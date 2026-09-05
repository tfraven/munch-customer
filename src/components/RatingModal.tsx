import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface RatingModalProps {
  visible: boolean;
  order: Order;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  order,
  onClose,
}) => {
  const { submitReview } = useApp();
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [foodRating, setFoodRating] = useState(5);
  const [riderRating, setRiderRating] = useState(5);
  const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>(['Hot & Fresh']);
  const [selectedRiderTags, setSelectedRiderTags] = useState<string[]>(['On Time']);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [comment, setComment] = useState('');

  const foodTagOptions = [
    'Hot & Fresh',
    'Delicious Taste',
    'Generous Portion',
    'Great Packaging',
    'Spicy & Authentic',
  ];

  const riderTagOptions = [
    'Fast Delivery',
    'Polite & Friendly',
    'Handled with Care',
    'Followed Gate Notes',
  ];

  const tipOptions = [0, 30, 50, 100, 150];

  const toggleFoodTag = (tag: string) => {
    setSelectedFoodTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleRiderTag = (tag: string) => {
    setSelectedRiderTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const combinedFeedback = [
      ...selectedFoodTags,
      ...selectedRiderTags,
      comment.trim(),
    ]
      .filter(Boolean)
      .join(' • ');

    submitReview(
      order.id,
      foodRating,
      riderRating,
      combinedFeedback,
      tipAmount
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>
                Rate Your Experience
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Help your local town restaurants & riders improve
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* 1. Rate Vendor Food */}
            <View
              style={[
                styles.ratingSection,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={20}
                  color={theme.primary}
                />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Food Quality • {order.vendor.name}
                </Text>
              </View>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setFoodRating(star)}
                    style={styles.starBtn}
                  >
                    <Ionicons
                      name={star <= foodRating ? 'star' : 'star-outline'}
                      size={28}
                      color="#FBBF24"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.tagsWrap}>
                {foodTagOptions.map((tag) => {
                  const isSel = selectedFoodTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagChip,
                        {
                          backgroundColor: isSel ? theme.primary : theme.card,
                          borderColor: isSel ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => toggleFoodTag(tag)}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color: isSel ? '#FFF' : theme.text,
                            fontWeight: isSel ? '700' : '500',
                          },
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Rate Rider Service */}
            <View
              style={[
                styles.ratingSection,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <MaterialCommunityIcons
                  name="moped"
                  size={20}
                  color={theme.secondary}
                />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Delivery Service • {order.rider?.name || 'Town Delivery Rider'}
                </Text>
              </View>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRiderRating(star)}
                    style={styles.starBtn}
                  >
                    <Ionicons
                      name={star <= riderRating ? 'star' : 'star-outline'}
                      size={28}
                      color="#FBBF24"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.tagsWrap}>
                {riderTagOptions.map((tag) => {
                  const isSel = selectedRiderTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagChip,
                        {
                          backgroundColor: isSel ? theme.secondary : theme.card,
                          borderColor: isSel ? theme.secondary : theme.border,
                        },
                      ]}
                      onPress={() => toggleRiderTag(tag)}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color: isSel ? '#FFF' : theme.text,
                            fontWeight: isSel ? '700' : '500',
                          },
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Optional Tip */}
              <Text style={[styles.tipTitle, { color: theme.text }]}>
                Add a tip for your hard-working rider:
              </Text>
              <View style={styles.tipRow}>
                {tipOptions.map((amt) => {
                  const isSel = tipAmount === amt;
                  return (
                    <TouchableOpacity
                      key={amt}
                      style={[
                        styles.tipChip,
                        {
                          backgroundColor: isSel
                            ? theme.secondaryLight
                            : theme.card,
                          borderColor: isSel ? theme.secondary : theme.border,
                        },
                      ]}
                      onPress={() => setTipAmount(amt)}
                    >
                      <Text
                        style={[
                          styles.tipChipText,
                          {
                            color: isSel ? theme.secondary : theme.text,
                            fontWeight: isSel ? '800' : '600',
                          },
                        ]}
                      >
                        {amt === 0 ? 'No Tip' : `Rs. ${amt}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Written Review */}
            <View style={styles.commentContainer}>
              <Text style={[styles.commentLabel, { color: theme.text }]}>
                Additional Feedback (Optional)
              </Text>
              <TextInput
                style={[
                  styles.commentInput,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Share more details about food taste or delivery experience..."
                placeholderTextColor={theme.textMuted}
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: theme.primary },
                Shadows.md,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Submit Dual Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '85%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 20,
  },
  ratingSection: {
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  starBtn: {
    padding: 4,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tipChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  tipChipText: {
    fontSize: 11,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  commentInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  submitBtn: {
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
