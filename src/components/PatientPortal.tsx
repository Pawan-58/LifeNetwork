import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Key, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Calendar, 
  Search, 
  Filter, 
  Heart, 
  AlertTriangle, 
  User, 
  QrCode, 
  Download, 
  Clock, 
  CheckCircle2, 
  Activity, 
  ChevronRight, 
  Printer, 
  Phone, 
  BedDouble,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Patient, MedicalRecord, Hospital } from '../types/health';
import { api } from '../utils/api';
import { RecordDetailModal } from './RecordDetailModal';
import { HealthCardModal } from './HealthCardModal';
import { TemporaryPassModal } from './TemporaryPassModal';
import { AuditLogsModal } from './AuditLogsModal';

interface PatientPortalProps {
  currentPatient: Patient | null;
  onLoginSuccess: (patient: Patient) => void;
  onOpenRegister: () => void;
  hospitals: Hospital[];
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  currentPatient,
  onLoginSuccess,
  onOpenRegister,
  hospitals
}) => {
  // Login State
  const [identifier, setIdentifier] = useState('9876543210'); // Default to Pawan Kumar
  const [pin, setPin] = useState('1234');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Authenticated State
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showHealthCard, setShowHealthCard] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Fetch records when currentPatient changes
  useEffect(() => {
    if (currentPatient) {
      loadRecords(currentPatient.uhid);
    }
  }, [currentPatient]);

  const loadRecords = async (uhid: string) => {
    setRecordsLoading(true);
    try {
      const data = await api.getPatientRecords(uhid);
      setRecords(data.records);
    } catch (err) {
      console.error(err);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const data = await api.loginPatient(identifier, pin);
      onLoginSuccess(data.patient);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const fillPawanDemo = () => {
    setIdentifier('9876543210');
    setPin('1234');
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesCategory = selectedCategory === 'All' || record.recordType === selectedCategory;
    const matchesHospital = selectedHospital === 'All' || record.hospitalId === selectedHospital;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      record.title.toLowerCase().includes(q) ||
      record.diagnosis.toLowerCase().includes(q) ||
      record.summary.toLowerCase().includes(q) ||
      record.doctorName.toLowerCase().includes(q) ||
      record.hospitalName.toLowerCase().includes(q) ||
      (record.medications && record.medications.some(m => m.name.toLowerCase().includes(q))) ||
      (record.parameters && record.parameters.some(p => p.name.toLowerCase().includes(q)));
    return matchesCategory && matchesHospital && matchesSearch;
  });

  // Calculate unique hospitals patient visited
  const connectedHospitalsCount = new Set(records.map(r => r.hospitalId)).size;

  // Unauthenticated View
  if (!currentPatient) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Cross-Hospital Consolidated Health Vault
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Access Your Entire Lifetime Medical History
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                One universal health identifier (UHID) connects you across all participating hospitals, diagnostic labs, and clinics. 
                Your medical data is locked by default and unlocked only via your 4-digit PIN or during active hospital admission.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 max-w-md mx-auto">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Mobile Number or UHID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or UHID-9842-4410"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    4-Digit Security Passcode / PIN
                  </label>
                  <span className="text-[11px] text-teal-600 font-medium">
                    Protected by Citizen Key
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-700/20 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loginLoading ? (
                  'Verifying Security Passcode...'
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Unlock Medical Records
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Helper */}
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
              <button
                type="button"
                onClick={fillPawanDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer flex items-center justify-between border border-slate-200"
              >
                <div className="text-left">
                  <span className="block font-bold">Quick Demo: Pawan Kumar</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Phone: 9876543210 | PIN: 1234 (4 Hospitals)
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold">
                  Autofill
                </span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="text-xs text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
                >
                  Don't have a Universal Health ID yet? <span className="underline">Register Free</span>
                </button>
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Your Privacy is Guaranteed:</strong> Hospitals cannot access your history without your PIN authorization or verified in-patient emergency admission token.
              </span>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Authenticated Patient View
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Patient Profile & Identity Card Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Identity info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-600/30">
              {currentPatient.fullName.slice(0, 1)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentPatient.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  {currentPatient.bloodGroup} Blood
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Universal ID Active
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {currentPatient.uhid}
                </span>
                <span>DOB: {currentPatient.dateOfBirth} ({currentPatient.gender})</span>
                <span>•</span>
                <span className="font-mono">Phone: {currentPatient.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowHealthCard(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <QrCode className="w-4 h-4 text-teal-400" />
              Universal Health Card
            </button>

            <button
              onClick={() => setShowPassModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Key className="w-4 h-4" />
              Generate Doctor Passcode
            </button>

            <button
              onClick={() => setShowAuditModal(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Access Audit Log
            </button>
          </div>
        </div>

        {/* Critical Alerts Bar (Allergies & Active Admission) */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Allergies Notice */}
          <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-rose-900 block">
                FLAGGED DRUG ALLERGIES (CROSS-HOSPITAL ALERT)
              </span>
              <span className="text-rose-800 font-medium">
                {currentPatient.allergies.length > 0 
                  ? currentPatient.allergies.join(' • ')
                  : 'No known drug allergies reported'}
              </span>
            </div>
          </div>

          {/* Admission Status */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            currentPatient.activeAdmission 
              ? 'bg-amber-50/90 border-amber-300 text-amber-950'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}>
            <BedDouble className={`w-5 h-5 shrink-0 mt-0.5 ${
              currentPatient.activeAdmission ? 'text-amber-600' : 'text-emerald-600'
            }`} />
            <div className="text-xs">
              <span className="font-bold block">
                {currentPatient.activeAdmission ? 'ACTIVE INPATIENT ADMISSION' : 'OUTPATIENT PRIVACY MODE'}
              </span>
              <span className="text-[11px] text-slate-600">
                {currentPatient.activeAdmission 
                  ? `Admitted at ${currentPatient.activeAdmission.hospitalName} (${currentPatient.activeAdmission.ward}). Attending: ${currentPatient.activeAdmission.attendingDoctor}.`
                  : 'You are currently not admitted. Hospitals require your 4-digit PIN to access lifetime records.'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Health Overview Statistics Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Lifetime Records</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{records.length}</div>
          <div className="text-[11px] text-teal-600 font-medium mt-0.5">Lab, Scans & Prescriptions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Hospitals Connected</div>
          <div className="text-2xl font-black text-sky-700 mt-1">{connectedHospitalsCount || 4}</div>
          <div className="text-[11px] text-sky-600 font-medium mt-0.5">Metro, Apollo, St. Jude, Apex</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Doctor Pass</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {currentPatient.temporaryPasses?.filter(p => p.status === 'Active').length || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">24-hour temporary passes</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Security Access Mode</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <Lock className="w-5 h-5 text-emerald-500" />
            PIN
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">4-digit Passcode Locked</div>
        </div>
      </div>

      {/* Lifetime Medical History Feed with Cross-Hospital Filter */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-600" />
              Consolidated Lifetime Medical Records
            </h2>
            <p className="text-xs text-slate-500">
              Synchronized from all connected healthcare providers into one unified ledger
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start md:self-auto px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Full Medical Summary
          </button>
        </div>

        {/* Filter Pills and Hospital Select */}
        <div className="space-y-3">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['All', 'Lab Report', 'Radiology & Scans', 'Prescription', 'Discharge Summary', 'Vitals & Triage'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Hospital Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across reports, diagnoses, medicines, doctors (e.g. 'Lipid', 'Knee', 'ECG')..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="All">All Connected Hospitals</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Records List */}
        {recordsLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Synchronizing lifetime medical records across hospital grid...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold">No medical records match your current filter.</p>
            <p className="text-xs text-slate-400">Try changing the category or clearing the search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400/80 hover:shadow-md transition bg-white cursor-pointer relative group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                      {record.recordType}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {record.date}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-sky-600" />
                      {record.hospitalName}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Hash: {record.documentHash.slice(0, 10)}...
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {record.title}
                  </h3>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Primary Diagnosis: </span>
                    {record.diagnosis}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {record.summary}
                  </p>
                </div>

                {/* Highlights preview */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-700 font-medium">
                      Consultant: {record.doctorName} ({record.doctorSpecialty})
                    </span>
                    {record.parameters && record.parameters.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono">
                        {record.parameters.length} Test Markers Analyzed
                      </span>
                    )}
                    {record.medications && record.medications.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                        {record.medications.length} Prescribed Drugs
                      </span>
                    )}
                  </div>

                  <div className="text-teal-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <span>View Official Record</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modals */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {showHealthCard && (
        <HealthCardModal
          patient={currentPatient}
          onClose={() => setShowHealthCard(false)}
        />
      )}

      {showPassModal && (
        <TemporaryPassModal
          patient={currentPatient}
          onClose={() => setShowPassModal(false)}
          onPassGenerated={() => loadRecords(currentPatient.uhid)}
        />
      )}

      {showAuditModal && (
        <AuditLogsModal
          patient={currentPatient}
          onClose={() => setShowAuditModal(false)}
        />
      )}

    </div>
  );
};
