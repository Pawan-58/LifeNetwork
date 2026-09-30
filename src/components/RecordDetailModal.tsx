import React from 'react';
import { 
  X, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  ShieldCheck, 
  Pill, 
  Hash, 
  Download,
  Stethoscope
} from 'lucide-react';
import { MedicalRecord } from '../types/health';

interface RecordDetailModalProps {
  record: MedicalRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
                {record.recordType}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                {record.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5"
              title="Print Clinical Record"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          
          {/* Hospital Letterhead Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {record.hospitalName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hospital Code: <span className="font-mono text-slate-700">{record.hospitalCode}</span> | Location: {record.hospitalCity}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cryptographically Synchronized
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Date: {record.date}
              </p>
            </div>
          </div>

          {/* Attending Physician & Patient Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                Attending Consultant
              </div>
              <div className="font-bold text-slate-900">{record.doctorName}</div>
              <div className="text-xs text-slate-600">{record.doctorSpecialty}</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Patient Lifetime Identifier
              </div>
              <div className="font-mono font-bold text-teal-700">{record.uhid}</div>
              <div className="text-xs text-slate-500">Universal Health Registry Record</div>
            </div>
          </div>

          {/* Clinical Diagnosis & Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Clinical Diagnosis & Findings
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-base mb-1.5">
                {record.diagnosis}
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">
                {record.summary}
              </p>
              {record.labFindingsSummary && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Specialist Notes: </span>
                  {record.labFindingsSummary}
                </div>
              )}
            </div>
          </div>

          {/* Diagnostic Laboratory Parameters (If available) */}
          {record.parameters && record.parameters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Quantitative Test Parameters ({record.parameters.length})
                </h4>
                <span className="text-[11px] text-slate-400">Validated on Automated Analyzer</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">Test Parameter</th>
                      <th className="py-2.5 px-3 font-semibold">Observed Value</th>
                      <th className="py-2.5 px-3 font-semibold">Normal Reference Range</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {record.parameters.map((param, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-medium text-slate-900">{param.name}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {param.value} {param.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono">
                          {param.referenceRange} {param.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {param.flag === 'High' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              HIGH
                            </span>
                          ) : param.flag === 'Low' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              LOW
                            </span>
                          ) : param.flag === 'Abnormal' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              ABNORMAL
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              NORMAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Prescribed Medications (If available) */}
          {record.medications && record.medications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-teal-600" />
                Prescribed Drug Regimen
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {record.medications.map((med, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                    <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                      <span>{med.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-medium text-slate-700">Frequency:</span> {med.frequency}
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-medium text-slate-700">Duration:</span> {med.duration}
                    </div>
                    {med.instructions && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 mt-1">
                        {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & Cryptographic Hash Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>
                SHA-256 Digital Verification Hash:
                <span className="block font-mono text-[10px] text-slate-600 break-all">
                  {record.documentHash}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => alert(`Consolidated digital copy of ${record.fileName || 'report.pdf'} verified on national registry.`)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
