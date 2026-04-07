import React, { useMemo, useRef, useState } from "react";

function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function KeyLoggerDemo() {
  const [consent, setConsent] = useState(false);
  const [running, setRunning] = useState(false);
  const [targetText, setTargetText] = useState("");
  const [logs, setLogs] = useState([]);
  const startRef = useRef(null);

  const stats = useMemo(() => {
    let total = logs.length;
    let backspace = 0;
    let enter = 0;
    let printable = 0;

    for (const l of logs) {
      if (l.key === "Backspace") backspace++;
      if (l.key === "Enter") enter++;
      if (l.type === "PRINT") printable++;
    }

    const seconds =
      startRef.current && running
        ? Math.max(1, Math.floor((Date.now() - startRef.current) / 1000))
        : startRef.current
        ? Math.max(1, Math.floor((logs.at(-1)?.ts - startRef.current) / 1000))
        : 1;

    const words = targetText.trim() ? targetText.trim().split(/\s+/).length : 0;
    const wpm = Math.round((words / seconds) * 60);

    return { total, backspace, enter, printable, words, seconds, wpm };
  }, [logs, targetText, running]);

  function addLog(entry) {
    setLogs((prev) => [entry, ...prev].slice(0, 300)); // keep last 300
  }

  function onKeyDown(e) {
    if (!running) return;

    // Only log events INSIDE this input/textarea
    const ts = Date.now();
    const key = e.key;

    if (key === "Backspace" || key === "Enter" || key === "Tab" || key === "Escape") {
      addLog({ ts, key, type: "SPECIAL" });
      return;
    }

    // Log only printable characters (avoid capturing modifier keys)
    if (key.length === 1) {
      addLog({ ts, key, type: "PRINT" });
    } else {
      addLog({ ts, key, type: "OTHER" });
    }
  }

  function start() {
    if (!consent) return;
    setRunning(true);
    startRef.current = Date.now();
    addLog({ ts: Date.now(), key: "START", type: "SYSTEM" });
  }

  function stop() {
    setRunning(false);
    addLog({ ts: Date.now(), key: "STOP", type: "SYSTEM" });
  }

  function clearAll() {
    setRunning(false);
    setTargetText("");
    setLogs([]);
    startRef.current = null;
  }

  function exportLog() {
    const header = [
      "Consent-based Keystroke Log (Input-only)",
      `Exported: ${new Date().toString()}`,
      `Duration(s): ${stats.seconds}`,
      `Total events: ${stats.total}`,
      `Words: ${stats.words} | WPM: ${stats.wpm}`,
      "----------------------------------------",
      "time\tkey\ttype",
    ].join("\n");

    const rows = [...logs]
      .reverse()
      .map((l) => `${fmtTime(l.ts)}\t${JSON.stringify(l.key)}\t${l.type}`)
      .join("\n");

    downloadText(`keystroke_log_${Date.now()}.txt`, `${header}\n${rows}\n`);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-black text-slate-900">
          Consent-based Keystroke Logger (Web Demo)
        </h1>
        <p className="mt-1 text-slate-600">
          Logs <span className="font-semibold">only</span> what you type inside this box (no system-wide logging).
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</p>
            <div className="mt-2 flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${
                  running ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {running ? "LOGGING" : "STOPPED"}
              </span>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I consent
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={start}
                disabled={!consent || running}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Start
              </button>
              <button
                onClick={stop}
                disabled={!running}
                className="rounded-xl border px-4 py-2 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Stop
              </button>
              <button
                onClick={exportLog}
                disabled={logs.length === 0}
                className="rounded-xl border px-4 py-2 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Download Log
              </button>
              <button
                onClick={clearAll}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700"
              >
                Clear
              </button>
            </div>

            {!consent && (
              <p className="mt-3 text-sm text-rose-700">
                Enable <b>I consent</b> to start logging.
              </p>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Type here</p>
            <textarea
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type something… (logging only happens when Start is ON)"
              className="mt-2 h-40 w-full resize-none rounded-2xl border bg-slate-50 p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-6">
              <Stat label="Events" value={stats.total} />
              <Stat label="Chars" value={stats.printable} />
              <Stat label="Backspace" value={stats.backspace} />
              <Stat label="Enter" value={stats.enter} />
              <Stat label="Words" value={stats.words} />
              <Stat label="WPM" value={stats.wpm} />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Live log (latest first)</p>
            <span className="text-xs text-slate-500">Showing up to 300 events</span>
          </div>

          <div className="mt-3 max-h-72 overflow-auto rounded-2xl border bg-slate-50 p-3 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-500">No logs yet. Click Start and type in the box.</div>
            ) : (
              logs.map((l, idx) => (
                <div key={idx} className="flex gap-3 border-b border-slate-200 py-1 last:border-b-0">
                  <span className="w-24 text-slate-500">{fmtTime(l.ts)}</span>
                  <span className="w-28 font-bold text-slate-900">{l.type}</span>
                  <span className="text-slate-700">{JSON.stringify(l.key)}</span>
                </div>
              ))
            )}
          </div>

          <p className="mt-3 text-sm text-slate-600">
            ✅ Safe design: logs only inside this textarea, with visible consent & export.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}