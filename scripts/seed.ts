/**
 * Seed script: populates products from the hardcoded list + creates default owner account.
 * Run: pnpm --filter @workspace/scripts seed
 */
import { db, productsTable, staffTable, couponsTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const PRODUCTS = [
  {
    slug: "nilgiri-morning-mist",
    name: "Nilgiri Morning Mist",
    shortDescription: "Single-origin Nilgiri whole-leaf black tea",
    description: "Handpicked from the misty Nilgiri slopes, this whole-leaf black tea brews a bright, brisk cup with floral undertones. No artificial flavours, no blending — pure Nilgiri.",
    price: "349.00",
    comparePrice: "399.00",
    category: "tea",
    images: [],
    badge: "Bestseller",
    stock: 150,
    gstRate: "5.00",
    weight: "100g",
    active: true,
    featured: true,
  },
  {
    slug: "kashmiri-kahwa-blend",
    name: "Kashmiri Kahwa Blend",
    shortDescription: "Saffron, cardamom & almond green tea",
    description: "A royal blend of green tea, Kashmiri saffron, cardamom, cinnamon, and crushed almonds. Traditionally prepared in a samovar — warming, aromatic, unforgettable.",
    price: "499.00",
    comparePrice: "599.00",
    category: "tea",
    images: [],
    badge: "New",
    stock: 80,
    gstRate: "5.00",
    weight: "100g",
    active: true,
    featured: true,
  },
  {
    slug: "masala-chai-blend",
    name: "Masala Chai Blend",
    shortDescription: "Classic Indian spiced black tea",
    description: "A bold Assam CTC base blended with whole spices — ginger, cardamom, cinnamon, cloves, and black pepper. The chai that tastes like home.",
    price: "299.00",
    comparePrice: null,
    category: "tea",
    images: [],
    badge: null,
    stock: 200,
    gstRate: "5.00",
    weight: "250g",
    active: true,
    featured: false,
  },
  {
    slug: "darjeeling-first-flush",
    name: "Darjeeling First Flush",
    shortDescription: "Rare spring harvest Darjeeling",
    description: "First flush Darjeeling — harvested in March from the high-altitude gardens of the Eastern Himalayas. Delicate, muscatel, with a natural sweetness. Limited seasonal availability.",
    price: "649.00",
    comparePrice: "749.00",
    category: "tea",
    images: [],
    badge: "Limited",
    stock: 40,
    gstRate: "5.00",
    weight: "50g",
    active: true,
    featured: true,
  },
  {
    slug: "tulsi-green-tea",
    name: "Tulsi Green Tea",
    shortDescription: "Organic tulsi & whole-leaf green tea",
    description: "A calming blend of whole-leaf green tea and fresh-dried Holy Basil (Tulsi). Antioxidant-rich, naturally caffeine-low, and deeply soothing.",
    price: "379.00",
    comparePrice: null,
    category: "tea",
    images: [],
    badge: "Organic",
    stock: 120,
    gstRate: "5.00",
    weight: "100g",
    active: true,
    featured: false,
  },
  {
    slug: "kerala-banana-chips",
    name: "Kerala Banana Chips",
    shortDescription: "Thin-sliced raw banana, coconut oil fried",
    description: "Sliced paper-thin from fresh raw bananas and fried in pure cold-pressed coconut oil. Lightly salted, sublimely crisp. A Keralite classic.",
    price: "199.00",
    comparePrice: "249.00",
    category: "snacks",
    images: [],
    badge: "Bestseller",
    stock: 300,
    gstRate: "12.00",
    weight: "200g",
    active: true,
    featured: true,
  },
  {
    slug: "kara-sev",
    name: "Kara Sev",
    shortDescription: "Spicy chickpea flour noodles",
    description: "Crunchy chickpea flour noodles fried with red chilli, garlic, and black pepper. The original South Indian teatime snack. Impossibly addictive.",
    price: "179.00",
    comparePrice: null,
    category: "snacks",
    images: [],
    badge: null,
    stock: 250,
    gstRate: "12.00",
    weight: "150g",
    active: true,
    featured: false,
  },
  {
    slug: "ribbon-pakoda",
    name: "Ribbon Pakoda",
    shortDescription: "Lacy rice-flour ribbons, crispy & light",
    description: "Hand-extruded rice and chickpea flour ribbons, fried golden and spiced with red chilli and cumin. Incredibly light, impossibly crisp.",
    price: "189.00",
    comparePrice: "219.00",
    category: "snacks",
    images: [],
    badge: "New",
    stock: 180,
    gstRate: "12.00",
    weight: "150g",
    active: true,
    featured: true,
  },
  {
    slug: "thattai",
    name: "Thattai",
    shortDescription: "Sesame & curry leaf rice crisps",
    description: "Flat, disc-shaped rice crisps loaded with sesame seeds, curry leaves, and red chilli. A Tamil Nadu staple — puffed light, fried crisp.",
    price: "159.00",
    comparePrice: null,
    category: "snacks",
    images: [],
    badge: null,
    stock: 220,
    gstRate: "12.00",
    weight: "150g",
    active: true,
    featured: false,
  },
  {
    slug: "murukku",
    name: "Murukku",
    shortDescription: "Classic spiral rice-flour murukku",
    description: "Hand-pressed spiral murukku made from whole rice flour and urad dal, spiced with cumin and sesame. Fried fresh, packed same-day.",
    price: "169.00",
    comparePrice: "199.00",
    category: "snacks",
    images: [],
    badge: "Gift Pick",
    stock: 200,
    gstRate: "12.00",
    weight: "200g",
    active: true,
    featured: true,
  },
];

async function seed() {
  console.log("🌱 Seeding database...\n");

  // Seed products
  let inserted = 0;
  let skipped = 0;
  for (const p of PRODUCTS) {
    const existing = await db.select().from(productsTable).where(eq(productsTable.slug, p.slug)).limit(1);
    if (existing.length > 0) {
      console.log(`  ⏭  Product "${p.name}" already exists — skipping.`);
      skipped++;
      continue;
    }
    await db.insert(productsTable).values(p);
    console.log(`  ✅ Inserted: ${p.name}`);
    inserted++;
  }
  console.log(`\n  Products: ${inserted} inserted, ${skipped} skipped.\n`);

  // Seed default owner account
  const ownerEmail = process.env.OWNER_EMAIL ?? "admin@crispynsnacky.in";
  const ownerPassword = process.env.OWNER_PASSWORD ?? "ChangeMe@123";
  const existingOwner = await db.select().from(staffTable).where(eq(staffTable.email, ownerEmail)).limit(1);
  if (existingOwner.length === 0) {
    const passwordHash = await bcrypt.hash(ownerPassword, 12);
    await db.insert(staffTable).values({ email: ownerEmail, passwordHash, name: "Owner", role: "owner" });
    console.log(`  ✅ Owner account created: ${ownerEmail}`);
    console.log(`  ⚠️  Default password: ${ownerPassword} — CHANGE THIS IMMEDIATELY after first login.\n`);
  } else {
    console.log(`  ⏭  Owner account already exists.\n`);
  }

  // Seed welcome coupon
  const welcomeCoupon = await db.select().from(couponsTable).where(eq(couponsTable.code, "WELCOME10")).limit(1);
  if (welcomeCoupon.length === 0) {
    await db.insert(couponsTable).values({
      code: "WELCOME10",
      type: "percent",
      value: "10",
      minOrderAmount: "299",
      description: "10% off first order — newsletter signup coupon",
      active: true,
    });
    console.log("  ✅ Coupon WELCOME10 created.\n");
  }

  console.log("✅ Seed complete.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
