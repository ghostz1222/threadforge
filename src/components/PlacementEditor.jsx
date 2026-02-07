import { useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function PlacementEditor({ design, value, onChange }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 280,
      height: 240,
      backgroundColor: "#0f1318",
      selection: false,
    });

    canvas.add(
      new fabric.Rect({
        left: 60,
        top: 20,
        width: 160,
        height: 200,
        fill: "#171d24",
        rx: 10,
        ry: 10,
        selectable: false,
        stroke: "rgba(255,255,255,0.04)",
        strokeWidth: 1,
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
    if (!canvas) return;

    const old = canvas.getObjects().find((obj) => obj.data?.role === "design");
    if (old) canvas.remove(old);

    if (!design?.preview) {
      canvas.renderAll();
      return;
    }

    fabric.Image.fromURL(
      design.preview,
      (img) => {
        img.set({
          data: { role: "design" },
          left: 140,
          top: 112 + (value?.y ?? 0),
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
    <div className="rounded-xl border border-white/[0.06] bg-coal-900/50 p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Placement editor</p>
      <canvas ref={canvasRef} className="w-full rounded-lg border border-white/[0.04]" />
      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="flex items-center justify-between text-[11px] text-white/50">
            <span>Scale</span>
            <span className="font-mono">{value.scale}%</span>
          </span>
          <input
            type="range"
            min={-20}
            max={60}
            value={value.scale}
            onChange={(event) => onChange({ ...value, scale: Number(event.target.value) })}
            className="mt-2 w-full"
          />
        </label>
        <label className="block">
          <span className="flex items-center justify-between text-[11px] text-white/50">
            <span>Vertical position</span>
            <span className="font-mono">{value.y}</span>
          </span>
          <input
            type="range"
            min={-40}
            max={60}
            value={value.y}
            onChange={(event) => onChange({ ...value, y: Number(event.target.value) })}
            className="mt-2 w-full"
          />
        </label>
      </div>
    </div>
  );
}
