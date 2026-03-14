import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Screen =
  | "auth"
  | "home"
  | "details"
  | "cart"
  | "checkout"
  | "orders"
  | "admin";

type Category =
  | "All"
  | "T-Shirts"
  | "Jeans"
  | "Shoes"
  | "Shorts"
  | "Pants"
  | "Hoodies"
  | "Jackets";

type AdminTab = "dashboard" | "products" | "orders" | "users";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string;
  image_url: string | null;
  colors: string[];
  sizes: string[];
  stock: number;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  selectedSize: string;
  selectedColor: string;
  qty: number;
};

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  full_name?: string;
  email?: string | null;
  phone?: string;
  city?: string;
  address?: string;
  order_items?: {
    id: string;
    product_name: string;
    price: number;
    quantity: number;
    selected_size: string | null;
    selected_color: string | null;
  }[];
};

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
};

const categories: Category[] = [
  "All",
  "T-Shirts",
  "Jeans",
  "Shoes",
  "Shorts",
  "Pants",
  "Hoodies",
  "Jackets",
];

/**
 * HARDCODED LOGIN ACCOUNTS
 * Change these to whatever you want.
 */
const DEMO_ADMIN = {
  email: "admin@hypenest.com",
  password: "admin123",
  full_name: "HypeNest Admin",
};

const DEMO_USER = {
  email: "user@hypenest.com",
  password: "user123",
  full_name: "HypeNest User",
};

const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Oversized Black T-Shirt",
    description: "Premium oversized t-shirt with soft cotton fabric.",
    price: 24.99,
    old_price: 34.99,
    category: "T-Shirts",
    image_url: "https://via.placeholder.com/600x700.png?text=Black+T-Shirt",
    colors: ["Black", "White", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
  },
  {
    id: "p2",
    name: "Blue Denim Jeans",
    description: "Slim fit denim jeans with modern style.",
    price: 49.99,
    old_price: 64.99,
    category: "Jeans",
    image_url: "https://via.placeholder.com/600x700.png?text=Blue+Jeans",
    colors: ["Blue", "Dark Blue"],
    sizes: ["30", "32", "34", "36"],
    stock: 15,
  },
  {
    id: "p3",
    name: "Street Sneakers",
    description: "Comfortable everyday sneakers for streetwear outfits.",
    price: 79.99,
    old_price: 99.99,
    category: "Shoes",
    image_url: "https://via.placeholder.com/600x700.png?text=Sneakers",
    colors: ["White", "Black"],
    sizes: ["40", "41", "42", "43"],
    stock: 10,
  },
  {
    id: "p4",
    name: "Summer Shorts",
    description: "Lightweight shorts perfect for daily wear.",
    price: 29.99,
    old_price: null,
    category: "Shorts",
    image_url: "https://via.placeholder.com/600x700.png?text=Shorts",
    colors: ["Black", "Beige"],
    sizes: ["S", "M", "L"],
    stock: 18,
  },
  {
    id: "p5",
    name: "Cargo Pants",
    description: "Street style cargo pants with side pockets.",
    price: 54.99,
    old_price: 69.99,
    category: "Pants",
    image_url: "https://via.placeholder.com/600x700.png?text=Cargo+Pants",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
  },
  {
    id: "p6",
    name: "Gray Hoodie",
    description: "Warm hoodie with oversized fit.",
    price: 59.99,
    old_price: 74.99,
    category: "Hoodies",
    image_url: "https://via.placeholder.com/600x700.png?text=Gray+Hoodie",
    colors: ["Gray", "Black"],
    sizes: ["M", "L", "XL"],
    stock: 14,
  },
];

