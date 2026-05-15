"use client";

import { formatCHF } from "@/lib/utils";
import { MIN_ORDER, SHIPPING_COST, SHIPPING_THRESHOLD } from "@/data/products";

interface Props {
  subtotal: number;
  onSubmit: () => void;
}

export default function OrderBar({ subtotal, onSubmit }: Props) {
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const belowMin = subtotal > 0 && subtotal < MIN_ORDER;
  const canSubmit = subtotal >= MIN_ORDER;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 shadow-xl"
      style={{ backgroundColor: "white", borderTop: "1px solid #ded5d1" }}
    >
      <div className="max-w-lg mx-auto px-4 py-3">
        {belowMin && (
          <p className="text-xs text-center mb-2" style={{ color: "#bf7585" }}>
            Minimum de commande : {formatCHF(MIN_ORDER)} (encore {formatCHF(MIN_ORDER - subtotal)})
          </p>
        )}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3 text-sm">
              <span style={{ color: "#bba8a1" }}>Sous-total</span>
              <span className="font-semibold">{formatCHF(subtotal)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span style={{ color: "#bba8a1" }}>Port</span>
              <span className="font-semibold">
                {subtotal === 0
                  ? "—"
                  : shipping === 0
                  ? "Offert ✓"
                  : formatCHF(SHIPPING_COST)}
              </span>
            </div>
            {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
              <p className="text-[10px]" style={{ color: "#bba8a1" }}>
                Port offert dès {formatCHF(SHIPPING_THRESHOLD)}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide" style={{ color: "#bba8a1" }}>
              Total
            </p>
            <p className="text-xl font-bold" style={{ color: "#d598aa" }}>
              {formatCHF(total)}
            </p>
          </div>
        </div>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{
            backgroundColor: canSubmit ? "#d598aa" : "#ded5d1",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {subtotal === 0
            ? "Commencer la sélection"
            : !canSubmit
            ? `Minimum non atteint (${formatCHF(MIN_ORDER)})`
            : "Envoyer la commande →"}
        </button>
      </div>
    </div>
  );
}
