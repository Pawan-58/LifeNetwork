import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  HeartHandshake, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  BedDouble 
} from 'lucide-react';
import { Hospital, HospitalAdmission } from '../types/health';
import { api } from '../utils/api';

interface AdmitModalProps {
  patientUhid: string;
  patientName: string;
  hospital: Hospital;
  onClose: () => void;
  onSuccess: (admission: HospitalAdmission) => void;
}

export const AdmitModal: React.FC<AdmitModalProps> = ({
  patientUhid,
  patientName,
  hospital,
  onClose,
  onSuccess
}) => {
  const [ward, setWard] = useState('Critical Care & ICU Ward');
  const [bed, setBed] = useState('Bed 204-A');
  const [attendingDoctor, setAttendingDoctor] = useState('Dr. Rajesh Varma, MD');
  const [department, setDepartment] = useState('Cardiology & Intensive Care');
  const [admissionReason, setAdmissionReason] = useState('Acute coronary evaluation and 48-hour continuous hemodynamic monitoring');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.admitPatient({
        uhid: patientUhid,
        hospitalId: hospital.id,
        ward,
        bed,
        attendingDoctor,
        department,
        admissionReason
      });

      onSuccess(res.admission);
    } catch (err: any) {
      setError(err.message || 'Failed to admit patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Inpatient Hospital Admission</h2>
              <p className="text-xs text-slate-400">
                Grant clinical access under Active Hospital Stay protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-700" />
              Active Admission Privilege
            </div>
            <p>
              Once admitted into <strong>{hospital.name}</strong>, medical staff on duty can immediately review all past medical records across connected hospitals to provide life-saving care without asking the patient for PIN repeatedly.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div className="text-[11px] text-slate-500">Patient Admitted:</div>
              <div className="font-bold text-slate-900 text-sm">{patientName}</div>
            </div>
            <div className="font-mono text-teal-700 font-bold text-xs">{patientUhid}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ward / Unit *
              </label>
              <input
                type="text"
                required
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. ICU Ward 3"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bed Number *
              </label>
              <input
                type="text"
                required
                value={bed}
                onChange={(e) => setBed(e.target.value)}
                placeholder="e.g. Bed 102"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Attending Physician *
              </label>
              <input
                type="text"
                required
                value={attendingDoctor}
                onChange={(e) => setAttendingDoctor(e.target.value)}
                placeholder="e.g. Dr. Rajesh Varma"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Cardiology"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Admission Diagnosis & Reason *
            </label>
            <textarea
              rows={3}
              required
              value={admissionReason}
              onChange={(e) => setAdmissionReason(e.target.value)}
              placeholder="Primary clinical complaint requiring admission..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md shadow-amber-700/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Hospital Admission...' : 'Confirm Admission & Issue Token'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
