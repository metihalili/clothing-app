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
  | "home"
  | "details"
  | "cart"
  | "checkout"
  | "auth"
  | "orders"
  | "profile"
  | "admin";

type AuthMode = "login" | "signup";

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

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  selected_size: string | null;
  selected_color: string | null;
};

type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  full_name?: string;
  email?: string | null;
  phone?: string;
  city?: string;
  address?: string;
  order_items?: OrderItem[];
};

type UserAccount = {
  id: string;
  email: string;
  password: string;
  full_name: string;
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

const DEMO_ADMIN: UserAccount = {
  id: "admin-1",
  email: "admin@hypenest.com",
  password: "admin123",
  full_name: "HypeNest Admin",
  is_admin: true,
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
  {
    id: "p7",
    name: "Urban Jacket",
    description: "Clean modern jacket for daily street outfits.",
    price: 89.99,
    old_price: 119.99,
    category: "Jackets",
    image_url: "https://via.placeholder.com/600x700.png?text=Urban+Jacket",
    colors: ["Black", "Brown"],
    sizes: ["M", "L", "XL"],
    stock: 8,
  },
];

function MainApp() {
  const insets = useSafeAreaInsets();

  const [screen, setScreen] = useState<Screen>("home");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<Screen | null>(null);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([DEMO_ADMIN]);

  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [adminName, setAdminName] = useState("");
  const [adminDescription, setAdminDescription] = useState("");
  const [adminPrice, setAdminPrice] = useState("");
  const [adminOldPrice, setAdminOldPrice] = useState("");
  const [adminCategory, setAdminCategory] = useState("T-Shirts");
  const [adminImageUrl, setAdminImageUrl] = useState("");
  const [adminColors, setAdminColors] = useState("Black,White");
  const [adminSizes, setAdminSizes] = useState("S,M,L,XL");
  const [adminStock, setAdminStock] = useState("10");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.description ?? "").toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter((order) => order.user_id === currentUser.id);
  }, [orders, currentUser]);

  const filteredAdminOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();

    return orders.filter((order) => {
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
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();

    return users.filter((user) => {
      if (!q) return true;
      return (
        user.full_name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    });
  }, [users, userSearch]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.total), 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((order) => order.status === "Pending").length;
  }, [orders]);

  function resetAuthFields() {
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
  }

  function openAuth(target?: Screen) {
    setRedirectAfterAuth(target ?? null);
    setAuthMode("login");
    setScreen("auth");
  }

  function handleLogin() {
    const email = authEmail.trim().toLowerCase();
    const password = authPassword.trim();

    if (!email || !password) {
      Alert.alert("Missing fields", "Enter email and password.");
      return;
    }

    const foundUser = users.find(
      (user) => user.email.toLowerCase() === email && user.password === password
    );

    if (!foundUser) {
      Alert.alert("Login failed", "Wrong email or password.");
      return;
    }

    setCurrentUser(foundUser);
    setCheckoutName(foundUser.full_name);
    resetAuthFields();

    if (foundUser.is_admin && redirectAfterAuth === "admin") {
      setAdminTab("dashboard");
      setScreen("admin");
      setRedirectAfterAuth(null);
      return;
    }

    if (redirectAfterAuth) {
      const target = redirectAfterAuth;
      setRedirectAfterAuth(null);
      setScreen(target);
      return;
    }

    if (foundUser.is_admin) {
      setScreen("admin");
    } else {
      setScreen("profile");
    }
  }

  function handleSignup() {
    const name = authName.trim();
    const email = authEmail.trim().toLowerCase();
    const password = authPassword.trim();

    if (!name || !email || !password) {
      Alert.alert("Missing fields", "Fill name, email and password.");
      return;
    }

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      Alert.alert("Email exists", "This email is already registered.");
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      full_name: name,
      email,
      password,
      is_admin: false,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCheckoutName(newUser.full_name);
    resetAuthFields();

    if (redirectAfterAuth) {
      const target = redirectAfterAuth;
      setRedirectAfterAuth(null);
      setScreen(target);
      return;
    }

    setScreen("profile");
  }

  function logout() {
    setCurrentUser(null);
    setAuthMode("login");
    setRedirectAfterAuth(null);
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
    setCheckoutName("");
    setCheckoutPhone("");
    setCheckoutCity("");
    setCheckoutAddress("");
    setScreen("home");
  }

  function openDetails(product: Product) {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] ?? "");
    setSelectedColor(product.colors?.[0] ?? "");
    setScreen("details");
  }

  function addToCart(product: Product) {
    if (!selectedSize || !selectedColor) {
      Alert.alert("Select options", "Please choose size and color.");
      return;
    }

    if (product.stock <= 0) {
      Alert.alert("Out of stock", "This product is out of stock.");
      return;
    }

    const existing = cart.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existing) {
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
        price: product.price,
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

  function goToCheckout() {
    setScreen("checkout");
  }

  function handleCheckoutAuthGate() {
    if (!currentUser) {
      Alert.alert(
        "Account required",
        "Please create an account or log in with email to continue your order."
      );
      openAuth("checkout");
      return true;
    }
    return false;
  }

  function placeOrder() {
    if (handleCheckoutAuthGate()) return;

    if (!currentUser) return;

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
      user_id: currentUser.id,
      status: "Pending",
      total: cartTotal,
      created_at: new Date().toISOString(),
      full_name: checkoutName,
      email: currentUser.email,
      phone: checkoutPhone,
      city: checkoutCity,
      address: checkoutAddress,
      order_items: cart.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.qty,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);

    setProducts((prev) =>
      prev.map((product) => {
        const orderedQty = newOrder.order_items
          ?.filter((item) => item.product_id === product.id)
          .reduce((sum, item) => sum + item.quantity, 0);

        if (!orderedQty) return product;

        return {
          ...product,
          stock: Math.max(0, product.stock - orderedQty),
        };
      })
    );

    Alert.alert("Success", "Order placed successfully.");
    setCart([]);
    setCheckoutPhone("");
    setCheckoutCity("");
    setCheckoutAddress("");
    setScreen("orders");
  }

  function updateProfileName(newName: string) {
    if (!currentUser) return;

    const trimmed = newName.trim();
    if (!trimmed) {
      Alert.alert("Invalid name", "Name cannot be empty.");
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id ? { ...user, full_name: trimmed } : user
      )
    );

    setCurrentUser((prev) => (prev ? { ...prev, full_name: trimmed } : prev));
    setCheckoutName(trimmed);
    Alert.alert("Saved", "Profile updated.");
  }

  function updateOrderStatus(orderId: string, status: string) {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  }

  function setUserAdmin(userId: string, value: boolean) {
    if (!currentUser?.is_admin) {
      Alert.alert("Access denied", "Only admin can do this.");
      return;
    }

    if (userId === currentUser.id && !value) {
      Alert.alert("Not allowed", "You cannot remove admin from yourself.");
      return;
    }

    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, is_admin: value } : user))
    );

    if (currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, is_admin: value } : prev));
    }

    Alert.alert("Success", value ? "User is now admin." : "Admin removed.");
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

  function addProductAsAdmin() {
    if (!currentUser?.is_admin) {
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
    setAdminStock(String(product.stock));
    setAdminTab("products");
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

  function goToAdmin() {
    if (!currentUser) {
      openAuth("admin");
      return;
    }

    if (!currentUser.is_admin) {
      Alert.alert("Access denied", "Only admin can open admin panel.");
      return;
    }

    setScreen("admin");
  }

  if (screen === "auth") {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.authWrap}>
          <Text style={styles.logo}>HypeNest</Text>
          <Text style={styles.subtle}>
            {authMode === "login"
              ? "Login to continue your shopping"
              : "Create your HypeNest account"}
          </Text>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Admin demo</Text>
            <Text style={styles.demoText}>Email: {DEMO_ADMIN.email}</Text>
            <Text style={styles.demoText}>Password: {DEMO_ADMIN.password}</Text>
          </View>

          {authMode === "signup" ? (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#888"
              value={authName}
              onChangeText={setAuthName}
            />
          ) : null}

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

          {authMode === "login" ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setAuthMode(authMode === "login" ? "signup" : "login")}
          >
            <Text style={styles.secondaryButtonText}>
              {authMode === "login"
                ? "Need an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setRedirectAfterAuth(null);
              setScreen("home");
            }}
          >
            <Text style={styles.linkText}>Continue Shopping</Text>
          </TouchableOpacity>
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
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>

            {selectedProduct.old_price ? (
              <Text style={styles.oldPrice}>
                Old price: ${selectedProduct.old_price.toFixed(2)}
              </Text>
            ) : null}

            <Text style={styles.subtle}>Stock: {selectedProduct.stock}</Text>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {selectedProduct.description || "No description yet."}
            </Text>

            <Text style={styles.sectionTitle}>Choose color</Text>
            <View style={styles.rowWrap}>
              {selectedProduct.colors.map((color) => (
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
              {selectedProduct.sizes.map((size) => (
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
          <View style={{ width: 60 }} />
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
              <TouchableOpacity style={styles.primaryButton} onPress={goToCheckout}>
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
            <View style={{ width: 60 }} />
          </View>

          {!currentUser ? (
            <View style={styles.authRequiredCard}>
              <Text style={styles.sectionTitle}>Account required</Text>
              <Text style={styles.description}>
                Please create an account or log in with email to continue your
                order.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => openAuth("checkout")}
              >
                <Text style={styles.primaryButtonText}>Login / Sign Up</Text>
              </TouchableOpacity>
            </View>
          ) : null}

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
          <TouchableOpacity
            onPress={() => setScreen(currentUser?.is_admin ? "admin" : "profile")}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>My Orders</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.pagePad}>
          {myOrders.length === 0 ? (
            <Text style={styles.emptyTitle}>No orders yet.</Text>
          ) : (
            myOrders.map((order) => (
              <View key={order.id} style={styles.card}>
                <Text style={styles.orderTitle}>Order #{order.id.slice(0, 8)}</Text>
                <Text style={styles.subtle}>Status: {order.status}</Text>
                <Text style={styles.subtle}>Total: ${order.total.toFixed(2)}</Text>
                <Text style={styles.subtle}>
                  Date: {new Date(order.created_at).toLocaleString()}
                </Text>

                <View style={{ marginTop: 10 }}>
                  {order.order_items?.map((item) => (
                    <Text key={item.id} style={styles.orderItem}>
                      • {item.product_name} x{item.quantity} | {item.selected_color} |{" "}
                      {item.selected_size}
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

  if (screen === "profile") {
    const totalMySpent = myOrders.reduce((sum, order) => sum + order.total, 0);

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.pagePad}
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.adminHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.screenTitle}>My Account</Text>
              <Text style={styles.subtle}>
                {currentUser ? "Your profile and orders" : "Login to manage account"}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setScreen("home")}>
              <Text style={styles.backText}>Home</Text>
            </TouchableOpacity>
          </View>

          {!currentUser ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>You are not logged in</Text>
              <Text style={styles.description}>
                Login or create an account to see your profile and orders.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => openAuth("profile")}
              >
                <Text style={styles.primaryButtonText}>Login / Sign Up</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Profile info</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor="#888"
                  value={currentUser.full_name}
                  onChangeText={(text) =>
                    setCurrentUser((prev) => (prev ? { ...prev, full_name: text } : prev))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={currentUser.email}
                  editable={false}
                />

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => updateProfileName(currentUser.full_name)}
                >
                  <Text style={styles.primaryButtonText}>Save Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setScreen("orders")}
                >
                  <Text style={styles.secondaryButtonText}>View My Orders</Text>
                </TouchableOpacity>

                {currentUser.is_admin ? (
                  <TouchableOpacity
                    style={styles.secondaryDarkButton}
                    onPress={() => setScreen("admin")}
                  >
                    <Text style={styles.secondaryDarkButtonText}>Open Admin Panel</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.logoutBtnWide} onPress={logout}>
                  <Text style={styles.logoutBtnText}>Logout</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{myOrders.length}</Text>
                  <Text style={styles.statLabel}>My Orders</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>${totalMySpent.toFixed(0)}</Text>
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "admin") {
    if (!currentUser?.is_admin) {
      return (
        <SafeAreaView style={styles.safe}>
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>Admin access only</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setScreen("home")}
            >
              <Text style={styles.primaryButtonText}>Back Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

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
              <Text style={styles.subtle}>Manage store, users and all orders</Text>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>

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
                  <Text style={styles.statValue}>{orders.length}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{users.length}</Text>
                  <Text style={styles.statLabel}>Users</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {users.filter((u) => u.is_admin).length}
                  </Text>
                  <Text style={styles.statLabel}>Admins</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>${totalRevenue.toFixed(0)}</Text>
                  <Text style={styles.statLabel}>Revenue</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{pendingOrdersCount}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
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
                <Text style={styles.sectionTitle}>Products</Text>

                {products.map((product) => (
                  <View key={product.id} style={styles.adminItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cartName}>{product.name}</Text>
                      <Text style={styles.subtle}>{product.category}</Text>
                      <Text style={styles.subtle}>
                        ${product.price.toFixed(2)}
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
              <Text style={styles.sectionTitle}>All Orders</Text>

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
                {["All", "Pending", "Accepted", "Delivered", "Cancelled"].map(
                  (status) => (
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
                          orderStatusFilter === status &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
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
                      Total: ${order.total.toFixed(2)}
                    </Text>
                    <Text style={styles.subtle}>
                      Date: {new Date(order.created_at).toLocaleString()}
                    </Text>

                    <View style={{ marginTop: 10 }}>
                      {order.order_items?.map((item) => (
                        <Text key={item.id} style={styles.orderItem}>
                          • {item.product_name} x{item.quantity} | {item.selected_color} |{" "}
                          {item.selected_size}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.statusRow}>
                      {["Pending", "Accepted", "Delivered", "Cancelled"].map(
                        (status) => (
                          <TouchableOpacity
                            key={status}
                            style={styles.statusBtn}
                            onPress={() => updateOrderStatus(order.id, status)}
                          >
                            <Text style={styles.statusBtnText}>{status}</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {adminTab === "users" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Users</Text>

              <TextInput
                style={styles.input}
                placeholder="Search users by name or email"
                placeholderTextColor="#888"
                value={userSearch}
                onChangeText={setUserSearch}
              />

              {filteredUsers.length === 0 ? (
                <Text style={styles.subtle}>No users found.</Text>
              ) : (
                filteredUsers.map((user) => {
                  const userOrderCount = orders.filter(
                    (order) => order.user_id === user.id
                  ).length;

                  return (
                    <View key={user.id} style={styles.userCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cartName}>{user.full_name}</Text>
                        <Text style={styles.subtle}>{user.email}</Text>
                        <Text style={styles.subtle}>
                          Role: {user.is_admin ? "Admin" : "User"}
                        </Text>
                        <Text style={styles.subtle}>Orders: {userOrderCount}</Text>
                      </View>

                      <View style={styles.userActions}>
                        {user.is_admin ? (
                          <TouchableOpacity
                            style={styles.removeAdminBtn}
                            onPress={() => setUserAdmin(user.id, false)}
                          >
                            <Text style={styles.removeAdminBtnText}>
                              Remove Admin
                            </Text>
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
                  );
                })
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
        <View style={styles.headerRightActions}>
          <TouchableOpacity onPress={() => setScreen("cart")}>
            <Text style={styles.backText}>Cart ({cart.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (currentUser?.is_admin) {
                setScreen("admin");
              } else {
                setScreen("profile");
              }
            }}
          >
            <Text style={styles.backText}>
              {currentUser ? "Account" : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.homeHeader}>
        <Text style={styles.subtle}>
          {currentUser
            ? `Hello ${currentUser.full_name}`
            : "Welcome to HypeNest"}
        </Text>

        <View style={styles.homeActions}>
          <TouchableOpacity
            style={styles.smallActionBtn}
            onPress={() => setScreen("profile")}
          >
            <Text style={styles.smallActionBtnText}>
              {currentUser ? "My Profile" : "Login / Sign Up"}
            </Text>
          </TouchableOpacity>

          {currentUser?.is_admin ? (
            <TouchableOpacity style={styles.smallActionBtn} onPress={goToAdmin}>
              <Text style={styles.smallActionBtnText}>Admin Panel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.smallActionBtn}
              onPress={() => setScreen("orders")}
            >
              <Text style={styles.smallActionBtnText}>My Orders</Text>
            </TouchableOpacity>
          )}
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
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {item.old_price ? (
              <Text style={styles.cardOldPrice}>${item.old_price.toFixed(2)}</Text>
            ) : null}
            <Text style={styles.stockText}>
              {item.stock > 0 ? `Stock: ${item.stock}` : "Out of stock"}
            </Text>
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
  secondaryDarkButton: {
    backgroundColor: "#222",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  secondaryDarkButtonText: {
    color: "#fff",
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
  headerRightActions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
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
    paddingBottom: 8,
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
  cardOldPrice: {
    color: "#888",
    fontSize: 12,
    textDecorationLine: "line-through",
    paddingHorizontal: 12,
    marginTop: -6,
  },
  stockText: {
    color: "#666",
    fontSize: 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
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
    paddingHorizontal: 12,
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
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  authRequiredCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e8e8e8",
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
  logoutBtnWide: {
    backgroundColor: "#c62828",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: "stretch",
    marginTop: 12,
    alignItems: "center",
  },
  logoutBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
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