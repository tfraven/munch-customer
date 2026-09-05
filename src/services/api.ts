import { Platform } from 'react-native';

// Dynamically resolve backend host
const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api/v1';
  }
  return 'http://localhost:4000/api/v1';
};

export const API_URL = getBaseUrl();

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.warn(`[API] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const CustomerApi = {
  // Auth
  login: async (phone: string, password = 'Customer@123') => {
    const res = await request<{ ok: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  register: async (payload: { name: string; phone: string; password?: string; email?: string; town?: string }) => {
    const res = await request<{ ok: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ password: 'Customer@123', ...payload }),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  getMe: () => request<{ ok: boolean; user: any }>('/auth/me'),

  // Vendors & Menu
  getVendors: (params?: { category?: string; search?: string; lat?: number; lng?: number }) => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('q', params.search);
    if (params?.lat) query.append('lat', params.lat.toString());
    if (params?.lng) query.append('lng', params.lng.toString());
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return request<{ ok: boolean; vendors: any[] }>(`/vendors${qStr}`);
  },

  getVendor: (id: string) => request<{ ok: boolean; vendor: any }>(`/vendors/${id}`),

  getVendorMenu: (id: string) => request<{ ok: boolean; menu: any[] }>(`/vendors/${id}/menu`),

  search: (q: string) => request<{ ok: boolean; vendors: any[]; items: any[] }>(`/search?q=${encodeURIComponent(q)}`),

  // Promos
  getPromos: () => request<{ ok: boolean; promos: any[] }>('/promos'),

  validatePromo: (code: string, subtotal: number, vendorId?: string) =>
    request<{ ok: boolean; promo: any; discount: number; finalTotal: number }>('/promos/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, vendorId }),
    }),

  // Addresses
  getAddresses: () => request<{ ok: boolean; addresses: any[] }>('/addresses'),

  addAddress: (address: any) =>
    request<{ ok: boolean; addresses: any[] }>('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),

  updateAddress: (id: string, address: any) =>
    request<{ ok: boolean; addresses: any[] }>(`/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(address),
    }),

  deleteAddress: (id: string) =>
    request<{ ok: boolean; addresses: any[] }>(`/addresses/${id}`, {
      method: 'DELETE',
    }),

  // Favorites
  getFavorites: () => request<{ ok: boolean; favorites: string[] }>('/favorites'),

  toggleFavorite: (vendorId: string) =>
    request<{ ok: boolean; isFavorite: boolean; favorites: string[] }>(`/favorites/${vendorId}`, {
      method: 'POST',
    }),

  // Orders
  quoteOrder: (payload: any) =>
    request<{ ok: boolean; quote: any }>('/orders/quote', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  placeOrder: (payload: any) =>
    request<{ ok: boolean; order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMyOrders: () => request<{ ok: boolean; orders: any[] }>('/orders'),

  getOrder: (id: string) => request<{ ok: boolean; order: any }>(`/orders/${id}`),

  cancelOrder: (id: string, reason?: string) =>
    request<{ ok: boolean; order: any }>(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  rateOrder: (id: string, ratings: { foodRating?: number; riderRating?: number; reviewComment?: string; tipAmount?: number }) =>
    request<{ ok: boolean; order: any }>(`/orders/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify(ratings),
    }),

  trackOrder: (id: string) => request<{ ok: boolean; tracking: any }>(`/orders/${id}/tracking`),

  // Chat
  getMessages: (orderId: string) => request<{ ok: boolean; messages: any[] }>(`/orders/${orderId}/messages`),

  sendMessage: (orderId: string, message: string, recipientType: string) =>
    request<{ ok: boolean; chatMessage: any }>(`/orders/${orderId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, recipientType }),
    }),
};
