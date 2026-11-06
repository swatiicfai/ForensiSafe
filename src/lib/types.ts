export type ThreatLevel = "CLEAN" | "SUSPICIOUS" | "CRITICAL";

export interface SyscallLog {
  timestamp: string;
  syscall: string;
  args: string[];
  status: "ALLOWED" | "TRAPPED" | "BLOCKED";
  details: string;
}

export interface NetworkAttempt {
  timestamp: string;
  destination: string;
  port: number;
  protocol: "TCP" | "UDP" | "HTTP" | "HTTPS" | "RAW";
  payloadSnippet?: string;
  status: "SINKHOLED" | "BLOCKED" | "ALLOWED";
}

export interface ContainmentEvent {
  triggered: boolean;
  timestamp: string;
  triggerType: "REVERSE_SHELL" | "CREDENTIAL_EXFILTRATION" | "UNAUTHORIZED_SYSCALL" | "MEMORY_EXHAUSTION" | "MALICIOUS_BEACON";
  description: string;
  remediation: string;
  blastRadius: "ZERO - Host Isolated";
  containerId: string;
  durationMs: number;
}

export interface FileMetadata {
  filename: string;
  fileSize: number;
  mimeType: string;
  sha256: string;
  authorMetadata?: string;
  creationDate?: string;
  embeddedStreamsCount: number;
  entropyScore: number; // 0 to 8
}

export interface ThreatAnalysisReport {
  id: string;
  targetName: string;
  targetType: "FILE" | "URL" | "CODE_SNIPPET";
  timestamp: string;
  threatLevel: ThreatLevel;
  confidenceScore: number; // 0 to 100
  summary: string;
  threatCategory: string;
  vultrModelUsed: string;
  containment: ContainmentEvent;
  syscalls: SyscallLog[];
  networkAttempts: NetworkAttempt[];
  extractedArtifacts: {
    sanitizedContent: string;
    hiddenPayloadsFound: string[];
    extractedIps: string[];
    extractedUrls: string[];
  };
  chainOfCustody: {
    dossierHash: string;
    vultrNodeId: string;
    signingAuthority: string;
    custodyLog: string[];
  };
}

export interface BrowserAirlockResult {
  id: string;
  url: string;
  timestamp: string;
  title: string;
  threatLevel: ThreatLevel;
  securityScore: number;
  trackingBeaconsIntercepted: {
    url: string;
    type: "FINGERPRINTING" | "TRACKER" | "EXPLOIT" | "TELEMETRY";
    blocked: boolean;
  }[];
  evasionDetected: boolean;
  evasionTactics: string[];
  containmentTriggered: boolean;
  screenshotBase64?: string;
  summary: string;
  vultrModelUsed: string;
}

export interface VultrSystemStatus {
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  vultrNodeRegion: string;
  vultrComputeType: string;
  serverlessInferenceStatus: "CONNECTED" | "FALLBACK_SIMULATED";
  activeModel: string;
  sandboxesSpawnedTotal: number;
  activeContainers: number;
  totalThreatsNeutralized: number;
  blastRadiusContainmentRate: "100%";
}
