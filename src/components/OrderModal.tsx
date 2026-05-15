"use client";

import { useState } from "react";
import { Product, Offer, SHIPPING_COST, SHIPPING_THRESHOLD } from "@/data/products";
import { calcPromo, formatCHF } from "@/lib/utils";

interface ContactInfo {
  firstName: string;
  lastName: string;
  studio: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  notes: string;
}

interface Props {
  onClose: () => void;
  products: Product[];
  offers: Offer[];
  quantities: Record<string, number>;
  offerQtys: Record<string, number>;
  subtotal: number;
}

export default function OrderModal({
  onClose,
  products,
  offers,
  quantities,
  offerQtys,
  subtotal,
}: Props) {
  const [contact, setContact] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    studio: "",
    address: "",
    postalCode: "",
    city: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const selectedProducts = products.filter((p) => (quantities[p.ref] || 0) > 0);
  const selectedOffers = offers.filter((o) => (offerQtys[o.id] || 0) > 0);

  function update(field: keyof ContactInfo, val: string) {
    setContact((c) => ({ ...c, [field]: val }));
  }

  const isValid =
    contact.firstName.trim() &&
    contact.lastName.trim() &&
    contact.email.trim() &&
    contact.address.trim() &&
    contact.postalCode.trim() &&
    contact.city.trim();

  async function handleSubmit() {
    if (!isValid) return;
    setStatus("sending");

    const orderLines = [
      ...selectedOffers.map((o) => ({
        ref: o.id,
        name: o.nameFr,
        type: "offre",
        size: "",
        qty: offerQtys[o.id],
        unitPrice: o.price,
        freeQty: 0,
        lineTotal: offerQtys[o.id] * o.price,
      })),
      ...selectedProducts.map((p) => {
        const qty = quantities[p.ref];
        const { paid, free } = calcPromo(qty);
        return {
          ref: p.ref,
          name: p.nameFr,
          type: p.type,
          size: p.size,
          qty,
          unitPrice: p.price,
          freeQty: free,
          lineTotal: paid * p.price,
        };
      }),
    ];

    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, orderLines, subtotal, shipping, total }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Erreur inconnue");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <ModalShell onClose={onClose}>
        <div className="text-center py-8 px-6">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold mb-2">Commande envoyée !</h2>
          <p className="text-sm" style={{ color: "#bba8a1" }}>
            Votre commande a été transmise à LPG Switzerland. Vous recevrez une confirmation par
            email.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 rounded-xl text-white text-sm font-semibold"
            style={{ backgroundColor: "#d598aa" }}
          >
            Fermer
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: "#ded5d1" }}>
          <h2 className="text-lg font-semibold">Finaliser la commande</h2>
          <p className="text-xs mt-0.5" style={{ color: "#bba8a1" }}>
            Vos coordonnées
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom *" value={contact.firstName} onChange={(v) => update("firstName", v)} />
            <Field label="Nom *" value={contact.lastName} onChange={(v) => update("lastName", v)} />
          </div>
          <Field label="Studio / Cabinet" value={contact.studio} onChange={(v) => update("studio", v)} />
          <Field label="Adresse *" value={contact.address} onChange={(v) => update("address", v)} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="NPA *" value={contact.postalCode} onChange={(v) => update("postalCode", v)} />
            <div className="col-span-2">
              <Field label="Ville *" value={contact.city} onChange={(v) => update("city", v)} />
            </div>
          </div>
          <Field label="Email *" type="email" value={contact.email} onChange={(v) => update("email", v)} />
          <Field label="Téléphone" type="tel" value={contact.phone} onChange={(v) => update("phone", v)} />

          {/* Récapitulatif */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "#ded5d1" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#bba8a1" }}>
              Récapitulatif
            </p>
            <div className="space-y-1">
              {selectedOffers.map((o) => (
                <div key={o.id} className="flex justify-between text-xs">
                  <span className="flex-1 truncate pr-2">{o.nameFr} ×{offerQtys[o.id]}</span>
                  <span className="font-medium">{formatCHF(offerQtys[o.id] * o.price)}</span>
                </div>
              ))}
              {selectedProducts.map((p) => {
                const qty = quantities[p.ref];
                const { paid, free } = calcPromo(qty);
                return (
                  <div key={p.ref} className="flex justify-between text-xs">
                    <span className="flex-1 truncate pr-2">
                      {p.nameFr} ×{qty}
                      {free > 0 && (
                        <span style={{ color: "#d598aa" }}> (+{free})</span>
                      )}
                    </span>
                    <span className="font-medium">{formatCHF(paid * p.price)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t space-y-1" style={{ borderColor: "#ded5d1" }}>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#bba8a1" }}>Sous-total</span>
                <span>{formatCHF(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#bba8a1" }}>Frais de port</span>
                <span>{shipping === 0 ? "Offerts" : formatCHF(SHIPPING_COST)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold mt-1">
                <span>Total</span>
                <span style={{ color: "#d598aa" }}>{formatCHF(total)}</span>
              </div>
            </div>
          </div>

          <Field
            label="Remarques / Notes"
            value={contact.notes}
            onChange={(v) => update("notes", v)}
            multiline
          />
        </div>

        {status === "error" && (
          <p className="px-5 py-2 text-xs text-center" style={{ color: "#bf7585" }}>
            Erreur : {errorMsg}
          </p>
        )}

        <div className="px-5 py-4 border-t" style={{ borderColor: "#ded5d1" }}>
          <button
            onClick={handleSubmit}
            disabled={!isValid || status === "sending"}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity"
            style={{
              backgroundColor: isValid && status === "idle" ? "#d598aa" : "#ded5d1",
              cursor: isValid && status === "idle" ? "pointer" : "not-allowed",
            }}
          >
            {status === "sending" ? "Envoi en cours…" : "Confirmer la commande"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#d598aa] transition-colors";
  const style = { borderColor: "#ded5d1", backgroundColor: "white" };
  return (
    <div>
      <label className="text-xs font-medium block mb-1" style={{ color: "#bba8a1" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={cls}
          style={style}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          style={style}
        />
      )}
    </div>
  );
}

function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "rgba(45,32,32,0.4)" }}>
      <div
        className="flex-1 mt-12 rounded-t-3xl flex flex-col overflow-hidden"
        style={{ backgroundColor: "#f7f4f3", maxHeight: "calc(100vh - 48px)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl font-bold"
          aria-label="Fermer"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
