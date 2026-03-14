import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { Product, Size } from '../types';
import { formatCurrency } from '../utils/currency';

export function ProductDetailsScreen({
  product,
  onBack,
  onGoToCart,
}: {
  product: Product;
  onBack: () => void;
  onGoToCart: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]);
  const { addToCart } = useAppContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <Text style={styles.label}>Choose size</Text>
      <View style={styles.sizesRow}>
        {product.sizes.map((size) => {
          const active = selectedSize === size;
          return (
            <Pressable
              key={size}
              style={[styles.sizeButton, active && styles.sizeButtonActive]}
              onPress={() => setSelectedSize(size)}
            >
              <Text style={[styles.sizeText, active && styles.sizeTextActive]}>{size}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          addToCart(product, selectedSize);
          onGoToCart();
        }}
      >
        <Text style={styles.primaryButtonText}>Add to cart</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: colors.muted,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  category: {
    color: colors.accent,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  price: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
  },
  label: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sizesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.card,
  },
  sizeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sizeText: {
    fontWeight: '700',
    color: colors.text,
  },
  sizeTextActive: {
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
