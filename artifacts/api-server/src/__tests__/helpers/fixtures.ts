/** Shared test fixtures — realistic but fake data. */
import bcrypt from "bcryptjs";

// Sync hash (fast rounds) — only for tests
const HASH_ROUNDS = 1;

export const TEST_PASSWORD = "Password123!";
export const TEST_HASH = bcrypt.hashSync(TEST_PASSWORD, HASH_ROUNDS);

export const fakeUser = {
  id: 1,
  email: "test@example.com",
  passwordHash: TEST_HASH,
  name: "Test User",
  phone: "9999999999",
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeStaffOwner = {
  id: 10,
  email: "owner@crispynsnacky.in",
  passwordHash: TEST_HASH,
  name: "Owner",
  role: "owner",
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeStaffManager = {
  id: 11,
  email: "manager@crispynsnacky.in",
  passwordHash: TEST_HASH,
  name: "Manager",
  role: "manager",
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeStaffOnly = {
  id: 12,
  email: "staff@crispynsnacky.in",
  passwordHash: TEST_HASH,
  name: "Staff",
  role: "staff",
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeProduct = {
  id: 42,
  slug: "masala-chai-blend",
  name: "Masala Chai Blend",
  description: "Rich South Indian masala chai.",
  shortDescription: "Spiced chai blend.",
  price: "299.00",
  comparePrice: "349.00",
  category: "tea",
  images: ["https://example.com/chai.jpg"],
  badge: "Bestseller",
  stock: 100,
  gstRate: "5.00",
  weight: "250g",
  active: true,
  featured: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeProduct2 = {
  ...fakeProduct,
  id: 43,
  slug: "banana-chips-classic",
  name: "Banana Chips Classic",
  price: "149.00",
  category: "snacks",
  gstRate: "12.00",
  stock: 50,
};

export const fakeCartItem = {
  id: 1,
  sessionId: "test-session-id",
  productId: fakeProduct.id,
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeCoupon = {
  id: 1,
  code: "WELCOME10",
  type: "percent" as const,
  value: "10.00",
  minOrderAmount: "299.00",
  maxUses: 100,
  usedCount: 5,
  description: "10% off first order",
  active: true,
  expiresAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const fakeOrder = {
  id: 1,
  orderNumber: "CNS-20260715-12345",
  userId: fakeUser.id,
  guestEmail: null,
  status: "pending",
  items: [
    {
      productId: fakeProduct.id,
      name: fakeProduct.name,
      price: fakeProduct.price,
      quantity: 2,
      gstRate: fakeProduct.gstRate,
    },
  ],
  subtotal: "598.00",
  discountAmount: "0.00",
  couponCode: null,
  taxAmount: "28.48",
  shippingAmount: "0.00",
  total: "598.00",
  shippingAddress: {
    name: "Test User",
    phone: "9999999999",
    line1: "A46 Test Street",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    country: "India",
  },
  gstDetails: null,
  razorpayOrderId: null,
  razorpayPaymentId: null,
  paymentStatus: "unpaid",
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const shippingAddress = {
  name: "Test Customer",
  phone: "9999999999",
  line1: "123 Main St",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600001",
  country: "India",
};
