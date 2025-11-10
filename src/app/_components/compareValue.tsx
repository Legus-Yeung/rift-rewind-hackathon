"use client";

import React from "react";
import { ChevronUp, ChevronDown, Minus } from "lucide-react";

export interface CompareValueProps {
  value1: number;
  value2: number;
  format?: (n: number) => string;
  className?: string;
}

export function CompareValue({ value1, value2, format, className = "" }: CompareValueProps) {
  const fmt = format ?? ((n: number) => n.toLocaleString());

  const getColor = (a: number, b: number) =>
    a > b ? "text-green-400 font-semibold" : a < b ? "text-red-400 font-semibold" : "text-gray-400";

  const getIcon = (a: number, b: number) => {
    if (a > b) return <ChevronUp className="inline w-4 h-4 text-green-400" />;
    if (a < b) return <ChevronDown className="inline w-4 h-4 text-red-400" />;
    return <Minus className="inline w-4 h-4 text-gray-400" />;
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="flex items-center gap-1">
        <span className={getColor(value1, value2)}>{fmt(value1)}</span>
        {getIcon(value1, value2)}
      </div>

      <span className="text-muted-foreground text-sm">vs</span>

      <div className="flex items-center gap-1">
        <span className={getColor(value2, value1)}>{fmt(value2)}</span>
        {getIcon(value2, value1)}
      </div>
    </div>
  );
}
