import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionTitle } from '../components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/currency';

export function CheckoutScreen({ onSuccess }: { onSuccess: () => void }) {
  const { cart, cartTotal, placeOrder } = useAppContext();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const submit = () => {
    if (!customerName || !phone || !city || !address || cart.length === 0) {
      Alert.alert('Missing data', 'Please fill in all fields and make sure your cart is not empty.');
      return;
    }

    placeOrder({ customerName, phone, city, address });
    setCustomerName('');
    setPhone('');
    setCity('');
    setAddress('');
    onSuccess();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle title="Checkout" subtitle="This demo uses Cash on Delivery only." />

      <View style={styles.card}>
        <Text style={styles.label}>Full name</Text>
        <TextInput value={customerName} onChangeText={setCustomerName} placeholder="Muhamed Halili" style={styles.input} />

        <Text style={styles.label}>Phone number</Text>
        <TextInput value={phone} onChangeText={setPhone} placeholder="+389..." style={styles.input} keyboardType="phone-pad" />

        <Text style={styles.label}>City</Text>
        <TextInput value={city} onChangeText={setCity} placeholder="Strumica" style={styles.input} />

        <Text style={styles.label}>Address</Text>
        <TextInput value={address} onChangeText={setAddress} placeholder="Street name, number" style={styles.input} />

        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Payment method</Text>
          <Text style={styles.paymentValue}>Cash on Delivery</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(cartTotal)}</Text>
        </View>

        <Pressable style={styles.placeOrderButton} onPress={submit}>
          <Text style={styles.placeOrderText}>Place order</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  paymentBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentTitle: {
    color: colors.muted,
  },
  paymentValue: {
    marginTop: 4,
    fontWeight: '700',
    color: colors.success,
  },
  totalRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.muted,
    fontSize: 16,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  placeOrderButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
