import { useEffect, useState } from "react";

/**
 * Client-side background removal for design images.
 * Converts dark pixels (near-black) to transparent using canvas.
 * This makes AI-generated designs with dark backgrounds blend seamlessly on any shirt.
 */
export default function useTransparentDesign(imageUrl) {
  const [processedUrl, setProcessedUrl] = useState(null);

  useEffect(() => {
    if (!imageUrl) {
      setProcessedUrl(null);
      return;
    }

    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Work at a reasonable size for performance
      const maxSize = 512;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Threshold: pixels darker than this become transparent
      // Use a generous threshold to catch dark greys from AI generation
      const threshold = 45;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Perceived brightness
        const brightness = r * 0.299 + g * 0.587 + b * 0.114;

        if (brightness < threshold) {
          // Fully transparent
          data[i + 3] = 0;
        } else if (brightness < threshold + 25) {
          // Feathered edge — smooth transition from transparent to opaque
          const alpha = ((brightness - threshold) / 25) * data[i + 3];
          data[i + 3] = Math.round(alpha);
        }
        // else: keep original pixel
      }

      ctx.putImageData(imageData, 0, 0);

      const result = canvas.toDataURL("image/png");
      if (!cancelled) {
        setProcessedUrl(result);
      }
    };

    img.onerror = () => {
      // If we can't load cross-origin, just use the original
      if (!cancelled) {
        setProcessedUrl(imageUrl);
      }
    };

    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return processedUrl;
}
