"use client";

import { Offer } from "@/data/products";
import { formatCHF } from "@/lib/utils";
import QuantitySelector from "./QuantitySelector";

interface Props {
  offer: Offer;
  qty: number;
  onChange: (id: string, qty: number) => void;
}

export default function OfferRow({ offer, qty, onChange }: Props) {
  return (
    <div
      className={`py-3 border-b last:border-b-0 transition-colors ${qty > 0 ? "bg-white/60" : ""}`}
      style={{ borderColor: "#ded5d1" }}
    >
      <div className="flex items-start gap-3 px-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">{offer.nameFr}</p>
          <p className="text-xs mt-0.5" style={{ color: "#bba8a1" }}>
            {offer.description}
          </p>
          <p className="text-xs mt-1 font-medium" style={{ color: "#d598aa" }}>
            🎁 {offer.gift}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-sm font-bold">{formatCHF(offer.price)}</p>
          <QuantitySelector value={qty} onChange={(v) => onChange(offer.id, v)} />
          {qty > 0 && (
            <p className="text-xs font-semibold" style={{ color: "#d598aa" }}>
              = {formatCHF(qty * offer.price)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
