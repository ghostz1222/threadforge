export async function upscaleForPrint(design) {
  if (!design) {
    throw new Error("No design provided for upscale");
  }

  if (import.meta.env.VITE_USE_SERVER_UPSCALE === "true") {
    const response = await fetch("/api/upscale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designId: design.id, image: design.preview }),
    });
    if (!response.ok) {
      throw new Error("Upscale request failed");
    }
    return response.json();
  }

  return {
    width: 4500,
    height: 5400,
    dpi: 300,
    image: design.preview,
    warning: null,
  };
}
