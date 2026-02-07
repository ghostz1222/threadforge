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
    image: "https://files.cdn.printful.com/o/upload/product-catalog-img/20/2079a3ee4cc472ad952fe16654f274cd_l",
    imageColorName: "Black",
    mockupPlacement: { x: 50, y: 48, width: 32, maxWidth: 46 },
    colors: [
      { name: "Black", hex: "#0C0C0C", variantId: 4017 },
      { name: "White", hex: "#FAFAFA", variantId: 4012 },
      { name: "Navy", hex: "#1B2A4A", variantId: 4112 },
      { name: "Dark Grey Heather", hex: "#3C3C3C", variantId: 8461 },
      { name: "Army", hex: "#4B5320", variantId: 8441 },
      { name: "Heather Mauve", hex: "#B8929A", variantId: 18636 },
      { name: "Black Heather", hex: "#1D1D1D", variantId: 8924 },
      { name: "Autumn", hex: "#B5651D", variantId: 10385 },
      { name: "Athletic Heather", hex: "#A8A8A8", variantId: 6949 },
      { name: "True Royal", hex: "#2B4F81", variantId: 4172 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  },
  {
    id: "bella-canvas-3001cvc",
    printfulProductId: 71,
    name: "Bella+Canvas 3001CVC",
    subtitle: "Unisex Heather CVC Tee",
    description: "Heather-forward colorways on Bella+Canvas 3001 with a premium soft handfeel.",
    fabric: "52% Airlume cotton, 48% poly",
    weight: "4.2 oz",
    fit: "Retail fit",
    badge: "Premium",
    basePrice: 26.00,
    image: "https://files.cdn.printful.com/o/upload/product-catalog-img/20/2079a3ee4cc472ad952fe16654f274cd_l",
    imageColorName: "Black Heather",
    mockupPlacement: { x: 50, y: 48, width: 32, maxWidth: 46 },
    colors: [
      { name: "Black Heather", hex: "#1C1C1C", variantId: 8924 },
      { name: "Dark Grey Heather", hex: "#3D3D3D", variantId: 8461 },
      { name: "Athletic Heather", hex: "#A4A5A7", variantId: 6949 },
      { name: "Heather Mauve", hex: "#B8929A", variantId: 18636 },
      { name: "Navy", hex: "#2D3A4E", variantId: 4112 },
      { name: "White", hex: "#F2F2F2", variantId: 4012 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "comfort-colors-1717",
    printfulProductId: 586,
    name: "Comfort Colors 1717",
    subtitle: "Garment-Dyed Heavyweight Tee",
    description: "Pre-shrunk garment-dyed heavyweight cotton. Relaxed, boxy fit with vintage wash feel.",
    fabric: "100% ring-spun cotton",
    weight: "6.1 oz",
    fit: "Relaxed boxy",
    badge: "Trending",
    basePrice: 28.00,
    image: "https://files.cdn.printful.com/o/upload/product-catalog-img/6d/6d7501c1e4b984392a258054bf0cd145_l",
    imageColorName: "Black",
    mockupPlacement: { x: 50, y: 47, width: 31, maxWidth: 44 },
    colors: [
      { name: "Black", hex: "#111111", variantId: 15115 },
      { name: "Ivory", hex: "#F0EDE3", variantId: 16524 },
      { name: "Pepper", hex: "#5A5A5A", variantId: 17694 },
      { name: "Blue Jean", hex: "#6B8BA4", variantId: 16512 },
      { name: "Moss", hex: "#6B7C5E", variantId: 17701 },
      { name: "Berry", hex: "#8D4E63", variantId: 15157 },
      { name: "Chalky Mint", hex: "#A8D5BA", variantId: 21514 },
      { name: "Burnt orange", hex: "#C05A2B", variantId: 22090 },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: "gildan-5000",
    printfulProductId: 438,
    name: "Gildan 5000",
    subtitle: "Classic Heavy Cotton Tee",
    description: "Heavyweight 100% cotton classic tee. Traditional fit with taped shoulders. Best value.",
    fabric: "100% preshrunk cotton",
    weight: "5.3 oz",
    fit: "Classic fit",
    badge: "Value",
    basePrice: 18.50,
    image: "https://files.cdn.printful.com/o/upload/product-catalog-img/51/5137d67bedbf56010d1daa04555a6d03_l",
    imageColorName: "Black",
    mockupPlacement: { x: 50, y: 47, width: 31, maxWidth: 44 },
    colors: [
      { name: "Black", hex: "#0E0E0E", variantId: 11547 },
      { name: "White", hex: "#FEFEFE", variantId: 11577 },
      { name: "Navy", hex: "#1A2744", variantId: 11562 },
      { name: "Sport Grey", hex: "#999999", variantId: 11572 },
      { name: "Military Green", hex: "#545B42", variantId: 15868 },
      { name: "Maroon", hex: "#5B2333", variantId: 12635 },
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
