// Printful product catalog — curated t-shirt selection
// Product IDs and variant IDs from Printful's API

export const PRINTFUL_PRODUCTS = [
  {
    id: "bella-canvas-3001",
    printfulProductId: 71,
    name: "Bella+Canvas 3001",
    subtitle: "Unisex Jersey Tee",
    description: "Ultra-soft 100% cotton. Side-seamed, retail fit. The gold standard for custom tees.",
    fabric: "100% Airlume combed cotton",
    weight: "4.2 oz",
    fit: "Retail fit",
    badge: "Best Seller",
    basePrice: 24.50,
    image: "https://files.cdn.printful.com/products/71/product_image/bella-canvas-3001-unisex-jersey-tee.jpg",
    imageColorName: "Black",
    mockupPlacement: { x: 50, y: 48, width: 32, maxWidth: 46 },
    colors: [
      { name: "Black", hex: "#0C0C0C", variantId: 4011 },
      { name: "White", hex: "#FAFAFA", variantId: 4012 },
      { name: "Navy", hex: "#1B2A4A", variantId: 4015 },
      { name: "Dark Grey Heather", hex: "#3C3C3C", variantId: 4017 },
      { name: "Army", hex: "#4B5320", variantId: 4362 },
      { name: "Heather Mauve", hex: "#B8929A", variantId: 4358 },
      { name: "Ocean Blue", hex: "#3D6B8E", variantId: 12120 },
      { name: "Vintage Black", hex: "#1A1A1A", variantId: 10791 },
      { name: "Autumn", hex: "#B5651D", variantId: 12119 },
      { name: "True Royal", hex: "#2B4F81", variantId: 4029 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    id: "bella-canvas-3001cvc",
    printfulProductId: 380,
    name: "Bella+Canvas 3001CVC",
    subtitle: "Unisex Heather CVC Tee",
    description: "Cotton/polyester blend for a slightly textured heathered look. Super soft feel.",
    fabric: "52% Airlume cotton, 48% poly",
    weight: "4.2 oz",
    fit: "Retail fit",
    badge: "Premium",
    basePrice: 26.00,
    image: "https://files.cdn.printful.com/products/380/product_image/bella-canvas-3001cvc.jpg",
    imageColorName: "Heather Black",
    mockupPlacement: { x: 50, y: 48, width: 32, maxWidth: 46 },
    colors: [
      { name: "Heather Black", hex: "#1C1C1C", variantId: 9867 },
      { name: "Heather Navy", hex: "#2D3A4E", variantId: 9872 },
      { name: "Heather Midnight Navy", hex: "#1E2D40", variantId: 9870 },
      { name: "Heather Deep Teal", hex: "#2A5C5A", variantId: 9868 },
      { name: "Heather Mauve", hex: "#B8929A", variantId: 9871 },
      { name: "Heather Olive", hex: "#6B7355", variantId: 12138 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "comfort-colors-1717",
    printfulProductId: 554,
    name: "Comfort Colors 1717",
    subtitle: "Garment-Dyed Heavyweight Tee",
    description: "Pre-shrunk garment-dyed heavyweight cotton. Relaxed, boxy fit with vintage wash feel.",
    fabric: "100% ring-spun cotton",
    weight: "6.1 oz",
    fit: "Relaxed boxy",
    badge: "Trending",
    basePrice: 28.00,
    image: "https://files.cdn.printful.com/products/554/product_image/comfort-colors-1717.jpg",
    imageColorName: "Black",
    mockupPlacement: { x: 50, y: 47, width: 31, maxWidth: 44 },
    colors: [
      { name: "Black", hex: "#111111", variantId: 14581 },
      { name: "Ivory", hex: "#F0EDE3", variantId: 14574 },
      { name: "Pepper", hex: "#5A5A5A", variantId: 14579 },
      { name: "Blue Jean", hex: "#6B8BA4", variantId: 14571 },
      { name: "Moss", hex: "#6B7C5E", variantId: 14577 },
      { name: "Yam", hex: "#C4754B", variantId: 14583 },
      { name: "Chalky Mint", hex: "#A8D5BA", variantId: 14572 },
      { name: "Burnt Orange", hex: "#C05A2B", variantId: 16121 },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: "gildan-5000",
    printfulProductId: 5,
    name: "Gildan 5000",
    subtitle: "Classic Heavy Cotton Tee",
    description: "Heavyweight 100% cotton classic tee. Traditional fit with taped shoulders. Best value.",
    fabric: "100% preshrunk cotton",
    weight: "5.3 oz",
    fit: "Classic fit",
    badge: "Value",
    basePrice: 18.50,
    image: "https://files.cdn.printful.com/products/5/product_image/gildan-5000.jpg",
    imageColorName: "Black",
    mockupPlacement: { x: 50, y: 47, width: 31, maxWidth: 44 },
    colors: [
      { name: "Black", hex: "#0E0E0E", variantId: 1 },
      { name: "White", hex: "#FEFEFE", variantId: 2 },
      { name: "Navy", hex: "#1A2744", variantId: 7 },
      { name: "Sport Grey", hex: "#999999", variantId: 3 },
      { name: "Military Green", hex: "#545B42", variantId: 11 },
      { name: "Maroon", hex: "#5B2333", variantId: 6 },
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  },
];

export const SHIPPING_RATES = {
  standard: { label: "Standard (5-8 days)", price: 4.50 },
  express: { label: "Express (3-5 days)", price: 8.95 },
};

export function getProductById(id) {
  return PRINTFUL_PRODUCTS.find((p) => p.id === id);
}

export function getDefaultProduct() {
  return PRINTFUL_PRODUCTS[0]; // Bella+Canvas 3001
}

export function getVariantForColor(product, shirtColor) {
  if (!product?.colors?.length) return null;
  const normalized = (shirtColor || "").toLowerCase();
  const byHex = product.colors.find((c) => c.hex.toLowerCase() === normalized);
  return byHex || product.colors[0];
}
