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
  description?: string;
  gift?: string;
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
    fr: { title: "Bon de commande", date: `Date : ${date}`, coord: "Coordonnées", delivery: "Adresse de livraison", order: "Commande", ref: "Réf.", product: "Produit", qty: "Qté", unit: "P.U.", total: "Total", subtotal: "Sous-total", shipping: "Frais de port", shippingFree: "Offerts", grandTotal: "Total", totalTTC: "Total TTC (TVA 8.1%)", notes: "Notes", name: "Nom", studio: "Studio / Cabinet", addr: "Adresse", email: "E-mail", phone: "Tél.", typeRevente: "Revente", typeCabine: "Cabine", typeRecharge: "Recharge" },
    de: { title: "Bestellformular", date: `Datum: ${date}`, coord: "Kontaktdaten", delivery: "Lieferadresse", order: "Bestellung", ref: "Ref.", product: "Produkt", qty: "Anz.", unit: "E.P.", total: "Total", subtotal: "Zwischensumme", shipping: "Porto", shippingFree: "Gratis", grandTotal: "Total", totalTTC: "Total inkl. MwSt. (8.1%)", notes: "Bemerkungen", name: "Name", studio: "Firma / Studio", addr: "Adresse", email: "E-Mail", phone: "Tel.", typeRevente: "Verkauf", typeCabine: "Professionell", typeRecharge: "Nachfüllung" },
  }[lang];

  const sameDelivery = contact.sameDelivery;
  const deliveryHtml = sameDelivery
    ? `<tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.delivery}</td><td style="font-size:13px">Identique / Gleich</td></tr>`
    : `<tr><td style="padding:4px 0;font-size:13px;color:#666">${labels.delivery}</td><td style="font-size:13px">${deliveryAddress.company ? deliveryAddress.company + "<br>" : ""}${deliveryAddress.address}<br>${deliveryAddress.postalCode} ${deliveryAddress.city}</td></tr>`;

  const typeLabel = (type: string) => {
    if (type === "revente") return labels.typeRevente;
    if (type === "professionnel") return labels.typeCabine;
    if (type === "recharge") return labels.typeRecharge;
    return "";
  };

  const rows = orderLines.map((l) => {
    const tl = typeLabel(l.type);
    const detail = [tl, l.size].filter(Boolean).join(" – ");
    const descHtml = l.type === "offre" && (l.description || l.gift)
      ? `${l.description ? `<br><span style="font-size:11px;color:#bba8a1;font-weight:400">${l.description}</span>` : ""}${l.gift ? `<br><span style="font-size:11px;color:#d598aa;font-weight:400">🎁 ${l.gift}</span>` : ""}`
      : "";
    return `
    <tr style="border-bottom:1px solid #f0ebe9">
      <td style="padding:7px 8px;font-size:11px;color:#999">${l.ref}</td>
      <td style="padding:7px 8px;font-size:13px">${l.name}${detail ? ` <span style="color:#bba8a1;font-size:11px">(${detail})</span>` : ""}${descHtml}</td>
      <td style="padding:7px 8px;font-size:12px;text-align:center">${l.qty}${l.freeQty > 0 ? ` <span style="color:#d598aa">+${l.freeQty}</span>` : ""}</td>
      <td style="padding:7px 8px;font-size:12px;text-align:right">${chf(l.unitPrice)}</td>
      <td style="padding:7px 8px;font-size:13px;font-weight:600;text-align:right">${chf(l.lineTotal)}</td>
    </tr>`;
  }).join("");

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
        <tr><td style="padding:3px 0;font-size:11px;color:#bba8a1">${labels.totalTTC}</td><td style="font-size:11px;text-align:right;color:#bba8a1">${chf(total * 1.081)}</td></tr>
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

