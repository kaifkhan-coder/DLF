import React, { useState } from "react";
import { apiPost } from "../services/api";

export default function ClaimBox({ itemId }) {
  const [proofText, setProofText] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState("");

  React.useEffect(() => {
    getQR(itemId);
  }, [itemId]);
  const submitClaim = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/api/claims", { itemId, proofText, secretAnswer });
      alert("Claim submitted ✅ Admin will verify.");
      setProofText("");
      setSecretAnswer("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getQR = async (id) => {
  const res = await apiGet(`/api/items/qr/${id}`);
  setQr(res.qr);
};
  return (
    <div className="mt-6 bg-white border rounded-2xl p-5">
      <h3 className="text-lg font-bold text-slate-900">Claim this item</h3>
      <p className="text-sm text-slate-600 mt-1">
        Give proof that only the real owner knows (hidden details).
      </p>
      <img src={qr} alt="QR Code" />
      <form onSubmit={submitClaim} className="mt-4 space-y-3">
        <textarea
          className="w-full border p-3 rounded-xl"
          rows={3}
          placeholder="Proof (example: sticker, scratch, serial, hidden notes...)"
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          required
        />

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Secret Answer (example: what is written inside wallet?)"
          value={secretAnswer}
          onChange={(e) => setSecretAnswer(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white p-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}

