import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { Patient } from '../types/health';
import { api } from '../utils/api';

interface TemporaryPassModalProps {
  patient: Patient;
  onClose: () => void;
  onPassGenerated: (passCode: string) => void;
}

export const TemporaryPassModal: React.FC<TemporaryPassModalProps> = ({
  patient,
  onClose,
  onPassGenerated
}) => {
  const [targetHospital, setTargetHospital] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateTemporaryPass(patient.uhid, targetHospital || 'Consulting Doctor');
      setGeneratedPass(res.passCode);
      onPassGenerated(res.passCode);
    } catch (err: any) {
      setError(err.message || 'Failed to generate passcode');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!generatedPass) return;
    navigator.clipboard.writeText(generatedPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Generate Doctor Access Passcode</h3>
              <p className="text-[11px] text-slate-400">Temporary 24-Hour Clinical Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          
          <div className="text-slate-600 text-xs leading-relaxed">
            Need to show your test reports to a new doctor or hospital without sharing your permanent account PIN? 
            Generate a secure, single-hospital <strong>4-digit temporary passcode</strong> valid for 24 hours.
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!generatedPass ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital or Doctor Name (Optional)
                </label>
                <input
                  type="text"
                  value={targetHospital}
                  onChange={(e) => setTargetHospital(e.target.value)}
                  placeholder="e.g. Apollo Memorial or Dr. Rajesh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  Auto-Expiration & Safety
                </div>
                <p>
                  This temporary passcode automatically revokes in 24 hours. Every view is recorded with time and doctor name in your audit history.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Generating Encrypted Pass...' : 'Generate 24-Hour Passcode'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-teal-50 border-2 border-teal-500/40 text-center space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
                  Temporary Doctor Passcode
                </span>
                <div className="text-4xl font-extrabold font-mono text-teal-950 tracking-widest">
                  {generatedPass}
                </div>
                <p className="text-xs text-teal-700">
                  Valid for 24 Hours from now
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Passcode Copied' : 'Copy Passcode'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
