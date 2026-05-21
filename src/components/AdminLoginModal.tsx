"use client";
import { useState } from "react";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AdminLoginModal({ onSuccess, onClose }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(45,32,32,0.5)" }}>
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h2 className="text-base font-bold mb-1" style={{ color: "#2d2020" }}>Accès Admin</h2>
        <p className="text-xs mb-4" style={{ color: "#bba8a1" }}>Réservé aux commerciales LPG</p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Mot de passe"
          className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#d598aa] transition-colors mb-3"
          style={{ borderColor: error ? "#bf7585" : "#ded5d1" }}
          autoFocus
        />
        {error && <p className="text-xs mb-3" style={{ color: "#bf7585" }}>Mot de passe incorrect</p>}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: "#ded5d1", color: "#bba8a1" }}>
            Annuler
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#2d2020" }}>
            Connexion
          </button>
        </div>
      </div>
    </div>
  );
}