function MainApp() {
  const insets = useSafeAreaInsets();

  const [screen, setScreen] = useState<Screen>("auth");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");

  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);

  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminUsers, setAdminUsers] = useState<Profile[]>([
    {
      id: "admin-1",
      email: DEMO_ADMIN.email,
      full_name: DEMO_ADMIN.full_name,
      is_admin: true,
    },
    {
      id: "user-1",
      email: DEMO_USER.email,
      full_name: DEMO_USER.full_name,
      is_admin: false,
    },
  ]);

  const [adminName, setAdminName] = useState("");
  const [adminDescription, setAdminDescription] = useState("");
  const [adminPrice, setAdminPrice] = useState("");
  const [adminOldPrice, setAdminOldPrice] = useState("");
  const [adminCategory, setAdminCategory] = useState("T-Shirts");
  const [adminImageUrl, setAdminImageUrl] = useState("");
  const [adminColors, setAdminColors] = useState("Black,White");
  const [adminSizes, setAdminSizes] = useState("S,M,L,XL");
  const [adminStock, setAdminStock] = useState("10");

  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.description ?? "").toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const filteredAdminUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();

    return adminUsers.filter((user) => {
      if (!q) return true;
      return (
        (user.full_name ?? "").toLowerCase().includes(q) ||
        (user.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [adminUsers, userSearch]);

  const filteredAdminOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();

    return adminOrders.filter((order) => {
      const matchesStatus =
        orderStatusFilter === "All" || order.status === orderStatusFilter;

      const matchesSearch =
        !q ||
        (order.full_name ?? "").toLowerCase().includes(q) ||
        (order.email ?? "").toLowerCase().includes(q) ||
        (order.city ?? "").toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [adminOrders, orderSearch, orderStatusFilter]);

  function handleLogin() {
    const email = authEmail.trim().toLowerCase();
    const password = authPassword.trim();

    if (!email || !password) {
      Alert.alert("Missing fields", "Enter email and password.");
      return;
    }

    if (
      email === DEMO_ADMIN.email.toLowerCase() &&
      password === DEMO_ADMIN.password
    ) {
      const adminProfile: Profile = {
        id: "admin-1",
        email: DEMO_ADMIN.email,
        full_name: DEMO_ADMIN.full_name,
        is_admin: true,
      };

      setSessionEmail(DEMO_ADMIN.email);
      setProfile(adminProfile);
      setAdminTab("dashboard");
      setScreen("admin");
      setCheckoutName(DEMO_ADMIN.full_name);
      return;
    }

    if (
      email === DEMO_USER.email.toLowerCase() &&
      password === DEMO_USER.password
    ) {
      const userProfile: Profile = {
        id: "user-1",
        email: DEMO_USER.email,
        full_name: DEMO_USER.full_name,
        is_admin: false,
      };

      setSessionEmail(DEMO_USER.email);
      setProfile(userProfile);
      setScreen("home");
      setCheckoutName(DEMO_USER.full_name);
      return;
    }

    Alert.alert("Login failed", "Wrong email or password.");
  }

  function logout() {
    setProfile(null);
    setSessionEmail(null);
    setCart([]);
    setScreen("auth");
    setAuthEmail("");
    setAuthPassword("");
  }

  function openDetails(product: Product) {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] ?? "");
    setSelectedColor(product.colors?.[0] ?? "");
    setScreen("details");
  }

  function addToCart(product: Product) {
    if (!selectedSize || !selectedColor) {
      Alert.alert("Select options", "Please choose a size and color.");
      return;
    }

    const found = cart.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (found) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
      Alert.alert("Added", "Product quantity updated.");
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        selectedSize,
        selectedColor,
        qty: 1,
      },
    ]);

    Alert.alert("Added", "Product added to cart.");
  }

  function increaseQty(index: number) {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty: item.qty + 1 } : item))
    );
  }

  function decreaseQty(index: number) {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function placeOrder() {
    if (!profile || !sessionEmail) {
      Alert.alert("Login required", "Please log in first.");
      return;
    }

    if (!checkoutName || !checkoutPhone || !checkoutCity || !checkoutAddress) {
      Alert.alert("Missing fields", "Fill all checkout fields.");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Cart is empty", "Add products before checkout.");
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      status: "Pending",
      total: cartTotal,
      created_at: new Date().toISOString(),
      full_name: checkoutName,
      email: sessionEmail,
      phone: checkoutPhone,
      city: checkoutCity,
      address: checkoutAddress,
      order_items: cart.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        product_name: item.name,
        price: item.price,
        quantity: item.qty,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
      })),
    };

    if (profile.is_admin) {
      setAdminOrders((prev) => [newOrder, ...prev]);
    } else {
      setMyOrders((prev) => [newOrder, ...prev]);
      setAdminOrders((prev) => [newOrder, ...prev]);
    }

    Alert.alert("Success", "Order placed successfully.");
    setCart([]);
    setCheckoutPhone("");
    setCheckoutCity("");
    setCheckoutAddress("");
    setScreen("orders");
  }

  function addProductAsAdmin() {
    if (!profile?.is_admin) {
      Alert.alert("Access denied", "Only admin can do this.");
      return;
    }

    if (!adminName || !adminPrice || !adminCategory) {
      Alert.alert("Missing fields", "Name, price and category are required.");
      return;
    }

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: adminName,
      description: adminDescription || null,
      price: Number(adminPrice),
      old_price: adminOldPrice ? Number(adminOldPrice) : null,
      category: adminCategory,
      image_url: adminImageUrl || null,
      colors: adminColors
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      sizes: adminSizes
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      stock: Number(adminStock || "0"),
    };

    setProducts((prev) => [newProduct, ...prev]);
    Alert.alert("Success", "Product added.");
    resetAdminProductForm();
  }

  function deleteProductAsAdmin(productId: string) {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    Alert.alert("Deleted", "Product removed.");
  }

  function updateOrderStatus(orderId: string, status: string) {
    setAdminOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

    setMyOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  }

  function setUserAdmin(userId: string, value: boolean) {
    if (!profile?.is_admin) {
      Alert.alert("Access denied", "Only admin can do this.");
      return;
    }

    setAdminUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, is_admin: value } : user))
    );

    Alert.alert("Success", value ? "User is now admin." : "Admin removed.");
  }

  function startEditProduct(product: Product) {
    setEditingProductId(product.id);
    setAdminName(product.name);
    setAdminDescription(product.description ?? "");
    setAdminPrice(String(product.price));
    setAdminOldPrice(product.old_price ? String(product.old_price) : "");
    setAdminCategory(product.category);
    setAdminImageUrl(product.image_url ?? "");
    setAdminColors((product.colors ?? []).join(","));
    setAdminSizes((product.sizes ?? []).join(","));
    setAdminStock(String(product.stock ?? 0));
    setAdminTab("products");
  }

  function resetAdminProductForm() {
    setEditingProductId(null);
    setAdminName("");
    setAdminDescription("");
    setAdminPrice("");
    setAdminOldPrice("");
    setAdminCategory("T-Shirts");
    setAdminImageUrl("");
    setAdminColors("Black,White");
    setAdminSizes("S,M,L,XL");
    setAdminStock("10");
  }

  function saveProductEditAsAdmin() {
    if (!editingProductId) return;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingProductId
          ? {
              ...product,
              name: adminName,
              description: adminDescription || null,
              price: Number(adminPrice),
              old_price: adminOldPrice ? Number(adminOldPrice) : null,
              category: adminCategory,
              image_url: adminImageUrl || null,
              colors: adminColors
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
              sizes: adminSizes
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
              stock: Number(adminStock || "0"),
            }
          : product
      )
    );

    Alert.alert("Success", "Product updated.");
    resetAdminProductForm();
  }

  if (screen === "auth") {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.authWrap}>
          <Text style={styles.logo}>HypeNest</Text>
          <Text style={styles.subtle}>Login with hardcoded demo accounts</Text>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Admin login</Text>
            <Text style={styles.demoText}>Email: {DEMO_ADMIN.email}</Text>
            <Text style={styles.demoText}>Password: {DEMO_ADMIN.password}</Text>
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>User login</Text>
            <Text style={styles.demoText}>Email: {DEMO_USER.email}</Text>
            <Text style={styles.demoText}>Password: {DEMO_USER.password}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={authEmail}
            onChangeText={setAuthEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={authPassword}
            onChangeText={setAuthPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.noteText}>
            This is local demo login inside code. No real email creation and no Supabase email verification.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "details" && selectedProduct) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView>
          <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
            <TouchableOpacity onPress={() => setScreen("home")}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen("cart")}>
              <Text style={styles.backText}>Cart ({cart.length})</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{
              uri:
                selectedProduct.image_url ||
                "https://via.placeholder.com/700x700.png?text=HypeNest",
            }}
            style={styles.detailsImage}
          />

          <View style={styles.pagePad}>
            <Text style={styles.productCategory}>{selectedProduct.category}</Text>
            <Text style={styles.detailsTitle}>{selectedProduct.name}</Text>
            <Text style={styles.price}>${Number(selectedProduct.price).toFixed(2)}</Text>

            {selectedProduct.old_price ? (
              <Text style={styles.oldPrice}>
                Old price: ${Number(selectedProduct.old_price).toFixed(2)}
              </Text>
            ) : null}

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {selectedProduct.description || "No description yet."}
            </Text>

            <Text style={styles.sectionTitle}>Choose color</Text>
            <View style={styles.rowWrap}>
              {(selectedProduct.colors || []).map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionChip,
                    selectedColor === color && styles.optionChipActive,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedColor === color && styles.optionChipTextActive,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Choose size</Text>
            <View style={styles.rowWrap}>
              {(selectedProduct.sizes || []).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionChip,
                    selectedSize === size && styles.optionChipActive,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedSize === size && styles.optionChipTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => addToCart(selectedProduct)}
            >
              <Text style={styles.primaryButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "cart") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Cart</Text>
          <View style={{ width: 50 }} />
        </View>

        {cart.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
          </View>
        ) : (
          <>
            <ScrollView style={styles.pagePad}>
              {cart.map((item, index) => (
                <View
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  style={styles.cartCard}
                >
                  <Image
                    source={{
                      uri:
                        item.image_url ||
                        "https://via.placeholder.com/300x300.png?text=HypeNest",
                    }}
                    style={styles.cartImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cartName}>{item.name}</Text>
                    <Text style={styles.subtle}>Color: {item.selectedColor}</Text>
                    <Text style={styles.subtle}>Size: {item.selectedSize}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>

                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => decreaseQty(index)}
                      >
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.qty}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => increaseQty(index)}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.footerBox}>
              <Text style={styles.totalText}>Total: ${cartTotal.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setScreen("checkout")}
              >
                <Text style={styles.primaryButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    );
  }

  if (screen === "checkout") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.pagePad}>
          <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
            <TouchableOpacity onPress={() => setScreen("cart")}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Checkout</Text>
            <View style={{ width: 50 }} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#888"
            value={checkoutName}
            onChangeText={setCheckoutName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#888"
            value={checkoutPhone}
            onChangeText={setCheckoutPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#888"
            value={checkoutCity}
            onChangeText={setCheckoutCity}
          />
          <TextInput
            style={[styles.input, { minHeight: 100 }]}
            placeholder="Address"
            placeholderTextColor="#888"
            value={checkoutAddress}
            onChangeText={setCheckoutAddress}
            multiline
          />

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment method</Text>
            <Text style={styles.subtle}>Cash on Delivery</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={placeOrder}>
            <Text style={styles.primaryButtonText}>
              Place Order • ${cartTotal.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "orders") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>My Orders</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.pagePad}>
          {myOrders.length === 0 ? (
            <Text style={styles.emptyTitle}>No orders yet.</Text>
          ) : (
            myOrders.map((order) => (
              <View key={order.id} style={styles.card}>
                <Text style={styles.orderTitle}>Order #{order.id.slice(0, 8)}</Text>
                <Text style={styles.subtle}>Status: {order.status}</Text>
                <Text style={styles.subtle}>Total: ${Number(order.total).toFixed(2)}</Text>
                <Text style={styles.subtle}>
                  Date: {new Date(order.created_at).toLocaleString()}
                </Text>

                <View style={{ marginTop: 10 }}>
                  {order.order_items?.map((item) => (
                    <Text key={item.id} style={styles.orderItem}>
                      • {item.product_name} x{item.quantity} | {item.selected_color} | {item.selected_size}
                    </Text>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "admin") {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.pagePad}
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.adminHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.screenTitle}>Admin Panel</Text>
              <Text style={styles.subtle}>Manage HypeNest store</Text>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.logo}>HypeNest Admin</Text>
          <Text style={styles.subtle}>Products, orders and users</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.adminTabsWrap}
          >
            {(["dashboard", "products", "orders", "users"] as AdminTab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.adminTabChip,
                  adminTab === tab && styles.adminTabChipActive,
                ]}
                onPress={() => setAdminTab(tab)}
              >
                <Text
                  style={[
                    styles.adminTabChipText,
                    adminTab === tab && styles.adminTabChipTextActive,
                  ]}
                >
                  {tab === "dashboard"
                    ? "Dashboard"
                    : tab === "products"
                    ? "Products"
                    : tab === "orders"
                    ? "Orders"
                    : "Users"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {adminTab === "dashboard" && (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{products.length}</Text>
                  <Text style={styles.statLabel}>Products</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{adminOrders.length}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{adminUsers.length}</Text>
                  <Text style={styles.statLabel}>Users</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {adminUsers.filter((u) => u.is_admin).length}
                  </Text>
                  <Text style={styles.statLabel}>Admins</Text>
                </View>
              </View>
            </>
          )}

          {adminTab === "products" && (
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                  {editingProductId ? "Edit Product" : "Add Product"}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#888"
                  value={adminName}
                  onChangeText={setAdminName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  placeholderTextColor="#888"
                  value={adminDescription}
                  onChangeText={setAdminDescription}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  placeholderTextColor="#888"
                  value={adminPrice}
                  onChangeText={setAdminPrice}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Old Price"
                  placeholderTextColor="#888"
                  value={adminOldPrice}
                  onChangeText={setAdminOldPrice}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category"
                  placeholderTextColor="#888"
                  value={adminCategory}
                  onChangeText={setAdminCategory}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Image URL"
                  placeholderTextColor="#888"
                  value={adminImageUrl}
                  onChangeText={setAdminImageUrl}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Colors ex: Black,White,Blue"
                  placeholderTextColor="#888"
                  value={adminColors}
                  onChangeText={setAdminColors}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Sizes ex: S,M,L,XL"
                  placeholderTextColor="#888"
                  value={adminSizes}
                  onChangeText={setAdminSizes}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Stock"
                  placeholderTextColor="#888"
                  value={adminStock}
                  onChangeText={setAdminStock}
                  keyboardType="numeric"
                />

                {editingProductId ? (
                  <>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={saveProductEditAsAdmin}
                    >
                      <Text style={styles.primaryButtonText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={resetAdminProductForm}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel Edit</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={addProductAsAdmin}
                  >
                    <Text style={styles.primaryButtonText}>Add Product</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.card}>
                <View style={styles.topBarInsideCard}>
                  <Text style={styles.sectionTitle}>Products</Text>
                </View>

                {products.map((product) => (
                  <View key={product.id} style={styles.adminItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cartName}>{product.name}</Text>
                      <Text style={styles.subtle}>{product.category}</Text>
                      <Text style={styles.subtle}>
                        ${Number(product.price).toFixed(2)}
                      </Text>
                      <Text style={styles.subtle}>Stock: {product.stock}</Text>
                    </View>

                    <View style={styles.productAdminActions}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => startEditProduct(product)}
                      >
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => deleteProductAsAdmin(product.id)}
                      >
                        <Text style={styles.deleteBtnText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {adminTab === "orders" && (
            <View style={styles.card}>
              <View style={styles.topBarInsideCard}>
                <Text style={styles.sectionTitle}>All Orders</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Search by customer, email, city or order id"
                placeholderTextColor="#888"
                value={orderSearch}
                onChangeText={setOrderSearch}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterTabsWrap}
              >
                {["All", "Pending", "Accepted", "Delivered"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterChip,
                      orderStatusFilter === status && styles.filterChipActive,
                    ]}
                    onPress={() => setOrderStatusFilter(status)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        orderStatusFilter === status && styles.filterChipTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {filteredAdminOrders.length === 0 ? (
                <Text style={styles.subtle}>No orders found.</Text>
              ) : (
                filteredAdminOrders.map((order) => (
                  <View key={order.id} style={styles.orderAdminCard}>
                    <Text style={styles.orderTitle}>Order #{order.id.slice(0, 8)}</Text>
                    <Text style={styles.subtle}>Status: {order.status}</Text>
                    <Text style={styles.subtle}>
                      Customer: {order.full_name || "Unknown"}
                    </Text>
                    <Text style={styles.subtle}>Email: {order.email || "-"}</Text>
                    <Text style={styles.subtle}>Phone: {order.phone || "-"}</Text>
                    <Text style={styles.subtle}>City: {order.city || "-"}</Text>
                    <Text style={styles.subtle}>Address: {order.address || "-"}</Text>
                    <Text style={styles.subtle}>
                      Total: ${Number(order.total).toFixed(2)}
                    </Text>
                    <Text style={styles.subtle}>
                      Date: {new Date(order.created_at).toLocaleString()}
                    </Text>

                    <View style={{ marginTop: 10 }}>
                      {order.order_items?.map((item) => (
                        <Text key={item.id} style={styles.orderItem}>
                          • {item.product_name} x{item.quantity} | {item.selected_color} | {item.selected_size}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.statusRow}>
                      <TouchableOpacity
                        style={styles.statusBtn}
                        onPress={() => updateOrderStatus(order.id, "Pending")}
                      >
                        <Text style={styles.statusBtnText}>Pending</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.statusBtn}
                        onPress={() => updateOrderStatus(order.id, "Accepted")}
                      >
                        <Text style={styles.statusBtnText}>Accepted</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.statusBtn}
                        onPress={() => updateOrderStatus(order.id, "Delivered")}
                      >
                        <Text style={styles.statusBtnText}>Delivered</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {adminTab === "users" && (
            <View style={styles.card}>
              <View style={styles.topBarInsideCard}>
                <Text style={styles.sectionTitle}>Users</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Search users by name or email"
                placeholderTextColor="#888"
                value={userSearch}
                onChangeText={setUserSearch}
              />

              {filteredAdminUsers.length === 0 ? (
                <Text style={styles.subtle}>No users found.</Text>
              ) : (
                filteredAdminUsers.map((user) => (
                  <View key={user.id} style={styles.userCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cartName}>
                        {user.full_name || "No Name"}
                      </Text>
                      <Text style={styles.subtle}>{user.email || "No Email"}</Text>
                      <Text style={styles.subtle}>
                        Role: {user.is_admin ? "Admin" : "User"}
                      </Text>
                    </View>

                    <View style={styles.userActions}>
                      {user.is_admin ? (
                        <TouchableOpacity
                          style={styles.removeAdminBtn}
                          onPress={() => setUserAdmin(user.id, false)}
                        >
                          <Text style={styles.removeAdminBtnText}>Remove Admin</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.makeAdminBtn}
                          onPress={() => setUserAdmin(user.id, true)}
                        >
                          <Text style={styles.makeAdminBtnText}>Make Admin</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Text style={styles.logo}>HypeNest</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.backText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeHeader}>
        <Text style={styles.subtle}>Hello {profile?.full_name || sessionEmail}</Text>

        <View style={styles.homeActions}>
          <TouchableOpacity
            style={styles.smallActionBtn}
            onPress={() => setScreen("orders")}
          >
            <Text style={styles.smallActionBtnText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallActionBtn}
            onPress={() => setScreen("cart")}
          >
            <Text style={styles.smallActionBtnText}>Cart ({cart.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pagePad}>
        <TextInput
          style={styles.input}
          placeholder="Search clothes..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => openDetails(item)}
          >
            <Image
              source={{
                uri:
                  item.image_url ||
                  "https://via.placeholder.com/300x300.png?text=HypeNest",
              }}
              style={styles.productImage}
            />
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  authWrap: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  pagePad: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },
  subtle: {
    color: "#666",
    fontSize: 14,
  },
  noteText: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    marginTop: 18,
  },
  demoBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  demoText: {
    color: "#444",
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 12,
    fontSize: 15,
    color: "#111",
  },
  primaryButton: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: "#efefef",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#111",
    fontWeight: "800",
    fontSize: 15,
  },
  linkText: {
    textAlign: "center",
    color: "#111",
    fontWeight: "700",
    marginTop: 16,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backText: {
    color: "#111",
    fontWeight: "800",
  },
  screenTitle: {
    color: "#111",
    fontWeight: "900",
    fontSize: 18,
  },
  homeHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  homeActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  smallActionBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  smallActionBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  categoryChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  categoryChipText: {
    color: "#111",
    fontWeight: "700",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  productCard: {
    width: "48.5%",
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
  },
  productImage: {
    width: "100%",
    height: 220,
  },
  productCategory: {
    color: "#777",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  productName: {
    color: "#111",
    fontWeight: "800",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingTop: 4,
    minHeight: 42,
  },
  price: {
    color: "#111",
    fontWeight: "900",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  detailsImage: {
    width: "100%",
    height: 370,
  },
  detailsTitle: {
    color: "#111",
    fontWeight: "900",
    fontSize: 24,
    marginTop: 6,
  },
  oldPrice: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#111",
    fontWeight: "900",
    fontSize: 16,
    marginTop: 18,
    marginBottom: 10,
  },
  description: {
    color: "#666",
    lineHeight: 22,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionChipActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  optionChipText: {
    color: "#111",
    fontWeight: "700",
  },
  optionChipTextActive: {
    color: "#fff",
  },
  cartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  cartImage: {
    width: 90,
    height: 110,
    borderRadius: 12,
  },
  cartName: {
    color: "#111",
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  qtyText: {
    marginHorizontal: 14,
    fontWeight: "800",
    color: "#111",
  },
  footerBox: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    color: "#111",
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#111",
    fontWeight: "900",
    fontSize: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  orderTitle: {
    color: "#111",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 6,
  },
  orderItem: {
    color: "#444",
    marginBottom: 4,
  },
  adminItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deleteBtn: {
    backgroundColor: "#c62828",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
  editBtn: {
    backgroundColor: "#111",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
  productAdminActions: {
    alignItems: "flex-end",
  },
  orderAdminCard: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  statusBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 12,
  },
  logoutBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  logoutBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  topBarInsideCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  adminTabsWrap: {
    paddingBottom: 12,
    paddingTop: 8,
  },
  adminTabChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 10,
  },
  adminTabChipActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  adminTabChipText: {
    color: "#111",
    fontWeight: "700",
  },
  adminTabChipTextActive: {
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  userCard: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  userActions: {
    alignItems: "flex-end",
  },
  makeAdminBtn: {
    backgroundColor: "#111",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  makeAdminBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  removeAdminBtn: {
    backgroundColor: "#c62828",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeAdminBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  filterTabsWrap: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  filterChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  filterChipText: {
    color: "#111",
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#fff",
  },
});