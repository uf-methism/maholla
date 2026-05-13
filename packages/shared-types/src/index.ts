// ============================================================
// MOHALLA — Shared Type Definitions
// ============================================================
// This is the CONTRACT LAYER between frontend and backend.
// Both apps/vendor, apps/customer-pwa, and backend import from here.
//
// ⚠️  RULES:
// 1. Changes to this file affect BOTH team members' code.
// 2. Always coordinate before modifying.
// 3. Use a dedicated branch: chore/shared-types/<description>
// 4. Get PR approval from BOTH members before merging.
// ============================================================

// ─── Vendor ──────────────────────────────────────────────────

export interface Vendor {
  id: string;
  phone: string;
  name: string;
  storeName: string;
  category: VendorCategory;
  description?: string;
  location: GeoLocation;
  address: string;
  upiId?: string;
  isOpen: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export type VendorCategory =
  | 'grocery'
  | 'vegetables'
  | 'dairy'
  | 'food'
  | 'medicine'
  | 'services'
  | 'general'
  | 'other';

export interface GeoLocation {
  lat: number;
  lng: number;
}

// ─── Product ─────────────────────────────────────────────────

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  price: number; // in paise (₹1 = 100 paise)
  unit: ProductUnit;
  quantity: number; // current stock
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductUnit =
  | 'kg'
  | 'g'
  | 'litre'
  | 'ml'
  | 'piece'
  | 'packet'
  | 'dozen'
  | 'box';

// ─── Inventory Delta (from Voice AI) ────────────────────────

export interface InventoryDelta {
  itemName: string;
  quantityChange: number; // positive = stock added, negative = sold
  unit: ProductUnit;
  confidence: 'high' | 'medium' | 'low';
}

export interface InventoryUpdateRequest {
  vendorId: string;
  deltas: InventoryDelta[];
  source: 'voice' | 'manual';
}

// ─── Order ───────────────────────────────────────────────────

export interface Order {
  id: string;
  vendorId: string;
  customerPhone: string;
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  deliveryPreference: 'pickup' | 'delivery';
  source: 'whatsapp' | 'pwa';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId?: string; // may be null if AI-parsed from free text
  name: string;
  quantity: number;
  unit: ProductUnit;
}

export type OrderStatus =
  | 'pending'    // just received, vendor hasn't seen
  | 'confirmed'  // vendor accepted
  | 'rejected'   // vendor declined
  | 'ready'      // ready for pickup/delivery
  | 'completed'  // handed over
  | 'cancelled'; // cancelled by customer

// ─── Customer ────────────────────────────────────────────────

export interface Customer {
  id: string;
  phone: string;
  name?: string;
  location?: GeoLocation;
  createdAt: string;
}

// ─── Review ──────────────────────────────────────────────────

export interface Review {
  id: string;
  vendorId: string;
  customerId: string;
  orderId: string; // purchase-gated: must have a completed order
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}

// ─── API Response Wrappers ───────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// ─── Discovery (Customer PWA) ────────────────────────────────

export interface NearbyVendorQuery {
  lat: number;
  lng: number;
  radiusKm: number; // 0.5 to 5
  category?: VendorCategory;
  page?: number;
  pageSize?: number;
}

export interface VendorCard {
  id: string;
  storeName: string;
  category: VendorCategory;
  distance: number; // in meters
  isOpen: boolean;
  rating: number;   // average, 0-5
  reviewCount: number;
  location: GeoLocation;
}
