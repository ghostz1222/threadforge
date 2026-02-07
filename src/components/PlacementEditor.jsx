import { useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function PlacementEditor({ design, value, onChange }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) {
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 320,
      height: 260,
      backgroundColor: "#12171c",
      selection: false,
    });

    canvas.add(
      new fabric.Rect({
        left: 80,
        top: 30,
        width: 160,
        height: 200,
        fill: "#1b222a",
        rx: 12,
        ry: 12,
        selectable: false,
      }),
    );

    fabricRef.current = canvas;
    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) {
      return;
    }

    const old = canvas.getObjects().find((obj) => obj.data?.role === "design");
    if (old) {
      canvas.remove(old);
    }

    if (!design?.preview) {
      canvas.renderAll();
      return;
    }

    fabric.Image.fromURL(
      design.preview,
      (img) => {
        img.set({
          data: { role: "design" },
          left: 160,
          top: 122 + (value?.y ?? 0),
          originX: "center",
          originY: "center",
          scaleX: 0.35 + (value?.scale ?? 20) / 100,
          scaleY: 0.35 + (value?.scale ?? 20) / 100,
          selectable: false,
        });
        canvas.add(img);
        canvas.renderAll();
      },
      { crossOrigin: "anonymous" },
    );
  }, [design, value?.scale, value?.y]);

  return (
    <div className="rounded-xl border border-white/10 bg-coal-900 p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Placement editor (Fabric.js)</p>
      <canvas ref={canvasRef} className="w-full rounded-md border border-white/10" />
      <div className="mt-3 space-y-3">
        <label className="block text-xs text-white/80">
          Scale
          <input
            type="range"
            min={-20}
            max={60}
            value={value.scale}
            onChange={(event) => onChange({ ...value, scale: Number(event.target.value) })}
            className="mt-1 w-full accent-ember-500"
          />
        </label>
        <label className="block text-xs text-white/80">
          Vertical position
          <input
            type="range"
            min={-40}
            max={60}
            value={value.y}
            onChange={(event) => onChange({ ...value, y: Number(event.target.value) })}
            className="mt-1 w-full accent-ember-500"
          />
        </label>
      </div>
    </div>
  );
}
