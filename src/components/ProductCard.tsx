import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/currency';

export function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text numberOfLines={2} style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
  },
  content: {
    padding: 14,
  },
  category: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    marginTop: 6,
    color: colors.muted,
    lineHeight: 20,
  },
  price: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});
