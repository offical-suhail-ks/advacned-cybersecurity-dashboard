import { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, FileText, Network,
  Bug, UserX, FileWarning, CheckCircle, Cpu,
  Eye, Radio, Menu, X, Bell, Settings, User,
  AlertOctagon, MapPin, Search, Filter, Terminal,
  Wifi, Key, TrendingUp, BarChart3, RefreshCw,
  FileSearch, Activity, Clock, Zap, Plus, Edit2,
  Trash2, Mail, Phone, Building2, Users, Lock,
  LogOut, Sliders, CreditCard, MessageSquare, Calendar,
  FileCode, Copy, Settings2, UserPlus, Layers,
  Target, Globe, Cloud, Sparkles, Wallet, Sword, Anchor,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Import Advanced Features Modules
import {
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
} from './AdvancedFeatures';

// ==================== TYPES ====================
interface ThreatAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  source: string;
  target: string;
  timestamp: Date;
  description: string;
}

interface LogEntry {
  id: string;
  source: string;
  type: string;
  message: string;
  timestamp: Date;
  severity: string;
}

interface CVE {
  id: string;
  cvss: number;
  description: string;
  affected: string;
  patchStatus: 'patched' | 'unpatched' | 'in-progress';
}

interface NetworkConnection {
  id: string;
  sourceIP: string;
  destIP: string;
  port: number;
  protocol: string;
  status: 'active' | 'suspicious' | 'blocked';
  bytes: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone: string;
  department: string;
  joinDate: string;
  lastLogin: string;
  mfaEnabled: boolean;
  notifications: boolean;
  darkMode: boolean;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  joinDate: string;
  expiryDate: string;
  users: number;
  threats: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'manager';
  department: string;
  status: 'active' | 'inactive' | 'onleave';
  avatar: string;
  joinDate: string;
  permissions: string[];
}

interface Enquiry {
  id: string;
  subject: string;
  message: string;
  from: string;
  email: string;
  company: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  assignedTo?: string;
}

// ==================== MOCK DATA ====================
const threatAlerts: ThreatAlert[] = [
  { id: '1', severity: 'critical', type: 'DDoS Attack', source: '185.220.101.42', target: 'Web Server', timestamp: new Date(), description: 'Massive traffic spike detected' },
  { id: '2', severity: 'high', type: 'Brute Force', source: '192.168.1.100', target: 'SSH Server', timestamp: new Date(Date.now() - 300000), description: 'Multiple failed login attempts' },
  { id: '3', severity: 'medium', type: 'SQL Injection', source: '45.142.212.89', target: 'Database', timestamp: new Date(Date.now() - 600000), description: 'Suspicious SQL patterns detected' },
  { id: '4', severity: 'high', type: 'Malware', source: '10.0.0.45', target: 'Workstation', timestamp: new Date(Date.now() - 900000), description: 'Ransomware signature detected' },
  { id: '5', severity: 'low', type: 'Port Scan', source: '203.78.45.12', target: 'Firewall', timestamp: new Date(Date.now() - 1200000), description: 'Reconnaissance activity detected' },
];

const logEntries: LogEntry[] = [
  { id: '1', source: 'Firewall', type: 'BLOCK', message: 'Blocked connection from 185.220.101.42', timestamp: new Date(), severity: 'high' },
  { id: '2', source: 'IDS', type: 'ALERT', message: 'Signature match: ET SCAN Nmap', timestamp: new Date(Date.now() - 120000), severity: 'medium' },
  { id: '3', source: 'Server', type: 'ERROR', message: 'Authentication failure for user admin', timestamp: new Date(Date.now() - 240000), severity: 'high' },
  { id: '4', source: 'Endpoint', type: 'INFO', message: 'Antivirus scan completed', timestamp: new Date(Date.now() - 360000), severity: 'low' },
  { id: '5', source: 'Proxy', type: 'WARN', message: 'Suspicious URL blocked', timestamp: new Date(Date.now() - 480000), severity: 'medium' },
];

const cveList: CVE[] = [
  { id: 'CVE-2024-1234', cvss: 9.8, description: 'Remote code execution in Apache', affected: 'Apache 2.4.x', patchStatus: 'unpatched' },
  { id: 'CVE-2024-5678', cvss: 8.5, description: 'SQL injection in WordPress plugin', affected: 'WP Plugin X', patchStatus: 'in-progress' },
  { id: 'CVE-2024-9012', cvss: 7.2, description: 'Privilege escalation in Linux kernel', affected: 'Kernel 5.x', patchStatus: 'patched' },
  { id: 'CVE-2024-3456', cvss: 6.8, description: 'XSS vulnerability in web app', affected: 'App v2.1', patchStatus: 'unpatched' },
];

const networkConnections: NetworkConnection[] = [
  { id: '1', sourceIP: '192.168.1.10', destIP: '8.8.8.8', port: 443, protocol: 'HTTPS', status: 'active', bytes: 15420 },
  { id: '2', sourceIP: '185.220.101.42', destIP: '192.168.1.5', port: 22, protocol: 'SSH', status: 'blocked', bytes: 0 },
  { id: '3', sourceIP: '192.168.1.25', destIP: '10.0.0.5', port: 3389, protocol: 'RDP', status: 'suspicious', bytes: 8920 },
  { id: '4', sourceIP: '192.168.1.100', destIP: '172.16.0.10', port: 445, protocol: 'SMB', status: 'active', bytes: 45200 },
];

const threatTrendData = [
  { time: '00:00', threats: 45, blocked: 42 },
  { time: '04:00', threats: 32, blocked: 30 },
  { time: '08:00', threats: 78, blocked: 75 },
  { time: '12:00', threats: 95, blocked: 92 },
  { time: '16:00', threats: 120, blocked: 115 },
  { time: '20:00', threats: 85, blocked: 82 },
  { time: '23:59', threats: 55, blocked: 53 },
];

const attackTypeData = [
  { name: 'DDoS', value: 35, color: '#c6ff00' },
  { name: 'Brute Force', value: 25, color: '#ff8800' },
  { name: 'Malware', value: 20, color: '#ff4444' },
  { name: 'SQL Injection', value: 12, color: '#ffcc00' },
  { name: 'XSS', value: 8, color: '#00ccff' },
];

const complianceData = [
  { subject: 'Access Control', A: 85, fullMark: 100 },
  { subject: 'Data Protection', A: 92, fullMark: 100 },
  { subject: 'Network Security', A: 78, fullMark: 100 },
  { subject: 'Incident Response', A: 88, fullMark: 100 },
  { subject: 'Risk Management', A: 75, fullMark: 100 },
  { subject: 'Compliance', A: 95, fullMark: 100 },
];

const initialCompanies: Company[] = [
  { id: '1', name: 'TechCorp Industries', industry: 'Technology', size: '500-1000', email: 'security@techcorp.com', phone: '+1-555-0101', address: '123 Silicon Valley, CA', status: 'active', plan: 'enterprise', joinDate: '2023-01-15', expiryDate: '2025-01-15', users: 47, threats: 1250 },
  { id: '2', name: 'FinanceFirst Bank', industry: 'Finance', size: '1000-5000', email: 'ops@financefirst.com', phone: '+1-555-0102', address: '456 Wall Street, NY', status: 'active', plan: 'enterprise', joinDate: '2023-03-20', expiryDate: '2025-03-20', users: 128, threats: 3420 },
  { id: '3', name: 'HealthCare Plus', industry: 'Healthcare', size: '100-500', email: 'it@healthcareplus.com', phone: '+1-555-0103', address: '789 Medical Center, TX', status: 'active', plan: 'professional', joinDate: '2023-06-10', expiryDate: '2024-12-10', users: 23, threats: 580 },
  { id: '4', name: 'RetailMax Stores', industry: 'Retail', size: '5000+', email: 'security@retailmax.com', phone: '+1-555-0104', address: '321 Commerce Blvd, FL', status: 'suspended', plan: 'starter', joinDate: '2023-08-05', expiryDate: '2024-02-05', users: 8, threats: 120 },
  { id: '5', name: 'EduSmart Learning', industry: 'Education', size: '50-100', email: 'admin@edusmart.edu', phone: '+1-555-0105', address: '654 Campus Dr, MA', status: 'active', plan: 'starter', joinDate: '2024-01-20', expiryDate: '2025-01-20', users: 12, threats: 85 },
];

const initialTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex.morgan@cybershield.com', role: 'admin', department: 'Security', status: 'active', avatar: 'AM', joinDate: '2022-06-15', permissions: ['all'] },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@cybershield.com', role: 'manager', department: 'Operations', status: 'active', avatar: 'SC', joinDate: '2022-09-20', permissions: ['users', 'companies', 'reports'] },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@cybershield.com', role: 'analyst', department: 'Threat Intel', status: 'active', avatar: 'MJ', joinDate: '2023-01-10', permissions: ['threats', 'logs', 'reports'] },
  { id: '4', name: 'Emily Davis', email: 'emily.d@cybershield.com', role: 'viewer', department: 'Compliance', status: 'onleave', avatar: 'ED', joinDate: '2023-04-05', permissions: ['reports', 'compliance'] },
  { id: '5', name: 'James Wilson', email: 'james.w@cybershield.com', role: 'analyst', department: 'Security', status: 'inactive', avatar: 'JW', joinDate: '2023-07-12', permissions: ['threats', 'logs'] },
];

const initialEnquiries: Enquiry[] = [
  { id: '1', subject: 'Enterprise Plan Inquiry', message: 'We are interested in upgrading to the Enterprise plan. Can you provide more details?', from: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp', priority: 'high', status: 'open', createdAt: new Date(Date.now() - 86400000) },
  { id: '2', subject: 'Integration Support', message: 'Need help integrating with our existing SIEM solution.', from: 'Lisa Wong', email: 'lisa@financefirst.com', company: 'FinanceFirst', priority: 'medium', status: 'in-progress', createdAt: new Date(Date.now() - 172800000), assignedTo: 'Mike Johnson' },
  { id: '3', subject: 'Billing Question', message: 'Question about our monthly invoice.', from: 'Tom Brown', email: 'tom@healthcareplus.com', company: 'HealthCare Plus', priority: 'low', status: 'resolved', createdAt: new Date(Date.now() - 259200000) },
  { id: '4', subject: 'Urgent: Security Incident', message: 'We suspect a breach in our network. Need immediate assistance.', from: 'Admin', email: 'admin@retailmax.com', company: 'RetailMax', priority: 'urgent', status: 'open', createdAt: new Date(Date.now() - 3600000) },
  { id: '5', subject: 'Feature Request', message: 'Would love to see API rate limiting features.', from: 'David Lee', email: 'david@edusmart.edu', company: 'EduSmart', priority: 'low', status: 'closed', createdAt: new Date(Date.now() - 604800000) },
];

// ==================== COMPONENTS ====================

// Navigation Component
const Navigation = ({ activeTab, setActiveTab, onSettingsClick, onProfileClick }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
  onProfileClick: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'threats', label: 'Threat Intel', icon: AlertTriangle },
    { id: 'siem', label: 'SIEM Logs', icon: FileText },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    { id: 'iam', label: 'IAM', icon: UserX },
    { id: 'malware', label: 'Malware', icon: FileWarning },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle },
    { id: 'ai', label: 'AI Detection', icon: Cpu },
  ];

  const advancedNavItems = [
    { id: 'pentesting', label: 'Pentesting', icon: Target },
    { id: 'malware-engine', label: 'Malware Engine', icon: Bug },
    { id: 'soar', label: 'SOAR', icon: Zap },
    { id: 'redblue', label: 'Red vs Blue', icon: Sword },
    { id: 'honeypot', label: 'Honeypot', icon: Anchor },
    { id: 'threat-hunt', label: 'Threat Hunt', icon: Search },
    { id: 'darkweb', label: 'Dark Web', icon: Eye },
    { id: 'cloud-sec', label: 'Cloud Sec', icon: Cloud },
    { id: 'zerotrust', label: 'Zero Trust', icon: Lock },
    { id: 'ai-advanced', label: 'AI Advanced', icon: Sparkles },
    { id: 'financial', label: 'Financial', icon: Wallet },
    { id: 'attack-graph', label: 'Attack Graph', icon: Globe },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-black/90 backdrop-blur-md border-b border-cyber-light">
      <div className="max-w-full px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyber-lime" />
            <span className="text-xl font-bold text-white">
              Cyber<span className="text-cyber-lime">Shield</span>
            </span>
          </div>
          
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-cyber-lime text-cyber-black' 
                    : 'text-cyber-muted hover:text-white hover:bg-cyber-gray'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
            
            {/* Advanced Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  advancedNavItems.some(i => i.id === activeTab)
                    ? 'bg-cyber-lime text-cyber-black' 
                    : 'text-cyber-muted hover:text-white hover:bg-cyber-gray'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAdvancedMenu ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showAdvancedMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-cyber-dark border border-cyber-light rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <div className="max-h-80 overflow-y-auto">
                      {advancedNavItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { setActiveTab(item.id); setShowAdvancedMenu(false); }}
                          className={`flex items-center space-x-3 w-full px-4 py-2.5 transition-all ${
                            activeTab === item.id 
                              ? 'bg-cyber-lime text-cyber-black' 
                              : 'text-cyber-muted hover:text-white hover:bg-cyber-gray'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-cyber-muted hover:text-cyber-lime transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <button 
              onClick={onSettingsClick}
              className="p-2 text-cyber-muted hover:text-cyber-lime transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-cyber-lime flex items-center justify-center hover:shadow-glow transition-all"
              >
                <User className="w-5 h-5 text-cyber-black" />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-10 w-48 bg-cyber-dark border border-cyber-light rounded-lg shadow-xl overflow-hidden"
                  >
                    <button 
                      onClick={() => { onProfileClick(); setShowUserMenu(false); }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-cyber-muted hover:bg-cyber-gray hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={() => { onSettingsClick(); setShowUserMenu(false); }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-cyber-muted hover:bg-cyber-gray hover:text-white transition-colors"
                    >
                      <Settings2 className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <div className="border-t border-cyber-light" />
                    <button className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-cyber-gray transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              className="xl:hidden p-2 text-cyber-muted"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-cyber-dark border-t border-cyber-light"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 transition-all ${
                  activeTab === item.id 
                    ? 'bg-cyber-lime text-cyber-black' 
                    : 'text-cyber-muted hover:text-white hover:bg-cyber-gray'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="px-4 py-2 text-xs font-semibold text-cyber-muted uppercase tracking-wider">
              Advanced Tools
            </div>
            {advancedNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 transition-all ${
                  activeTab === item.id 
                    ? 'bg-cyber-lime text-cyber-black' 
                    : 'text-cyber-muted hover:text-white hover:bg-cyber-gray'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Settings Modal
const SettingsModal = ({ isOpen, onClose, profile, setProfile }: { 
  isOpen: boolean; 
  onClose: () => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = () => {
    setProfile(editedProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-cyber-light">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-cyber-lime" />
            <span>Settings</span>
          </h2>
          <button onClick={onClose} className="p-2 text-cyber-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-cyber-light p-4 space-y-2">
            {[
              { id: 'general', label: 'General', icon: Sliders },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'integrations', label: 'Integrations', icon: Layers },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'api', label: 'API Keys', icon: FileCode },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-cyber-lime text-cyber-black' 
                    : 'text-cyber-muted hover:text-white hover:bg-cyber-gray'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">General Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-cyber-gray rounded-lg">
                    <div>
                      <div className="text-white font-medium">Dark Mode</div>
                      <div className="text-sm text-cyber-muted">Always use dark theme</div>
                    </div>
                    <button 
                      onClick={() => setEditedProfile({...editedProfile, darkMode: !editedProfile.darkMode})}
                      className={`w-12 h-6 rounded-full transition-colors ${editedProfile.darkMode ? 'bg-cyber-lime' : 'bg-cyber-gray border border-cyber-light'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${editedProfile.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-cyber-gray rounded-lg">
                    <div>
                      <div className="text-white font-medium">Auto-refresh Dashboard</div>
                      <div className="text-sm text-cyber-muted">Refresh data every 30 seconds</div>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-cyber-lime">
                      <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-cyber-gray rounded-lg">
                    <div>
                      <div className="text-white font-medium">Sound Alerts</div>
                      <div className="text-sm text-cyber-muted">Play sound for critical alerts</div>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-cyber-gray border border-cyber-light">
                      <div className="w-5 h-5 rounded-full bg-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyber-light">
                  <h4 className="text-white font-medium mb-3">Language & Region</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-cyber-muted mb-2">Language</label>
                      <select className="cyber-input w-full">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-cyber-muted mb-2">Timezone</label>
                      <select className="cyber-input w-full">
                        <option>UTC-05:00 Eastern Time</option>
                        <option>UTC-08:00 Pacific Time</option>
                        <option>UTC+00:00 GMT</option>
                        <option>UTC+01:00 Central European</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-cyber-lime flex items-center justify-center text-2xl font-bold text-cyber-black">
                    {editedProfile.avatar}
                  </div>
                  <div>
                    <button className="cyber-button text-sm">Change Avatar</button>
                    <p className="text-xs text-cyber-muted mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cyber-muted mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="cyber-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cyber-muted mb-2">Email</label>
                    <input 
                      type="email" 
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="cyber-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cyber-muted mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                      className="cyber-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cyber-muted mb-2">Department</label>
                    <input 
                      type="text" 
                      value={editedProfile.department}
                      onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                      className="cyber-input w-full"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-cyber-light">
                  <h4 className="text-white font-medium mb-3">Bio</h4>
                  <textarea 
                    className="cyber-input w-full h-24 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Critical Threat Alerts', desc: 'Immediate notifications for critical threats', enabled: true },
                    { label: 'Daily Summary', desc: 'Receive daily security summary email', enabled: true },
                    { label: 'New Vulnerabilities', desc: 'Alerts for new CVEs affecting your systems', enabled: false },
                    { label: 'System Updates', desc: 'Notifications for platform updates', enabled: true },
                    { label: 'Team Activity', desc: 'Updates on team member actions', enabled: false },
                    { label: 'Marketing Emails', desc: 'Product updates and promotional content', enabled: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-cyber-gray rounded-lg">
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-sm text-cyber-muted">{item.desc}</div>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-cyber-lime' : 'bg-cyber-gray border border-cyber-light'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                
                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-white font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-cyber-muted">Add an extra layer of security</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-500 text-sm">Enabled</span>
                    </div>
                  </div>
                  <button className="cyber-button-outline text-sm">Configure 2FA</button>
                </div>

                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="text-white font-medium mb-2">Change Password</div>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current password" className="cyber-input w-full" />
                    <input type="password" placeholder="New password" className="cyber-input w-full" />
                    <input type="password" placeholder="Confirm new password" className="cyber-input w-full" />
                    <button className="cyber-button text-sm">Update Password</button>
                  </div>
                </div>

                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="text-white font-medium mb-2">Active Sessions</div>
                  <div className="space-y-2">
                    {[
                      { device: 'Chrome on Windows', location: 'New York, US', current: true },
                      { device: 'Safari on macOS', location: 'San Francisco, US', current: false },
                      { device: 'Firefox on Linux', location: 'London, UK', current: false },
                    ].map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                        <div>
                          <div className="text-sm text-white">{session.device}</div>
                          <div className="text-xs text-cyber-muted">{session.location}</div>
                        </div>
                        {session.current ? (
                          <span className="text-xs text-cyber-lime">Current</span>
                        ) : (
                          <button className="text-xs text-red-500 hover:text-red-400">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Integrations</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Slack', desc: 'Security alerts to channels', icon: 'S', connected: true },
                    { name: 'Jira', desc: 'Create tickets from threats', icon: 'J', connected: true },
                    { name: 'Splunk', desc: 'Log forwarding', icon: 'Sp', connected: false },
                    { name: 'ServiceNow', desc: 'ITSM integration', icon: 'SN', connected: false },
                    { name: 'PagerDuty', desc: 'On-call notifications', icon: 'PD', connected: true },
                    { name: 'Webhook', desc: 'Custom HTTP callbacks', icon: 'WH', connected: false },
                  ].map((integration, idx) => (
                    <div key={idx} className="p-4 bg-cyber-gray rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-lg bg-cyber-dark flex items-center justify-center text-cyber-lime font-bold">{integration.icon}</div>
                        <div className={`w-2 h-2 rounded-full ${integration.connected ? 'bg-green-500' : 'bg-cyber-muted'}`} />
                      </div>
                      <div className="text-white font-medium">{integration.name}</div>
                      <div className="text-sm text-cyber-muted mb-3">{integration.desc}</div>
                      <button className={`text-sm ${integration.connected ? 'text-red-500' : 'text-cyber-lime'}`}>
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Billing & Subscription</h3>
                
                <div className="p-6 bg-cyber-lime/10 border border-cyber-lime/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-cyber-lime font-medium">Enterprise Plan</div>
                      <div className="text-3xl font-bold text-white">$499<span className="text-lg text-cyber-muted">/month</span></div>
                    </div>
                    <button className="cyber-button">Upgrade Plan</button>
                  </div>
                  <div className="mt-4 text-sm text-cyber-muted">
                    Next billing date: <span className="text-white">March 15, 2025</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Usage</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyber-muted">Monitored Assets</span>
                        <span className="text-white">847 / 1,000</span>
                      </div>
                      <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                        <div className="h-full bg-cyber-lime rounded-full" style={{ width: '84.7%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyber-muted">Log Storage</span>
                        <span className="text-white">450 GB / 500 GB</span>
                      </div>
                      <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-cyber-muted">API Calls</span>
                        <span className="text-white">12K / 50K</span>
                      </div>
                      <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '24%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Payment Method</h4>
                  <div className="flex items-center space-x-4 p-4 bg-cyber-gray rounded-lg">
                    <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-cyber-black font-bold text-xs">VISA</div>
                    <div className="flex-1">
                      <div className="text-white">•••• •••• •••• 4242</div>
                      <div className="text-sm text-cyber-muted">Expires 12/26</div>
                    </div>
                    <button className="text-cyber-lime text-sm">Update</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">API Keys</h3>
                
                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-white font-medium">Production API Key</div>
                      <div className="text-sm text-cyber-muted">For live environment</div>
                    </div>
                    <button className="cyber-button-outline text-sm">Generate New</button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-3 bg-cyber-dark rounded font-mono text-sm text-cyber-lime">
                      cs_live_51H7xYZ2eZvKYlo2C0XJqY8mPt
                    </code>
                    <button className="p-2 bg-cyber-dark rounded hover:bg-cyber-light">
                      <Copy className="w-4 h-4 text-cyber-muted" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-cyber-gray rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-white font-medium">Sandbox API Key</div>
                      <div className="text-sm text-cyber-muted">For testing and development</div>
                    </div>
                    <button className="cyber-button-outline text-sm">Generate New</button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-3 bg-cyber-dark rounded font-mono text-sm text-cyber-lime">
                      cs_test_51H7xYZ2eZvKYlo2C0TestKey
                    </code>
                    <button className="p-2 bg-cyber-dark rounded hover:bg-cyber-light">
                      <Copy className="w-4 h-4 text-cyber-muted" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyber-light">
                  <h4 className="text-white font-medium mb-3">Webhook Endpoints</h4>
                  <div className="space-y-2">
                    {[
                      { url: 'https://api.yourcompany.com/webhooks/cybershield', events: ['threat.alert', 'incident.created'] },
                    ].map((hook, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-cyber-dark rounded">
                        <div>
                          <div className="text-sm text-white">{hook.url}</div>
                          <div className="text-xs text-cyber-muted">{hook.events.join(', ')}</div>
                        </div>
                        <button className="text-red-500 text-sm">Delete</button>
                      </div>
                    ))}
                  </div>
                  <button className="cyber-button-outline text-sm mt-3">Add Endpoint</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-cyber-light">
          <button onClick={onClose} className="cyber-button-outline">Cancel</button>
          <button onClick={handleSave} className="cyber-button">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
};

// Profile Modal
const ProfileModal = ({ isOpen, onClose, profile }: { isOpen: boolean; onClose: () => void; profile: UserProfile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
      >
        <div className="relative h-32 bg-gradient-to-r from-cyber-lime/20 to-cyber-lime/5">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-cyber-dark/50 rounded-lg text-white hover:bg-cyber-dark">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-cyber-lime border-4 border-cyber-dark flex items-center justify-center text-4xl font-bold text-cyber-black">
              {profile.avatar}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-cyber-muted">{profile.role} • {profile.department}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-cyber-gray rounded-lg">
              <div className="flex items-center space-x-2 text-cyber-muted mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </div>
              <div className="text-white">{profile.email}</div>
            </div>
            <div className="p-4 bg-cyber-gray rounded-lg">
              <div className="flex items-center space-x-2 text-cyber-muted mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Phone</span>
              </div>
              <div className="text-white">{profile.phone}</div>
            </div>
            <div className="p-4 bg-cyber-gray rounded-lg">
              <div className="flex items-center space-x-2 text-cyber-muted mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined</span>
              </div>
              <div className="text-white">{profile.joinDate}</div>
            </div>
            <div className="p-4 bg-cyber-gray rounded-lg">
              <div className="flex items-center space-x-2 text-cyber-muted mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Last Login</span>
              </div>
              <div className="text-white">{profile.lastLogin}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${profile.mfaEnabled ? 'bg-green-500' : 'bg-cyber-muted'}`} />
              <span className="text-sm text-cyber-muted">2FA {profile.mfaEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-cyber-muted">Active</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ 
  companies, 
  setCompanies, 
  teamMembers, 
  setTeamMembers, 
  enquiries, 
  setEnquiries 
}: { 
  companies: Company[];
  setCompanies: (c: Company[]) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (t: TeamMember[]) => void;
  enquiries: Enquiry[];
  setEnquiries: (e: Enquiry[]) => void;
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState('all');

  // Company CRUD
  const handleAddCompany = (company: Omit<Company, 'id'>) => {
    const newCompany = { ...company, id: Date.now().toString() };
    setCompanies([...companies, newCompany]);
    setShowCompanyModal(false);
  };

  const handleEditCompany = (company: Company) => {
    setCompanies(companies.map(c => c.id === company.id ? company : c));
    setEditingCompany(null);
  };

  const handleDeleteCompany = (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  // Team CRUD
  const handleAddTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember = { ...member, id: Date.now().toString() };
    setTeamMembers([...teamMembers, newMember]);
    setShowTeamModal(false);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setTeamMembers(teamMembers.map(m => m.id === member.id ? member : m));
    setEditingMember(null);
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    }
  };

  // Enquiry handlers
  const handleAssignEnquiry = (enquiryId: string, assignedTo: string) => {
    setEnquiries(enquiries.map(e => e.id === enquiryId ? { ...e, assignedTo, status: 'in-progress' as const } : e));
  };

  const handleUpdateEnquiryStatus = (enquiryId: string, status: Enquiry['status']) => {
    setEnquiries(enquiries.map(e => e.id === enquiryId ? { ...e, status } : e));
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.email.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredEnquiries = enquiryFilter === 'all' 
    ? enquiries 
    : enquiries.filter(e => e.status === enquiryFilter);

  const adminStats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.status === 'active').length,
    totalUsers: companies.reduce((acc, c) => acc + c.users, 0),
    totalThreats: companies.reduce((acc, c) => acc + c.threats, 0),
    totalRevenue: companies.reduce((acc, c) => acc + (c.plan === 'enterprise' ? 499 : c.plan === 'professional' ? 199 : 49), 0),
    teamSize: teamMembers.length,
    openEnquiries: enquiries.filter(e => e.status === 'open' || e.status === 'in-progress').length,
  };

  return (
    <div className="space-y-6">
      {/* Admin Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: PieChart },
          { id: 'companies', label: 'Companies', icon: Building2 },
          { id: 'team', label: 'Team', icon: Users },
          { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'advanced', label: 'Advanced', icon: Sliders },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === item.id 
                ? 'bg-cyber-lime text-cyber-black' 
                : 'bg-cyber-gray text-cyber-muted hover:text-white'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="w-8 h-8 text-cyber-lime" />
                <span className="text-sm text-green-500">+12%</span>
              </div>
              <div className="text-3xl font-bold text-white">{adminStats.totalCompanies}</div>
              <div className="text-sm text-cyber-muted">Total Companies</div>
            </div>
            <div className="cyber-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-cyber-lime" />
                <span className="text-sm text-green-500">+8%</span>
              </div>
              <div className="text-3xl font-bold text-white">{adminStats.totalUsers}</div>
              <div className="text-sm text-cyber-muted">Total Users</div>
            </div>
            <div className="cyber-card p-6">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-cyber-lime" />
                <span className="text-sm text-green-500">+15%</span>
              </div>
              <div className="text-3xl font-bold text-white">${adminStats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-cyber-muted">Monthly Revenue</div>
            </div>
            <div className="cyber-card p-6">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-cyber-lime" />
                <span className="text-sm text-orange-500">{adminStats.openEnquiries} open</span>
              </div>
              <div className="text-3xl font-bold text-white">{enquiries.length}</div>
              <div className="text-sm text-cyber-muted">Total Enquiries</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="cyber-card">
              <div className="p-4 border-b border-cyber-light">
                <h3 className="text-lg font-semibold text-white">Recent Companies</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {companies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-3 bg-cyber-dark rounded-lg">
                      <div>
                        <div className="text-white font-medium">{company.name}</div>
                        <div className="text-sm text-cyber-muted">{company.industry} • {company.plan}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        company.status === 'active' ? 'bg-green-500/20 text-green-500' :
                        company.status === 'suspended' ? 'bg-red-500/20 text-red-500' :
                        'bg-cyber-muted/20 text-cyber-muted'
                      }`}>
                        {company.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cyber-card">
              <div className="p-4 border-b border-cyber-light">
                <h3 className="text-lg font-semibold text-white">Recent Enquiries</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {enquiries.slice(0, 5).map((enquiry) => (
                    <div key={enquiry.id} className="flex items-center justify-between p-3 bg-cyber-dark rounded-lg">
                      <div>
                        <div className="text-white font-medium">{enquiry.subject}</div>
                        <div className="text-sm text-cyber-muted">{enquiry.from} • {enquiry.company}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        enquiry.priority === 'urgent' ? 'bg-red-500/20 text-red-500' :
                        enquiry.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        enquiry.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {enquiry.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <div className="p-4 border-b border-cyber-light">
              <h3 className="text-lg font-semibold text-white">Plan Distribution</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Starter', value: companies.filter(c => c.plan === 'starter').length, color: '#00ccff' },
                      { name: 'Professional', value: companies.filter(c => c.plan === 'professional').length, color: '#ff8800' },
                      { name: 'Enterprise', value: companies.filter(c => c.plan === 'enterprise').length, color: '#c6ff00' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Starter', value: companies.filter(c => c.plan === 'starter').length, color: '#00ccff' },
                      { name: 'Professional', value: companies.filter(c => c.plan === 'professional').length, color: '#ff8800' },
                      { name: 'Enterprise', value: companies.filter(c => c.plan === 'enterprise').length, color: '#c6ff00' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-muted" />
              <input
                type="text"
                placeholder="Search companies..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="cyber-input pl-10 w-80"
              />
            </div>
            <button 
              onClick={() => setShowCompanyModal(true)}
              className="cyber-button flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>

          <div className="cyber-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-mono text-cyber-muted border-b border-cyber-light">
                  <th className="pb-3 pl-4">COMPANY</th>
                  <th className="pb-3">INDUSTRY</th>
                  <th className="pb-3">PLAN</th>
                  <th className="pb-3">USERS</th>
                  <th className="pb-3">THREATS</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3">EXPIRY</th>
                  <th className="pb-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-b border-cyber-light/50 hover:bg-cyber-gray/50">
                    <td className="py-4 pl-4">
                      <div>
                        <div className="text-white font-medium">{company.name}</div>
                        <div className="text-sm text-cyber-muted">{company.email}</div>
                      </div>
                    </td>
                    <td className="py-4 text-cyber-muted">{company.industry}</td>
                    <td className="py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        company.plan === 'enterprise' ? 'bg-cyber-lime/20 text-cyber-lime' :
                        company.plan === 'professional' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {company.plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-white">{company.users}</td>
                    <td className="py-4 text-white">{company.threats.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        company.status === 'active' ? 'bg-green-500/20 text-green-500' :
                        company.status === 'suspended' ? 'bg-red-500/20 text-red-500' :
                        'bg-cyber-muted/20 text-cyber-muted'
                      }`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="py-4 text-cyber-muted">{company.expiryDate}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditingCompany(company)}
                          className="p-2 text-cyber-muted hover:text-cyber-lime"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCompany(company.id)}
                          className="p-2 text-cyber-muted hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Team Management</h3>
            <button 
              onClick={() => setShowTeamModal(true)}
              className="cyber-button flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="cyber-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyber-lime flex items-center justify-center text-lg font-bold text-cyber-black">
                    {member.avatar}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => setEditingMember(member)}
                      className="p-2 text-cyber-muted hover:text-cyber-lime"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTeamMember(member.id)}
                      className="p-2 text-cyber-muted hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-white font-medium">{member.name}</div>
                  <div className="text-sm text-cyber-muted">{member.email}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cyber-muted">Role</span>
                    <span className="text-white capitalize">{member.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyber-muted">Department</span>
                    <span className="text-white">{member.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyber-muted">Status</span>
                    <span className={`${
                      member.status === 'active' ? 'text-green-500' :
                      member.status === 'onleave' ? 'text-yellow-500' :
                      'text-cyber-muted'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enquiries Tab */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {['all', 'open', 'in-progress', 'resolved', 'closed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setEnquiryFilter(filter)}
                  className={`px-3 py-1 rounded text-sm capitalize transition-all ${
                    enquiryFilter === filter 
                      ? 'bg-cyber-lime text-cyber-black' 
                      : 'bg-cyber-gray text-cyber-muted hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="cyber-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-medium">{enquiry.subject}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        enquiry.priority === 'urgent' ? 'bg-red-500/20 text-red-500' :
                        enquiry.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        enquiry.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {enquiry.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        enquiry.status === 'open' ? 'bg-blue-500/20 text-blue-500' :
                        enquiry.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-500' :
                        enquiry.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
                        'bg-cyber-muted/20 text-cyber-muted'
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-cyber-muted mb-2">{enquiry.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-cyber-muted">
                      <span>From: {enquiry.from}</span>
                      <span>Company: {enquiry.company}</span>
                      <span>{enquiry.createdAt.toLocaleDateString()}</span>
                      {enquiry.assignedTo && <span>Assigned: {enquiry.assignedTo}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={enquiry.assignedTo || ''}
                      onChange={(e) => handleAssignEnquiry(enquiry.id, e.target.value)}
                      className="cyber-input text-sm"
                    >
                      <option value="">Assign to...</option>
                      {teamMembers.filter(m => m.status === 'active').map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleUpdateEnquiryStatus(enquiry.id, e.target.value as Enquiry['status'])}
                      className="cyber-input text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="cyber-card">
              <div className="p-4 border-b border-cyber-light">
                <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={[
                    { month: 'Jan', revenue: 12000 },
                    { month: 'Feb', revenue: 15000 },
                    { month: 'Mar', revenue: 18000 },
                    { month: 'Apr', revenue: 22000 },
                    { month: 'May', revenue: 28000 },
                    { month: 'Jun', revenue: 35000 },
                  ]}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c6ff00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#c6ff00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#c6ff00" fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="cyber-card">
              <div className="p-4 border-b border-cyber-light">
                <h3 className="text-lg font-semibold text-white">User Growth</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { month: 'Jan', users: 120 },
                    { month: 'Feb', users: 180 },
                    { month: 'Mar', users: 250 },
                    { month: 'Apr', users: 380 },
                    { month: 'May', users: 520 },
                    { month: 'Jun', users: 690 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }} />
                    <Line type="monotone" dataKey="users" stroke="#c6ff00" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="cyber-card">
            <div className="p-4 border-b border-cyber-light">
              <h3 className="text-lg font-semibold text-white">Industry Distribution</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { industry: 'Technology', count: 45 },
                  { industry: 'Finance', count: 32 },
                  { industry: 'Healthcare', count: 28 },
                  { industry: 'Retail', count: 22 },
                  { industry: 'Education', count: 15 },
                  { industry: 'Other', count: 18 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="industry" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a' }} />
                  <Bar dataKey="count" fill="#c6ff00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg">
                  <div>
                    <div className="text-white">Maintenance Mode</div>
                    <div className="text-sm text-cyber-muted">Put site in maintenance mode</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-cyber-gray border border-cyber-light">
                    <div className="w-5 h-5 rounded-full bg-white translate-x-0.5" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg">
                  <div>
                    <div className="text-white">User Registration</div>
                    <div className="text-sm text-cyber-muted">Allow new user signups</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-cyber-lime">
                    <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg">
                  <div>
                    <div className="text-white">API Rate Limiting</div>
                    <div className="text-sm text-cyber-muted">Enable rate limiting on API</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-cyber-lime">
                    <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Backup & Restore</h3>
              <div className="space-y-4">
                <div className="p-4 bg-cyber-dark rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white">Last Backup</div>
                    <span className="text-sm text-cyber-muted">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="cyber-button-outline text-sm flex-1">Backup Now</button>
                    <button className="cyber-button-outline text-sm flex-1">Restore</button>
                  </div>
                </div>
                <div className="p-4 bg-cyber-dark rounded-lg">
                  <div className="text-white mb-2">Auto Backup Schedule</div>
                  <select className="cyber-input w-full">
                    <option>Every 6 hours</option>
                    <option>Every 12 hours</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Email Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-cyber-muted mb-1">SMTP Host</label>
                  <input type="text" className="cyber-input w-full" placeholder="smtp.example.com" />
                </div>
                <div>
                  <label className="block text-sm text-cyber-muted mb-1">SMTP Port</label>
                  <input type="text" className="cyber-input w-full" placeholder="587" />
                </div>
                <div>
                  <label className="block text-sm text-cyber-muted mb-1">From Email</label>
                  <input type="email" className="cyber-input w-full" placeholder="noreply@cybershield.com" />
                </div>
                <button className="cyber-button text-sm w-full">Save Configuration</button>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg">
                  <div>
                    <div className="text-white">Force 2FA</div>
                    <div className="text-sm text-cyber-muted">Require 2FA for all users</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-cyber-lime">
                    <div className="w-5 h-5 rounded-full bg-white translate-x-6" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg">
                  <div>
                    <div className="text-white">IP Whitelist</div>
                    <div className="text-sm text-cyber-muted">Restrict access by IP</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-cyber-gray border border-cyber-light">
                    <div className="w-5 h-5 rounded-full bg-white translate-x-0.5" />
                  </div>
                </div>
                <div className="p-4 bg-cyber-dark rounded-lg">
                  <div className="text-white mb-2">Session Timeout</div>
                  <select className="cyber-input w-full">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div>
                  <div className="text-red-500 font-medium">Purge All Data</div>
                  <div className="text-sm text-cyber-muted">Permanently delete all company data</div>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                  Purge
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div>
                  <div className="text-red-500 font-medium">Reset System</div>
                  <div className="text-sm text-cyber-muted">Reset to factory defaults</div>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {(showCompanyModal || editingCompany) && (
        <CompanyModal
          isOpen={showCompanyModal || !!editingCompany}
          onClose={() => { setShowCompanyModal(false); setEditingCompany(null); }}
          company={editingCompany}
          onSave={editingCompany ? handleEditCompany : handleAddCompany}
        />
      )}

      {/* Team Modal */}
      {(showTeamModal || editingMember) && (
        <TeamModal
          isOpen={showTeamModal || !!editingMember}
          onClose={() => { setShowTeamModal(false); setEditingMember(null); }}
          member={editingMember}
          onSave={editingMember ? handleEditTeamMember : handleAddTeamMember}
        />
      )}
    </div>
  );
};

// Company Modal
const CompanyModal = ({ isOpen, onClose, company, onSave }: { 
  isOpen: boolean; 
  onClose: () => void; 
  company: Company | null;
  onSave: (c: any) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Company>>(company || {
    name: '',
    industry: '',
    size: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    plan: 'starter',
    joinDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    users: 0,
    threats: 0,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b border-cyber-light">
          <h2 className="text-xl font-bold text-white">
            {company ? 'Edit Company' : 'Add New Company'}
          </h2>
          <button onClick={onClose} className="p-2 text-cyber-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Company Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Industry</label>
              <select 
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="cyber-input w-full"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Company Size</label>
              <select 
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                className="cyber-input w-full"
              >
                <option value="">Select Size</option>
                <option value="1-50">1-50 employees</option>
                <option value="50-100">50-100 employees</option>
                <option value="100-500">100-500 employees</option>
                <option value="500-1000">500-1000 employees</option>
                <option value="1000-5000">1000-5000 employees</option>
                <option value="5000+">5000+ employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Plan</label>
              <select 
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value as Company['plan']})}
                className="cyber-input w-full"
              >
                <option value="starter">Starter ($49/month)</option>
                <option value="professional">Professional ($199/month)</option>
                <option value="enterprise">Enterprise ($499/month)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Phone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="cyber-input w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-cyber-muted mb-1">Address</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as Company['status']})}
                className="cyber-input w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Expiry Date</label>
              <input 
                type="date" 
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="cyber-input w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-cyber-light">
          <button onClick={onClose} className="cyber-button-outline">Cancel</button>
          <button onClick={() => onSave(formData)} className="cyber-button">
            {company ? 'Save Changes' : 'Add Company'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Team Modal
const TeamModal = ({ isOpen, onClose, member, onSave }: { 
  isOpen: boolean; 
  onClose: () => void; 
  member: TeamMember | null;
  onSave: (m: any) => void;
}) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>(member || {
    name: '',
    email: '',
    role: 'analyst',
    department: '',
    status: 'active',
    avatar: '',
    permissions: [],
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-cyber-dark border border-cyber-light rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-cyber-light">
          <h2 className="text-xl font-bold text-white">
            {member ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <button onClick={onClose} className="p-2 text-cyber-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-cyber-muted mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value, avatar: e.target.value.split(' ').map(n => n[0]).join('').toUpperCase()})}
              className="cyber-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-cyber-muted mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="cyber-input w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Role</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as TeamMember['role']})}
                className="cyber-input w-full"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Department</label>
              <select 
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="cyber-input w-full"
              >
                <option value="">Select Department</option>
                <option value="Security">Security</option>
                <option value="Operations">Operations</option>
                <option value="Threat Intel">Threat Intel</option>
                <option value="Compliance">Compliance</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-cyber-muted mb-1">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as TeamMember['status']})}
              className="cyber-input w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="onleave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-cyber-light">
          <button onClick={onClose} className="cyber-button-outline">Cancel</button>
          <button onClick={() => onSave(formData)} className="cyber-button">
            {member ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 cyber-grid opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-black/50 to-cyber-black" />
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyber-lime/10 border border-cyber-lime/30 mb-6">
            <Radio className="w-4 h-4 text-cyber-lime animate-pulse" />
            <span className="text-sm text-cyber-lime font-mono">LIVE THREAT MONITORING ACTIVE</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          AI-Powered{' '}
          <span className="text-cyber-lime cyber-text-glow">Cyber Threat</span>
          <br />
          Intelligence & SIEM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-cyber-muted max-w-3xl mx-auto mb-10"
        >
          Real-time monitoring, advanced threat detection, and automated incident response 
          for modern enterprises. Protect your digital infrastructure with military-grade security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button className="cyber-button flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Explore Dashboard</span>
          </button>
          <button className="cyber-button-outline flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>View Documentation</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 relative"
        >
          <div className="relative rounded-xl overflow-hidden border border-cyber-light shadow-2xl">
            <img 
              src="/hero-globe.jpg" 
              alt="Cyber Globe" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyber-lime rounded-full animate-pulse" />
                  <span className="text-sm text-cyber-muted font-mono">10,847 THREATS BLOCKED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-cyber-muted font-mono">99.9% UPTIME</span>
                </div>
              </div>
              <span className="text-sm text-cyber-lime font-mono">LIVE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Stats Overview Component
const StatsOverview = () => {
  const stats = [
    { label: 'Threats Blocked', value: '10,847', change: '+12%', icon: Shield, color: 'text-cyber-lime' },
    { label: 'Active Alerts', value: '23', change: '-5%', icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Network Traffic', value: '2.4 TB', change: '+8%', icon: Network, color: 'text-blue-500' },
    { label: 'System Health', value: '98.5%', change: '+2%', icon: Activity, color: 'text-green-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="cyber-card-hover p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <span className={`text-sm font-mono ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-cyber-muted">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Live Threat Alerts Component
const ThreatAlertsPanel = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const filteredAlerts = filter === 'all' ? threatAlerts : threatAlerts.filter(a => a.severity === filter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-cyber-lime/20 text-cyber-lime border-cyber-lime/30';
    }
  };

  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-white">Live Threat Alerts</h3>
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filter === f 
                  ? 'bg-cyber-lime text-cyber-black' 
                  : 'bg-cyber-gray text-cyber-muted hover:text-white'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-4 p-4 bg-cyber-dark rounded-lg border border-cyber-light hover:border-cyber-lime/50 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${
                alert.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                alert.severity === 'high' ? 'bg-orange-500' :
                alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">{alert.type}</span>
                  <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-cyber-muted mb-2">{alert.description}</p>
                <div className="flex items-center space-x-4 text-xs font-mono text-cyber-muted">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.source}</span>
                  </span>
                  <span>→</span>
                  <span>{alert.target}</span>
                  <span className="ml-auto">{alert.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Attack Type Distribution
const AttackTypeChart = () => {
  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyber-lime" />
          <span>Attack Type Distribution</span>
        </h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={attackTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {attackTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {attackTypeData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-cyber-muted">{item.name}</span>
              <span className="text-sm text-white ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Threat Trend Chart
const ThreatTrendChart = () => {
  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-cyber-lime" />
          <span>Threat Trends (24h)</span>
        </h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={threatTrendData}>
            <defs>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c6ff00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#c6ff00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="time" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="threats" stroke="#c6ff00" fillOpacity={1} fill="url(#colorThreats)" />
            <Area type="monotone" dataKey="blocked" stroke="#00ccff" fill="none" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// SIEM Log Analysis
const SIEMLogAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredLogs = logEntries.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || log.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-cyber-lime" />
            <span>SIEM Log Analysis</span>
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-muted" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-input pl-10 w-64"
              />
            </div>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="cyber-input"
            >
              <option value="all">All Types</option>
              <option value="BLOCK">BLOCK</option>
              <option value="ALERT">ALERT</option>
              <option value="ERROR">ERROR</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
            </select>
            <button className="p-2 bg-cyber-gray rounded hover:bg-cyber-light transition-colors">
              <Filter className="w-4 h-4 text-cyber-muted" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-mono text-cyber-muted border-b border-cyber-light">
                <th className="pb-3 pl-4">TIMESTAMP</th>
                <th className="pb-3">SOURCE</th>
                <th className="pb-3">TYPE</th>
                <th className="pb-3">MESSAGE</th>
                <th className="pb-3">SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-cyber-light/50 hover:bg-cyber-gray/50 transition-colors">
                  <td className="py-3 pl-4 text-sm font-mono text-cyber-muted">
                    {log.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-3 text-sm text-white">{log.source}</td>
                  <td className="py-3">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${
                      log.type === 'BLOCK' ? 'bg-red-500/20 text-red-500' :
                      log.type === 'ALERT' ? 'bg-orange-500/20 text-orange-500' :
                      log.type === 'ERROR' ? 'bg-red-500/20 text-red-500' :
                      log.type === 'WARN' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-cyber-muted">{log.message}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      log.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                      log.severity === 'medium' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Network Monitoring
const NetworkMonitoring = () => {
  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Wifi className="w-5 h-5 text-cyber-lime" />
          <span>Network Traffic Monitor</span>
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-1">Total Connections</div>
            <div className="text-2xl font-bold text-white">1,247</div>
            <div className="text-xs text-green-500 mt-1">+3.2% from last hour</div>
          </div>
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-1">Bandwidth Usage</div>
            <div className="text-2xl font-bold text-white">847 Mbps</div>
            <div className="text-xs text-orange-500 mt-1">+12% spike detected</div>
          </div>
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-1">Blocked Connections</div>
            <div className="text-2xl font-bold text-red-500">23</div>
            <div className="text-xs text-red-500 mt-1">Potential threats</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-mono text-cyber-muted border-b border-cyber-light">
                <th className="pb-3 pl-4">SOURCE IP</th>
                <th className="pb-3">DESTINATION IP</th>
                <th className="pb-3">PORT</th>
                <th className="pb-3">PROTOCOL</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">BYTES</th>
              </tr>
            </thead>
            <tbody>
              {networkConnections.map((conn) => (
                <tr key={conn.id} className="border-b border-cyber-light/50 hover:bg-cyber-gray/50 transition-colors">
                  <td className="py-3 pl-4 text-sm font-mono text-white">{conn.sourceIP}</td>
                  <td className="py-3 text-sm font-mono text-cyber-muted">{conn.destIP}</td>
                  <td className="py-3 text-sm text-white">{conn.port}</td>
                  <td className="py-3 text-sm text-cyber-muted">{conn.protocol}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      conn.status === 'active' ? 'bg-green-500/20 text-green-500' :
                      conn.status === 'suspicious' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {conn.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-sm font-mono text-cyber-muted">
                    {(conn.bytes / 1024).toFixed(1)} KB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Vulnerability Management
const VulnerabilityManagement = () => {
  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Bug className="w-5 h-5 text-cyber-lime" />
          <span>Vulnerability Management</span>
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="text-3xl font-bold text-red-500 mb-1">3</div>
            <div className="text-xs text-cyber-muted">Critical</div>
          </div>
          <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <div className="text-3xl font-bold text-orange-500 mb-1">7</div>
            <div className="text-xs text-cyber-muted">High</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <div className="text-3xl font-bold text-yellow-500 mb-1">12</div>
            <div className="text-xs text-cyber-muted">Medium</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="text-3xl font-bold text-green-500 mb-1">28</div>
            <div className="text-xs text-cyber-muted">Low</div>
          </div>
        </div>

        <div className="space-y-3">
          {cveList.map((cve) => (
            <div key={cve.id} className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg border border-cyber-light">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-sm font-mono text-cyber-lime">{cve.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    cve.cvss >= 9 ? 'bg-red-500/20 text-red-500' :
                    cve.cvss >= 7 ? 'bg-orange-500/20 text-orange-500' :
                    cve.cvss >= 4 ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>
                    CVSS {cve.cvss}
                  </span>
                </div>
                <p className="text-sm text-cyber-muted">{cve.description}</p>
                <p className="text-xs text-cyber-muted mt-1">Affected: {cve.affected}</p>
              </div>
              <div className="ml-4">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  cve.patchStatus === 'patched' ? 'bg-green-500/20 text-green-500' :
                  cve.patchStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {cve.patchStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// IAM Security Panel
const IAMSecurityPanel = () => {
  const users = [
    { name: 'admin', role: 'Administrator', lastLogin: '2 mins ago', mfa: true, status: 'active' },
    { name: 'john.doe', role: 'Analyst', lastLogin: '15 mins ago', mfa: true, status: 'active' },
    { name: 'jane.smith', role: 'Security Engineer', lastLogin: '1 hour ago', mfa: false, status: 'warning' },
    { name: 'guest', role: 'Guest', lastLogin: '3 days ago', mfa: false, status: 'inactive' },
  ];

  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Key className="w-5 h-5 text-cyber-lime" />
          <span>User & Access Monitoring</span>
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-1">Active Sessions</div>
            <div className="text-2xl font-bold text-white">47</div>
          </div>
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-1">Failed Logins (24h)</div>
            <div className="text-2xl font-bold text-orange-500">23</div>
          </div>
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-1">MFA Coverage</div>
            <div className="text-2xl font-bold text-cyber-lime">87%</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-mono text-cyber-muted border-b border-cyber-light">
                <th className="pb-3 pl-4">USER</th>
                <th className="pb-3">ROLE</th>
                <th className="pb-3">LAST LOGIN</th>
                <th className="pb-3">MFA</th>
                <th className="pb-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-b border-cyber-light/50 hover:bg-cyber-gray/50 transition-colors">
                  <td className="py-3 pl-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cyber-gray flex items-center justify-center">
                        <User className="w-4 h-4 text-cyber-muted" />
                      </div>
                      <span className="text-sm text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-cyber-muted">{user.role}</td>
                  <td className="py-3 text-sm font-mono text-cyber-muted">{user.lastLogin}</td>
                  <td className="py-3">
                    {user.mfa ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-500' :
                      user.status === 'warning' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-cyber-muted/20 text-cyber-muted'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Malware Analysis Panel
const MalwareAnalysisPanel = () => {
  const [hash, setHash] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <FileSearch className="w-5 h-5 text-cyber-lime" />
          <span>Malware Analysis</span>
        </h3>
      </div>
      <div className="p-4">
        <div className="mb-6">
          <label className="block text-sm text-cyber-muted mb-2">File Hash Lookup (MD5/SHA256)</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Enter file hash..."
              className="cyber-input flex-1 font-mono"
            />
            <button 
              onClick={handleScan}
              disabled={scanning || !hash}
              className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanning ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-2">Detection Rate</div>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-bold text-red-500">67</span>
              <span className="text-lg text-cyber-muted">/ 70</span>
            </div>
            <div className="text-xs text-red-500 mt-1">Highly Malicious</div>
          </div>
          <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-light">
            <div className="text-sm text-cyber-muted mb-2">File Type</div>
            <div className="text-xl font-bold text-white">PE32 Executable</div>
            <div className="text-xs text-cyber-muted mt-1">Windows binary</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white mb-3">Detection Engines</h4>
          {[
            { engine: 'Kaspersky', result: 'Trojan.Win32.Agent', detected: true },
            { engine: 'Malwarebytes', result: 'Malware.AI.123456', detected: true },
            { engine: 'Symantec', result: 'Trojan.Gen.2', detected: true },
            { engine: 'Microsoft', result: 'Trojan:Win32/Casdet', detected: true },
            { engine: 'Avast', result: 'Clean', detected: false },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-cyber-dark rounded">
              <span className="text-sm text-white">{item.engine}</span>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${item.detected ? 'text-red-500' : 'text-green-500'}`}>
                  {item.result}
                </span>
                {item.detected ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Compliance & Risk Panel
const CompliancePanel = () => {
  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-cyber-lime" />
          <span>Compliance & Risk Overview</span>
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-cyber-lime mb-2">87</div>
              <div className="text-sm text-cyber-muted">Security Posture Score</div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'ISO 27001', progress: 92 },
                { label: 'NIST CSF', progress: 85 },
                { label: 'SOC 2', progress: 78 },
                { label: 'GDPR', progress: 88 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyber-muted">{item.label}</span>
                    <span className="text-white">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyber-lime rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={complianceData}>
                <PolarGrid stroke="#2a2a2a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name="Compliance"
                  dataKey="A"
                  stroke="#c6ff00"
                  fill="#c6ff00"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="text-2xl font-bold text-green-500">12</div>
            <div className="text-xs text-cyber-muted">Compliant</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-500">5</div>
            <div className="text-xs text-cyber-muted">In Progress</div>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="text-2xl font-bold text-red-500">2</div>
            <div className="text-xs text-cyber-muted">Non-Compliant</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Threat Intelligence Feed
const ThreatIntelligenceFeed = () => {
  const feeds = [
    { type: 'IOC', indicator: '185.220.101.42', threat: 'C2 Server', confidence: 95 },
    { type: 'Domain', indicator: 'evil-malware.com', threat: 'Phishing', confidence: 88 },
    { type: 'Hash', indicator: 'd41d8cd98f00b204e9800998ecf8427e', threat: 'Ransomware', confidence: 99 },
    { type: 'IP', indicator: '203.78.45.12', threat: 'Scanner', confidence: 72 },
  ];

  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Radio className="w-5 h-5 text-cyber-lime" />
          <span>Threat Intelligence Feed</span>
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {feeds.map((feed, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg border border-cyber-light">
              <div className="flex items-center space-x-4">
                <span className="text-xs px-2 py-1 rounded bg-cyber-lime/20 text-cyber-lime">
                  {feed.type}
                </span>
                <div>
                  <div className="text-sm font-mono text-white">{feed.indicator}</div>
                  <div className="text-xs text-cyber-muted">{feed.threat}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-white">{feed.confidence}%</div>
                  <div className="text-xs text-cyber-muted">Confidence</div>
                </div>
                <div className="w-16 h-2 bg-cyber-gray rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyber-lime rounded-full"
                    style={{ width: `${feed.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// AI Anomaly Detection
const AIAnomalyDetection = () => {
  const anomalies = [
    { type: 'Unusual Login Time', user: 'admin', severity: 'medium', time: '03:45 AM', confidence: 87 },
    { type: 'Data Exfiltration', user: 'john.doe', severity: 'high', time: 'Just now', confidence: 94 },
    { type: 'Privilege Escalation', user: 'guest', severity: 'critical', time: '5 mins ago', confidence: 98 },
    { type: 'Network Scanning', user: 'system', severity: 'low', time: '15 mins ago', confidence: 76 },
  ];

  return (
    <div className="cyber-card">
      <div className="p-4 border-b border-cyber-light">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyber-lime" />
          <span>AI Anomaly Detection</span>
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-cyber-dark rounded-lg border border-cyber-light">
            <Zap className="w-6 h-6 text-cyber-lime mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1.2M</div>
            <div className="text-xs text-cyber-muted">Events Analyzed</div>
          </div>
          <div className="text-center p-4 bg-cyber-dark rounded-lg border border-cyber-light">
            <Eye className="w-6 h-6 text-cyber-lime mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">47</div>
            <div className="text-xs text-cyber-muted">Anomalies Detected</div>
          </div>
          <div className="text-center p-4 bg-cyber-dark rounded-lg border border-cyber-light">
            <Activity className="w-6 h-6 text-cyber-lime mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">99.2%</div>
            <div className="text-xs text-cyber-muted">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-cyber-dark rounded-lg border border-cyber-light">
            <Clock className="w-6 h-6 text-cyber-lime mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">&lt;1s</div>
            <div className="text-xs text-cyber-muted">Response Time</div>
          </div>
        </div>

        <div className="space-y-3">
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-cyber-dark rounded-lg border border-cyber-light">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  anomaly.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                  anomaly.severity === 'high' ? 'bg-orange-500' :
                  anomaly.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <div className="text-sm text-white">{anomaly.type}</div>
                  <div className="text-xs text-cyber-muted">User: {anomaly.user}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-cyber-muted">{anomaly.time}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  anomaly.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                  anomaly.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                  anomaly.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {anomaly.confidence}% AI
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Module Header Component
const ModuleHeader = ({ activeTab }: { activeTab: string }) => {
  const moduleInfo: Record<string, { title: string; subtitle: string }> = {
    threats: { title: 'Threat Intelligence', subtitle: 'Real-time threat detection and analysis' },
    siem: { title: 'SIEM Log Analysis', subtitle: 'Centralized security event monitoring' },
    network: { title: 'Network Monitoring', subtitle: 'Network traffic and connection analysis' },
    vulnerabilities: { title: 'Vulnerability Management', subtitle: 'CVE tracking and patch management' },
    iam: { title: 'Identity & Access Management', subtitle: 'User access control and monitoring' },
    malware: { title: 'Malware Analysis', subtitle: 'Threat detection and sandbox analysis' },
    compliance: { title: 'Compliance Overview', subtitle: 'Regulatory compliance monitoring' },
    ai: { title: 'AI Anomaly Detection', subtitle: 'Machine learning powered threat detection' },
    // Advanced modules
    pentesting: { title: 'Web Application Pentesting', subtitle: 'Automated vulnerability scanning and assessment' },
    'malware-engine': { title: 'Malware Analysis Engine', subtitle: 'Advanced file analysis with sandbox simulation' },
    soar: { title: 'SOAR - Automated Response', subtitle: 'Security orchestration and automated incident response' },
    redblue: { title: 'Red Team vs Blue Team', subtitle: 'Adversary simulation and defense training' },
    honeypot: { title: 'Honeypot Integration', subtitle: 'Deception technology and threat capture' },
    'threat-hunt': { title: 'Threat Hunting', subtitle: 'Proactive threat detection and investigation' },
    darkweb: { title: 'Dark Web Intelligence', subtitle: 'Underground threat monitoring and reputation checks' },
    'cloud-sec': { title: 'Cloud Security Monitoring', subtitle: 'Multi-cloud security posture management' },
    zerotrust: { title: 'Zero Trust Architecture', subtitle: 'Continuous verification and access control' },
    'ai-advanced': { title: 'Advanced AI Features', subtitle: 'Predictive analytics and intelligent clustering' },
    financial: { title: 'Financial Impact Model', subtitle: 'Cyber risk quantification and cost analysis' },
    'attack-graph': { title: 'Attack Graph Visualization', subtitle: 'Multi-hop attack path analysis' },
    admin: { title: 'Admin Panel', subtitle: 'Manage companies, team members, and system settings' },
  };

  const info = moduleInfo[activeTab] || { title: activeTab.replace('-', ' '), subtitle: 'Security module' };

  return (
    <>
      <h2 className="text-3xl font-bold text-white capitalize mb-2">{info.title}</h2>
      <p className="text-cyber-muted">{info.subtitle}</p>
    </>
  );
};

// ==================== MAIN APP ====================
function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Alex Morgan',
    email: 'alex.morgan@cybershield.com',
    role: 'Security Administrator',
    avatar: 'AM',
    phone: '+1-555-0199',
    department: 'Security Operations',
    joinDate: '2022-06-15',
    lastLogin: 'Just now',
    mfaEnabled: true,
    notifications: true,
    darkMode: true,
  });

  // Admin panel state
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThreatAlertsPanel />
              <AttackTypeChart />
            </div>
            <ThreatTrendChart />
            <ThreatIntelligenceFeed />
          </div>
        );
      case 'threats':
        return (
          <div className="space-y-6">
            <ThreatAlertsPanel />
            <AttackTypeChart />
            <ThreatTrendChart />
          </div>
        );
      case 'siem':
        return (
          <div className="space-y-6">
            <SIEMLogAnalysis />
          </div>
        );
      case 'network':
        return (
          <div className="space-y-6">
            <NetworkMonitoring />
          </div>
        );
      case 'vulnerabilities':
        return (
          <div className="space-y-6">
            <VulnerabilityManagement />
          </div>
        );
      case 'iam':
        return (
          <div className="space-y-6">
            <IAMSecurityPanel />
          </div>
        );
      case 'malware':
        return (
          <div className="space-y-6">
            <MalwareAnalysisPanel />
          </div>
        );
      case 'compliance':
        return (
          <div className="space-y-6">
            <CompliancePanel />
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-6">
            <AIAnomalyDetection />
          </div>
        );
      // Advanced Modules
      case 'pentesting':
        return (
          <div className="space-y-6">
            <PentestingModule />
          </div>
        );
      case 'malware-engine':
        return (
          <div className="space-y-6">
            <MalwareAnalysisEngine />
          </div>
        );
      case 'soar':
        return (
          <div className="space-y-6">
            <SOARModule />
          </div>
        );
      case 'redblue':
        return (
          <div className="space-y-6">
            <RedTeamBlueTeamSimulation />
          </div>
        );
      case 'honeypot':
        return (
          <div className="space-y-6">
            <HoneypotModule />
          </div>
        );
      case 'threat-hunt':
        return (
          <div className="space-y-6">
            <ThreatHuntingModule />
          </div>
        );
      case 'darkweb':
        return (
          <div className="space-y-6">
            <DarkWebIntelligenceModule />
          </div>
        );
      case 'cloud-sec':
        return (
          <div className="space-y-6">
            <CloudSecurityModule />
          </div>
        );
      case 'zerotrust':
        return (
          <div className="space-y-6">
            <ZeroTrustModule />
          </div>
        );
      case 'ai-advanced':
        return (
          <div className="space-y-6">
            <AdvancedAIModule />
          </div>
        );
      case 'financial':
        return (
          <div className="space-y-6">
            <FinancialImpactModule />
          </div>
        );
      case 'attack-graph':
        return (
          <div className="space-y-6">
            <AttackGraphModule />
          </div>
        );
      case 'admin':
        return (
          <AdminPanel 
            companies={companies}
            setCompanies={setCompanies}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            enquiries={enquiries}
            setEnquiries={setEnquiries}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black cyber-grid">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onSettingsClick={() => setShowSettings(true)}
        onProfileClick={() => setShowProfile(true)}
      />
      
      {activeTab === 'overview' ? (
        <>
          <HeroSection />
          <main className="max-w-7xl mx-auto px-4 py-8">
            {renderContent()}
          </main>
        </>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-24">
          <div className="mb-8">
            <ModuleHeader activeTab={activeTab} />
          </div>
          {renderContent()}
        </main>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        profile={profile}
        setProfile={setProfile}
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        profile={profile}
      />

      {/* Footer */}
      <footer className="bg-cyber-dark border-t border-cyber-light mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-cyber-lime" />
                <span className="text-lg font-bold text-white">
                  Cyber<span className="text-cyber-lime">Shield</span>
                </span>
              </div>
              <p className="text-sm text-cyber-muted">
                Advanced threat detection and response platform for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-cyber-muted">
                <li><a href="#" className="hover:text-cyber-lime transition-colors">Threat Intelligence</a></li>
                <li><a href="#" className="hover:text-cyber-lime transition-colors">SIEM</a></li>
                <li><a href="#" className="hover:text-cyber-lime transition-colors">Network Monitoring</a></li>
                <li><a href="#" className="hover:text-cyber-lime transition-colors">Vulnerability Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-cyber-muted">
                <li><a href="#" className="hover:text-cyber-lime transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyber-lime transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-cyber-lime transition-colors">Security Blog</a></li>
                <li><a href="#" className="hover:text-cyber-lime transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-cyber-muted">
                <li>security@cybershield.com</li>
                <li>+1 (555) 123-4567</li>
                <li>24/7 SOC Hotline</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cyber-light mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-cyber-muted font-mono">
              © 2024 CyberShield. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="flex items-center space-x-2 text-sm text-cyber-muted">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All Systems Operational</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
