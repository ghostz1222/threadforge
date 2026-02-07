import { useEffect, useState } from "react";

/**
 * Client-side background removal for design images.
 * Uses edge-based flood fill against the dominant border color so we can remove
 * solid backgrounds (black, white, or colored) while preserving the foreground.
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
      if (!ctx) {
        setProcessedUrl(imageUrl);
        return;
      }

      // Work at a reasonable size for performance
      const maxSize = 768;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;
      const totalPixels = width * height;

      const bg = estimateEdgeBackground(data, width, height);
      const hardTolerance = 30;
      const softTolerance = 62;
      const visited = new Uint8Array(totalPixels);
      const queue = new Uint32Array(totalPixels);
      let head = 0;
      let tail = 0;

      const trySeed = (x, y) => {
        const idx = y * width + x;
        if (visited[idx]) return;
        const offset = idx * 4;
        if (data[offset + 3] < 8 || colorDistanceSq(data, offset, bg) <= hardTolerance * hardTolerance) {
          visited[idx] = 1;
          queue[tail] = idx;
          tail += 1;
        }
      };

      for (let x = 0; x < width; x += 1) {
        trySeed(x, 0);
        trySeed(x, height - 1);
      }
      for (let y = 0; y < height; y += 1) {
        trySeed(0, y);
        trySeed(width - 1, y);
      }

      while (head < tail) {
        const idx = queue[head];
        head += 1;
        const x = idx % width;
        const y = (idx / width) | 0;

        for (let n = 0; n < 4; n += 1) {
          const nx = n === 0 ? x - 1 : n === 1 ? x + 1 : x;
          const ny = n === 2 ? y - 1 : n === 3 ? y + 1 : y;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const nIdx = ny * width + nx;
          if (visited[nIdx]) continue;
          const offset = nIdx * 4;

          const dist = Math.sqrt(colorDistanceSq(data, offset, bg));
          if (dist <= softTolerance || data[offset + 3] < 8) {
            visited[nIdx] = 1;
            queue[tail] = nIdx;
            tail += 1;
          }
        }
      }

      for (let i = 0; i < totalPixels; i += 1) {
        if (!visited[i]) continue;
        const offset = i * 4;
        const dist = Math.sqrt(colorDistanceSq(data, offset, bg));
        if (dist <= hardTolerance) {
          data[offset + 3] = 0;
        } else {
          const feather = (dist - hardTolerance) / Math.max(1, softTolerance - hardTolerance);
          data[offset + 3] = Math.round(data[offset + 3] * Math.min(Math.max(feather, 0), 1));
        }
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

function estimateEdgeBackground(data, width, height) {
  const bucketCount = 4096; // 16*16*16
  const buckets = new Uint32Array(bucketCount);
  const sums = new Uint32Array(bucketCount * 3);
  const step = Math.max(1, Math.floor(Math.min(width, height) / 140));

  const addSample = (x, y) => {
    const idx = (y * width + x) * 4;
    const a = data[idx + 3];
    if (a < 10) return;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const bucket = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    buckets[bucket] += 1;
    sums[bucket * 3] += r;
    sums[bucket * 3 + 1] += g;
    sums[bucket * 3 + 2] += b;
  };

  for (let x = 0; x < width; x += step) {
    addSample(x, 0);
    addSample(x, height - 1);
  }
  for (let y = 0; y < height; y += step) {
    addSample(0, y);
    addSample(width - 1, y);
  }

  let best = 0;
  for (let i = 1; i < bucketCount; i += 1) {
    if (buckets[i] > buckets[best]) best = i;
  }

  const count = Math.max(1, buckets[best]);
  return {
    r: Math.round(sums[best * 3] / count),
    g: Math.round(sums[best * 3 + 1] / count),
    b: Math.round(sums[best * 3 + 2] / count),
  };
}

function colorDistanceSq(data, offset, bg) {
  const dr = data[offset] - bg.r;
  const dg = data[offset + 1] - bg.g;
  const db = data[offset + 2] - bg.b;
  return dr * dr + dg * dg + db * db;
}
