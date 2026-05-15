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

interface OrderPayload {
  contact: ContactInfo;
  orderLines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
}

function formatCHF(n: number) {
  return n.toFixed(2).replace(".", ",") + " CHF";
}

function buildEmailHtml(payload: OrderPayload): string {
  const { contact, orderLines, subtotal, shipping, total } = payload;
  const date = new Date().toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const rows = orderLines
    .map(
      (l) => `
      <tr>
        <td style="padding:6px 8px;font-size:12px;color:#666">${l.ref}</td>
        <td style="padding:6px 8px;font-size:13px">${l.name}${l.size ? ` <span style="color:#bba8a1">(${l.size})</span>` : ""}</td>
        <td style="padding:6px 8px;font-size:12px;text-align:center">${l.qty}${l.freeQty > 0 ? ` <span style="color:#d598aa">+${l.freeQty}</span>` : ""}</td>
        <td style="padding:6px 8px;font-size:12px;text-align:right">${formatCHF(l.unitPrice)}</td>
        <td style="padding:6px 8px;font-size:13px;font-weight:600;text-align:right">${formatCHF(l.lineTotal)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Bon de commande LPG</title></head>
<body style="margin:0;padding:0;background:#f7f4f3;font-family:system-ui,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#d598aa;padding:24px 32px">
      <h1 style="margin:0;color:white;font-size:20px;font-weight:700">LPG Switzerland</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px">Bon de commande — ${date}</p>
    </div>
    <div style="padding:24px 32px">
      <h2 style="font-size:14px;color:#bba8a1;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px">Coordonnées</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:4px 0;font-size:13px;color:#666;width:120px">Nom</td><td style="font-size:13px">${contact.firstName} ${contact.lastName}</td></tr>
        ${contact.studio ? `<tr><td style="padding:4px 0;font-size:13px;color:#666">Studio</td><td style="font-size:13px">${contact.studio}</td></tr>` : ""}
        <tr><td style="padding:4px 0;font-size:13px;color:#666">Adresse</td><td style="font-size:13px">${contact.address}, ${contact.postalCode} ${contact.city}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#666">Email</td><td style="font-size:13px">${contact.email}</td></tr>
        ${contact.phone ? `<tr><td style="padding:4px 0;font-size:13px;color:#666">Tél.</td><td style="font-size:13px">${contact.phone}</td></tr>` : ""}
      </table>

      <h2 style="font-size:14px;color:#bba8a1;text-transform:uppercase;letter-spacing:0.08em;margin:24px 0 12px">Commande</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #ded5d1;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#f7f4f3">
            <th style="padding:8px;font-size:11px;color:#bba8a1;text-align:left;font-weight:600">REF</th>
            <th style="padding:8px;font-size:11px;color:#bba8a1;text-align:left;font-weight:600">PRODUIT</th>
            <th style="padding:8px;font-size:11px;color:#bba8a1;text-align:center;font-weight:600">QTÉ</th>
            <th style="padding:8px;font-size:11px;color:#bba8a1;text-align:right;font-weight:600">P.U.</th>
            <th style="padding:8px;font-size:11px;color:#bba8a1;text-align:right;font-weight:600">TOTAL</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <tr><td style="padding:4px 0;font-size:13px;color:#666">Sous-total</td><td style="font-size:13px;text-align:right">${formatCHF(subtotal)}</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#666">Frais de port</td><td style="font-size:13px;text-align:right">${shipping === 0 ? "Offerts" : formatCHF(shipping)}</td></tr>
        <tr style="border-top:1px solid #ded5d1">
          <td style="padding:8px 0 4px;font-size:15px;font-weight:700">Total</td>
          <td style="padding:8px 0 4px;font-size:15px;font-weight:700;text-align:right;color:#d598aa">${formatCHF(total)}</td>
        </tr>
      </table>

      ${contact.notes ? `<div style="margin-top:16px;padding:12px;background:#f7f4f3;border-radius:8px"><p style="margin:0;font-size:12px;color:#666"><strong>Notes :</strong> ${contact.notes}</p></div>` : ""}
    </div>
    <div style="background:#f7f4f3;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:11px;color:#bba8a1">LPG Switzerland — Bon de commande cosmétique 2026</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const payload: OrderPayload = await req.json();
  const { contact, orderLines } = payload;

  if (!contact.email || !contact.firstName || orderLines.length === 0) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ORDER_EMAIL || "commandes@lpg.ch";

  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY non configurée" }, { status: 500 });
  }

  const html = buildEmailHtml(payload);
  const subject = `Bon de commande — ${contact.firstName} ${contact.lastName} — ${contact.studio || contact.city}`;

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
