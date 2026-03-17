import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 36) / 2;

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Screen = "home" | "details" | "cart" | "checkout" | "auth" | "orders" | "profile" | "admin" | "category" | "search" | "wishlist";
type AuthMode = "login" | "signup";
type AdminTab = "dashboard" | "products" | "orders" | "users";
type Category = "All" | "T-Shirts" | "Jeans" | "Shoes" | "Shorts" | "Pants" | "Hoodies" | "Jackets" | "Dresses" | "Accessories";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  category: Category;
  image_url: string;
  extra_images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  review_count: number;
  is_new: boolean;
  is_hot: boolean;
  tags: string[];
}

interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  qty: number;
}

interface Order {
  id: string;
  userId: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  items: CartItem[];
  total: number;
  created_at: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  email: string;
}

interface UserRecord {
  id: string;
  email: string;
  password: string;
  full_name: string;
  is_admin: boolean;
  avatar_color: string;
}

// ─── DEMO PRODUCTS (REAL PHOTOS) ─────────────────────────────────────────────
const DEMO_PRODUCTS: Product[] = [
  // T-SHIRTS
  {
    id: "p1", name: "Oversized Vintage Wash Tee", description: "Premium 100% cotton heavyweight tee with a vintage wash finish. Drop-shoulder fit for that perfect oversized look. Pre-shrunk and ultra-soft from first wear.",
    price: 19.99, old_price: 34.99, category: "T-Shirts",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80"],
    colors: ["Black", "White", "Sand", "Slate Blue"], sizes: ["XS","S","M","L","XL","2XL"], stock: 45,
    rating: 4.7, review_count: 1289, is_new: false, is_hot: true, tags: ["bestseller","cotton"],
  },
  {
    id: "p2", name: "Graphic Art Print Tee", description: "Street-art inspired graphic tee on a relaxed unisex fit. Screen-printed design that won't crack or fade. Ribbed collar for structure.",
    price: 22.99, old_price: 38.00, category: "T-Shirts",
    image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"],
    colors: ["White", "Black", "Washed Gray"], sizes: ["S","M","L","XL"], stock: 30,
    rating: 4.5, review_count: 876, is_new: true, is_hot: false, tags: ["graphic","streetwear"],
  },
  {
    id: "p3", name: "Ribbed Muscle Tank", description: "Form-fitting ribbed tank in premium stretch cotton. Perfect for layering or wearing solo. Reinforced seams for lasting wear.",
    price: 14.99, old_price: 22.00, category: "T-Shirts",
    image_url: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"],
    colors: ["Black", "White", "Terracotta", "Forest Green"], sizes: ["XS","S","M","L","XL"], stock: 60,
    rating: 4.6, review_count: 543, is_new: true, is_hot: false, tags: ["new","fitness"],
  },
  // JEANS
  {
    id: "p4", name: "High-Rise Slim Straight Jeans", description: "Classic 5-pocket slim straight jeans with a high waist. Made from premium stretch denim for all-day comfort. Modern tapered leg with clean finished hem.",
    price: 49.99, old_price: 79.99, category: "Jeans",
    image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"],
    colors: ["Mid Blue", "Dark Indigo", "Black", "Light Wash"], sizes: ["24","25","26","27","28","29","30","32"], stock: 38,
    rating: 4.8, review_count: 2104, is_new: false, is_hot: true, tags: ["bestseller","denim"],
  },
  {
    id: "p5", name: "Baggy Y2K Jeans", description: "Trend-forward baggy fit with an ultra-low rise and wide leg. Distressed details and faded wash for authentic vintage vibes.",
    price: 54.99, old_price: 89.99, category: "Jeans",
    image_url: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"],
    colors: ["Light Wash", "Medium Wash"], sizes: ["24","26","28","30","32"], stock: 22,
    rating: 4.4, review_count: 667, is_new: true, is_hot: false, tags: ["y2k","trending"],
  },
  // HOODIES
  {
    id: "p6", name: "Heavyweight Fleece Hoodie", description: "Ultra-cozy 500gsm fleece hoodie with kangaroo pocket and adjustable drawstring. Brushed interior for maximum warmth. Relaxed boxy silhouette.",
    price: 44.99, old_price: 69.99, category: "Hoodies",
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", "https://images.unsplash.com/photo-1614495149050-9f3c8c9df6b6?w=600&q=80"],
    colors: ["Charcoal", "Cream", "Navy", "Sage", "Dusty Rose"], sizes: ["XS","S","M","L","XL","2XL"], stock: 55,
    rating: 4.9, review_count: 3421, is_new: false, is_hot: true, tags: ["bestseller","winter","cozy"],
  },
  {
    id: "p7", name: "Zip-Up Tech Hoodie", description: "Performance fleece zip-up with moisture-wicking inner lining. Thumbhole cuffs and media pocket for active lifestyle use.",
    price: 54.99, old_price: 84.99, category: "Hoodies",
    image_url: "https://images.unsplash.com/photo-1614495149050-9f3c8c9df6b6?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"],
    colors: ["Black", "Stone", "Olive"], sizes: ["S","M","L","XL"], stock: 28,
    rating: 4.6, review_count: 891, is_new: true, is_hot: false, tags: ["sports","zip"],
  },
  // JACKETS
  {
    id: "p8", name: "Satin Bomber Jacket", description: "Luxe satin bomber with embroidered back detail and ribbed trim. Lined interior for comfort. A timeless piece that elevates any outfit.",
    price: 79.99, old_price: 129.99, category: "Jackets",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80"],
    colors: ["Black", "Navy", "Burgundy", "Olive"], sizes: ["XS","S","M","L","XL"], stock: 18,
    rating: 4.7, review_count: 1543, is_new: false, is_hot: true, tags: ["trending","premium","bomber"],
  },
  {
    id: "p9", name: "Oversized Denim Jacket", description: "Vintage-inspired oversized denim jacket with chest pockets and button closure. Heavy-weight denim with natural fading for that lived-in look.",
    price: 64.99, old_price: 99.99, category: "Jackets",
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"],
    colors: ["Light Denim", "Dark Denim", "Black"], sizes: ["S","M","L","XL","2XL"], stock: 25,
    rating: 4.5, review_count: 987, is_new: true, is_hot: false, tags: ["denim","vintage"],
  },
  // SHOES
  {
    id: "p10", name: "Chunky Platform Sneakers", description: "Elevated chunky sole sneakers with mesh upper and leather overlays. Extra 5cm platform sole. Padded collar for comfort. The ultimate streetwear statement.",
    price: 89.99, old_price: 139.99, category: "Shoes",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"],
    colors: ["White", "Black", "Gray/Orange"], sizes: ["36","37","38","39","40","41","42","43","44"], stock: 20,
    rating: 4.8, review_count: 2876, is_new: false, is_hot: true, tags: ["chunky","platform","trending"],
  },
  {
    id: "p11", name: "Retro Canvas Low-Top", description: "Classic canvas low-top in a retro-inspired silhouette. Vulcanized rubber sole and reinforced toe cap. Unisex sizing.",
    price: 44.99, old_price: 64.99, category: "Shoes",
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    colors: ["White", "Black", "Navy", "Red"], sizes: ["36","37","38","39","40","41","42","43","44","45"], stock: 50,
    rating: 4.6, review_count: 1654, is_new: false, is_hot: false, tags: ["classic","canvas"],
  },
  {
    id: "p12", name: "Block Heel Mule", description: "Minimalist mule with a sturdy block heel and cushioned footbed. Open back slip-on design. Perfect for work to weekend.",
    price: 52.99, old_price: 78.00, category: "Shoes",
    image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    colors: ["Nude", "Black", "Cream"], sizes: ["35","36","37","38","39","40","41"], stock: 15,
    rating: 4.4, review_count: 432, is_new: true, is_hot: false, tags: ["heels","minimal"],
  },
  // SHORTS
  {
    id: "p13", name: "Cargo Utility Shorts", description: "Six-pocket cargo shorts in ripstop fabric. Adjustable waistband and side zip pockets. Versatile length hits just above the knee.",
    price: 29.99, old_price: 44.99, category: "Shorts",
    image_url: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1562932831-afb0b8b2b6f3?w=600&q=80"],
    colors: ["Olive", "Black", "Khaki", "Navy"], sizes: ["XS","S","M","L","XL"], stock: 42,
    rating: 4.5, review_count: 765, is_new: false, is_hot: false, tags: ["cargo","utility"],
  },
  {
    id: "p14", name: "Linen Drawstring Shorts", description: "Lightweight linen-blend shorts with an elasticated drawstring waist. Breathable and relaxed fit, perfect for summer days.",
    price: 24.99, old_price: null, category: "Shorts",
    image_url: "https://images.unsplash.com/photo-1562932831-afb0b8b2b6f3?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80"],
    colors: ["Sand", "White", "Black", "Dusty Blue"], sizes: ["XS","S","M","L","XL","2XL"], stock: 60,
    rating: 4.3, review_count: 521, is_new: true, is_hot: false, tags: ["linen","summer"],
  },
  // PANTS
  {
    id: "p15", name: "Wide-Leg Tailored Trousers", description: "Elevated wide-leg trousers with a high rise and pressed crease. Smooth woven fabric with a slight sheen. Functional side and back pockets.",
    price: 59.99, old_price: 94.99, category: "Pants",
    image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4aa0?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"],
    colors: ["Black", "Camel", "Ivory", "Chocolate"], sizes: ["XS","S","M","L","XL"], stock: 30,
    rating: 4.7, review_count: 1123, is_new: false, is_hot: true, tags: ["wide-leg","tailored","trending"],
  },
  {
    id: "p16", name: "Relaxed Cargo Pants", description: "Street-ready cargo pants with multiple utility pockets and adjustable hem. Technical fabric with slight stretch for mobility.",
    price: 54.99, old_price: 84.99, category: "Pants",
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4aa0?w=600&q=80"],
    colors: ["Olive", "Black", "Stone", "Teal"], sizes: ["XS","S","M","L","XL","2XL"], stock: 35,
    rating: 4.6, review_count: 892, is_new: true, is_hot: false, tags: ["cargo","streetwear"],
  },
  // DRESSES
  {
    id: "p17", name: "Slip Satin Midi Dress", description: "Elegant slip dress in fluid satin fabric. Adjustable spaghetti straps, bias-cut for a flattering drape. Lined for opacity. Wear it dressed up or down.",
    price: 49.99, old_price: 79.99, category: "Dresses",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80"],
    colors: ["Champagne", "Black", "Dusty Rose", "Sage"], sizes: ["XS","S","M","L","XL"], stock: 28,
    rating: 4.8, review_count: 2341, is_new: false, is_hot: true, tags: ["satin","elegant","bestseller"],
  },
  {
    id: "p18", name: "Floral Wrap Mini Dress", description: "Flirty wrap-style mini dress in lightweight chiffon with an all-over floral print. Adjustable tie waist. Flutter sleeves.",
    price: 36.99, old_price: 55.00, category: "Dresses",
    image_url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"],
    colors: ["Pink Floral", "Blue Floral", "Black Floral"], sizes: ["XS","S","M","L"], stock: 40,
    rating: 4.5, review_count: 876, is_new: true, is_hot: false, tags: ["floral","summer","mini"],
  },
  // ACCESSORIES
  {
    id: "p19", name: "Structured Mini Handbag", description: "Compact structured handbag with a top handle and detachable chain strap. Interior zip pocket and magnetic snap closure. Vegan leather.",
    price: 42.99, old_price: 68.00, category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"],
    colors: ["Black", "Ivory", "Caramel", "Sage", "Burgundy"], sizes: ["One Size"], stock: 35,
    rating: 4.7, review_count: 1892, is_new: false, is_hot: true, tags: ["bag","vegan","trending"],
  },
  {
    id: "p20", name: "Oval Sunglasses", description: "Retro-inspired oval frames with UV400 protection lenses. Lightweight acetate frame. Comes with protective pouch.",
    price: 18.99, old_price: 28.00, category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1623091411395-09e79fdbfcf3?w=600&q=80"],
    colors: ["Black", "Tortoise", "Clear", "Brown"], sizes: ["One Size"], stock: 80,
    rating: 4.4, review_count: 654, is_new: true, is_hot: false, tags: ["sunglasses","summer","retro"],
  },
  {
    id: "p21", name: "Chunky Chain Necklace", description: "Statement gold-tone chunky chain necklace. Lobster clasp closure. Tarnish-resistant plating. Hypoallergenic and lead-free.",
    price: 16.99, old_price: 26.00, category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"],
    colors: ["Gold", "Silver"], sizes: ["One Size"], stock: 100,
    rating: 4.6, review_count: 1204, is_new: false, is_hot: true, tags: ["jewelry","gold","statement"],
  },
  {
    id: "p22", name: "Wide Brim Bucket Hat", description: "Oversized bucket hat in washed canvas. UV-protective fabric. Unstructured for a relaxed shape. Adjustable inner band.",
    price: 22.99, old_price: 34.99, category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
    extra_images: ["https://images.unsplash.com/photo-1623091411395-09e79fdbfcf3?w=600&q=80"],
    colors: ["Beige", "Black", "Sage", "Terracotta"], sizes: ["S/M", "L/XL"], stock: 48,
    rating: 4.5, review_count: 789, is_new: true, is_hot: false, tags: ["hat","summer","Y2K"],
  },
];

