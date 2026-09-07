"use client";

import { useState } from "react";
import { MapPin, Info } from "lucide-react";

export interface SektorDistributionItem {
  sektor: string;
  count: number;
  percentage: number;
  jiwa: number;
}

interface SektorDistributionChartProps {
  data: SektorDistributionItem[];
  totalWarga: number;
}

export function SektorDistributionChart({
  data,
  totalWarga,
}: SektorDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        Belum ada data persebaran domisili warga.
      </div>
    );
  }

  // Find max count to scale visual progress bars accurately
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-dark" />
            Sebaran Wilayah Domisili di Timika
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Konsentrasi kepala keluarga (KK) per distrik & sektor di Kabupaten Mimika
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
          {totalWarga} Kepala Keluarga Terdata
        </span>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-3.5 pt-1">
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const barWidthPercent = Math.min(
            100,
            Math.max(4, Math.round((item.count / maxCount) * 100))
          );

          return (
            <div
              key={item.sektor}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Row Header: Name and Counts */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800 group-hover:text-sky-dark transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky transition-colors" />
                  {item.sektor}
                </span>

                <div className="flex items-center gap-2.5 font-mono">
                  <span className="font-bold text-slate-900">
                    {item.count} KK
                  </span>
                  <span className="text-[11px] font-semibold text-sky-dark bg-sky-light/70 px-2 py-0.5 rounded-md min-w-[42px] text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    index === 0
                      ? "bg-gradient-to-r from-sky via-sky-dark to-sky-dark"
                      : "bg-sky group-hover:bg-sky-dark"
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Interactive Tooltip Card on Hover */}
              {isHovered && (
                <div className="absolute left-1/2 -top-12 -translate-x-1/2 z-20 px-3 py-1.5 bg-slate-900 text-white rounded-lg shadow-elevated text-[11px] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2">
                  <span className="font-semibold">{item.sektor}:</span>
                  <span className="text-sky-light">{item.count} KK</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-amber-300">~{item.jiwa} Jiwa</span>
                  <span className="text-slate-400">•</span>
                  <span>{item.percentage}% dari total</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Sektor dominan perantau:{" "}
          <strong className="text-slate-800">{data[0]?.sektor || "-"}</strong>
        </span>
        <span className="text-[11px] text-slate-400">
          Diperbarui secara real-time
        </span>
      </div>
    </div>
  );
}
