import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  Vendor,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  UserAddress,
  PromoCode,
  ChatMessage,
  VendorCategory,
  PaymentMethod,
  SelectedOption,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ADDRESSES,
  PROMO_CODES,
  VENDORS,
  MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockData';
import { CustomerApi } from '../services/api';

export type FilterSortOption = 'ALL' | 'RATING_HIGH' | 'FAST_DELIVERY' | 'FREE_DELIVERY' | 'BUDGET';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // User & Address
  user: typeof INITIAL_USER;
  addresses: UserAddress[];
  currentAddress: UserAddress;
  setCurrentAddress: (address: UserAddress) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (address: UserAddress) => void;

  // Vendors & Filtering
  vendors: Vendor[];
  menuItems: MenuItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: VendorCategory;
  setSelectedCategory: (category: VendorCategory) => void;
  activeFilter: FilterSortOption;
  setActiveFilter: (filter: FilterSortOption) => void;
  filteredVendors: Vendor[];
  getVendorById: (id: string) => Vendor | undefined;
  getMenuItemsByVendor: (vendorId: string) => MenuItem[];

  // Favorites
  favoriteVendorIds: string[];
  toggleFavorite: (vendorId: string) => void;
  isFavorite: (vendorId: string) => boolean;

  // Cart
  cart: CartItem[];
  cartVendorId: string | null;
  cartVendorName: string | null;
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  addToCart: (
    item: MenuItem,
    selectedOptions: SelectedOption[],
    quantity: number,
    specialInstructions?: string
  ) => { success: boolean; requiresVendorClear?: boolean };
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Checkout Configuration
  restaurantNotes: string;
  setRestaurantNotes: (notes: string) => void;
  riderNotes: string;
  setRiderNotes: (notes: string) => void;
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;

  // Promo Code
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  discountAmount: number;

  // Orders & Active Tracking
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: () => Order | null;
  cancelOrder: (orderId: string) => void;
  advanceOrderStatus: (orderId: string) => void;
  submitReview: (
    orderId: string,
    foodRating: number,
    riderRating: number,
    reviewComment: string,
    tipAmount?: number
  ) => void;
  reorder: (order: Order) => boolean;

  // In-App Chat
  chatMessages: ChatMessage[];
  sendMessage: (orderId: string, text: string, recipient: 'RIDER' | 'VENDOR') => void;

  // Toast
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User & Address state
  const [user, setUser] = useState(INITIAL_USER);
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<UserAddress>(INITIAL_ADDRESSES[0]);

  // Vendors state
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>('All');
  const [activeFilter, setActiveFilter] = useState<FilterSortOption>('ALL');

  // Favorites
  const [favoriteVendorIds, setFavoriteVendorIds] = useState<string[]>(['ven_01', 'ven_02']);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartVendorId, setCartVendorId] = useState<string | null>(null);
  const [cartVendorName, setCartVendorName] = useState<string | null>(null);

  // Checkout inputs
  const [restaurantNotes, setRestaurantNotes] = useState<string>('');
  const [riderNotes, setRiderNotes] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Toast
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Auto-fetch data from MongoDB on startup
  useEffect(() => {
    async function initData() {
      try {
        // Auto-login seeded customer
        const authRes = await CustomerApi.login('+923001234567').catch(() => null);
        if (authRes?.user) {
          setUser((prev) => ({ ...prev, name: authRes.user.name, phone: authRes.user.phone }));
        }

        // Fetch real vendors
        const vendorRes = await CustomerApi.getVendors().catch(() => null);
        if (vendorRes?.vendors && vendorRes.vendors.length > 0) {
          const transformedVendors: Vendor[] = vendorRes.vendors.map((v) => ({
            id: v._id || v.id,
            name: v.name,
            tagline: v.tagline || '',
            category: v.category as any,
            cuisineTypes: v.cuisineTypes || [],
            imageUrl: v.imageUrl,
            coverImageUrl: v.coverImageUrl,
            rating: v.rating || 4.8,
            reviewCount: v.reviewCount || 100,
            deliveryTimeEstimate: v.deliveryTimeEstimate || '20-30 min',
            deliveryFee: v.deliveryFee ?? 40,
            minOrderAmount: v.minOrderAmount || 150,
            distanceKm: v.distanceKm || 1.5,
            status: v.status || 'OPEN',
            location: {
              latitude: v.location?.coordinates?.[1] || 31.5204,
              longitude: v.location?.coordinates?.[0] || 74.3587,
              address: v.address || 'Main Town Bazaar',
              townArea: v.townArea || 'Town Center',
            },
            isFreeDelivery: v.isFreeDelivery,
            discountBadge: v.discountBadge,
            featured: v.featured,
            phone: v.phone || '+923001234567',
            openingHours: v.openingHours || '10:00 AM - 11:00 PM',
          }));
          setVendors(transformedVendors);

          // Fetch menu items for all vendors
          const menuPromises = transformedVendors.map((v) =>
            CustomerApi.getVendorMenu(v.id).catch(() => null)
          );
          const menusResults = await Promise.all(menuPromises);
          const allFetchedMenu: MenuItem[] = [];
          menusResults.forEach((mRes, idx) => {
            if (mRes?.menu) {
              const vendor = transformedVendors[idx];
              mRes.menu.forEach((item: any) => {
                allFetchedMenu.push({
                  id: item._id || item.id,
                  vendorId: vendor.id,
                  name: item.name,
                  description: item.description || '',
                  price: item.price,
                  originalPrice: item.originalPrice,
                  category: item.category || 'Mains',
                  imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
                  isAvailable: item.isAvailable ?? true,
                  isBestseller: item.isBestseller,
                  isVeg: item.isVeg,
                  isSpicy: item.isSpicy,
                  preparationTimeMins: item.preparationTimeMins || 15,
                  optionGroups: item.optionGroups?.map((og: any, ogIdx: number) => ({
                    id: og._id || `og_${ogIdx}`,
                    title: og.title,
                    required: og.required || false,
                    options: og.options?.map((opt: any, oIdx: number) => ({
                      id: opt._id || `opt_${oIdx}`,
                      name: opt.name,
                      price: opt.price || 0,
                    })) || [],
                  })),
                });
              });
            }
          });

          if (allFetchedMenu.length > 0) {
            setMenuItems(allFetchedMenu);
          }
        }

        // Fetch real orders from database
        const ordersRes = await CustomerApi.getMyOrders().catch(() => null);
        if (ordersRes?.orders && ordersRes.orders.length > 0) {
          const transformedOrders: Order[] = ordersRes.orders.map((o: any) => ({
            id: o._id || o.id,
            orderNumber: o.orderNumber || `MNCH-${o._id.slice(-4)}`,
            createdAt: o.createdAt || new Date().toISOString(),
            status: o.status as OrderStatus,
            vendor: {
              id: o.vendorId?._id || o.vendorId || 'ven_01',
              name: o.vendorSnapshot?.name || o.vendorId?.name || 'Local Vendor',
              phone: o.vendorSnapshot?.phone || o.vendorId?.phone || '+923001234567',
              location: {
                latitude: o.vendorSnapshot?.location?.coordinates?.[1] || 31.5204,
                longitude: o.vendorSnapshot?.location?.coordinates?.[0] || 74.3587,
                address: o.vendorSnapshot?.address || 'Main Town Bazaar',
              },
              imageUrl: o.vendorSnapshot?.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
            },
            items: o.items?.map((it: any, itIdx: number) => ({
              cartItemId: `ord_item_${itIdx}`,
              menuItem: {
                id: it.menuItemId || `m_${itIdx}`,
                vendorId: o.vendorId?._id || o.vendorId,
                name: it.name,
                description: '',
                price: it.unitPrice,
                category: 'Mains',
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
                isAvailable: true,
                preparationTimeMins: 15,
              },
              vendorId: o.vendorId?._id || o.vendorId,
              vendorName: o.vendorSnapshot?.name || 'Local Vendor',
              quantity: it.quantity,
              selectedOptions: it.selectedOptions || [],
              itemTotalPrice: it.totalPrice,
            })) || [],
            subtotal: o.pricing?.subtotal || 0,
            deliveryFee: o.pricing?.deliveryFee || 40,
            serviceFee: o.pricing?.serviceFee || 15,
            discountAmount: o.pricing?.discount || 0,
            totalAmount: o.pricing?.finalTotal || 0,
            paymentMethod: o.payment?.method || 'CASH_ON_DELIVERY',
            deliveryAddress: {
              id: 'addr_db',
              label: 'Home',
              street: o.deliveryAddress?.street || 'House # 42, Street 7',
              area: o.deliveryAddress?.area || 'Town Center',
              city: o.deliveryAddress?.city || 'Munch Town',
              latitude: o.deliveryAddress?.location?.coordinates?.[1] || 31.5204,
              longitude: o.deliveryAddress?.location?.coordinates?.[0] || 74.3587,
            },
            estimatedDeliveryTime: o.tracking?.estimatedDeliveryTime || '20-30 min',
            deliveryOtp: o.security?.deliveryOtp || '4821',
          }));
          setOrders(transformedOrders);
        }
      } catch (err) {
        console.warn('Backend load warning, using offline fallback', err);
      }
    }

    initData();
  }, []);

  // Auto hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  // Active Order is any non-delivered, non-cancelled order
  const activeOrder = useMemo(() => {
    return (
      orders.find(
        (ord) =>
          ord.status !== 'DELIVERED' && ord.status !== 'CANCELLED'
      ) || null
    );
  }, [orders]);

  // Address management
  const addAddress = useCallback(async (newAddr: Omit<UserAddress, 'id'>) => {
    const created: UserAddress = {
      ...newAddr,
      id: `addr_${Date.now()}`,
    };
    setAddresses((prev) => [...prev, created]);
    setCurrentAddress(created);
    showToast('New delivery address added!', 'success');
    CustomerApi.addAddress(newAddr).catch(() => {});
  }, [showToast]);

  const updateAddress = useCallback((updated: UserAddress) => {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (currentAddress.id === updated.id) {
      setCurrentAddress(updated);
    }
    showToast('Address updated!', 'success');
    CustomerApi.updateAddress(updated.id, updated).catch(() => {});
  }, [currentAddress.id, showToast]);

  // Favorites
  const toggleFavorite = useCallback((vendorId: string) => {
    setFavoriteVendorIds((prev) => {
      const exists = prev.includes(vendorId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== vendorId);
      } else {
        showToast('Added to favorite stalls!', 'success');
        return [...prev, vendorId];
      }
    });
    CustomerApi.toggleFavorite(vendorId).catch(() => {});
  }, [showToast]);

  const isFavorite = useCallback(
    (vendorId: string) => favoriteVendorIds.includes(vendorId),
    [favoriteVendorIds]
  );

  // Vendor Lookup Helpers
  const getVendorById = useCallback(
    (id: string) => vendors.find((v) => v.id === id || (v as any)._id === id),
    [vendors]
  );

  const getMenuItemsByVendor = useCallback(
    (vendorId: string) => menuItems.filter((item) => item.vendorId === vendorId),
    [menuItems]
  );

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      // Category filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Restaurants' && vendor.category !== 'Restaurants' && vendor.category !== 'Desi Special') {
          return false;
        }
        if (selectedCategory === 'Street Food' && vendor.category !== 'Street Food') {
          return false;
        }
        if (selectedCategory === 'Cafes' && vendor.category !== 'Cafes') {
          return false;
        }
        if (selectedCategory === 'Bakeries' && vendor.category !== 'Bakeries') {
          return false;
        }
        if (selectedCategory === 'Desi Special' && vendor.category !== 'Desi Special') {
          return false;
        }
        if (selectedCategory === 'Fast Food' && vendor.category !== 'Fast Food') {
          return false;
        }
        if (selectedCategory === 'Chai & Snacks' && vendor.category !== 'Chai & Snacks' && vendor.category !== 'Street Food') {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = vendor.name.toLowerCase().includes(q);
        const matchesTagline = vendor.tagline.toLowerCase().includes(q);
        const matchesCuisine = vendor.cuisineTypes.some((c) => c.toLowerCase().includes(q));
        const matchesDish = menuItems.some(
          (m) => m.vendorId === vendor.id && m.name.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesTagline && !matchesCuisine && !matchesDish) {
          return false;
        }
      }

      // Quick active filters
      if (activeFilter === 'RATING_HIGH' && vendor.rating < 4.8) {
        return false;
      }
      if (activeFilter === 'FAST_DELIVERY' && !vendor.deliveryTimeEstimate.includes('15') && !vendor.deliveryTimeEstimate.includes('20')) {
        return false;
      }
      if (activeFilter === 'FREE_DELIVERY' && !vendor.isFreeDelivery && vendor.deliveryFee > 0) {
        return false;
      }
      if (activeFilter === 'BUDGET' && vendor.minOrderAmount > 150) {
        return false;
      }

      return true;
    });
  }, [vendors, selectedCategory, searchQuery, activeFilter, menuItems]);

  // Cart Computations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  }, [cart]);

  const currentVendor = useMemo(() => {
    if (!cartVendorId) return null;
    return getVendorById(cartVendorId) || null;
  }, [cartVendorId, getVendorById]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (currentVendor?.isFreeDelivery) return 0;
    return currentVendor?.deliveryFee ?? 40;
  }, [cart.length, currentVendor]);

  const serviceFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return 15; // standard platform fee
  }, [cart.length]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo || cartSubtotal < appliedPromo.minOrder) return 0;
    if (appliedPromo.discountFlat) {
      return appliedPromo.discountFlat;
    }
    if (appliedPromo.discountPercent) {
      const calc = (cartSubtotal * appliedPromo.discountPercent) / 100;
      return appliedPromo.maxDiscount ? Math.min(calc, appliedPromo.maxDiscount) : calc;
    }
    return 0;
  }, [appliedPromo, cartSubtotal]);

  const totalAmount = useMemo(() => {
    if (cart.length === 0) return 0;
    const total = cartSubtotal + deliveryFee + serviceFee - discountAmount;
    return Math.max(0, total);
  }, [cart.length, cartSubtotal, deliveryFee, serviceFee, discountAmount]);

  // Cart Operations
  const addToCart = useCallback(
    (
      item: MenuItem,
      selectedOptions: SelectedOption[],
      quantity: number,
      specialInstructions?: string
    ) => {
      const vendor = getVendorById(item.vendorId);
      const vendorName = vendor?.name || 'Local Vendor';

      if (cart.length > 0 && cartVendorId && cartVendorId !== item.vendorId) {
        return { success: false, requiresVendorClear: true };
      }

      const optionsExtra = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      const unitPrice = item.price + optionsExtra;
      const itemTotalPrice = unitPrice * quantity;

      const optionsSignature = selectedOptions
        .map((o) => `${o.groupId}:${o.optionId}`)
        .sort()
        .join('|');
      const cartItemId = `${item.id}_${optionsSignature}_${specialInstructions || ''}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((ci) => ci.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            itemTotalPrice: unitPrice * newQty,
          };
          return updated;
        } else {
          const newCartItem: CartItem = {
            cartItemId,
            menuItem: item,
            vendorId: item.vendorId,
            vendorName,
            quantity,
            selectedOptions,
            specialInstructions,
            itemTotalPrice,
          };
          return [...prev, newCartItem];
        }
      });

      setCartVendorId(item.vendorId);
      setCartVendorName(vendorName);
      showToast(`Added ${quantity}x ${item.name} to cart!`, 'success');
      return { success: true };
    },
    [cart.length, cartVendorId, getVendorById, showToast]
  );

  const updateCartItemQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) => {
      const target = prev.find((ci) => ci.cartItemId === cartItemId);
      if (!target) return prev;

      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        const filtered = prev.filter((ci) => ci.cartItemId !== cartItemId);
        if (filtered.length === 0) {
          setCartVendorId(null);
          setCartVendorName(null);
          setAppliedPromo(null);
        }
        return filtered;
      }

      const unitPrice = target.itemTotalPrice / target.quantity;
      return prev.map((ci) =>
        ci.cartItemId === cartItemId
          ? { ...ci, quantity: newQty, itemTotalPrice: unitPrice * newQty }
          : ci
      );
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => {
      const filtered = prev.filter((ci) => ci.cartItemId !== cartItemId);
      if (filtered.length === 0) {
        setCartVendorId(null);
        setCartVendorName(null);
        setAppliedPromo(null);
      }
      return filtered;
    });
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartVendorId(null);
    setCartVendorName(null);
    setAppliedPromo(null);
    setRestaurantNotes('');
    setRiderNotes('');
  }, []);

  // Promo Code Operations
  const applyPromo = useCallback(
    (inputCode: string) => {
      const found = PROMO_CODES.find(
        (p) => p.code.toLowerCase() === inputCode.trim().toLowerCase()
      );
      if (!found) {
        return { success: false, message: 'Invalid promo voucher code' };
      }
      if (cartSubtotal < found.minOrder) {
        return {
          success: false,
          message: `Minimum order of Rs. ${found.minOrder} required for ${found.code}`,
        };
      }
      setAppliedPromo(found);
      showToast(`Promo ${found.code} applied!`, 'success');
      return { success: true, message: `Promo code ${found.code} applied!` };
    },
    [cartSubtotal, showToast]
  );

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    showToast('Promo voucher removed', 'info');
  }, [showToast]);

  // Order Operations
  const placeOrder = useCallback((): Order | null => {
    if (cart.length === 0 || !cartVendorId) {
      showToast('Cart is empty', 'warning');
      return null;
    }

    const vendor = getVendorById(cartVendorId);
    if (!vendor) return null;

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNum = `MNCH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      status: 'ORDER_PLACED',
      vendor: {
        id: vendor.id,
        name: vendor.name,
        phone: vendor.phone,
        location: vendor.location,
        imageUrl: vendor.imageUrl,
      },
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      serviceFee,
      discountAmount,
      totalAmount,
      paymentMethod: selectedPaymentMethod,
      deliveryAddress: currentAddress,
      restaurantNotes: restaurantNotes.trim() || undefined,
      riderNotes: riderNotes.trim() || undefined,
      estimatedDeliveryTime: '20-30 min',
      deliveryOtp: randomOtp,
      rider: {
        id: 'rid_03',
        name: 'Tariq Mehmood',
        phone: '+92 301 7766554',
        avatarUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        vehicleModel: 'Honda CD 70 (Red)',
        vehicleNumber: 'MN-25-1092',
        currentLocation: {
          latitude: vendor.location.latitude - 0.002,
          longitude: vendor.location.longitude - 0.002,
        },
      },
    };

    // Save to local state
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order ${orderNum} placed successfully!`, 'success');

    // Post to MongoDB Backend API
    CustomerApi.placeOrder({
      vendorId: vendor.id,
      items: cart.map((c) => ({
        menuItemId: c.menuItem.id,
        quantity: c.quantity,
        selectedOptions: c.selectedOptions,
        instructions: c.specialInstructions,
      })),
      deliveryAddress: {
        label: currentAddress.label,
        street: currentAddress.street,
        area: currentAddress.area,
        city: currentAddress.city,
        notes: currentAddress.notes,
        lat: currentAddress.latitude,
        lng: currentAddress.longitude,
      },
      paymentMethod: selectedPaymentMethod,
      promoCode: appliedPromo?.code,
      instructionsForVendor: restaurantNotes,
      instructionsForRider: riderNotes,
    })
      .then((res) => {
        if (res?.order) {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === newOrder.id ? { ...o, id: res.order._id, orderNumber: res.order.orderNumber } : o
            )
          );
        }
      })
      .catch((err) => {
        console.warn('Backend order placement offline fallback', err);
      });

    return newOrder;
  }, [
    cart,
    cartVendorId,
    cartSubtotal,
    deliveryFee,
    serviceFee,
    discountAmount,
    totalAmount,
    selectedPaymentMethod,
    currentAddress,
    restaurantNotes,
    riderNotes,
    appliedPromo,
    getVendorById,
    clearCart,
    showToast,
  ]);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    );
    showToast('Order has been cancelled', 'info');
    CustomerApi.cancelOrder(orderId).catch(() => {});
  }, [showToast]);

  const advanceOrderStatus = useCallback((orderId: string) => {
    const statusProgression: OrderStatus[] = [
      'ORDER_PLACED',
      'ORDER_ACCEPTED',
      'PREPARING',
      'RIDER_ASSIGNED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const currentIndex = statusProgression.indexOf(o.status);
        if (currentIndex < statusProgression.length - 1) {
          const nextStatus = statusProgression[currentIndex + 1];
          showToast(`Order status updated: ${nextStatus.replace(/_/g, ' ')}`, 'info');
          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  }, [showToast]);

  const submitReview = useCallback(
    (
      orderId: string,
      foodRating: number,
      riderRating: number,
      reviewComment: string,
      tipAmount: number = 0
    ) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                ratingGiven: {
                  foodRating,
                  riderRating,
                  reviewComment,
                  tipAmount,
                },
              }
            : o
        )
      );
      showToast('Thank you for rating your food & rider!', 'success');
      CustomerApi.rateOrder(orderId, {
        foodRating,
        riderRating,
        reviewComment,
        tipAmount,
      }).catch(() => {});
    },
    [showToast]
  );

  const reorder = useCallback(
    (order: Order) => {
      clearCart();
      order.items.forEach((item) => {
        addToCart(
          item.menuItem,
          item.selectedOptions,
          item.quantity,
          item.specialInstructions
        );
      });
      showToast(`Items from order ${order.orderNumber} added to cart!`, 'success');
      return true;
    },
    [addToCart, clearCart, showToast]
  );

  // In-App Chat Messaging
  const sendMessage = useCallback(
    (orderId: string, text: string, recipient: 'RIDER' | 'VENDOR') => {
      if (!text.trim()) return;

      const customerMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        orderId,
        senderType: 'CUSTOMER',
        senderName: user.name,
        message: text.trim(),
        timestamp: 'Just now',
      };

      setChatMessages((prev) => [...prev, customerMsg]);
      CustomerApi.sendMessage(orderId, text.trim(), recipient).catch(() => {});

      // Simulated instant response if backend not connected
      setTimeout(() => {
        const replyText =
          recipient === 'RIDER'
            ? 'Ji brother, I got your message! Almost at your destination.'
            : 'Ji janab, your order is being packed fresh with extra care!';

        const autoReply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          orderId,
          senderType: recipient,
          senderName:
            recipient === 'RIDER'
              ? 'Tariq Mehmood (Rider)'
              : 'Kitchen Staff (Vendor)',
          message: replyText,
          timestamp: 'Just now',
        };

        setChatMessages((prev) => [...prev, autoReply]);
        showToast(`New message from ${recipient === 'RIDER' ? 'Rider' : 'Restaurant'}`, 'info');
      }, 2000);
    },
    [user.name, showToast]
  );

  const value = {
    user,
    addresses,
    currentAddress,
    setCurrentAddress,
    addAddress,
    updateAddress,
    vendors,
    menuItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeFilter,
    setActiveFilter,
    filteredVendors,
    getVendorById,
    getMenuItemsByVendor,
    favoriteVendorIds,
    toggleFavorite,
    isFavorite,
    cart,
    cartVendorId,
    cartVendorName,
    cartCount,
    cartSubtotal,
    deliveryFee,
    serviceFee,
    totalAmount,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    restaurantNotes,
    setRestaurantNotes,
    riderNotes,
    setRiderNotes,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    appliedPromo,
    applyPromo,
    removePromo,
    discountAmount,
    orders,
    activeOrder,
    placeOrder,
    cancelOrder,
    advanceOrderStatus,
    submitReview,
    reorder,
    chatMessages,
    sendMessage,
    toast,
    showToast,
    hideToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
