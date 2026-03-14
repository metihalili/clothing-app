import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartItem } from '../types';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/currency';

export function CartItemRow({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.product.title}</Text>
        <Text style={styles.meta}>Size: {item.size}</Text>
        <Text style={styles.price}>{formatCurrency(item.product.price)}</Text>
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.button} onPress={onDecrease}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Text style={styles.qty}>{item.quantity}</Text>
        <Pressable style={styles.button} onPress={onIncrease}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    color: colors.muted,
  },
  price: {
    marginTop: 8,
    fontWeight: '700',
    color: colors.primary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  qty: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
