"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, OFFERS, CATEGORIES } from "@/data/products";
import { calcPromo } from "@/lib/utils";
import CategorySection from "@/components/CategorySection";
import OfferRow from "@/components/OfferRow";
import OrderBar from "@/components/OrderBar";
import OrderModal from "@/components/OrderModal";

export default function Home() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [offerQtys, setOfferQtys] = useState<Record<string, number>>({});
  const [modalOpen, setModalOpen] = useState(false);

  function updateQty(ref: string, qty: number) {
    setQuantities((q) => ({ ...q, [ref]: qty }));
  }

  function updateOfferQty(id: string, qty: number) {
    setOfferQtys((q) => ({ ...q, [id]: qty }));
  }

  const subtotal = useMemo(() => {
    const productTotal = PRODUCTS.reduce((sum, p) => {
      const qty = quantities[p.ref] || 0;
      if (qty === 0) return sum;
      const { paid } = calcPromo(qty);
      return sum + paid * p.price;
    }, 0);
    const offerTotal = OFFERS.reduce((sum, o) => {
      return sum + (offerQtys[o.id] || 0) * o.price;
    }, 0);
    return Math.round((productTotal + offerTotal) * 100) / 100;
  }, [quantities, offerQtys]);

  const categorizedProducts = useMemo(() => {
    return CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat] = PRODUCTS.filter((p) => p.category === cat);
        return acc;
      },
      {} as Record<string, typeof PRODUCTS>
    );
  }, []);

  return (
    <main className="min-h-screen pb-36">
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3 shadow-sm"
        style={{ backgroundColor: "white", borderBottom: "1px solid #ded5d1" }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "#d598aa" }}>
            LPG Switzerland
          </p>
          <h1 className="text-base font-bold leading-tight" style={{ color: "#2d2020" }}>
            Bon de commande 2026
          </h1>
        </div>
      </header>

      {/* Règles */}
      <div
        className="mx-4 mt-4 mb-3 rounded-xl p-3 text-xs space-y-1"
        style={{ backgroundColor: "#f0cad620", border: "1px solid #f0cad6" }}
      >
        <p className="font-semibold" style={{ color: "#bf7585" }}>
          Conditions de commande
        </p>
        <p style={{ color: "#8a5565" }}>
          • Minimum de commande : <strong>250 CHF</strong> netto
        </p>
        <p style={{ color: "#8a5565" }}>
          • Frais de port : <strong>20 CHF</strong> — offerts dès 400 CHF netto
        </p>
        <p style={{ color: "#8a5565" }}>
          • Produits revente : <strong>6 achetés = 1 offert</strong> · <strong>10 = +2 offerts</strong>
        </p>
        <p style={{ color: "#8a5565" }}>
          • Min. <strong>3 pièces</strong> du même produit (revente)
        </p>
      </div>

      <div className="px-4 space-y-1">
        {/* Offres spéciales */}
        <div className="mb-3 rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "#d598aa40" }}>
          <div
            className="px-4 py-3.5 flex items-center gap-2"
            style={{ backgroundColor: "#d598aa15" }}
          >
            <span className="font-semibold text-sm tracking-wide uppercase" style={{ color: "#d598aa" }}>
              🎁 Offres Spéciales
            </span>
          </div>
          <div className="bg-white/50">
            {OFFERS.map((offer) => (
              <OfferRow
                key={offer.id}
                offer={offer}
                qty={offerQtys[offer.id] || 0}
                onChange={updateOfferQty}
              />
            ))}
          </div>
        </div>

        {/* Catégories */}
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            products={categorizedProducts[cat]}
            quantities={quantities}
            onChange={updateQty}
          />
        ))}
      </div>

      {/* Barre de commande */}
      <OrderBar subtotal={subtotal} onSubmit={() => setModalOpen(true)} />

      {/* Modal confirmation */}
      {modalOpen && (
        <OrderModal
          onClose={() => setModalOpen(false)}
          products={PRODUCTS}
          offers={OFFERS}
          quantities={quantities}
          offerQtys={offerQtys}
          subtotal={subtotal}
        />
      )}
    </main>
  );
}
