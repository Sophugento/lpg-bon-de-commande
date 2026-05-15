"use client";

import { Product } from "@/data/products";
import { calcPromo, formatCHF } from "@/lib/utils";
import QuantitySelector from "./QuantitySelector";

interface Props {
  product: Product;
  qty: number;
  onChange: (ref: string, qty: number) => void;
}

const TYPE_LABEL: Record<string, string> = {
  revente: "Revente",
  professionnel: "Pro",
  recharge: "Recharge",
};

const TYPE_COLOR: Record<string, string> = {
  revente: "#d598aa",
  professionnel: "#bba8a1",
  recharge: "#bba8a1",
};

export default function ProductRow({ product, qty, onChange }: Props) {
  const { paid, free } = calcPromo(qty);
  const lineTotal = paid * product.price;
  const hasPromo = free > 0;
  const showMinWarning =
    product.promoEligible && qty > 0 && qty < 3;

  return (
    <div
      className={`py-3 border-b last:border-b-0 transition-colors ${
        qty > 0 ? "bg-white/60" : ""
      }`}
      style={{ borderColor: "#ded5d1" }}
    >
      <div className="flex items-start gap-3 px-4">
        {/* Info produit */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: TYPE_COLOR[product.type] + "20",
                color: TYPE_COLOR[product.type],
              }}
            >
              {TYPE_LABEL[product.type]}
            </span>
            <span className="text-[10px] text-lpg-secondary font-mono">{product.ref}</span>
          </div>
          <p className="text-sm font-semibold mt-0.5 leading-tight">{product.nameFr}</p>
          {product.size && (
            <p className="text-xs text-lpg-secondary mt-0.5">{product.size}</p>
          )}
          {hasPromo && (
            <p className="text-xs mt-1 font-medium" style={{ color: "#d598aa" }}>
              🎁 +{free} offert{free > 1 ? "s" : ""} ({qty > 9 ? "10+2" : "6+1"})
            </p>
          )}
          {showMinWarning && (
            <p className="text-xs mt-1" style={{ color: "#bf7585" }}>
              Min. 3 pièces requis
            </p>
          )}
        </div>

        {/* Prix + Qty */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold" style={{ color: qty > 0 ? "#2d2020" : "#bba8a1" }}>
              {formatCHF(product.price)}
            </p>
            {product.retailPrice && (
              <p className="text-[10px]" style={{ color: "#bba8a1" }}>
                Vente : {formatCHF(product.retailPrice)}
              </p>
            )}
          </div>
          <QuantitySelector
            value={qty}
            onChange={(v) => onChange(product.ref, v)}
          />
          {qty > 0 && (
            <p className="text-xs font-semibold" style={{ color: "#d598aa" }}>
              = {formatCHF(lineTotal)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
