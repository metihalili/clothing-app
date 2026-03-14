import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/currency';

export function OrdersScreen() {
  const { orders } = useAppContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle title="Demo orders" subtitle="Simple admin-like view for COD orders." />

      {orders.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Place a demo order from checkout and it will show up here.</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.status}>{order.status}</Text>
            </View>
            <Text style={styles.meta}>{order.customerName} • {order.phone}</Text>
            <Text style={styles.meta}>{order.city}, {order.address}</Text>
            <Text style={styles.meta}>Created: {order.createdAt}</Text>

            <View style={styles.itemsWrap}>
              {order.items.map((item) => (
                <Text key={`${item.product.id}-${item.size}`} style={styles.itemText}>
                  • {item.product.title} / {item.size} / x{item.quantity}
                </Text>
              ))}
            </View>

            <Text style={styles.total}>Total: {formatCurrency(order.total)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
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
  orderCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontWeight: '800',
    color: colors.text,
  },
  status: {
    color: colors.success,
    fontWeight: '700',
  },
  meta: {
    marginTop: 6,
    color: colors.muted,
  },
  itemsWrap: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemText: {
    color: colors.text,
    marginBottom: 4,
  },
  total: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
});
