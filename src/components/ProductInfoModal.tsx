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
        className="w-full rounded-t-3xl overflow-hidden relative"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-7 h-7 flex items-center justify-center rounded-full text-lg font-light z-10"
          style={{ color: "#bba8a1", backgroundColor: "#f0ebe9" }}
        >
          ×
        </button>

        {/* Layout : image gauche + texte droite */}
        <div className="flex" style={{ minHeight: 0 }}>
          {/* Image */}
          {info.imageUrl && (
            <div
              className="shrink-0 flex items-center justify-center"
              style={{ width: "140px", backgroundColor: "#f7f4f3" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={info.imageUrl}
                alt={name}
                className="w-full object-contain p-3"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}

          {/* Contenu texte */}
          <div
            className="flex-1 px-4 py-4 overflow-y-auto"
            style={{ maxHeight: "65vh" }}
          >
            <h2 className="text-sm font-bold uppercase tracking-wide mb-1.5 pr-6" style={{ color: "#2d2020" }}>
              {name}
            </h2>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: "#6b5050" }}>
              {description}
            </p>
            <ul className="space-y-1.5 mb-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "#2d2020" }}>
                  <span className="shrink-0" style={{ color: "#d598aa", lineHeight: "1.5" }}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {info.lpgUrl && (
              <a
                href={info.lpgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold underline"
                style={{ color: "#d598aa" }}
              >
                {seeMore}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
