"use client";

import { useState, useMemo, useEffect } from "react";
import { calcPromo } from "@/lib/utils";
import { TRANSLATIONS, Lang } from "@/lib/i18n";
import CategorySection from "@/components/CategorySection";
import OfferRow from "@/components/OfferRow";
import OrderBar from "@/components/OrderBar";
import OrderModal from "@/components/OrderModal";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Catalog } from "@/lib/catalog";

interface Props {
  catalog: Catalog;
}

export default function OrderForm({ catalog }: Props) {
  const { products, offers, productInfo } = catalog;

  const [lang, setLang] = useState<Lang>("fr");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [offerQtys, setOfferQtys] = useState<Record<string, number>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [freeQuantities, setFreeQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("lpg_admin") === "1");
  }, []);

  const t = TRANSLATIONS[lang];

  function updateQty(ref: string, qty: number) {
    setQuantities((q) => ({ ...q, [ref]: qty }));
  }

  function updateOfferQty(id: string, qty: number) {
    setOfferQtys((q) => ({ ...q, [id]: qty }));
  }

  function handleAdminLogin() {
    sessionStorage.setItem("lpg_admin", "1");
    setIsAdmin(true);
    setShowAdminLogin(false);
  }

  function handleAdminLogout() {
    sessionStorage.removeItem("lpg_admin");
    setIsAdmin(false);
    setFreeQuantities({});
  }

  function updateFreeQty(ref: string, qty: number) {
    setFreeQuantities((q) => ({ ...q, [ref]: qty }));
  }

  const subtotal = useMemo(() => {
    const productTotal = products.reduce((sum, p) => {
      const qty = quantities[p.ref] || 0;
      if (qty === 0) return sum;
      const paid = isAdmin || !p.promoEligible ? qty : calcPromo(qty).paid;
      return sum + paid * p.price;
    }, 0);
    const offerTotal = offers.reduce(
      (sum, o) => sum + (offerQtys[o.id] || 0) * o.price,
      0
    );
    return Math.round((productTotal + offerTotal) * 100) / 100;
  }, [quantities, offerQtys, products, offers, isAdmin]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const categorizedProducts = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat] = products.filter((p) => p.category === cat);
      return acc;
    }, {} as Record<string, typeof products>);
  }, [categories, products]);

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
        <div className="flex items-center">
          <button
            onClick={() => isAdmin ? handleAdminLogout() : setShowAdminLogin(true)}
            className="mr-2 w-7 h-7 flex items-center justify-center rounded-full text-sm transition-colors"
            style={{ backgroundColor: isAdmin ? "#2d2020" : "transparent", color: isAdmin ? "white" : "#bba8a1" }}
            title={isAdmin ? "Déconnexion admin" : "Accès admin"}
          >
            🔑
          </button>
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
        </div>
      </header>

      {isAdmin && (
        <div className="mx-4 mt-4 rounded-xl px-3 py-2 flex items-center justify-between text-xs" style={{ backgroundColor: "#2d2020", color: "white" }}>
          <span className="font-semibold">🔑 Mode Admin — Quantités manuelles activées</span>
          <button onClick={handleAdminLogout} className="underline opacity-70">Déconnexion</button>
        </div>
      )}

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
        {!isAdmin && <p style={{ color: "#8a5565" }}>• {t.rulePromo}</p>}
        {!isAdmin && <p style={{ color: "#8a5565" }}>• {t.ruleMinQty}</p>}
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
            {offers.map((offer) => (
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
        {categories.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            products={categorizedProducts[cat]}
            quantities={quantities}
            onChange={updateQty}
            t={t}
            lang={lang}
            productInfo={productInfo}
            isAdmin={isAdmin}
            freeQuantities={freeQuantities}
            onFreeQtyChange={updateFreeQty}
          />
        ))}
      </div>

      <OrderBar subtotal={subtotal} onSubmit={() => setModalOpen(true)} t={t} />

      {modalOpen && (
        <OrderModal
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); setQuantities({}); setOfferQtys({}); }}
          products={products}
          offers={offers}
          quantities={quantities}
          offerQtys={offerQtys}
          subtotal={subtotal}
          t={t}
          lang={lang}
          isAdmin={isAdmin}
          freeQuantities={freeQuantities}
        />
      )}

      {showAdminLogin && (
        <AdminLoginModal onSuccess={handleAdminLogin} onClose={() => setShowAdminLogin(false)} />
      )}
    </main>
  );
}
