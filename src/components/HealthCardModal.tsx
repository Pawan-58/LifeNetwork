import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Printer, 
  Copy, 
  Check, 
  Heart, 
  AlertTriangle, 
  Lock, 
  Phone,
  Building2
} from 'lucide-react';
import { Patient } from '../types/health';

interface HealthCardModalProps {
  patient: Patient;
  onClose: () => void;
}

export const HealthCardModal: React.FC<HealthCardModalProps> = ({ patient, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyUhid = () => {
    navigator.clipboard.writeText(patient.uhid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm">Universal Patient Health Identity Card</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          
          {/* Printable Universal Health Card Widget */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-teal-500/30">
            {/* Background decorative watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <ShieldCheck className="w-48 h-48 text-teal-300" />
            </div>

            {/* Card Header */}
            <div className="flex items-start justify-between relative z-10 border-b border-teal-500/30 pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 block">
                  National Unified Healthcare Grid
                </span>
                <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                  Universal Health Card
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Heart className="w-5 h-5 fill-teal-400/20" />
              </div>
            </div>

            {/* Patient Primary Details */}
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Patient Name</span>
                  <div className="text-xl font-extrabold text-white">{patient.fullName}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Blood Group</span>
                  <div className="text-lg font-black text-rose-400 px-2.5 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/30 inline-block">
                    {patient.bloodGroup}
                  </div>
                </div>
              </div>

              {/* UHID Highlight Bar */}
              <div className="bg-slate-900/80 border border-teal-500/40 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-teal-300 uppercase tracking-wider font-semibold">
                    Universal Health ID (UHID)
                  </span>
                  <div className="text-base font-mono font-bold tracking-wider text-teal-200">
                    {patient.uhid}
                  </div>
                </div>
                <button
                  onClick={copyUhid}
                  className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs flex items-center gap-1 border border-teal-500/30 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Grid of Key Health Attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Date of Birth / Gender</span>
                  <span className="font-semibold text-slate-200">{patient.dateOfBirth} ({patient.gender})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Emergency Phone</span>
                  <span className="font-semibold text-slate-200 font-mono">{patient.emergencyContact?.phone || patient.phone}</span>
                </div>
              </div>

              {/* Critical Allergy Pill Alert */}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300 text-[11px] block">CRITICAL ALLERGIES:</span>
                    <span className="text-rose-200 text-[11px] font-medium">
                      {patient.allergies.join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Security Notice */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-teal-500/20">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-teal-400" /> Protected by 4-digit Security PIN
                </span>
                <span className="font-mono">VALID AT ALL CONNECTED HOSPITALS</span>
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs space-y-1.5 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-teal-950">
              <Building2 className="w-4 h-4 text-teal-700" />
              How to use at ANY Hospital
            </div>
            <p>
              Present your <strong>UHID ({patient.uhid})</strong> or registered mobile number at any connected hospital registration counter. 
              The hospital staff will look up your profile, but can <strong>only view your lifelong medical reports</strong> once you share your 4-digit PIN, generate a temporary passcode, or get admitted.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Card
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-teal-700/20"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
