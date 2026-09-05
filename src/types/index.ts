export type VendorCategory =
  | 'All'
  | 'Restaurants'
  | 'Street Food'
  | 'Cafes'
  | 'Bakeries'
  | 'Desi Special'
  | 'Fast Food'
  | 'Chai & Snacks';

export type OperatingStatus = 'OPEN' | 'BUSY' | 'CLOSED';

export interface LocationGeo {
  latitude: number;
  longitude: number;
  address: string;
  townArea?: string;
}

export interface MenuItemOption {
  id: string;
  name: string;
  price: number; // additional price (0 if base included)
}

export interface OptionGroup {
  id: string;
  title: string;
  required: boolean;
  minSelect?: number;
  maxSelect?: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isBestseller?: boolean;
  isVeg?: boolean;
  isSpicy?: boolean;
  preparationTimeMins: number;
  optionGroups?: OptionGroup[];
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  category: VendorCategory;
  cuisineTypes: string[];
  imageUrl: string;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
  deliveryTimeEstimate: string; // e.g. "15-25 min"
  deliveryFee: number; // in PKR / Rs. (e.g. 40 or 0)
  minOrderAmount: number;
  distanceKm: number;
  status: OperatingStatus;
  location: LocationGeo;
  isFreeDelivery?: boolean;
  discountBadge?: string; // e.g. "20% OFF up to Rs. 150"
  featured?: boolean;
  phone: string;
  openingHours: string;
}

export interface SelectedOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique ID for item + options combination
  menuItem: MenuItem;
  vendorId: string;
  vendorName: string;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  itemTotalPrice: number;
}

export type PaymentMethod =
  | 'CASH_ON_DELIVERY'
  | 'EASYPAISA'
  | 'JAZZCASH'
  | 'CREDIT_DEBIT_CARD';

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'ORDER_ACCEPTED'
  | 'PREPARING'
  | 'RIDER_ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface RiderInfo {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  rating: number;
  vehicleModel: string;
  vehicleNumber: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  vendor: {
    id: string;
    name: string;
    phone: string;
    location: LocationGeo;
    imageUrl: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: UserAddress;
  restaurantNotes?: string;
  riderNotes?: string;
  rider?: RiderInfo;
  estimatedDeliveryTime: string;
  deliveryOtp: string; // 4-digit OTP
  ratingGiven?: {
    foodRating: number;
    riderRating: number;
    reviewComment?: string;
    tipAmount?: number;
  };
}

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Hostel' | 'Other';
  street: string;
  area: string;
  city: string;
  postalCode?: string;
  notes?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface PromoCode {
  code: string;
  description: string;
  discountPercent?: number;
  discountFlat?: number;
  minOrder: number;
  maxDiscount?: number;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderType: 'CUSTOMER' | 'RIDER' | 'VENDOR';
  senderName: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
}
