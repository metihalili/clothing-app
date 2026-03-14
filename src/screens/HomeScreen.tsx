import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SectionTitle } from '../components/SectionTitle';
import { colors } from '../theme/colors';

export function HomeScreen({
  onOpenProduct,
}: {
  onOpenProduct: (product: Product) => void;
}) {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={products}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.hero}>
          <Text style={styles.badge}>COD APP DEMO</Text>
          <SectionTitle
            title="Streetwear Shop"
            subtitle="Clean mobile demo for a clothing store with cash on delivery checkout."
          />
        </View>
      }
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onOpenProduct(item)} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  hero: {
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff3e0',
    color: colors.accent,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
    overflow: 'hidden',
  },
});
