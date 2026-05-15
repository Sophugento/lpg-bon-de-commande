import { NextRequest, NextResponse } from "next/server";

interface OrderLine {
  ref: string;
  name: string;
  type: string;
  size: string;
  qty: number;
  unitPrice: number;
  freeQty: number;
  lineTotal: number;
}

interface Address {
  company: string;
  address: string;
  postalCode: string;
  city: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  notes: string;
  sameDelivery: boolean;
}

interface OrderPayload {
  contact: ContactInfo;
  deliveryAddress: Address;
  orderLines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  lang: "fr" | "de";
}

function chf(n: number) {
  return n.toFixed(2).replace(".", ",") + " CHF";
}

function buildHtml(payload: OrderPayload): string {
  const { contact, deliveryAddress, orderLines, subtotal, shipping, total, lang } = payload;
  const date = new Date().toLocaleDateString(lang === "de" ? "de-CH" : "fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const labels = {
    fr: { title: "Bon de commande", date: `Date : ${date}`, coord: "Coordonnées", delivery: "Adresse de livraison", order: "Commande", ref: "Réf.", product: "Produit", qty: "Qté", unit: "P.U.", total: "Total", subtotal: "Sous-total", shipping: "Frais de port", shippingFree: "Offerts", grandTotal: "Total", notes: "Notes", name: "Nom", studio: "Studio / Cabinet", addr: "Adresse", email: "E-mail", phone: "Tél." },
    de: { title: "Bestellformular", date: `Datum: ${date}`, coord: "Kontaktdaten", delivery: "Lieferadresse", order: "Bestellung", ref: "Ref.", product: "Produkt", qty: "Anz.", unit: "E.P.", total: "Total", subtotal: "Zwischensumme", shipping: "Porto", shippingFree: "Gratis", grandTotal: "Total", notes: "Bemerkungen", name: "Name", studio: "Firma / Studio", addr: "Adresse", email: "E-Mail", phone: "Tel." },
  }[lang];

  const sameDelivery = contact.sameDelivery;
  const deliveryHtml = sameDelivery
    ? `<tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.delivery}</td><td style="font-size:13px">Identique / Gleich</td></tr>`
    : `<tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.delivery}</td><td style="font-size:13px">${deliveryAddress.company ? deliveryAddress.company + "<br>" : ""}${deliveryAddress.address}<br>${deliveryAddress.postalCode} ${deliveryAddress.city}</td></tr>`;

  const rows = orderLines.map((l) => `
    <tr style="border-bottom:1px solid #f0ebe9">
      <td style="padding:7px 8px;font-size:11px;color:#999">${l.ref}</td>
      <td style="padding:7px 8px;font-size:13px">${l.name}${l.size ? ` <span style="color:#bba8a1;font-size:11px">(${l.size})</span>` : ""}</td>
      <td style="padding:7px 8px;font-size:12px;text-align:center">${l.qty}${l.freeQty > 0 ? ` <span style="color:#d598aa">+${l.freeQty}</span>` : ""}</td>
      <td style="padding:7px 8px;font-size:12px;text-align:right">${chf(l.unitPrice)}</td>
      <td style="padding:7px 8px;font-size:13px;font-weight:600;text-align:right">${chf(l.lineTotal)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7f4f3;font-family:system-ui,sans-serif">
  <div style="max-width:620px;margin:24px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#d598aa,#c47d94);padding:28px 32px">
      <h1 style="margin:0;color:white;font-size:22px;font-weight:700;letter-spacing:-0.5px">LPG Switzerland</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px">${labels.title} — ${date}</p>
    </div>
    <div style="padding:28px 32px">
      <h2 style="font-size:11px;color:#bba8a1;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px">${labels.coord}</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr><td style="padding:4px 0;font-size:13px;color:#666;width:140px">${labels.name}</td><td style="font-size:13px;font-weight:600">${contact.firstName} ${contact.lastName}</td></tr>
        ${contact.company ? `<tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.studio}</td><td style="font-size:13px">${contact.company}</td></tr>` : ""}
        <tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.addr}</td><td style="font-size:13px">${contact.address}, ${contact.postalCode} ${contact.city}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.email}</td><td style="font-size:13px">${contact.email}</td></tr>
        ${contact.phone ? `<tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.phone}</td><td style="font-size:13px">${contact.phone}</td></tr>` : ""}
        ${deliveryHtml}
      </table>

      <h2 style="font-size:11px;color:#bba8a1;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px">${labels.order}</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #ded5d1;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#f7f4f3">
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:left;font-weight:700">${labels.ref}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:left;font-weight:700">${labels.product}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:center;font-weight:700">${labels.qty}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:right;font-weight:700">${labels.unit}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:right;font-weight:700">${labels.total}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <tr><td style="padding:5px 0;font-size:13px;color:#666">${labels.subtotal}</td><td style="font-size:13px;text-align:right">${chf(subtotal)}</td></tr>
        <tr><td style="padding:5px 0;font-size:13px;color:#666">${labels.shipping}</td><td style="font-size:13px;text-align:right">${shipping === 0 ? labels.shippingFree : chf(shipping)}</td></tr>
        <tr><td style="padding:10px 0 4px;font-size:16px;font-weight:700;border-top:2px solid #ded5d1">${labels.grandTotal}</td><td style="padding:10px 0 4px;font-size:16px;font-weight:700;text-align:right;border-top:2px solid #ded5d1;color:#d598aa">${chf(total)}</td></tr>
      </table>

      ${contact.notes ? `<div style="margin-top:20px;padding:14px;background:#f7f4f3;border-radius:10px"><p style="margin:0;font-size:12px;color:#666"><strong>${labels.notes} :</strong> ${contact.notes}</p></div>` : ""}
    </div>
    <div style="background:#f7f4f3;padding:16px 32px;text-align:center;border-top:1px solid #ded5d1">
      <p style="margin:0;font-size:11px;color:#bba8a1">LPG Switzerland — ${labels.title} 2026</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const payload: OrderPayload = await req.json();
  const { contact, orderLines, lang } = payload;

  if (!contact.email || !contact.firstName || orderLines.length === 0) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ORDER_EMAIL || "commandes@lpg.ch";

  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY non configurée" }, { status: 500 });
  }

  const html = buildHtml(payload);
  const subject =
    lang === "de"
      ? `Bestellung — ${contact.firstName} ${contact.lastName}${contact.company ? " — " + contact.company : ""}`
      : `Bon de commande — ${contact.firstName} ${contact.lastName}${contact.company ? " — " + contact.company : ""}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LPG Switzerland <onboarding@resend.dev>",
      to: [toEmail],
      reply_to: contact.email,
      cc: [contact.email],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
