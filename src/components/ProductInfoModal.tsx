"use client";

import { ProductInfo } from "@/data/productInfo";
import { Lang } from "@/lib/i18n";

interface Props {
  nameFr: string;
  nameDe: string;
  info: ProductInfo;
  lang: Lang;
  onClose: () => void;
}

export default function ProductInfoModal({ nameFr, nameDe, info, lang, onClose }: Props) {
  const name = lang === "de" ? nameDe : nameFr;
  const description = lang === "de" ? info.descriptionDe : info.description;
  const benefits = lang === "de" ? info.benefitsDe : info.benefits;
  const seeMore = lang === "de" ? "Mehr auf lpg-group.com →" : "Voir sur lpg-group.com →";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: "rgba(45,32,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl overflow-hidden"
        style={{ backgroundColor: "#f7f4f3", maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {info.imageUrl && (
          <div
            className="w-full flex items-center justify-center overflow-hidden"
            style={{ height: "220px", backgroundColor: "white" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={info.imageUrl}
              alt={name}
              className="h-full w-full object-contain p-4"
            />
          </div>
        )}

        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: info.imageUrl ? "calc(80vh - 220px)" : "80vh" }}>
          {/* Nom */}
          <h2 className="text-base font-bold uppercase tracking-wide mb-2" style={{ color: "#2d2020" }}>
            {name}
          </h2>

          {/* Description */}
          <p className="text-sm mb-4" style={{ color: "#6b5050" }}>
            {description}
          </p>

          {/* Bénéfices */}
          <ul className="space-y-2 mb-5">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#2d2020" }}>
                <span style={{ color: "#d598aa", fontSize: "16px", lineHeight: "1.3" }}>✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Lien LPG */}
          {info.lpgUrl && (
            <a
              href={info.lpgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold underline"
              style={{ color: "#d598aa" }}
            >
              {seeMore}
            </a>
          )}
        </div>

        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl font-light"
          style={{ color: "#bba8a1" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
