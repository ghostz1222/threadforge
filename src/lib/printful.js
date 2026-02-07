export async function createPrintfulOrder(payload) {
  if (import.meta.env.VITE_USE_SERVER_PRINTFUL === "true") {
    const response = await fetch("/api/printful-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Printful order routing failed");
    }

    return response.json();
  }

  return {
    id: `pf_${Math.random().toString(36).slice(2, 10)}`,
    status: "submitted",
    estimatedShipDate: new Date(Date.now() + 3 * 86400000).toISOString(),
  };
}
