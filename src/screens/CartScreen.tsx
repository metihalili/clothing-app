import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartItemRow } from '../components/CartItemRow';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/currency';

export function CartScreen({ onCheckout }: { onCheckout: () => void }) {
  const { cart, cartTotal, increaseQty, decreaseQty } = useAppContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle title="Your cart" subtitle="Review products before checkout." />

      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some products from the home screen first.</Text>
        </View>
      ) : (
        <>
          {cart.map((item) => (
            <CartItemRow
              key={`${item.product.id}-${item.size}`}
              item={item}
              onIncrease={() => increaseQty(item.product.id, item.size)}
              onDecrease={() => decreaseQty(item.product.id, item.size)}
            />
          ))}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{formatCurrency(cartTotal)}</Text>
            <Text style={styles.summaryHint}>Payment method: Cash on Delivery</Text>
          </View>

          <Pressable style={styles.checkoutButton} onPress={onCheckout}>
            <Text style={styles.checkoutText}>Go to checkout</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    marginTop: 6,
    color: colors.muted,
  },
  summaryCard: {
    marginTop: 10,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  summaryHint: {
    marginTop: 8,
    color: colors.success,
    fontWeight: '600',
  },
  checkoutButton: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
