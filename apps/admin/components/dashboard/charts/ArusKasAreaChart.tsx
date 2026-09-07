"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

export interface MonthlyCashFlowItem {
  monthKey: string;
  monthLabel: string;
  masuk: number;
  keluar: number;
}

interface ArusKasAreaChartProps {
  data: MonthlyCashFlowItem[];
}

export function ArusKasAreaChart({ data }: ArusKasAreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        Belum ada data riwayat transaksi kas 6 bulan terakhir.
      </div>
    );
  }

  // Calculate scales and coordinates safely
  const chartHeight = 220;
  const chartWidth = 560;
  const paddingLeft = 60;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 40;

  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.masuk, d.keluar)),
    1000000
  );

  // Ceiling to a neat round number
  const roundFactor = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const yAxisMax = Math.ceil(maxVal / roundFactor) * roundFactor;

  // Grid steps (3 steps: 0, 50%, 100%)
  const yTicks = [0, yAxisMax * 0.5, yAxisMax];

  // Coordinates calculation for smooth curves
  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + usableWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * usableWidth;
  };

  const getY = (value: number) => {
    const safeVal = Math.max(0, isNaN(value) ? 0 : value);
    const ratio = safeVal / (yAxisMax || 1);
    return paddingTop + usableHeight - ratio * usableHeight;
  };

  // Monotone cubic bezier path builder for smooth curve
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0]!.x},${points[0]!.y}`;

    let path = `M ${points[0]!.x},${points[0]!.y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1]! : points[i]!;
      const p1 = points[i]!;
      const p2 = points[i + 1]!;
      const p3 = i != points.length - 2 ? points[i + 2]! : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(
        1
      )},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const pointsMasuk = data.map((d, i) => ({ x: getX(i), y: getY(d.masuk) }));
  const pointsKeluar = data.map((d, i) => ({ x: getX(i), y: getY(d.keluar) }));

  const pathMasuk = createSmoothPath(pointsMasuk);
  const pathKeluar = createSmoothPath(pointsKeluar);

  const bottomY = paddingTop + usableHeight;
  const areaMasuk = `${pathMasuk} L ${getX(data.length - 1)},${bottomY} L ${getX(
    0
  )},${bottomY} Z`;
  const areaKeluar = `${pathKeluar} L ${getX(data.length - 1)},${bottomY} L ${getX(
    0
  )},${bottomY} Z`;

  const total6BulanMasuk = data.reduce((acc, c) => acc + c.masuk, 0);
  const total6BulanKeluar = data.reduce((acc, c) => acc + c.keluar, 0);

  const activeItem =
    hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold" />
            Arus Kas Sosial: Iuran vs Santunan Duka
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbandingan dana masuk (iuran warga & donasi) dan dana keluar (santunan lelayu) 6 bulan terakhir
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gold inline-block" />
            <span className="text-slate-700">Dana Masuk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-siri inline-block" />
            <span className="text-slate-700">Dana Keluar</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto max-h-[260px] min-w-[480px] overflow-visible select-none"
        >
          <defs>
            {/* Gradient Masuk (Red Gold) */}
            <linearGradient id="area-grad-masuk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DC2626" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#DC2626" stopOpacity={0.0} />
            </linearGradient>

            {/* Gradient Keluar (Siri Dark Red) */}
            <linearGradient id="area-grad-keluar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#991B1B" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#991B1B" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  {tick >= 1000000
                    ? `${(tick / 1000000).toFixed(tick % 1000000 === 0 ? 0 : 1)} Jt`
                    : tick.toLocaleString("id-ID")}
                </text>
              </g>
            );
          })}

          {/* Filled Area Charts */}
          <path d={areaMasuk} fill="url(#area-grad-masuk)" />
          <path d={areaKeluar} fill="url(#area-grad-keluar)" />

          {/* Smooth Curves */}
          <path
            d={pathMasuk}
            fill="none"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathKeluar}
            fill="none"
            stroke="#991B1B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Guides & Data Points */}
          {data.map((item, idx) => {
            const x = getX(idx);
            const ptMasuk = pointsMasuk[idx]!;
            const ptKeluar = pointsKeluar[idx]!;
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={item.monthKey}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Transparent hover hit-box */}
                <rect
                  x={x - usableWidth / (data.length * 2)}
                  y={paddingTop}
                  width={usableWidth / data.length}
                  height={usableHeight}
                  fill="transparent"
                />

                {/* Vertical hover line indicator */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={bottomY}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Data Points */}
                <circle
                  cx={ptMasuk.x}
                  cy={ptMasuk.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#DC2626"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />
                <circle
                  cx={ptKeluar.x}
                  cy={ptKeluar.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#991B1B"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* X Axis Labels */}
                <text
                  x={x}
                  y={bottomY + 20}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold transition-colors ${
                    isHovered ? "fill-slate-900 font-bold" : "fill-slate-500"
                  }`}
                >
                  {item.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Minimalist Floating Tooltip on Hover */}
        {activeItem && hoveredIndex !== null && (
          <div
            className="absolute top-2 pointer-events-none transition-all duration-150 z-30"
            style={{
              left: `${Math.min(
                Math.max(10, (getX(hoveredIndex) / chartWidth) * 100),
                85
              )}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-elevated p-3 text-xs min-w-[170px] space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
              <p className="font-bold text-slate-900 text-[11px] pb-1 border-b border-slate-100">
                Bulan: {activeItem.monthLabel}
              </p>
              <div className="flex items-center justify-between text-emerald-600 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  Masuk:
                </span>
                <span className="font-bold">
                  +{formatRupiah(activeItem.masuk)}
                </span>
              </div>
              <div className="flex items-center justify-between text-rose-600 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-siri" />
                  Keluar:
                </span>
                <span className="font-bold">
                  -{formatRupiah(activeItem.keluar)}
                </span>
              </div>
              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>Selisih:</span>
                <span
                  className={`font-semibold ${
                    activeItem.masuk - activeItem.keluar >= 0
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  {formatRupiah(activeItem.masuk - activeItem.keluar)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics 6-Bulan */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 block">
            Total Iuran/Masuk (6 Bln)
          </span>
          <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            {formatRupiah(total6BulanMasuk)}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block">
            Total Santunan/Keluar (6 Bln)
          </span>
          <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            {formatRupiah(total6BulanKeluar)}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 block">
            Status Kas Siaga
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs mt-0.5">
            Kondisi Likuid Aman
          </span>
        </div>
      </div>
    </div>
  );
}
