import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRINTFUL_PRODUCTS, SHIPPING_RATES } from "../data/printfulProducts";

const ThreadForgeContext = createContext(null);

const STORAGE_KEY = "threadforge_session";

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted storage, ignore
  }
  return null;
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable, ignore
  }
}

export function ThreadForgeProvider({ children }) {
  const persisted = useMemo(() => loadPersistedState(), []);

  const [prompt, setPrompt] = useState(persisted?.prompt || "");
  const [style, setStyle] = useState(persisted?.style || "streetwear");
  const [designs, setDesigns] = useState(persisted?.designs || []);
  const [selectedDesign, setSelectedDesign] = useState(persisted?.selectedDesign || null);

  const [placement, setPlacement] = useState(
    persisted?.placement || { scale: 20, y: 0 }
  );

  const [product, setProduct] = useState(
    persisted?.product || {
      printfulProduct: "bella-canvas-3001",
      shirtType: "Bella+Canvas 3001",
      shirtColor: "#0C0C0C",
      shirtColorName: "Black",
      size: "L",
    }
  );

  const [generation, setGeneration] = useState(
    persisted?.generation || { used: 0, freeLimit: 3, emailUnlocked: false, lastAt: 0 }
  );

  const [checkoutDraft, setCheckoutDraft] = useState(
    persisted?.checkoutDraft || {
      email: "",
      shipping: {
        fullName: "",
        address1: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
      },
    }
  );

  const [activeOrder, setActiveOrder] = useState(persisted?.activeOrder || null);

  const total = useMemo(() => {
    const pfProduct = PRINTFUL_PRODUCTS.find((p) => p.id === product.printfulProduct) || PRINTFUL_PRODUCTS[0];
    return pfProduct.basePrice + SHIPPING_RATES.standard.price;
  }, [product.printfulProduct]);

  // Persist state on every change
  useEffect(() => {
    persistState({
      prompt,
      style,
      designs,
      selectedDesign,
      placement,
      product,
      generation,
      checkoutDraft,
      activeOrder,
    });
  }, [prompt, style, designs, selectedDesign, placement, product, generation, checkoutDraft, activeOrder]);

  const value = {
    prompt,
    setPrompt,
    style,
    setStyle,
    designs,
    setDesigns,
    selectedDesign,
    setSelectedDesign,
    placement,
    setPlacement,
    product,
    setProduct,
    generation,
    setGeneration,
    checkoutDraft,
    setCheckoutDraft,
    activeOrder,
    setActiveOrder,
    total,
  };

  return (
    <ThreadForgeContext.Provider value={value}>
      {children}
    </ThreadForgeContext.Provider>
  );
}

export function useThreadForge() {
  const ctx = useContext(ThreadForgeContext);
  if (!ctx) {
    throw new Error("useThreadForge must be used within ThreadForgeProvider");
  }
  return ctx;
}
