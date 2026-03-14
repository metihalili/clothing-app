import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';
import { Product, ScreenName } from '../types';

export function AppNavigator() {
  const { cartCount } = useAppContext();
  const [screen, setScreen] = useState<ScreenName>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setScreen('product');
  };

  const renderScreen = () => {
    if (screen === 'product' && selectedProduct) {
      return (
        <ProductDetailsScreen
          product={selectedProduct}
          onBack={() => setScreen('home')}
          onGoToCart={() => setScreen('cart')}
        />
      );
    }

    if (screen === 'cart') {
      return <CartScreen onCheckout={() => setScreen('checkout')} />;
    }

    if (screen === 'checkout') {
      return <CheckoutScreen onSuccess={() => setScreen('success')} />;
    }

    if (screen === 'success') {
      return <SuccessScreen onGoHome={() => setScreen('home')} onSeeOrders={() => setScreen('orders')} />;
    }

    if (screen === 'orders') {
      return <OrdersScreen />;
    }

    return <HomeScreen onOpenProduct={openProduct} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <TabButton label="Home" active={screen === 'home' || screen === 'product'} onPress={() => setScreen('home')} />
        <TabButton label={`Cart (${cartCount})`} active={screen === 'cart' || screen === 'checkout'} onPress={() => setScreen('cart')} />
        <TabButton label="Orders" active={screen === 'orders' || screen === 'success'} onPress={() => setScreen('orders')} />
      </View>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#fff',
  },
});
