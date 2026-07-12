"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ComponentType,
} from "react";
import dynamic from "next/dynamic";

// ─── Dynamically imported chart components (async chunk) ─────────────────────
const LineChart = dynamic(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((m) => ({ default: m.Line as unknown as ComponentType<any> })),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((m) => ({ default: m.Bar as unknown as ComponentType<any> })),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => ({ default: m.XAxis as unknown as ComponentType<any> })),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => ({ default: m.YAxis as unknown as ComponentType<any> })),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => ({ default: m.CartesianGrid as unknown as ComponentType<any> })),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => ({ default: m.Tooltip as unknown as ComponentType<any> })),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);

export const Charts = {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} as const;

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="skeleton rounded-lg w-full"
      style={{ height }}
      aria-hidden="true"
    />
  );
}

interface LazyChartProps {
  height?: number;
  children: (charts: typeof Charts) => ReactNode;
}

export function LazyChart({ height = 200, children }: LazyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: height }}>
      {visible ? children(Charts) : <ChartSkeleton height={height} />}
    </div>
  );
}
