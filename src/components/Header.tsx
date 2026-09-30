import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Stethoscope, 
  Server, 
  Lock, 
  LogOut, 
  UserPlus, 
  Activity, 
  ChevronRight,
  Database
} from 'lucide-react';
import { Patient } from '../types/health';

interface HeaderProps {
  activeTab: 'patient' | 'doctor' | 'network';
  setActiveTab: (tab: 'patient' | 'doctor' | 'network') => void;
  currentPatient: Patient | null;
  onLogoutPatient: () => void;
  onOpenRegister: () => void;
  onQuickSelectDemo: (type: 'pawan' | 'doctor') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentPatient,
  onLogoutPatient,
  onOpenRegister,
  onQuickSelectDemo,
}) => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      {/* Top Telemetry & Network Status Ticker */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              National Healthcare Grid Online
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              148 Connected Hospitals
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              High Availability SLA (99.998%)
            </span>
            <span className="text-slate-500 hidden lg:inline">|</span>
            <span className="hidden lg:inline text-slate-400">
              Encrypted HL7 FHIR v4 Gateway
            </span>
          </div>

          {/* Quick Demo Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline font-mono">Demo Profiles:</span>
            <button
              onClick={() => onQuickSelectDemo('pawan')}
              className="px-2 py-0.5 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 transition font-medium cursor-pointer"
              title="Switch to Pawan Kumar (Pre-loaded with 4 hospitals history)"
            >
              Patient: Pawan Kumar
            </button>
            <button
              onClick={() => onQuickSelectDemo('doctor')}
              className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition font-medium cursor-pointer"
              title="Switch to Doctor Clinical Desk"
            >
              Doctor Desk
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                OmniHealth Network
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Universal Health ID
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Unified Cross-Hospital National Patient Records Exchange
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="hidden md:flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('patient')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'patient'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Patient Health Vault
            {currentPatient && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'doctor'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Hospital & Doctor Desk
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'network'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Connected Hospitals & Grid
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentPatient ? (
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {currentPatient.fullName}
                </div>
                <div className="text-[11px] font-mono text-teal-400">
                  {currentPatient.uhid}
                </div>
              </div>
              <button
                onClick={onLogoutPatient}
                title="Lock & Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md shadow-teal-700/30 transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden border-t border-slate-800 bg-slate-900/95 px-2 py-1.5 justify-around">
        <button
          onClick={() => setActiveTab('patient')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'patient' ? 'bg-teal-600 text-white' : 'text-slate-400'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Patient Vault
        </button>
        <button
          onClick={() => setActiveTab('doctor')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'doctor' ? 'bg-sky-600 text-white' : 'text-slate-400'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          Doctor Desk
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
            activeTab === 'network' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          Hospitals
        </button>
      </div>
    </header>
  );
};
