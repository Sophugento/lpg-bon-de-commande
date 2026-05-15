"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import ProductRow from "./ProductRow";

interface Props {
  category: string;
  products: Product[];
  quantities: Record<string, number>;
  onChange: (ref: string, qty: number) => void;
}

function groupBySubcategory(products: Product[]): Record<string, Product[]> {
  return products.reduce(
    (acc, p) => {
      if (!acc[p.subcategory]) acc[p.subcategory] = [];
      acc[p.subcategory].push(p);
      return acc;
    },
    {} as Record<string, Product[]>
  );
}

export default function CategorySection({ category, products, quantities, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const grouped = groupBySubcategory(products);
  const activeCount = products.filter((p) => (quantities[p.ref] || 0) > 0).length;

  return (
    <div className="mb-3 rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "#ded5d1" }}>
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm tracking-wide uppercase" style={{ color: "#2d2020" }}>
            {category}
          </span>
          {activeCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
              style={{ backgroundColor: "#d598aa" }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <span style={{ color: "#d598aa", fontSize: "18px", lineHeight: 1 }}>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="bg-white/50">
          {Object.entries(grouped).map(([sub, prods]) => (
            <div key={sub}>
              {sub !== category && (
                <div
                  className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#bba8a1", backgroundColor: "#f7f4f3" }}
                >
                  {sub}
                </div>
              )}
              {prods.map((p) => (
                <ProductRow
                  key={p.ref}
                  product={p}
                  qty={quantities[p.ref] || 0}
                  onChange={onChange}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
