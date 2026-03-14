import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function SuccessScreen({ onGoHome, onSeeOrders }: { onGoHome: () => void; onSeeOrders: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.title}>Order placed</Text>
        <Text style={styles.text}>
          The order was saved successfully. In a real app, this would be sent to your database.
        </Text>

        <Pressable style={styles.primaryButton} onPress={onSeeOrders}>
          <Text style={styles.primaryButtonText}>See demo orders</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onGoHome}>
          <Text style={styles.secondaryButtonText}>Back to home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  icon: {
    fontSize: 54,
    color: colors.success,
    fontWeight: '800',
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: 20,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
});