const DEMO_ADMIN: UserRecord = {
  id: "admin-1", email: "admin@hypenest.com", password: "admin123",
  full_name: "HypeNest Admin", is_admin: true, avatar_color: "#FF385C",
};

const CATEGORIES: Category[] = ["All","T-Shirts","Jeans","Hoodies","Jackets","Shoes","Shorts","Pants","Dresses","Accessories"];

const BANNER_DATA = [
  { id: 1, title: "Summer Flash Sale", subtitle: "Up to 70% off", bg: "#FF385C", label: "⚡ Limited Time", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" },
  { id: 2, title: "New Arrivals", subtitle: "Fresh drops every week", bg: "#1A1A2E", label: "✨ Just In", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80" },
  { id: 3, title: "Street Culture", subtitle: "Express your style", bg: "#0F3460", label: "🔥 Trending", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80" },
];

const STATUS_CONFIG = {
  Pending:   { color: "#F59E0B", bg: "#FEF3C7", icon: "⏳" },
  Confirmed: { color: "#3B82F6", bg: "#DBEAFE", icon: "✅" },
  Shipped:   { color: "#8B5CF6", bg: "#EDE9FE", icon: "🚚" },
  Delivered: { color: "#10B981", bg: "#D1FAE5", icon: "📦" },
  Cancelled: { color: "#EF4444", bg: "#FEE2E2", icon: "❌" },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp() {
  const insets = useSafeAreaInsets();

  // Navigation
  const [screen, setScreen] = useState<Screen>("home");
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);

  function navigate(to: Screen) {
    setScreenHistory(h => [...h, screen]);
    setScreen(to);
  }
  function goBack() {
    const prev = screenHistory[screenHistory.length - 1];
    if (prev) {
      setScreenHistory(h => h.slice(0, -1));
      setScreen(prev);
    } else {
      setScreen("home");
    }
  }

  // Auth
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([DEMO_ADMIN]);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authReturnTo, setAuthReturnTo] = useState<Screen>("home");

  // Products
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // Checkout
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");

  // Orders & Admin
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [userSearch, setUserSearch] = useState("");

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Admin product form
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminForm, setAdminForm] = useState({ name:"",description:"",price:"",old_price:"",category:"T-Shirts",colors:"Black,White",sizes:"S,M,L,XL",stock:"10",image_url:"" });

  // Banner auto-scroll
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef<ScrollView>(null);
  useEffect(() => {
    const t = setInterval(() => {
      const next = (bannerIndex + 1) % BANNER_DATA.length;
      bannerRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setBannerIndex(next);
    }, 3500);
    return () => clearInterval(t);
  }, [bannerIndex]);

  // Computed
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartSubtotal = cart.reduce((s,i) => s+i.product.price*i.qty, 0);
  const cartDiscount = discountApplied ? cartSubtotal * 0.15 : 0;
  const cartTotal = cartSubtotal - cartDiscount;

  const myOrders = useMemo(() => allOrders.filter(o => o.userId === currentUser?.id), [allOrders, currentUser]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.includes(q));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
  }, [products, searchQuery]);

  const featuredProducts = useMemo(() => products.filter(p => p.is_hot).slice(0, 8), [products]);
  const newProducts = useMemo(() => products.filter(p => p.is_new).slice(0, 8), [products]);

  const filteredAdminOrders = useMemo(() => {
    const q = orderSearch.toLowerCase();
    return allOrders.filter(o => {
      const matchStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
      const matchQ = !q || o.full_name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.id.includes(q);
      return matchStatus && matchQ;
    });
  }, [allOrders, orderSearch, orderStatusFilter]);

  const filteredAdminUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    return users.filter(u => !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, userSearch]);

  const adminStats = useMemo(() => ({
    products: products.length,
    orders: allOrders.length,
    users: users.length,
    revenue: allOrders.filter(o=>o.status!=="Cancelled").reduce((s,o)=>s+o.total,0),
    pending: allOrders.filter(o=>o.status==="Pending").length,
    delivered: allOrders.filter(o=>o.status==="Delivered").length,
  }), [products, allOrders, users]);

  // ── AUTH ──
  function requireAuth(returnTo: Screen) {
    setAuthReturnTo(returnTo);
    setAuthMode("login");
    setAuthEmail(""); setAuthPassword(""); setAuthName("");
    navigate("auth");
  }

  function handleLogin() {
    const email = authEmail.trim().toLowerCase();
    const pass = authPassword.trim();
    if (!email || !pass) { Alert.alert("Missing fields","Enter your email and password."); return; }
    const found = users.find(u => u.email.toLowerCase() === email && u.password === pass);
    if (!found) { Alert.alert("Login failed","Incorrect email or password."); return; }
    setCurrentUser(found);
    setCheckoutName(found.full_name);
    setAuthEmail(""); setAuthPassword("");
    if (found.is_admin) { setAdminTab("dashboard"); setScreen("admin"); }
    else setScreen(authReturnTo);
  }

  function handleSignup() {
    const email = authEmail.trim().toLowerCase();
    const pass = authPassword.trim();
    const name = authName.trim();
    if (!email || !pass || !name) { Alert.alert("Missing fields","Fill all fields."); return; }
    if (pass.length < 6) { Alert.alert("Weak password","Min 6 characters."); return; }
    if (users.find(u => u.email.toLowerCase() === email)) { Alert.alert("Email taken","Account already exists."); return; }
    const colors = ["#FF385C","#8B5CF6","#3B82F6","#10B981","#F59E0B"];
    const newUser: UserRecord = { id:`user-${Date.now()}`, email, password: pass, full_name: name, is_admin: false, avatar_color: colors[Math.floor(Math.random()*colors.length)] };
    setUsers(p => [...p, newUser]);
    setCurrentUser(newUser);
    setCheckoutName(name);
    setAuthEmail(""); setAuthPassword(""); setAuthName("");
    setScreen(authReturnTo);
  }

  function logout() {
    setCurrentUser(null);
    setCart([]);
    setCheckoutName(""); setCheckoutPhone(""); setCheckoutCity(""); setCheckoutAddress("");
    setScreen("home");
  }

  // ── CART ──
  function addToCart(product: Product) {
    if (!selectedSize || !selectedColor) { Alert.alert("Select options","Please choose a size and color."); return; }
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor);
      if (exists) return prev.map(i => i.product.id===product.id && i.selectedSize===selectedSize && i.selectedColor===selectedColor ? {...i,qty:i.qty+1} : i);
      return [...prev, { id:`ci-${Date.now()}`, product, selectedSize, selectedColor, qty:1 }];
    });
    setCartOpen(true);
  }

  function changeQty(cartId: string, delta: number) {
    setCart(prev => prev.map(i => i.id===cartId ? {...i,qty:Math.max(0,i.qty+delta)} : i).filter(i=>i.qty>0));
  }

  function removeFromCart(cartId: string) {
    setCart(prev => prev.filter(i => i.id !== cartId));
  }

  function applyDiscount() {
    if (discountCode.toUpperCase() === "HYPE15") {
      setDiscountApplied(true);
      Alert.alert("🎉 Discount Applied!","15% off has been applied to your order.");
    } else {
      Alert.alert("Invalid Code","Try code HYPE15 for 15% off.");
    }
  }

  // ── ORDERS ──
  function placeOrder() {
    if (!currentUser) { requireAuth("checkout"); return; }
    if (!checkoutName || !checkoutPhone || !checkoutCity || !checkoutAddress) { Alert.alert("Missing fields","Fill all delivery details."); return; }
    if (cart.length === 0) { Alert.alert("Empty cart","Add items first."); return; }
    const newOrder: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      userId: currentUser.id, status: "Pending",
      items: [...cart], total: cartTotal,
      created_at: new Date().toISOString(),
      full_name: checkoutName, phone: checkoutPhone,
      city: checkoutCity, address: checkoutAddress, email: currentUser.email,
    };
    setAllOrders(p => [newOrder, ...p]);
    setCart([]); setDiscountApplied(false); setDiscountCode("");
    setCheckoutPhone(""); setCheckoutCity(""); setCheckoutAddress("");
    Alert.alert("🎉 Order Placed!","Your order is confirmed.");
    setScreen("orders");
  }

  function updateOrderStatus(orderId: string, status: Order["status"]) {
    setAllOrders(p => p.map(o => o.id===orderId ? {...o,status} : o));
  }

  // ── WISHLIST ──
  function toggleWishlist(productId: string) {
    setWishlist(prev => prev.includes(productId) ? prev.filter(i=>i!==productId) : [...prev,productId]);
  }

  // ── ADMIN PRODUCTS ──
  function saveAdminProduct() {
    const { name,price,category,colors,sizes,stock,image_url,description,old_price } = adminForm;
    if (!name||!price||!category) { Alert.alert("Missing","Name, price, category required."); return; }
    const prod: Product = {
      id: editingProduct?.id || `p-${Date.now()}`,
      name, description, price:+price, old_price:old_price?+old_price:null,
      category: category as Category, image_url: image_url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      extra_images: [], colors: colors.split(",").map(x=>x.trim()).filter(Boolean),
      sizes: sizes.split(",").map(x=>x.trim()).filter(Boolean), stock:+stock,
      rating: 4.5, review_count: 0, is_new: true, is_hot: false, tags: [],
    };
    if (editingProduct) setProducts(p => p.map(x => x.id===editingProduct.id ? prod : x));
    else setProducts(p => [prod,...p]);
    setEditingProduct(null);
    setAdminForm({ name:"",description:"",price:"",old_price:"",category:"T-Shirts",colors:"Black,White",sizes:"S,M,L,XL",stock:"10",image_url:"" });
    Alert.alert("✓ Saved");
  }

  function startEditProduct(p: Product) {
    setEditingProduct(p);
    setAdminForm({ name:p.name, description:p.description, price:String(p.price), old_price:p.old_price?String(p.old_price):"", category:p.category, colors:p.colors.join(","), sizes:p.sizes.join(","), stock:String(p.stock), image_url:p.image_url });
    setAdminTab("products");
  }

  // ─── RENDER HELPERS ──────────────────────────────────────────────────────────

  function renderStars(rating: number) {
    return Array.from({length:5},(_,i) => (
      <Text key={i} style={{color: i < Math.floor(rating) ? "#FFB800" : i < rating ? "#FFB800" : "#D1D5DB", fontSize:12}}>★</Text>
    ));
  }

  function renderProductCard(item: Product, wide = false) {
    const discount = item.old_price ? Math.round(((item.old_price-item.price)/item.old_price)*100) : null;
    const isWished = wishlist.includes(item.id);
    return (
      <TouchableOpacity key={item.id} onPress={() => { setSelectedProduct(item); setSelectedSize(item.sizes[0]||""); setSelectedColor(item.colors[0]||""); setSelectedImageIndex(0); navigate("details"); }}
        style={[s.productCard, wide && {width:"100%",flexDirection:"row",height:140}]} activeOpacity={0.92}>
        <View style={[s.productImgWrap, wide && {width:120,height:140}]}>
          <Image source={{uri:item.image_url}} style={[s.productImg, wide && {height:140}]} resizeMode="cover"/>
          {discount && <View style={s.discountBadge}><Text style={s.discountBadgeText}>-{discount}%</Text></View>}
          {item.is_new && !discount && <View style={[s.discountBadge,{backgroundColor:"#10B981"}]}><Text style={s.discountBadgeText}>NEW</Text></View>}
          {item.is_hot && <View style={[s.discountBadge,{backgroundColor:"#8B5CF6",top:"auto",bottom:8}]}><Text style={s.discountBadgeText}>🔥 HOT</Text></View>}
          <TouchableOpacity style={s.wishBtn} onPress={() => toggleWishlist(item.id)}>
            <Text style={{fontSize:18, color: isWished ? "#FF385C" : "#FFF"}}>{isWished?"♥":"♡"}</Text>
          </TouchableOpacity>
        </View>
        <View style={[s.productInfo, wide && {flex:1,justifyContent:"center",paddingVertical:0}]}>
          <Text style={s.productCategory}>{item.category.toUpperCase()}</Text>
          <Text style={s.productName} numberOfLines={2}>{item.name}</Text>
          <View style={{flexDirection:"row",alignItems:"center",marginTop:2}}>
            {renderStars(item.rating)}
            <Text style={s.reviewCount}> ({item.review_count.toLocaleString()})</Text>
          </View>
          <View style={s.priceRow}>
            <Text style={s.productPrice}>${item.price.toFixed(2)}</Text>
            {item.old_price && <Text style={s.productOldPrice}>${item.old_price.toFixed(2)}</Text>}
          </View>
          <View style={{flexDirection:"row",flexWrap:"wrap",gap:4,marginTop:6}}>
            {item.colors.slice(0,4).map(c => <View key={c} style={[s.colorDot, {backgroundColor: COLOR_MAP[c]||"#888"}]}/>)}
            {item.colors.length > 4 && <Text style={{color:"#9CA3AF",fontSize:11}}>+{item.colors.length-4}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREENS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── AUTH ────────────────────────────────────────────────────────────────────
  if (screen === "auth") {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
        <ScrollView contentContainerStyle={s.authWrap} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={goBack} style={s.authBackBtn}>
            <Text style={s.authBackTxt}>← Back</Text>
          </TouchableOpacity>

          <View style={s.authLogo}>
            <Text style={s.authLogoText}>HypeNest</Text>
            <View style={s.authLogoBadge}><Text style={{color:"#FFF",fontSize:10,fontWeight:"700"}}>FASHION</Text></View>
          </View>

          <Text style={s.authTagline}>
            {authMode==="login" ? "Welcome back, trendsetter 👋" : "Join the style movement ✨"}
          </Text>

          {/* Toggle */}
          <View style={s.authToggle}>
            <TouchableOpacity style={[s.authToggleBtn, authMode==="login"&&s.authToggleBtnActive]} onPress={()=>setAuthMode("login")}>
              <Text style={[s.authToggleTxt, authMode==="login"&&s.authToggleTxtActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.authToggleBtn, authMode==="signup"&&s.authToggleBtnActive]} onPress={()=>setAuthMode("signup")}>
              <Text style={[s.authToggleTxt, authMode==="signup"&&s.authToggleTxtActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {authMode==="signup" && (
            <View style={s.inputWrap}>
              <Text style={s.inputLabel}>Full Name</Text>
              <TextInput style={s.input} placeholder="Your full name" placeholderTextColor="#9CA3AF" value={authName} onChangeText={setAuthName}/>
            </View>
          )}

          <View style={s.inputWrap}>
            <Text style={s.inputLabel}>Email Address</Text>
            <TextInput style={s.input} placeholder="hello@example.com" placeholderTextColor="#9CA3AF" value={authEmail} onChangeText={setAuthEmail} autoCapitalize="none" keyboardType="email-address"/>
          </View>
          <View style={s.inputWrap}>
            <Text style={s.inputLabel}>Password</Text>
            <TextInput style={s.input} placeholder={authMode==="signup"?"Min 6 characters":"Your password"} placeholderTextColor="#9CA3AF" value={authPassword} onChangeText={setAuthPassword} secureTextEntry/>
          </View>

          <TouchableOpacity style={s.primaryBtn} onPress={authMode==="login"?handleLogin:handleSignup}>
            <Text style={s.primaryBtnTxt}>{authMode==="login"?"Login & Continue →":"Create Account →"}</Text>
          </TouchableOpacity>

          <View style={s.demoBadge}>
            <Text style={s.demoBadgeTitle}>🔑 Demo Admin</Text>
            <Text style={s.demoBadgeTxt}>admin@hypenest.com / admin123</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── SEARCH ──────────────────────────────────────────────────────────────────
  if (screen === "search") {
    return (
      <SafeAreaView style={s.safe}>
        <View style={[s.searchHeader, {paddingTop: insets.top+4}]}>
          <TouchableOpacity onPress={goBack} style={{padding:8}}>
            <Text style={{fontSize:22}}>←</Text>
          </TouchableOpacity>
          <TextInput
            style={s.searchInputFull} placeholder="Search fashion..." placeholderTextColor="#9CA3AF"
            value={searchQuery} onChangeText={setSearchQuery} autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={()=>setSearchQuery("")} style={{padding:8}}>
              <Text style={{color:"#6B7280",fontSize:16}}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {searchQuery.length === 0 ? (
          <View style={s.searchEmptyState}>
            <Text style={s.searchEmptyIcon}>🔍</Text>
            <Text style={s.searchEmptyTitle}>Search HypeNest</Text>
            <Text style={s.searchEmptySubtitle}>Find your next favorite piece</Text>
            <Text style={{marginTop:20,color:"#9CA3AF",fontSize:13,fontWeight:"600"}}>POPULAR SEARCHES</Text>
            <View style={{flexDirection:"row",flexWrap:"wrap",gap:10,marginTop:12,justifyContent:"center"}}>
              {["Oversized Tee","Wide Leg Pants","Bomber Jacket","Chunky Sneakers","Slip Dress"].map(q => (
                <TouchableOpacity key={q} style={s.popularChip} onPress={()=>setSearchQuery(q)}>
                  <Text style={s.popularChipTxt}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={i=>i.id}
            numColumns={2}
            contentContainerStyle={{padding:12,gap:12}}
            columnWrapperStyle={{gap:12}}
            ListEmptyComponent={
              <View style={{alignItems:"center",padding:40}}>
                <Text style={{fontSize:40}}>😕</Text>
                <Text style={{fontSize:18,fontWeight:"800",marginTop:12,color:"#111"}}>No results found</Text>
                <Text style={{color:"#6B7280",marginTop:4}}>Try different keywords</Text>
              </View>
            }
            renderItem={({item}) => renderProductCard(item)}
          />
        )}
      </SafeAreaView>
    );
  }

  // ── WISHLIST ─────────────────────────────────────────────────────────────────
  if (screen === "wishlist") {
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    return (
      <SafeAreaView style={s.safe}>
        <View style={[s.pageHeader, {paddingTop:insets.top+6}]}>
          <TouchableOpacity onPress={goBack}><Text style={s.backTxt}>←</Text></TouchableOpacity>
          <Text style={s.pageTitle}>Wishlist ♥</Text>
          <View style={{width:32}}/>
        </View>
        {wishlistProducts.length === 0 ? (
          <View style={s.emptyCenter}>
            <Text style={{fontSize:60}}>♡</Text>
            <Text style={s.emptyTitle}>Your wishlist is empty</Text>
            <Text style={s.emptySub}>Save items you love to find them easily later</Text>
            <TouchableOpacity style={s.primaryBtn} onPress={() => navigate("home")}>
              <Text style={s.primaryBtnTxt}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={wishlistProducts}
            keyExtractor={i=>i.id}
            numColumns={2}
            contentContainerStyle={{padding:12,gap:12}}
            columnWrapperStyle={{gap:12}}
            renderItem={({item})=>renderProductCard(item)}
          />
        )}
      </SafeAreaView>
    );
  }

  // ── PRODUCT DETAILS ─────────────────────────────────────────────────────────
  if (screen === "details" && selectedProduct) {
    const p = selectedProduct;
    const allImages = [p.image_url, ...p.extra_images];
    const discount = p.old_price ? Math.round(((p.old_price-p.price)/p.old_price)*100) : null;
    const isWished = wishlist.includes(p.id);

    return (
      <SafeAreaView style={s.safe}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* Image Gallery */}
          <View style={{position:"relative"}}>
            <ScrollView
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScroll={e => setSelectedImageIndex(Math.round(e.nativeEvent.contentOffset.x/SCREEN_WIDTH))}
              scrollEventThrottle={16}
            >
              {allImages.map((img,idx) => (
                <Image key={idx} source={{uri:img}} style={{width:SCREEN_WIDTH,height:460}} resizeMode="cover"/>
              ))}
            </ScrollView>

            {/* Dots */}
            {allImages.length > 1 && (
              <View style={s.imageDots}>
                {allImages.map((_,idx) => (
                  <View key={idx} style={[s.imageDot, idx===selectedImageIndex&&s.imageDotActive]}/>
                ))}
              </View>
            )}

            {/* Top controls */}
            <View style={[s.detailsTopBar, {top: insets.top+8}]}>
              <TouchableOpacity style={s.detailsCircleBtn} onPress={goBack}>
                <Text style={{fontSize:20}}>←</Text>
              </TouchableOpacity>
              <View style={{flexDirection:"row",gap:10}}>
                <TouchableOpacity style={s.detailsCircleBtn} onPress={() => toggleWishlist(p.id)}>
                  <Text style={{fontSize:20,color:isWished?"#FF385C":"#111"}}>{isWished?"♥":"♡"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.detailsCircleBtn,{position:"relative"}]} onPress={() => setCartOpen(true)}>
                  <Text style={{fontSize:20}}>🛒</Text>
                  {cartCount > 0 && <View style={s.cartBadge}><Text style={s.cartBadgeTxt}>{cartCount}</Text></View>}
                </TouchableOpacity>
              </View>
            </View>

            {/* Badges */}
            {discount && <View style={[s.detailsBadge,{backgroundColor:"#FF385C"}]}><Text style={s.detailsBadgeTxt}>-{discount}% OFF</Text></View>}
            {p.is_new && !discount && <View style={[s.detailsBadge,{backgroundColor:"#10B981"}]}><Text style={s.detailsBadgeTxt}>NEW IN</Text></View>}
          </View>

          <View style={s.detailsPad}>
            {/* Title & Price */}
            <Text style={s.detailsCategory}>{p.category.toUpperCase()}</Text>
            <Text style={s.detailsTitle}>{p.name}</Text>

            <View style={s.ratingRow}>
              <View style={{flexDirection:"row"}}>{renderStars(p.rating)}</View>
              <Text style={s.ratingText}>{p.rating} ({p.review_count.toLocaleString()} reviews)</Text>
              <View style={[s.stockBadge,{backgroundColor:p.stock>10?"#D1FAE5":"#FEE2E2"}]}>
                <Text style={[s.stockBadgeTxt,{color:p.stock>10?"#059669":"#DC2626"}]}>
                  {p.stock>10?"In Stock":"Low Stock"}
                </Text>
              </View>
            </View>

            <View style={s.priceRowLarge}>
              <Text style={s.detailsPrice}>${p.price.toFixed(2)}</Text>
              {p.old_price && <Text style={s.detailsOldPrice}>${p.old_price.toFixed(2)}</Text>}
              {discount && <View style={s.saveBadge}><Text style={s.saveBadgeTxt}>Save ${(p.old_price!-p.price).toFixed(2)}</Text></View>}
            </View>

            {/* Color */}
            <Text style={s.optionLabel}>Color: <Text style={{fontWeight:"900"}}>{selectedColor}</Text></Text>
            <View style={s.colorRow}>
              {p.colors.map(c => (
                <TouchableOpacity key={c} onPress={()=>setSelectedColor(c)}
                  style={[s.colorOption, selectedColor===c&&s.colorOptionActive]}>
                  <View style={[s.colorSwatch,{backgroundColor:COLOR_MAP[c]||"#888"}]}/>
                  <Text style={[s.colorOptionTxt,selectedColor===c&&{color:"#FF385C",fontWeight:"700"}]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Size */}
            <Text style={s.optionLabel}>Size: <Text style={{fontWeight:"900"}}>{selectedSize}</Text></Text>
            <View style={s.sizeRow}>
              {p.sizes.map(sz => (
                <TouchableOpacity key={sz} style={[s.sizeChip, selectedSize===sz&&s.sizeChipActive]} onPress={()=>setSelectedSize(sz)}>
                  <Text style={[s.sizeChipTxt, selectedSize===sz&&s.sizeChipTxtActive]}>{sz}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Description */}
            <Text style={s.sectionLabel}>About This Item</Text>
            <Text style={s.description}>{p.description}</Text>

            {/* Tags */}
            {p.tags.length > 0 && (
              <View style={{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:12}}>
                {p.tags.map(t => <View key={t} style={s.tag}><Text style={s.tagTxt}>#{t}</Text></View>)}
              </View>
            )}

            {/* Perks */}
            <View style={s.perksRow}>
              {[["🚚","Free shipping\nover $50"],["↩️","Easy 30-day\nreturns"],["🔒","Secure\npayment"],["⭐","Quality\nguaranteed"]].map(([icon,txt]) => (
                <View key={txt} style={s.perkItem}>
                  <Text style={{fontSize:22}}>{icon}</Text>
                  <Text style={s.perkTxt}>{txt}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Sticky Add to Cart */}
        <View style={[s.stickyAddToCart, {paddingBottom: insets.bottom+8}]}>
          <TouchableOpacity style={s.wishlistStickyBtn} onPress={()=>toggleWishlist(p.id)}>
            <Text style={{fontSize:22,color:isWished?"#FF385C":"#111"}}>{isWished?"♥":"♡"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.addToCartBtn} onPress={()=>addToCart(p)}>
            <Text style={s.addToCartBtnTxt}>Add to Cart · ${p.price.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── CART DRAWER (Modal) ──────────────────────────────────────────────────────
  const CartDrawer = () => (
    <Modal visible={cartOpen} transparent animationType="slide" onRequestClose={()=>setCartOpen(false)}>
      <TouchableWithoutFeedback onPress={()=>setCartOpen(false)}>
        <View style={s.drawerOverlay}/>
      </TouchableWithoutFeedback>
      <View style={[s.drawer, {paddingBottom: insets.bottom+16}]}>
        <View style={s.drawerHandle}/>
        <View style={s.drawerHeader}>
          <Text style={s.drawerTitle}>My Cart</Text>
          <Text style={s.drawerCount}>{cartCount} items</Text>
          <TouchableOpacity onPress={()=>setCartOpen(false)} style={s.drawerCloseBtn}>
            <Text style={{fontSize:16,color:"#6B7280"}}>✕</Text>
          </TouchableOpacity>
        </View>

        {cart.length === 0 ? (
          <View style={{alignItems:"center",padding:40}}>
            <Text style={{fontSize:56}}>🛒</Text>
            <Text style={{fontSize:18,fontWeight:"800",marginTop:12,color:"#111"}}>Your cart is empty</Text>
            <Text style={{color:"#6B7280",marginTop:4}}>Start shopping to add items here</Text>
            <TouchableOpacity style={[s.primaryBtn,{marginTop:20,width:"100%"}]} onPress={()=>setCartOpen(false)}>
              <Text style={s.primaryBtnTxt}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView style={{maxHeight: SCREEN_HEIGHT*0.4}} showsVerticalScrollIndicator={false}>
              {cart.map(item => (
                <View key={item.id} style={s.cartItem}>
                  <Image source={{uri:item.product.image_url}} style={s.cartItemImg}/>
                  <View style={{flex:1}}>
                    <Text style={s.cartItemName} numberOfLines={2}>{item.product.name}</Text>
                    <Text style={s.cartItemMeta}>{item.selectedColor} · {item.selectedSize}</Text>
                    <Text style={s.cartItemPrice}>${(item.product.price*item.qty).toFixed(2)}</Text>
                    <View style={s.qtyRow}>
                      <TouchableOpacity style={s.qtyBtn} onPress={()=>changeQty(item.id,-1)}>
                        <Text style={s.qtyBtnTxt}>−</Text>
                      </TouchableOpacity>
                      <Text style={s.qtyVal}>{item.qty}</Text>
                      <TouchableOpacity style={s.qtyBtn} onPress={()=>changeQty(item.id,1)}>
                        <Text style={s.qtyBtnTxt}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.removeBtn} onPress={()=>removeFromCart(item.id)}>
                        <Text style={s.removeBtnTxt}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Discount */}
            <View style={s.discountRow}>
              <TextInput style={s.discountInput} placeholder="Discount code (try HYPE15)" placeholderTextColor="#9CA3AF" value={discountCode} onChangeText={setDiscountCode} autoCapitalize="characters"/>
              <TouchableOpacity style={s.discountApplyBtn} onPress={applyDiscount}>
                <Text style={s.discountApplyTxt}>Apply</Text>
              </TouchableOpacity>
            </View>
            {discountApplied && <Text style={{color:"#10B981",fontSize:13,fontWeight:"600",marginHorizontal:16}}>✓ 15% discount applied!</Text>}

            <View style={s.cartSummary}>
              <View style={s.cartSummaryRow}>
                <Text style={s.cartSummaryLabel}>Subtotal</Text>
                <Text style={s.cartSummaryValue}>${cartSubtotal.toFixed(2)}</Text>
              </View>
              {discountApplied && (
                <View style={s.cartSummaryRow}>
                  <Text style={[s.cartSummaryLabel,{color:"#10B981"}]}>Discount (15%)</Text>
                  <Text style={[s.cartSummaryValue,{color:"#10B981"}]}>-${cartDiscount.toFixed(2)}</Text>
                </View>
              )}
              <View style={s.cartSummaryRow}>
                <Text style={s.cartSummaryLabel}>Shipping</Text>
                <Text style={[s.cartSummaryValue,{color:"#10B981"}]}>{cartSubtotal>=50?"FREE":"$4.99"}</Text>
              </View>
              <View style={[s.cartSummaryRow,{borderTopWidth:1,borderTopColor:"#E5E7EB",paddingTop:12,marginTop:4}]}>
                <Text style={{fontWeight:"900",fontSize:17,color:"#111"}}>Total</Text>
                <Text style={{fontWeight:"900",fontSize:20,color:"#FF385C"}}>${cartTotal.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={[s.primaryBtn,{marginHorizontal:16}]} onPress={()=>{ setCartOpen(false); navigate("checkout"); }}>
              <Text style={s.primaryBtnTxt}>Checkout · ${cartTotal.toFixed(2)} →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );

  // ── CHECKOUT ──────────────────────────────────────────────────────────────────
  if (screen === "checkout") {
    return (
      <SafeAreaView style={s.safe}>
        <CartDrawer/>
        <View style={[s.pageHeader, {paddingTop:insets.top+6}]}>
          <TouchableOpacity onPress={goBack}><Text style={s.backTxt}>←</Text></TouchableOpacity>
          <Text style={s.pageTitle}>Checkout</Text>
          <View style={{width:32}}/>
        </View>

        <ScrollView style={{flex:1}} contentContainerStyle={{padding:16}} keyboardShouldPersistTaps="handled">
          {!currentUser && (
            <View style={s.authPromptCard}>
              <Text style={{fontSize:24}}>🔐</Text>
              <View style={{flex:1}}>
                <Text style={{fontWeight:"900",fontSize:15,color:"#111"}}>Login to complete your order</Text>
                <Text style={{color:"#6B7280",fontSize:13,marginTop:2}}>We need your details to process your order safely.</Text>
              </View>
              <TouchableOpacity style={s.authPromptBtn} onPress={()=>requireAuth("checkout")}>
                <Text style={s.authPromptBtnTxt}>Login</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={s.sectionLabel}>Delivery Details</Text>
          {[
            {label:"Full Name",val:checkoutName,set:setCheckoutName,placeholder:"Your full name"},
            {label:"Phone",val:checkoutPhone,set:setCheckoutPhone,placeholder:"+1 234 567 8900",keyboard:"phone-pad"},
            {label:"City",val:checkoutCity,set:setCheckoutCity,placeholder:"New York"},
          ].map(({label,val,set,placeholder,keyboard}) => (
            <View key={label} style={s.inputWrap}>
              <Text style={s.inputLabel}>{label}</Text>
              <TextInput style={s.input} placeholder={placeholder} placeholderTextColor="#9CA3AF" value={val} onChangeText={set} keyboardType={(keyboard as any)||"default"}/>
            </View>
          ))}
          <View style={s.inputWrap}>
            <Text style={s.inputLabel}>Delivery Address</Text>
            <TextInput style={[s.input,{minHeight:80,textAlignVertical:"top"}]} placeholder="Street address, apartment, etc." placeholderTextColor="#9CA3AF" value={checkoutAddress} onChangeText={setCheckoutAddress} multiline/>
          </View>

          {/* Payment */}
          <Text style={s.sectionLabel}>Payment Method</Text>
          <View style={s.paymentCard}>
            <Text style={{fontSize:28}}>💵</Text>
            <View>
              <Text style={{fontWeight:"800",color:"#111",fontSize:15}}>Cash on Delivery</Text>
              <Text style={{color:"#6B7280",fontSize:13}}>Pay when your package arrives</Text>
            </View>
            <View style={s.paymentSelected}><Text style={{color:"#FFF",fontSize:11,fontWeight:"700"}}>✓</Text></View>
          </View>

          {/* Order Summary */}
          <Text style={s.sectionLabel}>Order Summary</Text>
          <View style={s.summaryCard}>
            {cart.map(item => (
              <View key={item.id} style={s.summaryItem}>
                <Image source={{uri:item.product.image_url}} style={s.summaryImg}/>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:"700",color:"#111",fontSize:13}} numberOfLines={1}>{item.product.name}</Text>
                  <Text style={{color:"#6B7280",fontSize:12}}>{item.selectedColor} · {item.selectedSize} · ×{item.qty}</Text>
                </View>
                <Text style={{fontWeight:"800",color:"#111"}}>${(item.product.price*item.qty).toFixed(2)}</Text>
              </View>
            ))}
            <View style={[s.cartSummaryRow,{borderTopWidth:1,borderTopColor:"#E5E7EB",paddingTop:12,marginTop:8}]}>
              <Text style={{fontWeight:"900",color:"#111",fontSize:16}}>Total</Text>
              <Text style={{fontWeight:"900",color:"#FF385C",fontSize:20}}>${cartTotal.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity style={[s.primaryBtn, !currentUser&&{backgroundColor:"#9CA3AF"}]} onPress={placeOrder} disabled={!currentUser}>
            <Text style={s.primaryBtnTxt}>{currentUser?`Place Order · $${cartTotal.toFixed(2)} →`:"Login to Place Order"}</Text>
          </TouchableOpacity>
          <View style={{height:40}}/>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── ORDERS ───────────────────────────────────────────────────────────────────
  if (screen === "orders") {
    return (
      <SafeAreaView style={s.safe}>
        <View style={[s.pageHeader, {paddingTop:insets.top+6}]}>
          <TouchableOpacity onPress={goBack}><Text style={s.backTxt}>←</Text></TouchableOpacity>
          <Text style={s.pageTitle}>My Orders</Text>
          <View style={{width:32}}/>
        </View>
        <ScrollView style={{flex:1,paddingHorizontal:16}} showsVerticalScrollIndicator={false}>
          {myOrders.length === 0 ? (
            <View style={s.emptyCenter}>
              <Text style={{fontSize:60}}>📦</Text>
              <Text style={s.emptyTitle}>No orders yet</Text>
              <Text style={s.emptySub}>Your order history will appear here</Text>
              <TouchableOpacity style={s.primaryBtn} onPress={()=>navigate("home")}>
                <Text style={s.primaryBtnTxt}>Start Shopping →</Text>
              </TouchableOpacity>
            </View>
          ) : myOrders.map(order => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <View key={order.id} style={s.orderCard}>
                <View style={s.orderCardTop}>
                  <View>
                    <Text style={s.orderId}>#{order.id}</Text>
                    <Text style={s.orderDate}>{new Date(order.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</Text>
                  </View>
                  <View style={[s.statusPill,{backgroundColor:cfg.bg}]}>
                    <Text style={[s.statusPillTxt,{color:cfg.color}]}>{cfg.icon} {order.status}</Text>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:12}}>
                  {order.items.map(item => (
                    <Image key={item.id} source={{uri:item.product.image_url}} style={{width:72,height:90,borderRadius:10,marginRight:8}}/>
                  ))}
                </ScrollView>
                <Text style={{color:"#6B7280",fontSize:13,marginBottom:4}}>{order.items.reduce((s,i)=>s+i.qty,0)} items · {order.city}</Text>
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                  <Text style={{fontWeight:"900",fontSize:18,color:"#111"}}>${order.total.toFixed(2)}</Text>
                  <TouchableOpacity style={s.trackBtn}><Text style={s.trackBtnTxt}>Track Order →</Text></TouchableOpacity>
                </View>
              </View>
            );
          })}
          <View style={{height:30}}/>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── PROFILE ──────────────────────────────────────────────────────────────────
  if (screen === "profile") {
    if (!currentUser) return (
      <SafeAreaView style={s.safe}>
        <View style={[s.pageHeader,{paddingTop:insets.top+6}]}>
          <TouchableOpacity onPress={goBack}><Text style={s.backTxt}>←</Text></TouchableOpacity>
          <Text style={s.pageTitle}>Account</Text>
          <View style={{width:32}}/>
        </View>
        <View style={s.emptyCenter}>
          <Text style={{fontSize:60}}>👤</Text>
          <Text style={s.emptyTitle}>Not logged in</Text>
          <Text style={s.emptySub}>Login to manage your account & orders</Text>
          <TouchableOpacity style={s.primaryBtn} onPress={()=>requireAuth("profile")}>
            <Text style={s.primaryBtnTxt}>Login / Sign Up →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

    return (
      <SafeAreaView style={s.safe}>
        <View style={[s.pageHeader,{paddingTop:insets.top+6}]}>
          <TouchableOpacity onPress={goBack}><Text style={s.backTxt}>←</Text></TouchableOpacity>
          <Text style={s.pageTitle}>My Account</Text>
          <View style={{width:32}}/>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.profileHero}>
            <View style={[s.profileAvatar,{backgroundColor:currentUser.avatar_color}]}>
              <Text style={s.profileAvatarTxt}>{currentUser.full_name[0].toUpperCase()}</Text>
            </View>
            <Text style={s.profileName}>{currentUser.full_name}</Text>
            <Text style={s.profileEmail}>{currentUser.email}</Text>
            <View style={s.profileStats}>
              <View style={s.profileStat}><Text style={s.profileStatNum}>{myOrders.length}</Text><Text style={s.profileStatLabel}>Orders</Text></View>
              <View style={s.profileStatDivider}/>
              <View style={s.profileStat}><Text style={s.profileStatNum}>{wishlist.length}</Text><Text style={s.profileStatLabel}>Wishlist</Text></View>
              <View style={s.profileStatDivider}/>
              <View style={s.profileStat}><Text style={s.profileStatNum}>{cartCount}</Text><Text style={s.profileStatLabel}>In Cart</Text></View>
            </View>
          </View>

          <View style={{paddingHorizontal:16}}>
            {[
              {icon:"📦",label:"My Orders",count:myOrders.length,action:()=>navigate("orders")},
              {icon:"♥",label:"Wishlist",count:wishlist.length,action:()=>navigate("wishlist")},
              {icon:"🛒",label:"Shopping Cart",count:cartCount,action:()=>setCartOpen(true)},
              {icon:"📍",label:"Saved Addresses",count:null,action:()=>{}},
              {icon:"🔔",label:"Notifications",count:null,action:()=>{}},
              {icon:"💳",label:"Payment Methods",count:null,action:()=>{}},
              {icon:"⚙️",label:"Settings",count:null,action:()=>{}},
            ].map(({icon,label,count,action}) => (
              <TouchableOpacity key={label} style={s.profileMenuItem} onPress={action}>
                <Text style={{fontSize:22,marginRight:14}}>{icon}</Text>
                <Text style={s.profileMenuLabel}>{label}</Text>
                {count!=null && count>0 && <View style={s.profileMenuBadge}><Text style={s.profileMenuBadgeTxt}>{count}</Text></View>}
                <Text style={{color:"#9CA3AF",marginLeft:"auto",fontSize:18}}>›</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={s.logoutBtn} onPress={logout}>
              <Text style={s.logoutBtnTxt}>🚪  Log Out</Text>
            </TouchableOpacity>
            <View style={{height:30}}/>
          </View>
        </ScrollView>
        <CartDrawer/>
      </SafeAreaView>
    );
  }

  // ── ADMIN ────────────────────────────────────────────────────────────────────
  if (screen === "admin") {
    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={{paddingBottom:40}} showsVerticalScrollIndicator={false}>
          <View style={[s.adminHdr,{paddingTop:insets.top+10}]}>
            <View>
              <Text style={s.adminTitle}>Admin Panel</Text>
              <Text style={{color:"rgba(255,255,255,0.7)",fontSize:13}}>HypeNest Store Management</Text>
            </View>
            <TouchableOpacity style={s.adminLogoutBtn} onPress={logout}>
              <Text style={{color:"#FFF",fontWeight:"700",fontSize:13}}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Admin Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,gap:10,paddingVertical:14}}>
            {(["dashboard","products","orders","users"] as AdminTab[]).map(tab => (
              <TouchableOpacity key={tab} style={[s.adminTabChip, adminTab===tab&&s.adminTabChipActive]} onPress={()=>setAdminTab(tab)}>
                <Text style={[s.adminTabTxt, adminTab===tab&&s.adminTabTxtActive]}>
                  {tab==="dashboard"?"📊 Dashboard":tab==="products"?"👕 Products":tab==="orders"?"📦 Orders":"👥 Users"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{paddingHorizontal:16}}>

            {/* DASHBOARD */}
            {adminTab==="dashboard" && (
              <>
                <View style={s.statsGrid}>
                  {[
                    {icon:"👕",label:"Products",val:adminStats.products,color:"#8B5CF6"},
                    {icon:"📦",label:"Orders",val:adminStats.orders,color:"#3B82F6"},
                    {icon:"👥",label:"Users",val:adminStats.users,color:"#10B981"},
                    {icon:"💰",label:"Revenue",val:`$${adminStats.revenue.toFixed(0)}`,color:"#FF385C"},
                    {icon:"⏳",label:"Pending",val:adminStats.pending,color:"#F59E0B"},
                    {icon:"✅",label:"Delivered",val:adminStats.delivered,color:"#059669"},
                  ].map(({icon,label,val,color}) => (
                    <View key={label} style={[s.statCard,{borderTopColor:color}]}>
                      <Text style={{fontSize:28}}>{icon}</Text>
                      <Text style={[s.statVal,{color}]}>{val}</Text>
                      <Text style={s.statLabel}>{label}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* PRODUCTS */}
            {adminTab==="products" && (
              <>
                <View style={s.adminFormCard}>
                  <Text style={s.adminFormTitle}>{editingProduct?"✏️ Edit Product":"➕ Add New Product"}</Text>
                  {[
                    {label:"Product Name",key:"name",placeholder:"e.g. Oversized Hoodie"},
                    {label:"Description",key:"description",placeholder:"Product description..."},
                    {label:"Price ($)",key:"price",placeholder:"29.99",keyboard:"numeric"},
                    {label:"Old Price ($)",key:"old_price",placeholder:"49.99 (optional)",keyboard:"numeric"},
                    {label:"Category",key:"category",placeholder:"T-Shirts"},
                    {label:"Image URL",key:"image_url",placeholder:"https://images.unsplash.com/..."},
                    {label:"Colors (comma-separated)",key:"colors",placeholder:"Black,White,Gray"},
                    {label:"Sizes (comma-separated)",key:"sizes",placeholder:"S,M,L,XL"},
                    {label:"Stock",key:"stock",placeholder:"50",keyboard:"numeric"},
                  ].map(({label,key,placeholder,keyboard}) => (
                    <View key={key} style={s.inputWrap}>
                      <Text style={s.inputLabel}>{label}</Text>
                      <TextInput
                        style={[s.input, key==="description"&&{minHeight:72,textAlignVertical:"top"}]}
                        placeholder={placeholder} placeholderTextColor="#9CA3AF"
                        value={(adminForm as any)[key]} multiline={key==="description"}
                        onChangeText={v=>setAdminForm(f=>({...f,[key]:v}))}
                        keyboardType={(keyboard as any)||"default"}
                      />
                    </View>
                  ))}
                  <TouchableOpacity style={s.primaryBtn} onPress={saveAdminProduct}>
                    <Text style={s.primaryBtnTxt}>{editingProduct?"Save Changes":"Add Product"}</Text>
                  </TouchableOpacity>
                  {editingProduct && (
                    <TouchableOpacity style={s.secondaryBtn} onPress={()=>{setEditingProduct(null);setAdminForm({name:"",description:"",price:"",old_price:"",category:"T-Shirts",colors:"Black,White",sizes:"S,M,L,XL",stock:"10",image_url:""})}}>
                      <Text style={s.secondaryBtnTxt}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {products.map(p => (
                  <View key={p.id} style={s.adminProductRow}>
                    <Image source={{uri:p.image_url}} style={s.adminProductImg}/>
                    <View style={{flex:1,marginLeft:12}}>
                      <Text style={{fontWeight:"800",color:"#111",fontSize:14}} numberOfLines={1}>{p.name}</Text>
                      <Text style={{color:"#6B7280",fontSize:12}}>{p.category} · ${p.price.toFixed(2)} · Stock: {p.stock}</Text>
                      <View style={{flexDirection:"row",gap:6,marginTop:4}}>
                        {p.colors.slice(0,3).map(c=><View key={c} style={[{width:14,height:14,borderRadius:7,backgroundColor:COLOR_MAP[c]||"#888",borderWidth:1,borderColor:"#E5E7EB"}]}/>)}
                      </View>
                    </View>
                    <View style={{gap:8}}>
                      <TouchableOpacity style={s.adminEditBtn} onPress={()=>startEditProduct(p)}>
                        <Text style={{color:"#FFF",fontWeight:"700",fontSize:12}}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.adminDeleteBtn} onPress={()=>Alert.alert("Delete?","Remove this product?",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:()=>setProducts(pr=>pr.filter(x=>x.id!==p.id))}])}>
                        <Text style={{color:"#FFF",fontWeight:"700",fontSize:12}}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* ORDERS */}
            {adminTab==="orders" && (
              <>
                <TextInput style={s.input} placeholder="Search orders..." placeholderTextColor="#9CA3AF" value={orderSearch} onChangeText={setOrderSearch}/>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,paddingVertical:12}}>
                  {["All","Pending","Confirmed","Shipped","Delivered","Cancelled"].map(st=>(
                    <TouchableOpacity key={st} style={[s.filterChip,orderStatusFilter===st&&s.filterChipActive]} onPress={()=>setOrderStatusFilter(st)}>
                      <Text style={[s.filterChipTxt,orderStatusFilter===st&&s.filterChipTxtActive]}>{st}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {filteredAdminOrders.length===0 ? (
                  <Text style={{color:"#9CA3AF",textAlign:"center",padding:24}}>No orders found.</Text>
                ) : filteredAdminOrders.map(order=>{
                  const cfg = STATUS_CONFIG[order.status];
                  return (
                    <View key={order.id} style={s.adminOrderCard}>
                      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <Text style={{fontWeight:"900",color:"#111"}}>#{order.id}</Text>
                        <View style={[s.statusPill,{backgroundColor:cfg.bg}]}><Text style={[s.statusPillTxt,{color:cfg.color}]}>{cfg.icon} {order.status}</Text></View>
                      </View>
                      <Text style={{color:"#374151",marginTop:6}}>👤 {order.full_name} · {order.email}</Text>
                      <Text style={{color:"#6B7280",fontSize:13}}>📍 {order.city} · 💰 ${order.total.toFixed(2)}</Text>
                      <Text style={{color:"#6B7280",fontSize:12,marginTop:2}}>📅 {new Date(order.created_at).toLocaleDateString()}</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:10,marginBottom:12}}>
                        {order.items.map(item=>(
                          <View key={item.id} style={{marginRight:8,alignItems:"center"}}>
                            <Image source={{uri:item.product.image_url}} style={{width:52,height:64,borderRadius:8}}/>
                            <Text style={{fontSize:10,color:"#6B7280",marginTop:2}}>×{item.qty}</Text>
                          </View>
                        ))}
                      </ScrollView>
                      <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
                        {(["Pending","Confirmed","Shipped","Delivered","Cancelled"] as Order["status"][]).map(st=>(
                          <TouchableOpacity key={st} style={[s.statusActionBtn,order.status===st&&s.statusActionBtnActive]} onPress={()=>updateOrderStatus(order.id,st)}>
                            <Text style={[s.statusActionTxt,order.status===st&&{color:"#FFF"}]}>{st}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </>
            )}

            {/* USERS */}
            {adminTab==="users" && (
              <>
                <TextInput style={s.input} placeholder="Search users..." placeholderTextColor="#9CA3AF" value={userSearch} onChangeText={setUserSearch}/>
                {filteredAdminUsers.map(user=>(
                  <View key={user.id} style={s.adminUserCard}>
                    <View style={[s.adminUserAvatar,{backgroundColor:user.avatar_color}]}>
                      <Text style={{color:"#FFF",fontWeight:"900",fontSize:18}}>{user.full_name[0]}</Text>
                    </View>
                    <View style={{flex:1,marginLeft:12}}>
                      <Text style={{fontWeight:"800",color:"#111",fontSize:15}}>{user.full_name}</Text>
                      <Text style={{color:"#6B7280",fontSize:13}}>{user.email}</Text>
                      <Text style={{color:"#9CA3AF",fontSize:12,marginTop:2}}>
                        {user.is_admin?"🔑 Admin":"👤 User"} · {allOrders.filter(o=>o.userId===user.id).length} orders
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[s.adminRoleBtn,{backgroundColor:user.is_admin?"#FEE2E2":"#D1FAE5"}]}
                      onPress={()=>setUsers(pu=>pu.map(u=>u.id===user.id?{...u,is_admin:!u.is_admin}:u))}>
                      <Text style={{fontWeight:"700",fontSize:12,color:user.is_admin?"#DC2626":"#059669"}}>{user.is_admin?"Remove Admin":"Make Admin"}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
      <CartDrawer/>

      {/* NAVBAR */}
      <View style={[s.navbar, {paddingTop: insets.top+4}]}>
        <Text style={s.navLogo}>HypeNest</Text>
        <TouchableOpacity style={s.navSearchBtn} onPress={()=>navigate("search")}>
          <Text style={{color:"#6B7280",fontSize:16}}>🔍 Search...</Text>
        </TouchableOpacity>
        <View style={s.navIcons}>
          <TouchableOpacity style={s.navIconBtn} onPress={()=>navigate("wishlist")}>
            <Text style={{fontSize:22}}>{wishlist.length>0?"♥":"♡"}</Text>
            {wishlist.length>0 && <View style={s.navBadge}><Text style={s.navBadgeTxt}>{wishlist.length}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={s.navIconBtn} onPress={()=>setCartOpen(true)}>
            <Text style={{fontSize:22}}>🛒</Text>
            {cartCount>0 && <View style={s.navBadge}><Text style={s.navBadgeTxt}>{cartCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={s.navIconBtn} onPress={()=>navigate("profile")}>
            {currentUser
              ? <View style={[s.navAvatar,{backgroundColor:currentUser.avatar_color}]}><Text style={{color:"#FFF",fontWeight:"900",fontSize:13}}>{currentUser.full_name[0]}</Text></View>
              : <Text style={{fontSize:22}}>👤</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* CATEGORY BAR */}
      <View style={{backgroundColor:"#FFF",borderBottomWidth:1,borderBottomColor:"#F3F4F6"}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:12,paddingVertical:10,gap:8}}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={[s.catChip, selectedCategory===cat&&s.catChipActive]} onPress={()=>setSelectedCategory(cat)}>
              <Text style={[s.catChipTxt, selectedCategory===cat&&s.catChipTxtActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={selectedCategory==="All" ? [] : filteredProducts}
        keyExtractor={i=>i.id}
        numColumns={2}
        columnWrapperStyle={{gap:12,paddingHorizontal:12}}
        contentContainerStyle={{paddingBottom:40, paddingTop: selectedCategory==="All"?0:12, gap:12}}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={selectedCategory==="All" ? (
          <>
            {/* BANNER */}
            <ScrollView
              ref={bannerRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScroll={e=>setBannerIndex(Math.round(e.nativeEvent.contentOffset.x/SCREEN_WIDTH))}
              scrollEventThrottle={16}
            >
              {BANNER_DATA.map(b => (
                <View key={b.id} style={s.banner}>
                  <Image source={{uri:b.image}} style={StyleSheet.absoluteFillObject} resizeMode="cover"/>
                  <View style={s.bannerOverlay}/>
                  <View style={s.bannerContent}>
                    <View style={s.bannerBadge}><Text style={s.bannerBadgeTxt}>{b.label}</Text></View>
                    <Text style={s.bannerTitle}>{b.title}</Text>
                    <Text style={s.bannerSubtitle}>{b.subtitle}</Text>
                    <TouchableOpacity style={s.bannerBtn}>
                      <Text style={s.bannerBtnTxt}>Shop Now →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={s.bannerDots}>
              {BANNER_DATA.map((_,i)=><View key={i} style={[s.bannerDot, i===bannerIndex&&s.bannerDotActive]}/>)}
            </View>

            {/* FLASH SALE BANNER */}
            <View style={s.flashSaleBanner}>
              <Text style={{fontSize:18}}>⚡</Text>
              <View style={{flex:1,marginLeft:10}}>
                <Text style={s.flashSaleTitle}>Flash Sale — Up to 70% Off</Text>
                <Text style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>Use code HYPE15 for extra 15% off</Text>
              </View>
              <TouchableOpacity onPress={()=>setSelectedCategory("All")}><Text style={s.flashSaleShop}>Shop →</Text></TouchableOpacity>
            </View>

            {/* CATEGORIES GRID */}
            <View style={s.sectionHdr}>
              <Text style={s.sectionTitle}>Categories</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:12,gap:14,paddingBottom:4}}>
              {CATEGORIES.filter(c=>c!=="All").map((cat,idx) => {
                const catProduct = products.find(p=>p.category===cat);
                return (
                  <TouchableOpacity key={cat} style={s.catCard} onPress={()=>setSelectedCategory(cat)}>
                    {catProduct ? (
                      <Image source={{uri:catProduct.image_url}} style={s.catCardImg} resizeMode="cover"/>
                    ) : (
                      <View style={[s.catCardImg,{backgroundColor:"#F3F4F6",justifyContent:"center",alignItems:"center"}]}>
                        <Text style={{fontSize:32}}>{["👕","👖","🧥","🥿","🩳","👔","👗","👜"][idx]||"👕"}</Text>
                      </View>
                    )}
                    <View style={s.catCardOverlay}/>
                    <Text style={s.catCardTxt}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* HOT RIGHT NOW */}
            <View style={s.sectionHdr}>
              <Text style={s.sectionTitle}>🔥 Hot Right Now</Text>
              <TouchableOpacity><Text style={s.sectionLink}>See All →</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:12,gap:12,paddingBottom:4}}>
              {featuredProducts.map(p => {
                const discount = p.old_price ? Math.round(((p.old_price-p.price)/p.old_price)*100) : null;
                const isWished = wishlist.includes(p.id);
                return (
                  <TouchableOpacity key={p.id} style={s.hScrollCard}
                    onPress={()=>{setSelectedProduct(p);setSelectedSize(p.sizes[0]||"");setSelectedColor(p.colors[0]||"");setSelectedImageIndex(0);navigate("details");}}>
                    <View style={{position:"relative"}}>
                      <Image source={{uri:p.image_url}} style={s.hScrollImg} resizeMode="cover"/>
                      {discount && <View style={s.hScrollBadge}><Text style={{color:"#FFF",fontSize:10,fontWeight:"800"}}>-{discount}%</Text></View>}
                      <TouchableOpacity style={s.hScrollWish} onPress={()=>toggleWishlist(p.id)}>
                        <Text style={{color:isWished?"#FF385C":"#FFF",fontSize:16}}>{isWished?"♥":"♡"}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{padding:10}}>
                      <Text style={{fontSize:12,color:"#9CA3AF",fontWeight:"600"}}>{p.category}</Text>
                      <Text style={{fontSize:13,fontWeight:"800",color:"#111",marginTop:2}} numberOfLines={2}>{p.name}</Text>
                      <View style={{flexDirection:"row",alignItems:"center",marginTop:4,gap:6}}>
                        <Text style={{fontWeight:"900",color:"#FF385C",fontSize:15}}>${p.price.toFixed(2)}</Text>
                        {p.old_price && <Text style={{color:"#9CA3AF",fontSize:12,textDecorationLine:"line-through"}}>${p.old_price.toFixed(2)}</Text>}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* NEW ARRIVALS */}
            <View style={s.sectionHdr}>
              <Text style={s.sectionTitle}>✨ New Arrivals</Text>
              <TouchableOpacity><Text style={s.sectionLink}>See All →</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:12,gap:12,paddingBottom:4}}>
              {newProducts.map(p => {
                const isWished = wishlist.includes(p.id);
                return (
                  <TouchableOpacity key={p.id} style={s.hScrollCard}
                    onPress={()=>{setSelectedProduct(p);setSelectedSize(p.sizes[0]||"");setSelectedColor(p.colors[0]||"");setSelectedImageIndex(0);navigate("details");}}>
                    <View style={{position:"relative"}}>
                      <Image source={{uri:p.image_url}} style={s.hScrollImg} resizeMode="cover"/>
                      <View style={[s.hScrollBadge,{backgroundColor:"#10B981"}]}><Text style={{color:"#FFF",fontSize:10,fontWeight:"800"}}>NEW</Text></View>
                      <TouchableOpacity style={s.hScrollWish} onPress={()=>toggleWishlist(p.id)}>
                        <Text style={{color:isWished?"#FF385C":"#FFF",fontSize:16}}>{isWished?"♥":"♡"}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{padding:10}}>
                      <Text style={{fontSize:12,color:"#9CA3AF",fontWeight:"600"}}>{p.category}</Text>
                      <Text style={{fontSize:13,fontWeight:"800",color:"#111",marginTop:2}} numberOfLines={2}>{p.name}</Text>
                      <Text style={{fontWeight:"900",color:"#111",fontSize:15,marginTop:4}}>${p.price.toFixed(2)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ALL PRODUCTS HEADER */}
            <View style={s.sectionHdr}>
              <Text style={s.sectionTitle}>All Products ({products.length})</Text>
            </View>
          </>
        ) : null}
        renderItem={selectedCategory==="All" ? ({item}) => renderProductCard(item) : ({item}) => renderProductCard(item)}
        data={selectedCategory==="All" ? products : filteredProducts}
        ListEmptyComponent={
          <View style={s.emptyCenter}>
            <Text style={{fontSize:48}}>😕</Text>
            <Text style={s.emptyTitle}>No products found</Text>
            <Text style={s.emptySub}>Try a different category or search</Text>
          </View>
        }
      />

      {/* BOTTOM NAV */}
      <View style={[s.bottomNav, {paddingBottom: insets.bottom+6}]}>
        {[
          {icon:"🏠",label:"Home",action:()=>{setSelectedCategory("All");setScreen("home");}},
          {icon:"🔍",label:"Search",action:()=>navigate("search")},
          {icon:"♥",label:"Wishlist",action:()=>navigate("wishlist"),badge:wishlist.length},
          {icon:"🛒",label:"Cart",action:()=>setCartOpen(true),badge:cartCount},
          {icon:"👤",label:"Profile",action:()=>navigate("profile")},
        ].map(({icon,label,action,badge}) => (
          <TouchableOpacity key={label} style={s.bottomNavItem} onPress={action}>
            <View style={{position:"relative"}}>
              <Text style={{fontSize:22}}>{icon}</Text>
              {badge!=null && badge>0 && <View style={s.navBadge}><Text style={s.navBadgeTxt}>{badge}</Text></View>}
            </View>
            <Text style={s.bottomNavLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── COLOR MAP ────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string,string> = {
  Black:"#1A1A1A", White:"#F9FAFB", Gray:"#9CA3AF", "Washed Gray":"#D1D5DB",
  Navy:"#1E3A5F", Blue:"#3B82F6", "Mid Blue":"#60A5FA", "Dark Indigo":"#312E81",
  "Light Blue":"#BAE6FD", "Light Wash":"#BFDBFE", "Dark Blue":"#1E40AF",
  Red:"#EF4444", Pink:"#EC4899", Terracotta:"#C2410C", Burgundy:"#7F1D1D",
  Green:"#10B981", Sage:"#6EE7B7", "Forest Green":"#166534", Teal:"#0D9488",
  Olive:"#65A30D", Khaki:"#A16207", Sand:"#D97706", Beige:"#D4B896",
  Camel:"#C49A6C", Brown:"#92400E", Cream:"#FEF3C7", Ivory:"#FFFBEB",
  Champagne:"#F5DEB3", Stone:"#A8A29E", Slate:"#64748B", "Slate Blue":"#475569",
  "Dusty Blue":"#93C5FD", "Dusty Rose":"#FBCFE8", Gold:"#F59E0B", Silver:"#9CA3AF",
  Chocolate:"#7C2D12", Charcoal:"#374151", Taupe:"#B5A49A",
  Tortoise:"#8B4513", Clear:"#E5E7EB", "Pink Floral":"#FBCFE8",
  "Blue Floral":"#BFDBFE", "Black Floral":"#1A1A1A", Caramel:"#D97706",
  Nude:"#E8C4A0", "Gray/Orange":"#9CA3AF", "White/Blue":"#BAE6FD",
  "Black/Red":"#1A1A1A", "Gray/Yellow":"#D1D5DB", "Medium Wash":"#93C5FD",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex:1, backgroundColor:"#FAFAFA" },

  // Navbar
  navbar: { backgroundColor:"#FFF", paddingHorizontal:14, paddingBottom:10, borderBottomWidth:1, borderBottomColor:"#F3F4F6" },
  navLogo: { fontSize:26, fontWeight:"900", color:"#FF385C", letterSpacing:-0.5, marginBottom:8 },
  navSearchBtn: { backgroundColor:"#F3F4F6", borderRadius:12, paddingHorizontal:14, paddingVertical:9, marginBottom:10 },
  navIcons: { position:"absolute", right:14, top:0, flexDirection:"row", alignItems:"center", gap:6, paddingTop:4 },
  navIconBtn: { width:38, height:38, alignItems:"center", justifyContent:"center", position:"relative" },
  navBadge: { position:"absolute", top:-4, right:-4, backgroundColor:"#FF385C", borderRadius:9, minWidth:18, height:18, alignItems:"center", justifyContent:"center", paddingHorizontal:3 },
  navBadgeTxt: { color:"#FFF", fontSize:10, fontWeight:"900" },
  navAvatar: { width:32, height:32, borderRadius:16, alignItems:"center", justifyContent:"center" },

  // Category bar
  catChip: { backgroundColor:"#F3F4F6", paddingHorizontal:14, paddingVertical:8, borderRadius:20 },
  catChipActive: { backgroundColor:"#FF385C" },
  catChipTxt: { fontSize:13, fontWeight:"700", color:"#374151" },
  catChipTxtActive: { color:"#FFF" },

  // Banner
  banner: { width:SCREEN_WIDTH, height:260, position:"relative" },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor:"rgba(0,0,0,0.45)" },
  bannerContent: { position:"absolute", bottom:28, left:22 },
  bannerBadge: { backgroundColor:"#FF385C", paddingHorizontal:10, paddingVertical:4, borderRadius:20, alignSelf:"flex-start", marginBottom:8 },
  bannerBadgeTxt: { color:"#FFF", fontSize:11, fontWeight:"800" },
  bannerTitle: { color:"#FFF", fontSize:30, fontWeight:"900", letterSpacing:-0.5 },
  bannerSubtitle: { color:"rgba(255,255,255,0.85)", fontSize:14, marginTop:4 },
  bannerBtn: { marginTop:14, backgroundColor:"#FFF", paddingHorizontal:20, paddingVertical:10, borderRadius:24, alignSelf:"flex-start" },
  bannerBtnTxt: { color:"#111", fontWeight:"800", fontSize:13 },
  bannerDots: { flexDirection:"row", justifyContent:"center", gap:6, paddingVertical:10 },
  bannerDot: { width:6, height:6, borderRadius:3, backgroundColor:"#D1D5DB" },
  bannerDotActive: { width:18, backgroundColor:"#FF385C" },

  // Flash sale banner
  flashSaleBanner: { marginHorizontal:12, marginBottom:4, backgroundColor:"#FF385C", borderRadius:16, padding:16, flexDirection:"row", alignItems:"center" },
  flashSaleTitle: { color:"#FFF", fontWeight:"900", fontSize:15 },
  flashSaleShop: { color:"#FFF", fontWeight:"800", fontSize:14, opacity:0.9 },

  // Section
  sectionHdr: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:14, paddingVertical:16 },
  sectionTitle: { fontSize:18, fontWeight:"900", color:"#111" },
  sectionLink: { color:"#FF385C", fontWeight:"700", fontSize:14 },
  sectionLabel: { fontSize:16, fontWeight:"900", color:"#111", marginTop:20, marginBottom:8 },

  // Category cards
  catCard: { width:100, height:130, borderRadius:16, overflow:"hidden", position:"relative" },
  catCardImg: { width:"100%", height:"100%" },
  catCardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor:"rgba(0,0,0,0.35)" },
  catCardTxt: { position:"absolute", bottom:10, left:0, right:0, textAlign:"center", color:"#FFF", fontWeight:"800", fontSize:13 },

  // Horizontal scroll cards
  hScrollCard: { width:160, backgroundColor:"#FFF", borderRadius:16, overflow:"hidden", shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:8, elevation:3 },
  hScrollImg: { width:160, height:180 },
  hScrollBadge: { position:"absolute", top:8, left:8, backgroundColor:"#FF385C", paddingHorizontal:7, paddingVertical:3, borderRadius:8 },
  hScrollWish: { position:"absolute", top:8, right:8, backgroundColor:"rgba(0,0,0,0.35)", width:30, height:30, borderRadius:15, alignItems:"center", justifyContent:"center" },

  // Product card
  productCard: { width:CARD_WIDTH, backgroundColor:"#FFF", borderRadius:16, overflow:"hidden", marginBottom:0, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8, elevation:2 },
  productImgWrap: { position:"relative" },
  productImg: { width:"100%", height:210 },
  discountBadge: { position:"absolute", top:8, left:8, backgroundColor:"#FF385C", paddingHorizontal:7, paddingVertical:3, borderRadius:8 },
  discountBadgeText: { color:"#FFF", fontSize:11, fontWeight:"800" },
  wishBtn: { position:"absolute", top:8, right:8, backgroundColor:"rgba(0,0,0,0.35)", width:32, height:32, borderRadius:16, alignItems:"center", justifyContent:"center" },
  productInfo: { padding:12 },
  productCategory: { fontSize:10, color:"#9CA3AF", fontWeight:"700", letterSpacing:0.5, textTransform:"uppercase" },
  productName: { fontSize:13, fontWeight:"800", color:"#111", marginTop:3, minHeight:34 },
  reviewCount: { fontSize:11, color:"#9CA3AF" },
  priceRow: { flexDirection:"row", alignItems:"center", gap:6, marginTop:6 },
  productPrice: { fontWeight:"900", color:"#FF385C", fontSize:15 },
  productOldPrice: { color:"#9CA3AF", fontSize:12, textDecorationLine:"line-through" },
  colorDot: { width:14, height:14, borderRadius:7, borderWidth:1, borderColor:"rgba(0,0,0,0.1)" },

  // Details
  detailsTopBar: { position:"absolute", left:16, right:16, flexDirection:"row", justifyContent:"space-between", alignItems:"center", zIndex:10 },
  detailsCircleBtn: { width:42, height:42, borderRadius:21, backgroundColor:"rgba(255,255,255,0.92)", alignItems:"center", justifyContent:"center", shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 },
  detailsBadge: { position:"absolute", bottom:16, left:16, paddingHorizontal:12, paddingVertical:5, borderRadius:20 },
  detailsBadgeTxt: { color:"#FFF", fontWeight:"900", fontSize:13 },
  imageDots: { position:"absolute", bottom:12, left:0, right:0, flexDirection:"row", justifyContent:"center", gap:5 },
  imageDot: { width:6, height:6, borderRadius:3, backgroundColor:"rgba(255,255,255,0.5)" },
  imageDotActive: { width:20, backgroundColor:"#FFF" },
  detailsPad: { padding:20, paddingBottom:100 },
  detailsCategory: { fontSize:11, color:"#9CA3AF", fontWeight:"700", textTransform:"uppercase", letterSpacing:1 },
  detailsTitle: { fontSize:24, fontWeight:"900", color:"#111", marginTop:4, letterSpacing:-0.5 },
  ratingRow: { flexDirection:"row", alignItems:"center", gap:8, marginTop:8, flexWrap:"wrap" },
  ratingText: { color:"#6B7280", fontSize:13 },
  stockBadge: { paddingHorizontal:10, paddingVertical:3, borderRadius:20 },
  stockBadgeTxt: { fontSize:12, fontWeight:"700" },
  priceRowLarge: { flexDirection:"row", alignItems:"center", gap:12, marginTop:14 },
  detailsPrice: { fontSize:28, fontWeight:"900", color:"#FF385C" },
  detailsOldPrice: { fontSize:18, color:"#D1D5DB", textDecorationLine:"line-through" },
  saveBadge: { backgroundColor:"#FEE2E2", paddingHorizontal:10, paddingVertical:3, borderRadius:20 },
  saveBadgeTxt: { color:"#EF4444", fontSize:12, fontWeight:"700" },
  optionLabel: { fontSize:14, color:"#6B7280", fontWeight:"600", marginTop:20, marginBottom:10 },
  colorRow: { flexDirection:"row", flexWrap:"wrap", gap:10 },
  colorOption: { flexDirection:"row", alignItems:"center", paddingHorizontal:12, paddingVertical:7, borderRadius:20, borderWidth:1.5, borderColor:"#E5E7EB", gap:8 },
  colorOptionActive: { borderColor:"#FF385C", backgroundColor:"#FFF1F0" },
  colorSwatch: { width:18, height:18, borderRadius:9, borderWidth:1, borderColor:"rgba(0,0,0,0.1)" },
  colorOptionTxt: { fontSize:13, fontWeight:"600", color:"#374151" },
  sizeRow: { flexDirection:"row", flexWrap:"wrap", gap:10 },
  sizeChip: { paddingHorizontal:16, paddingVertical:10, borderRadius:12, borderWidth:1.5, borderColor:"#E5E7EB", minWidth:50, alignItems:"center" },
  sizeChipActive: { borderColor:"#FF385C", backgroundColor:"#FF385C" },
  sizeChipTxt: { fontWeight:"700", color:"#374151", fontSize:14 },
  sizeChipTxtActive: { color:"#FFF" },
  description: { color:"#6B7280", lineHeight:22, fontSize:14, marginTop:4 },
  tag: { backgroundColor:"#F3F4F6", paddingHorizontal:12, paddingVertical:4, borderRadius:20 },
  tagTxt: { color:"#6B7280", fontSize:12, fontWeight:"600" },
  perksRow: { flexDirection:"row", marginTop:24, backgroundColor:"#F9FAFB", borderRadius:16, padding:16, justifyContent:"space-around" },
  perkItem: { alignItems:"center", flex:1 },
  perkTxt: { fontSize:11, color:"#6B7280", textAlign:"center", marginTop:6, lineHeight:16 },
  stickyAddToCart: { position:"absolute", bottom:0, left:0, right:0, backgroundColor:"#FFF", padding:16, flexDirection:"row", gap:12, borderTopWidth:1, borderTopColor:"#F3F4F6", shadowColor:"#000", shadowOffset:{width:0,height:-4}, shadowOpacity:0.08, shadowRadius:12, elevation:8 },
  wishlistStickyBtn: { width:52, height:52, borderRadius:16, borderWidth:1.5, borderColor:"#E5E7EB", alignItems:"center", justifyContent:"center" },
  addToCartBtn: { flex:1, backgroundColor:"#FF385C", borderRadius:16, height:52, alignItems:"center", justifyContent:"center" },
  addToCartBtnTxt: { color:"#FFF", fontWeight:"900", fontSize:16 },

  // Cart drawer
  drawerOverlay: { flex:1, backgroundColor:"rgba(0,0,0,0.5)" },
  drawer: { backgroundColor:"#FFF", borderTopLeftRadius:24, borderTopRightRadius:24, maxHeight:SCREEN_HEIGHT*0.88, shadowColor:"#000", shadowOffset:{width:0,height:-4}, shadowOpacity:0.15, shadowRadius:20, elevation:20 },
  drawerHandle: { width:40, height:4, backgroundColor:"#E5E7EB", borderRadius:2, alignSelf:"center", marginTop:12, marginBottom:4 },
  drawerHeader: { flexDirection:"row", alignItems:"center", paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:"#F3F4F6" },
  drawerTitle: { fontSize:20, fontWeight:"900", color:"#111", flex:1 },
  drawerCount: { color:"#6B7280", fontSize:14, marginRight:12 },
  drawerCloseBtn: { width:32, height:32, borderRadius:16, backgroundColor:"#F3F4F6", alignItems:"center", justifyContent:"center" },
  cartItem: { flexDirection:"row", padding:16, gap:14, borderBottomWidth:1, borderBottomColor:"#F9FAFB" },
  cartItemImg: { width:86, height:106, borderRadius:12, backgroundColor:"#F3F4F6" },
  cartItemName: { fontSize:14, fontWeight:"800", color:"#111" },
  cartItemMeta: { color:"#9CA3AF", fontSize:13, marginTop:3 },
  cartItemPrice: { color:"#FF385C", fontWeight:"900", fontSize:16, marginTop:4 },
  qtyRow: { flexDirection:"row", alignItems:"center", marginTop:10, gap:4 },
  qtyBtn: { width:30, height:30, borderRadius:15, backgroundColor:"#F3F4F6", alignItems:"center", justifyContent:"center" },
  qtyBtnTxt: { fontSize:16, fontWeight:"800", color:"#111" },
  qtyVal: { width:32, textAlign:"center", fontWeight:"800", color:"#111", fontSize:16 },
  removeBtn: { marginLeft:"auto" as any },
  removeBtnTxt: { color:"#EF4444", fontWeight:"700", fontSize:13 },
  discountRow: { flexDirection:"row", margin:16, gap:10 },
  discountInput: { flex:1, backgroundColor:"#F9FAFB", borderRadius:12, paddingHorizontal:14, paddingVertical:10, fontSize:14, color:"#111", borderWidth:1, borderColor:"#E5E7EB" },
  discountApplyBtn: { backgroundColor:"#111", borderRadius:12, paddingHorizontal:16, justifyContent:"center" },
  discountApplyTxt: { color:"#FFF", fontWeight:"800", fontSize:14 },
  cartSummary: { paddingHorizontal:20, paddingTop:8 },
  cartSummaryRow: { flexDirection:"row", justifyContent:"space-between", paddingVertical:5 },
  cartSummaryLabel: { color:"#6B7280", fontSize:14 },
  cartSummaryValue: { color:"#111", fontWeight:"700", fontSize:14 },

  // Checkout
  authPromptCard: { flexDirection:"row", alignItems:"center", gap:12, backgroundColor:"#FFF7ED", borderRadius:16, padding:16, borderWidth:1, borderColor:"#FED7AA", marginBottom:16 },
  authPromptBtn: { backgroundColor:"#F97316", paddingHorizontal:16, paddingVertical:9, borderRadius:12 },
  authPromptBtnTxt: { color:"#FFF", fontWeight:"800", fontSize:13 },
  paymentCard: { backgroundColor:"#F0FDF4", borderRadius:16, padding:16, flexDirection:"row", alignItems:"center", gap:14, borderWidth:1, borderColor:"#BBF7D0", position:"relative" },
  paymentSelected: { position:"absolute", top:12, right:12, backgroundColor:"#10B981", width:22, height:22, borderRadius:11, alignItems:"center", justifyContent:"center" },
  summaryCard: { backgroundColor:"#FFF", borderRadius:16, padding:16, borderWidth:1, borderColor:"#F3F4F6" },
  summaryItem: { flexDirection:"row", alignItems:"center", gap:12, paddingVertical:8 },
  summaryImg: { width:52, height:64, borderRadius:10, backgroundColor:"#F3F4F6" },

  // Orders
  orderCard: { backgroundColor:"#FFF", borderRadius:18, padding:18, marginBottom:14, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:2 },
  orderCardTop: { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start" },
  orderId: { fontWeight:"900", color:"#111", fontSize:15 },
  orderDate: { color:"#9CA3AF", fontSize:12, marginTop:3 },
  statusPill: { paddingHorizontal:12, paddingVertical:5, borderRadius:20 },
  statusPillTxt: { fontSize:12, fontWeight:"700" },
  trackBtn: { backgroundColor:"#F3F4F6", paddingHorizontal:14, paddingVertical:8, borderRadius:12 },
  trackBtnTxt: { fontWeight:"700", color:"#374151", fontSize:13 },

  // Profile
  profileHero: { backgroundColor:"#FFF", padding:24, alignItems:"center", marginBottom:12 },
  profileAvatar: { width:88, height:88, borderRadius:44, alignItems:"center", justifyContent:"center", marginBottom:14 },
  profileAvatarTxt: { fontSize:36, fontWeight:"900", color:"#FFF" },
  profileName: { fontSize:22, fontWeight:"900", color:"#111" },
  profileEmail: { color:"#9CA3AF", fontSize:14, marginTop:4 },
  profileStats: { flexDirection:"row", alignItems:"center", marginTop:20, backgroundColor:"#F9FAFB", borderRadius:18, padding:16 },
  profileStat: { flex:1, alignItems:"center" },
  profileStatNum: { fontSize:22, fontWeight:"900", color:"#FF385C" },
  profileStatLabel: { fontSize:12, color:"#6B7280", marginTop:3 },
  profileStatDivider: { width:1, height:32, backgroundColor:"#E5E7EB" },
  profileMenuItem: { flexDirection:"row", alignItems:"center", backgroundColor:"#FFF", borderRadius:14, padding:16, marginBottom:8 },
  profileMenuLabel: { fontSize:15, fontWeight:"700", color:"#111", flex:1 },
  profileMenuBadge: { backgroundColor:"#FF385C", paddingHorizontal:9, paddingVertical:2, borderRadius:10 },
  profileMenuBadgeTxt: { color:"#FFF", fontSize:12, fontWeight:"700" },
  logoutBtn: { backgroundColor:"#FFF", borderRadius:14, padding:16, alignItems:"center", borderWidth:1.5, borderColor:"#FEE2E2", marginTop:8 },
  logoutBtnTxt: { color:"#EF4444", fontWeight:"800", fontSize:15 },

  // Admin
  adminHdr: { backgroundColor:"#1A1A2E", paddingHorizontal:20, paddingBottom:20, flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start" },
  adminTitle: { fontSize:26, fontWeight:"900", color:"#FFF" },
  adminLogoutBtn: { backgroundColor:"rgba(255,255,255,0.15)", paddingHorizontal:16, paddingVertical:9, borderRadius:12, marginTop:4 },
  adminTabChip: { backgroundColor:"#F3F4F6", paddingHorizontal:16, paddingVertical:10, borderRadius:20, borderWidth:1, borderColor:"#E5E7EB" },
  adminTabChipActive: { backgroundColor:"#1A1A2E", borderColor:"#1A1A2E" },
  adminTabTxt: { fontWeight:"700", color:"#374151", fontSize:14 },
  adminTabTxtActive: { color:"#FFF" },
  statsGrid: { flexDirection:"row", flexWrap:"wrap", gap:12, marginBottom:8 },
  statCard: { width:(SCREEN_WIDTH-56)/3, backgroundColor:"#FFF", borderRadius:16, padding:14, alignItems:"center", borderTopWidth:3, shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:4, elevation:2 },
  statVal: { fontSize:22, fontWeight:"900", marginTop:6 },
  statLabel: { fontSize:12, color:"#9CA3AF", marginTop:4 },
  adminFormCard: { backgroundColor:"#FFF", borderRadius:18, padding:18, marginBottom:16, shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:6, elevation:2 },
  adminFormTitle: { fontSize:18, fontWeight:"900", color:"#111", marginBottom:4 },
  adminProductRow: { flexDirection:"row", alignItems:"center", backgroundColor:"#FFF", borderRadius:14, padding:14, marginBottom:10, shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.04, shadowRadius:4, elevation:1 },
  adminProductImg: { width:64, height:80, borderRadius:12, backgroundColor:"#F3F4F6" },
  adminEditBtn: { backgroundColor:"#3B82F6", borderRadius:10, paddingHorizontal:12, paddingVertical:7, marginBottom:6 },
  adminDeleteBtn: { backgroundColor:"#EF4444", borderRadius:10, paddingHorizontal:12, paddingVertical:7 },
  adminOrderCard: { backgroundColor:"#FFF", borderRadius:16, padding:16, marginBottom:12, shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.04, shadowRadius:4, elevation:1 },
  statusActionBtn: { paddingHorizontal:12, paddingVertical:7, borderRadius:10, borderWidth:1, borderColor:"#E5E7EB", backgroundColor:"#F9FAFB" },
  statusActionBtnActive: { backgroundColor:"#1A1A2E", borderColor:"#1A1A2E" },
  statusActionTxt: { fontSize:12, fontWeight:"700", color:"#374151" },
  filterChip: { backgroundColor:"#F3F4F6", paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:"#E5E7EB" },
  filterChipActive: { backgroundColor:"#FF385C", borderColor:"#FF385C" },
  filterChipTxt: { fontSize:13, fontWeight:"700", color:"#374151" },
  filterChipTxtActive: { color:"#FFF" },
  adminUserCard: { flexDirection:"row", alignItems:"center", backgroundColor:"#FFF", borderRadius:14, padding:14, marginBottom:10 },
  adminUserAvatar: { width:48, height:48, borderRadius:24, alignItems:"center", justifyContent:"center" },
  adminRoleBtn: { paddingHorizontal:12, paddingVertical:7, borderRadius:12 },

  // Search
  searchHeader: { flexDirection:"row", alignItems:"center", backgroundColor:"#FFF", paddingHorizontal:12, paddingBottom:12, borderBottomWidth:1, borderBottomColor:"#F3F4F6", gap:8 },
  searchInputFull: { flex:1, backgroundColor:"#F3F4F6", borderRadius:14, paddingHorizontal:14, paddingVertical:11, fontSize:15, color:"#111" },
  searchEmptyState: { flex:1, alignItems:"center", justifyContent:"center", padding:32 },
  searchEmptyIcon: { fontSize:56 },
  searchEmptyTitle: { fontSize:22, fontWeight:"900", color:"#111", marginTop:12 },
  searchEmptySubtitle: { color:"#6B7280", fontSize:14, marginTop:4 },
  popularChip: { backgroundColor:"#F3F4F6", paddingHorizontal:14, paddingVertical:8, borderRadius:20 },
  popularChipTxt: { fontWeight:"700", color:"#374151", fontSize:13 },

  // Auth
  authWrap: { flexGrow:1, padding:24, paddingTop:48 },
  authBackBtn: { marginBottom:24 },
  authBackTxt: { color:"#374151", fontWeight:"700", fontSize:16 },
  authLogo: { flexDirection:"row", alignItems:"center", gap:10, marginBottom:6 },
  authLogoText: { fontSize:36, fontWeight:"900", color:"#FF385C", letterSpacing:-1 },
  authLogoBadge: { backgroundColor:"#111", paddingHorizontal:8, paddingVertical:3, borderRadius:8 },
  authTagline: { fontSize:17, color:"#374151", fontWeight:"600", marginBottom:28 },
  authToggle: { flexDirection:"row", backgroundColor:"#F3F4F6", borderRadius:16, padding:4, marginBottom:24 },
  authToggleBtn: { flex:1, paddingVertical:12, borderRadius:12, alignItems:"center" },
  authToggleBtnActive: { backgroundColor:"#FFF", shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:4, elevation:2 },
  authToggleTxt: { fontWeight:"700", color:"#9CA3AF", fontSize:15 },
  authToggleTxtActive: { color:"#111" },
  demoBadge: { marginTop:28, backgroundColor:"#FFF8F0", borderRadius:14, padding:14, borderWidth:1, borderColor:"#FDDCB5" },
  demoBadgeTitle: { fontWeight:"900", color:"#EA580C", fontSize:14, marginBottom:4 },
  demoBadgeTxt: { color:"#78350F", fontSize:13 },

  // Common
  pageHeader: { backgroundColor:"#FFF", paddingHorizontal:16, paddingBottom:14, flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottomWidth:1, borderBottomColor:"#F3F4F6" },
  pageTitle: { fontSize:19, fontWeight:"900", color:"#111" },
  backTxt: { fontSize:22, color:"#111", fontWeight:"700", padding:4 },
  primaryBtn: { backgroundColor:"#FF385C", borderRadius:16, paddingVertical:16, alignItems:"center", justifyContent:"center", marginTop:14 },
  primaryBtnTxt: { color:"#FFF", fontWeight:"900", fontSize:16 },
  secondaryBtn: { backgroundColor:"#F3F4F6", borderRadius:16, paddingVertical:14, alignItems:"center", justifyContent:"center", marginTop:10 },
  secondaryBtnTxt: { color:"#374151", fontWeight:"700", fontSize:15 },
  inputWrap: { marginTop:12 },
  inputLabel: { fontSize:13, fontWeight:"700", color:"#374151", marginBottom:6 },
  input: { backgroundColor:"#F9FAFB", borderWidth:1, borderColor:"#E5E7EB", borderRadius:14, paddingHorizontal:14, paddingVertical:13, fontSize:15, color:"#111" },
  emptyCenter: { flex:1, alignItems:"center", justifyContent:"center", padding:40 },
  emptyTitle: { fontSize:22, fontWeight:"900", color:"#111", marginTop:14 },
  emptySub: { color:"#9CA3AF", fontSize:14, marginTop:6, textAlign:"center" },

  // Bottom nav
  bottomNav: { backgroundColor:"#FFF", flexDirection:"row", borderTopWidth:1, borderTopColor:"#F3F4F6", paddingTop:8 },
  bottomNavItem: { flex:1, alignItems:"center", justifyContent:"center", paddingVertical:4 },
  bottomNavLabel: { fontSize:10, color:"#9CA3AF", marginTop:3, fontWeight:"600" },

  // Checkout
  cartBadge: { position:"absolute", top:-4, right:-4, backgroundColor:"#FF385C", borderRadius:9, minWidth:18, height:18, alignItems:"center", justifyContent:"center", paddingHorizontal:3 },
  cartBadgeTxt: { color:"#FFF", fontSize:10, fontWeight:"900" },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp/>
    </SafeAreaProvider>
  );
}
