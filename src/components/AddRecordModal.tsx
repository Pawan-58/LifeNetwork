import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  FileText, 
  Trash2, 
  Building2, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Hospital, MedicalRecord, RecordType, RecordPriority } from '../types/health';
import { api } from '../utils/api';

interface AddRecordModalProps {
  patientUhid: string;
  patientName: string;
  hospital: Hospital;
  doctorName: string;
  onClose: () => void;
  onSuccess: (record: MedicalRecord) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  patientUhid,
  patientName,
  hospital,
  doctorName,
  onClose,
  onSuccess
}) => {
  const [recordType, setRecordType] = useState<RecordType>('Lab Report');
  const [title, setTitle] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState<RecordPriority>('Normal');
  const [doctorSpecialty, setDoctorSpecialty] = useState('General Medicine');
  
  // Lab parameters
  const [parameters, setParameters] = useState<Array<{ name: string; value: string; unit: string; referenceRange: string; flag: 'Normal' | 'High' | 'Low' }>>([
    { name: 'Blood Glucose (Random)', value: '110', unit: 'mg/dL', referenceRange: '70 - 140', flag: 'Normal' }
  ]);

  // Medications
  const [medications, setMedications] = useState<Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addParamRow = () => {
    setParameters([
      ...parameters,
      { name: '', value: '', unit: '', referenceRange: '', flag: 'Normal' }
    ]);
  };

  const removeParamRow = (index: number) => {
    setParameters(parameters.filter((_, idx) => idx !== index));
  };

  const addMedRow = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: 'Once daily', duration: '5 days', instructions: 'After meals' }
    ]);
  };

  const removeMedRow = (index: number) => {
    setMedications(medications.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a record title.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.addRecord({
        uhid: patientUhid,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        hospitalCode: hospital.code,
        hospitalCity: hospital.city,
        doctorName: doctorName || 'Attending Consultant',
        doctorSpecialty: doctorSpecialty,
        recordType,
        title,
        diagnosis: diagnosis || title,
        summary: summary || 'Clinical consultation recorded and verified.',
        priority,
        parameters: recordType === 'Lab Report' ? parameters.filter(p => p.name.trim()) : [],
        medications: medications.filter(m => m.name.trim())
      });

      onSuccess(res.record);
    } catch (err: any) {
      setError(err.message || 'Failed to submit medical record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Add New Clinical Record</h2>
              <p className="text-xs text-slate-400">
                Synchronizing with patient <span className="text-teal-300 font-semibold">{patientName}</span> ({patientUhid})
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Admitting Hospital Context */}
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span className="font-bold text-sky-950">{hospital.name}</span>
            </div>
            <span className="font-mono text-sky-700 text-[11px]">{hospital.code}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Record Category *
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value as RecordType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Lab Report">Lab Report & Diagnostics</option>
                <option value="Prescription">Prescription & Medication Order</option>
                <option value="Radiology & Scans">Radiology & Imaging (X-Ray / MRI / CT)</option>
                <option value="Discharge Summary">Discharge Summary & OT Notes</option>
                <option value="Vitals & Triage">Vitals & Clinical Consultation</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Doctor Specialty
              </label>
              <input
                type="text"
                value={doctorSpecialty}
                onChange={(e) => setDoctorSpecialty(e.target.value)}
                placeholder="e.g. Cardiology, Orthopedics, General Surgery"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Document / Report Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2D Echo Examination or Complete Blood Count"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Diagnosis / Clinical Impression
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Sinus Tachycardia, Resolved Bronchitis"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Physician Summary & Assessment Notes
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter detailed clinical impressions, physical exam findings, or surgical notes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Lab Parameters Table if Lab Report */}
          {recordType === 'Lab Report' && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Lab Test Parameters</span>
                <button
                  type="button"
                  onClick={addParamRow}
                  className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Parameter
                </button>
              </div>

              {parameters.map((param, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Test Name"
                    value={param.name}
                    onChange={(e) => {
                      const next = [...parameters];
                      next[idx].name = e.target.value;
                      setParameters(next);
                    }}
                    className="flex-2 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) => {
                      const next = [...parameters];
                      next[idx].value = e.target.value;
                      setParameters(next);
                    }}
                    className="flex-1 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={param.unit}
                    onChange={(e) => {
                      const next = [...parameters];
                      next[idx].unit = e.target.value;
                      setParameters(next);
                    }}
                    className="flex-1 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Ref Range"
                    value={param.referenceRange}
                    onChange={(e) => {
                      const next = [...parameters];
                      next[idx].referenceRange = e.target.value;
                      setParameters(next);
                    }}
                    className="flex-1 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeParamRow(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Medication Row */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Prescribed Medications (Optional)</span>
              <button
                type="button"
                onClick={addMedRow}
                className="px-2.5 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine
              </button>
            </div>

            {medications.map((med, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Drug Name (e.g. Amoxicillin)"
                    value={med.name}
                    onChange={(e) => {
                      const next = [...medications];
                      next[idx].name = e.target.value;
                      setMedications(next);
                    }}
                    className="flex-2 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (500mg)"
                    value={med.dosage}
                    onChange={(e) => {
                      const next = [...medications];
                      next[idx].dosage = e.target.value;
                      setMedications(next);
                    }}
                    className="flex-1 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedRow(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Frequency & Duration (e.g. Twice daily for 5 days)"
                    value={med.frequency}
                    onChange={(e) => {
                      const next = [...medications];
                      next[idx].frequency = e.target.value;
                      setMedications(next);
                    }}
                    className="flex-1 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Instructions (e.g. After meals)"
                    value={med.instructions}
                    onChange={(e) => {
                      const next = [...medications];
                      next[idx].instructions = e.target.value;
                      setMedications(next);
                    }}
                    className="flex-1 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-700/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Cryptographically Uploading...' : 'Upload & Synchronize to Patient Vault'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
