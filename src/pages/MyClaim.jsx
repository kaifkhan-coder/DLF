import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    apiGet("/api/claims/my").then((d) => setClaims(d.claims || [])).catch(console.log);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900">My Claims</h1>

      <div className="mt-6 space-y-3">
        {claims.map((c) => (
          <div key={c._id} className="bg-white border rounded-2xl p-4">
            <p className="font-bold">{c.itemTitle}</p>
            <p className="text-sm text-slate-600">Status: <b>{c.status}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
}