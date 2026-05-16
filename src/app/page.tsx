"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, OFFERS, CATEGORIES } from "@/data/products";
import { calcPromo } from "@/lib/utils";
import { TRANSLATIONS, Lang } from "@/lib/i18n";
import CategorySection from "@/components/CategorySection";
import OfferRow from "@/components/OfferRow";
import OrderBar from "@/components/OrderBar";
import OrderModal from "@/components/OrderModal";

export default function Home() {
  const [lang, setLang] = useState<Lang>("fr");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [offerQtys, setOfferQtys] = useState<Record<string, number>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const t = TRANSLATIONS[lang];

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
      const { paid } = p.promoEligible ? calcPromo(qty) : { paid: qty };
      return sum + paid * p.price;
    }, 0);
    const offerTotal = OFFERS.reduce(
      (sum, o) => sum + (offerQtys[o.id] || 0) * o.price,
      0
    );
    return Math.round((productTotal + offerTotal) * 100) / 100;
  }, [quantities, offerQtys]);

  const categorizedProducts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = PRODUCTS.filter((p) => p.category === cat);
      return acc;
    }, {} as Record<string, typeof PRODUCTS>);
  }, []);

  return (
    <main className="min-h-screen pb-52">
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm"
        style={{ backgroundColor: "white", borderBottom: "1px solid #ded5d1" }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#d598aa" }}>
            {t.brand}
          </p>
          <h1 className="text-base font-bold leading-tight" style={{ color: "#2d2020" }}>
            {t.title}
          </h1>
        </div>
        {/* Toggle langue */}
        <div
          className="flex rounded-lg overflow-hidden border text-xs font-semibold"
          style={{ borderColor: "#ded5d1" }}
        >
          <button
            onClick={() => setLang("fr")}
            className="px-3 py-1.5 transition-colors"
            style={{
              backgroundColor: lang === "fr" ? "#d598aa" : "white",
              color: lang === "fr" ? "white" : "#bba8a1",
            }}
          >
            FR
          </button>
          <button
            onClick={() => setLang("de")}
            className="px-3 py-1.5 transition-colors"
            style={{
              backgroundColor: lang === "de" ? "#d598aa" : "white",
              color: lang === "de" ? "white" : "#bba8a1",
            }}
          >
            DE
          </button>
        </div>
      </header>

      {/* Règles */}
      <div
        className="mx-4 mt-4 mb-3 rounded-xl p-3 text-xs space-y-1"
        style={{ backgroundColor: "#f0cad620", border: "1px solid #f0cad6" }}
      >
        <p className="font-bold" style={{ color: "#bf7585" }}>
          {t.rulesTitle}
        </p>
        <p style={{ color: "#8a5565" }}>
          • {t.ruleMin} <strong>250 CHF</strong> {t.priceNote}
        </p>
        <p style={{ color: "#8a5565" }}>
          • {t.ruleShipping} <strong>20 CHF</strong> {t.ruleShippingDetail}
        </p>
        <p style={{ color: "#8a5565" }}>• {t.rulePromo}</p>
        <p style={{ color: "#8a5565" }}>• {t.ruleMinQty}</p>
        <p className="pt-1 font-semibold" style={{ color: "#bf7585" }}>
          ⚠️ {t.htNote}
        </p>
      </div>

      <div className="px-4">
        {/* Offres spéciales */}
        <div className="mb-3 rounded-2xl overflow-hidden border" style={{ borderColor: "#d598aa40" }}>
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ backgroundColor: "#d598aa15" }}
          >
            <span className="font-bold text-sm tracking-wide uppercase" style={{ color: "#d598aa" }}>
              🎁 {t.offresSpeciales}
            </span>
          </div>
          <div className="px-3 py-3" style={{ backgroundColor: "#f7f4f3" }}>
            {OFFERS.map((offer) => (
              <OfferRow
                key={offer.id}
                offer={offer}
                qty={offerQtys[offer.id] || 0}
                onChange={updateOfferQty}
                t={t}
                lang={lang}
              />
            ))}
          </div>
        </div>

        {/* Catégories produits */}
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            products={categorizedProducts[cat]}
            quantities={quantities}
            onChange={updateQty}
            t={t}
            lang={lang}
          />
        ))}
      </div>

      <OrderBar subtotal={subtotal} onSubmit={() => setModalOpen(true)} t={t} />

      {modalOpen && (
        <OrderModal
          onClose={() => setModalOpen(false)}
          products={PRODUCTS}
          offers={OFFERS}
          quantities={quantities}
          offerQtys={offerQtys}
          subtotal={subtotal}
          t={t}
          lang={lang}
        />
      )}
    </main>
  );
}
