import nilgiriTeaPath from "@assets/generated_images/nilgiri-tea.jpg";
import murukkuPath from "@assets/generated_images/murukku.jpg";
import bananaChipsPath from "@assets/generated_images/banana-chips.jpg";
import darjeelingGiftPath from "@assets/generated_images/darjeeling-gift.jpg";
import snacksAssortmentPath from "@assets/generated_images/snacks-assortment.jpg";

export type Product = {
  id: string;
  name: string;
  category: 'tea' | 'snacks';
  price: number;
  image: string;
  slug: string;
  description: string;
  variants: string[];
  badge: string | null;
};

export const PRODUCTS: Product[] = [
  { id: "nilgiri-morning-mist", name: "Nilgiri Morning Mist", category: "tea", price: 349, image: nilgiriTeaPath, slug: "nilgiri-morning-mist", description: "A delicate, aromatic loose-leaf tea from the Nilgiri hills. Light, floral, and perfect for morning calm.", variants: ["100g", "250g", "500g"], badge: "Bestseller" },
  { id: "darjeeling-first-flush", name: "Darjeeling First Flush Gift Box", category: "tea", price: 899, image: darjeelingGiftPath, slug: "darjeeling-first-flush", description: "Premium first flush Darjeeling in an elegant gift box — an ideal gifting choice.", variants: ["Gift Box 150g"], badge: "Gift Pick" },
  { id: "kashmiri-kahwa", name: "Kashmiri Kahwa Green Tea", category: "tea", price: 449, image: nilgiriTeaPath, slug: "kashmiri-kahwa", description: "Saffron-infused green tea with almonds and cardamom. A royal Kashmiri tradition.", variants: ["100g", "250g"], badge: "Premium" },
  { id: "masala-chai-blend", name: "Crispy N Snacky Masala Chai", category: "tea", price: 299, image: nilgiriTeaPath, slug: "masala-chai-blend", description: "Our signature blend of bold Assam CTC, ginger, cardamom, and spice. Makes the perfect cutting chai.", variants: ["250g", "500g"], badge: null },
  { id: "earl-grey-bags", name: "Earl Grey Premium Bags", category: "tea", price: 249, image: nilgiriTeaPath, slug: "earl-grey-bags", description: "Classic bergamot-scented Earl Grey in individually wrapped pyramid bags.", variants: ["20 bags", "40 bags"], badge: null },
  { id: "murukku-classic", name: "Murukku Classic Crispy", category: "snacks", price: 199, image: murukkuPath, slug: "murukku-classic", description: "Sun-dried rice and urad dal murukku, fried to golden perfection. A Tamil Nadu staple.", variants: ["200g", "400g"], badge: "Fan Favourite" },
  { id: "ribbon-pakoda", name: "Ribbon Pakoda Spicy", category: "snacks", price: 179, image: snacksAssortmentPath, slug: "ribbon-pakoda", description: "Crisp ribbon-shaped chickpea flour snacks with a satisfying spice kick.", variants: ["200g", "400g"], badge: null },
  { id: "banana-chips-kerala", name: "Banana Chips Kerala Style", category: "snacks", price: 229, image: bananaChipsPath, slug: "banana-chips-kerala", description: "Thick-cut raw banana chips fried in coconut oil with a pinch of rock salt.", variants: ["150g", "300g"], badge: "New" },
  { id: "thattai-sesame", name: "Thattai Sesame Crunch", category: "snacks", price: 189, image: snacksAssortmentPath, slug: "thattai-sesame", description: "Thin, crispy rice discs topped with sesame and curry leaves. Addictively crunchy.", variants: ["200g", "400g"], badge: null },
  { id: "jackfruit-chips", name: "Jackfruit Chips", category: "snacks", price: 259, image: snacksAssortmentPath, slug: "jackfruit-chips", description: "Seasonal raw jackfruit sliced thin and fried with Kerala spices. A rare seasonal treat.", variants: ["150g"], badge: "Limited" },
];

export const REVIEWS = [
  { author: "Priya S.", rating: 5, text: "The Nilgiri tea is absolutely divine. Orders every month now!", location: "Chennai" },
  { author: "Arjun K.", rating: 5, text: "Murukku tastes exactly like what paati used to make. Incredible.", location: "Bengaluru" },
  { author: "Meena R.", rating: 4, text: "Great quality and fast delivery. The gift box for Darjeeling was beautifully packed.", location: "Mumbai" },
];