function buildConfirmHtml(payload: OrderPayload): string {
  const { contact, deliveryAddress, orderLines, subtotal, shipping, total, lang } = payload;
  const date = new Date().toLocaleDateString(lang === "de" ? "de-CH" : "fr-CH", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const labels = {
    fr: {
      title: "Confirmation de commande", date: `Date : ${date}`,
      coord: "Vos coordonnées", delivery: "Adresse de livraison",
      order: "Récapitulatif de votre commande",
      ref: "Réf.", product: "Produit", qty: "Qté", unit: "P.U.", total: "Total",
      subtotal: "Sous-total", shipping: "Frais de port", shippingFree: "Offerts",
      grandTotal: "Total HT", totalTTC: "Total TTC (TVA 8.1%)",
      name: "Nom", studio: "Studio / Cabinet", addr: "Adresse", email: "E-mail", phone: "Tél.",
      notes: "Remarques",
      stock: "Cette commande est sous réserve des produits disponibles en stock. Notre équipe vous recontactera si un article n'est pas disponible.",
      closing: "Merci pour votre confiance.",
      team: "L'équipe LPG Switzerland",
      typeRevente: "Revente", typeCabine: "Cabine", typeRecharge: "Recharge",
    },
    de: {
      title: "Bestellbestätigung", date: `Datum: ${date}`,
      coord: "Ihre Kontaktdaten", delivery: "Lieferadresse",
      order: "Zusammenfassung Ihrer Bestellung",
      ref: "Ref.", product: "Produkt", qty: "Anz.", unit: "E.P.", total: "Total",
      subtotal: "Zwischensumme", shipping: "Porto", shippingFree: "Gratis",
      grandTotal: "Total netto", totalTTC: "Total inkl. MwSt. (8.1%)",
      name: "Name", studio: "Firma / Studio", addr: "Adresse", email: "E-Mail", phone: "Tel.",
      notes: "Bemerkungen",
      stock: "Diese Bestellung erfolgt vorbehaltlich der Verfügbarkeit der Produkte auf Lager. Unser Team meldet sich bei Ihnen, falls ein Artikel nicht verfügbar sein sollte.",
      closing: "Vielen Dank für Ihr Vertrauen.",
      team: "Das LPG Switzerland Team",
      typeRevente: "Verkauf", typeCabine: "Professionell", typeRecharge: "Nachfüllung",
    },
  }[lang];

  const typeLabel = (type: string) => {
    if (type === "revente") return labels.typeRevente;
    if (type === "professionnel") return labels.typeCabine;
    if (type === "recharge") return labels.typeRecharge;
    return "";
  };

  const sameDelivery = contact.sameDelivery;
  const deliveryRow = sameDelivery
    ? `<tr><td style="padding:4px 0;font-size:13px;color:#666666;width:140px;font-family:Arial,sans-serif">${labels.delivery}</td><td style="font-size:13px;font-family:Arial,sans-serif">= ${labels.coord}</td></tr>`
    : `<tr><td style="padding:4px 0;font-size:13px;color:#666666;width:140px;font-family:Arial,sans-serif">${labels.delivery}</td><td style="font-size:13px;font-family:Arial,sans-serif">${deliveryAddress.company ? deliveryAddress.company + "<br>" : ""}${deliveryAddress.address}<br>${deliveryAddress.postalCode} ${deliveryAddress.city}</td></tr>`;

  const rows = orderLines.map((l) => {
    const tl = typeLabel(l.type);
    const detail = [tl, l.size].filter(Boolean).join(" – ");
    return `<tr>
      <td style="padding:7px 8px;font-size:11px;color:#999999;border-bottom:1px solid #f0ebe9;font-family:Arial,sans-serif">${l.ref}</td>
      <td style="padding:7px 8px;font-size:13px;border-bottom:1px solid #f0ebe9;font-family:Arial,sans-serif">${l.name}${detail ? ` <span style="color:#bba8a1;font-size:11px">(${detail})</span>` : ""}</td>
      <td style="padding:7px 8px;font-size:12px;text-align:center;border-bottom:1px solid #f0ebe9;font-family:Arial,sans-serif">${l.qty}${l.freeQty > 0 ? ` <span style="color:#d598aa">+${l.freeQty}</span>` : ""}</td>
      <td style="padding:7px 8px;font-size:12px;text-align:right;border-bottom:1px solid #f0ebe9;white-space:nowrap;font-family:Arial,sans-serif">${chf(l.unitPrice)}</td>
      <td style="padding:7px 8px;font-size:13px;font-weight:700;text-align:right;border-bottom:1px solid #f0ebe9;white-space:nowrap;font-family:Arial,sans-serif">${chf(l.lineTotal)}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f7f4f3;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f4f3">
<tr><td align="center" style="padding:24px 16px">

  <table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background-color:#ffffff;border:1px solid #ded5d1">

    <!-- HEADER -->
    <tr>
      <td bgcolor="#d598aa" style="padding:28px 32px;background-color:#d598aa">
        <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;font-family:Arial,sans-serif">LPG Switzerland</p>
        <p style="margin:6px 0 0;color:#f9e8ef;font-size:13px;font-family:Arial,sans-serif">${labels.title} — ${date}</p>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:28px 32px">

        <!-- Stock notice -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px">
          <tr>
            <td bgcolor="#fff8f0" style="padding:14px 16px;background-color:#fff8f0;border:1px solid #f5c542;border-left:4px solid #f5c542">
              <p style="margin:0;font-size:13px;color:#7a5c00;line-height:1.6;font-family:Arial,sans-serif">⚠️ ${labels.stock}</p>
            </td>
          </tr>
        </table>

        <!-- Coordonnées -->
        <p style="margin:0 0 10px;font-size:11px;color:#bba8a1;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif">${labels.coord}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px">
          <tr><td style="padding:4px 0;font-size:13px;color:#666666;width:140px;font-family:Arial,sans-serif">${labels.name}</td><td style="font-size:13px;font-weight:700;font-family:Arial,sans-serif">${contact.firstName} ${contact.lastName}</td></tr>
          ${contact.company ? `<tr><td style="padding:4px 0;font-size:13px;color:#666666;font-family:Arial,sans-serif">${labels.studio}</td><td style="font-size:13px;font-family:Arial,sans-serif">${contact.company}</td></tr>` : ""}
          <tr><td style="padding:4px 0;font-size:13px;color:#666666;font-family:Arial,sans-serif">${labels.addr}</td><td style="font-size:13px;font-family:Arial,sans-serif">${contact.address}, ${contact.postalCode} ${contact.city}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#666666;font-family:Arial,sans-serif">${labels.email}</td><td style="font-size:13px;font-family:Arial,sans-serif">${contact.email}</td></tr>
          ${contact.phone ? `<tr><td style="padding:4px 0;font-size:13px;color:#666666;font-family:Arial,sans-serif">${labels.phone}</td><td style="font-size:13px;font-family:Arial,sans-serif">${contact.phone}</td></tr>` : ""}
          ${deliveryRow}
        </table>

        <!-- Commande -->
        <p style="margin:0 0 10px;font-size:11px;color:#bba8a1;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif">${labels.order}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #ded5d1">
          <tr bgcolor="#f7f4f3">
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:left;font-weight:700;font-family:Arial,sans-serif">${labels.ref}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:left;font-weight:700;font-family:Arial,sans-serif">${labels.product}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:center;font-weight:700;font-family:Arial,sans-serif">${labels.qty}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:right;font-weight:700;font-family:Arial,sans-serif">${labels.unit}</th>
            <th style="padding:8px;font-size:10px;color:#bba8a1;text-align:right;font-weight:700;font-family:Arial,sans-serif">${labels.total}</th>
          </tr>
          ${rows}
        </table>

        <!-- Totaux -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px">
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#666666;font-family:Arial,sans-serif">${labels.subtotal}</td>
            <td style="padding:5px 0;font-size:13px;text-align:right;white-space:nowrap;font-family:Arial,sans-serif">${chf(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#666666;font-family:Arial,sans-serif">${labels.shipping}</td>
            <td style="padding:5px 0;font-size:13px;text-align:right;white-space:nowrap;font-family:Arial,sans-serif">${shipping === 0 ? labels.shippingFree : chf(shipping)}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 4px;font-size:16px;font-weight:700;color:#2d2020;border-top:2px solid #ded5d1;font-family:Arial,sans-serif">${labels.grandTotal}</td>
            <td style="padding:12px 0 4px;font-size:16px;font-weight:700;text-align:right;color:#d598aa;border-top:2px solid #ded5d1;white-space:nowrap;font-family:Arial,sans-serif">${chf(total)}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:11px;color:#bba8a1;font-family:Arial,sans-serif">${labels.totalTTC}</td>
            <td style="padding:3px 0;font-size:11px;text-align:right;color:#bba8a1;white-space:nowrap;font-family:Arial,sans-serif">${chf(total * 1.081)}</td>
          </tr>
        </table>

        ${contact.notes ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px"><tr><td bgcolor="#f7f4f3" style="padding:14px;background-color:#f7f4f3"><p style="margin:0;font-size:12px;color:#666666;font-family:Arial,sans-serif"><strong>${labels.notes} :</strong> ${contact.notes}</p></td></tr></table>` : ""}

        <p style="margin:28px 0 4px;font-size:13px;color:#555555;font-family:Arial,sans-serif">${labels.closing}</p>
        <p style="margin:0;font-size:13px;font-weight:700;color:#2d2020;font-family:Arial,sans-serif">${labels.team}</p>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td bgcolor="#f7f4f3" style="padding:16px 32px;text-align:center;border-top:1px solid #ded5d1;background-color:#f7f4f3">
        <p style="margin:0;font-size:11px;color:#bba8a1;font-family:Arial,sans-serif">LPG Switzerland — ${labels.title} 2026</p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
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
    return NextResponse.json(
      { error: "Clé Resend manquante — vérifier RESEND_API_KEY dans Vercel > Settings > Environment Variables" },
      { status: 500 }
    );
  }

  const html = buildHtml(payload);
  const subject =
    lang === "de"
      ? `Bestellung — ${contact.firstName} ${contact.lastName}${contact.company ? " — " + contact.company : ""}`
      : `Bon de commande — ${contact.firstName} ${contact.lastName}${contact.company ? " — " + contact.company : ""}`;

  let resendRes: Response;
  try {
    resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LPG Switzerland <commandes@lpgswitzerland.com>",
        to: [toEmail],
        reply_to: contact.email,
        subject,
        html,
      }),
    });
  } catch (e) {
    return NextResponse.json({ error: `Réseau : ${e}` }, { status: 502 });
  }

  if (!resendRes.ok) {
    const body = await resendRes.json().catch(() => ({}));
    const msg = (body as { message?: string }).message ?? resendRes.statusText;
    return NextResponse.json(
      { error: `Resend (${resendRes.status}) : ${msg}` },
      { status: 500 }
    );
  }

  // Confirmation email to the customer
  const confirmSubject = lang === "de"
    ? `Ihre Bestellung — LPG Switzerland`
    : `Confirmation de commande — LPG Switzerland`;

  const confirmHtml = buildConfirmHtml(payload);

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LPG Switzerland <order.ch@lpgswitzerland.com>",
      to: [contact.email],
      subject: confirmSubject,
      html: confirmHtml,
    }),
  });

  return NextResponse.json({ ok: true });
}
