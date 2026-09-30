import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  Lock, 
  Unlock, 
  Key, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Plus, 
  BedDouble, 
  Clock, 
  User, 
  Activity, 
  RefreshCw,
  LogOut,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Hospital, Patient, MedicalRecord } from '../types/health';
import { api } from '../utils/api';
import { RecordDetailModal } from './RecordDetailModal';
import { AddRecordModal } from './AddRecordModal';
import { AdmitModal } from './AdmitModal';

interface DoctorDeskProps {
  hospitals: Hospital[];
}

export const DoctorDesk: React.FC<DoctorDeskProps> = ({ hospitals }) => {
  // Hospital & Doctor Session
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-metro');
  const [doctorName, setDoctorName] = useState('Dr. Rajesh Varma, MD');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Cardiovascular Sciences');

  // Search State
  const [searchQuery, setSearchQuery] = useState('9876543210'); // Default to Pawan Kumar
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<any | null>(null);

  // Security Verification State
  const [accessMethod, setAccessMethod] = useState<'PIN' | 'ADMISSION' | 'EMERGENCY'>('PIN');
  const [pinOrPass, setPinOrPass] = useState('');
  const [clinicalPurpose, setClinicalPurpose] = useState('Comprehensive clinical consultation & review of past multi-hospital diagnostics');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Unlocked State
  const [unlockedPatient, setUnlockedPatient] = useState<Patient | null>(null);
  const [unlockedRecords, setUnlockedRecords] = useState<MedicalRecord[]>([]);

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);

  const activeHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  // Perform Patient Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    setLookupResult(null);
    setUnlockedPatient(null);
    setUnlockedRecords([]);
    setVerifyError(null);

    try {
      const data = await api.searchPatient(searchQuery.trim());
      setLookupResult(data);
    } catch (err: any) {
      setSearchError(err.message || 'Patient not found in the national grid.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Verify PIN or Admission to unlock lifetime records
  const handleVerifyAccess = async (overrideMethod?: 'PIN' | 'ADMISSION' | 'EMERGENCY', customPin?: string) => {
    if (!lookupResult) return;
    const methodToUse = overrideMethod || accessMethod;
    const pinToUse = customPin !== undefined ? customPin : pinOrPass;

    if (methodToUse === 'PIN' && !pinToUse) {
      setVerifyError('Please enter the 4-digit patient PIN or temporary passcode.');
      return;
    }

    setVerifyLoading(true);
    setVerifyError(null);

    try {
      const data = await api.verifyDoctorAccess({
        uhid: lookupResult.uhid,
        hospitalId: activeHospital.id,
        hospitalName: activeHospital.name,
        doctorName,
        doctorSpecialty,
        accessMethod: methodToUse,
        pinOrPassCode: pinToUse,
        admissionToken: lookupResult.activeAdmission?.admissionToken,
        purpose: clinicalPurpose
      });

      setUnlockedPatient(data.patient);
      setUnlockedRecords(data.records);
    } catch (err: any) {
      setVerifyError(err.message || 'Access verification denied.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDischarge = async () => {
    if (!unlockedPatient) return;
    if (!confirm('Confirm patient discharge? An automated discharge summary will be added to lifetime records.')) return;
    try {
      await api.dischargePatient(unlockedPatient.uhid);
      // Refresh patient records
      const refreshed = await api.getPatientRecords(unlockedPatient.uhid);
      setUnlockedRecords(refreshed.records);
      setUnlockedPatient({ ...unlockedPatient, activeAdmission: undefined });
      alert('Patient discharged successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to discharge patient.');
    }
  };

  const resetLookup = () => {
    setLookupResult(null);
    setUnlockedPatient(null);
    setUnlockedRecords([]);
    setPinOrPass('');
    setSearchError(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Hospital Workstation Context Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
                  Clinical Exchange Portal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Doctor Workstation
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Cross-Hospital Patient History Lookup
              </h1>
            </div>
          </div>

          {/* Connected Hospital Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Active Hospital Facility:</span>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => {
                    setSelectedHospitalId(e.target.value);
                    resetLookup();
                  }}
                  className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-xs hidden sm:block">
              <span className="text-slate-400 block text-[10px]">Logged In Consultant:</span>
              <span className="font-bold text-slate-200">{doctorName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lookup Bar if No Unlocked Patient */}
      {!unlockedPatient && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900">
              Step 1: Patient Identity Search
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Search by Universal Health ID (UHID), National Health ID, or Patient's Registered Mobile Number. 
              The system connects with all partner hospitals instantly.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter UHID (e.g. UHID-9842-4410) or Phone (9876543210)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={searchLoading}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-700/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {searchLoading ? (
                'Querying National Grid...'
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search Patient
                </>
              )}
            </button>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-400">Quick Test Searches:</span>
            <button
              onClick={() => {
                setSearchQuery('9876543210');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] cursor-pointer"
            >
              Pawan Kumar (Phone: 9876543210)
            </button>
            <button
              onClick={() => {
                setSearchQuery('UHID-9842-4410');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] cursor-pointer"
            >
              UHID-9842-4410
            </button>
            <button
              onClick={() => {
                setSearchQuery('9811223344');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] cursor-pointer"
            >
              Ananya Sharma (Admitted Patient)
            </button>
          </div>

          {searchError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Step 2: Patient Found - STRICT ACCESS GATE */}
          {lookupResult && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-6 animate-in fade-in duration-200">
              
              {/* Patient Basic Identity Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-xl flex items-center justify-center">
                    {lookupResult.fullName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {lookupResult.fullName}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                        {lookupResult.bloodGroup}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {lookupResult.uhid} | DOB: {lookupResult.dateOfBirth} ({lookupResult.gender})
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-semibold text-slate-700">
                    Lifetime Records In Grid: <span className="font-bold text-teal-700">{lookupResult.totalRecordsInVault} reports</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Hospitals: Metro, Apollo, St. Jude, Apex
                  </div>
                </div>
              </div>

              {/* SECURITY LOCK NOTICE */}
              <div className="p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-amber-950 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-amber-950">
                      Step 2: Medical Records Protected by Patient Privacy Protocol
                    </h3>
                    <p className="text-xs text-amber-900 leading-relaxed mt-1">
                      As mandated by national privacy regulations, all lab reports, scan images, past prescriptions, and surgical history 
                      remain <strong>strictly encrypted</strong> until you authenticate access using one of the authorized methods below.
                    </p>
                  </div>
                </div>

                {/* Authentication Method Selector */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccessMethod('PIN')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center gap-2 ${
                        accessMethod === 'PIN'
                          ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      <Key className="w-4 h-4" />
                      Patient PIN / Passcode
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccessMethod('ADMISSION')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center gap-2 ${
                        accessMethod === 'ADMISSION'
                          ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      <BedDouble className="w-4 h-4" />
                      Active Inpatient Admission
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccessMethod('EMERGENCY')}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center gap-2 ${
                        accessMethod === 'EMERGENCY'
                          ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Emergency Trauma Override
                    </button>
                  </div>

                  {verifyError && (
                    <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{verifyError}</span>
                    </div>
                  )}

                  {/* Method Content */}
                  {accessMethod === 'PIN' && (
                    <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Enter Patient Security PIN or Temporary 24-Hour Passcode
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            maxLength={6}
                            value={pinOrPass}
                            onChange={(e) => setPinOrPass(e.target.value)}
                            placeholder="e.g. 1234"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-mono tracking-widest text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPinOrPass('1234');
                              handleVerifyAccess('PIN', '1234');
                            }}
                            className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-semibold cursor-pointer shrink-0"
                          >
                            Autofill & Unlock (PIN: 1234)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {accessMethod === 'ADMISSION' && (
                    <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-3">
                      <div className="text-xs text-slate-600">
                        {lookupResult.activeAdmission ? (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                            <strong>Active Admission Found:</strong> Admitted at {lookupResult.activeAdmission.hospitalName} ({lookupResult.activeAdmission.ward}). 
                            Token: <span className="font-mono font-bold">{lookupResult.activeAdmission.admissionToken}</span>.
                          </div>
                        ) : (
                          <div>
                            <p className="text-amber-900 font-semibold mb-2">
                              No active admission on file at {activeHospital.name}.
                            </p>
                            <p className="text-slate-500 mb-3">
                              If patient is being admitted right now, admit them to activate cross-hospital inpatient access.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowAdmitModal(true)}
                              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              Admit Patient to {activeHospital.name}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {accessMethod === 'EMERGENCY' && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-900">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Emergency Trauma Override Protocol
                      </div>
                      <p>
                        This mode immediately unlocks life-critical medical history (blood group, allergies, past cardiac surgeries) 
                        without patient PIN for unconscious or unresponsive emergency arrivals. 
                        <strong>A mandatory incident audit log will be submitted with your medical license number.</strong>
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleVerifyAccess()}
                      disabled={verifyLoading}
                      className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {verifyLoading ? (
                        'Decrypting Cross-Hospital Records...'
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Verify & Decrypt Patient Medical Records
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Unlocked Clinical History View */}
      {unlockedPatient && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Patient Header & Quick Action Desk */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authenticated Cross-Hospital Session
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {unlockedPatient.uhid}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {unlockedPatient.fullName}
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                DOB: {unlockedPatient.dateOfBirth} ({unlockedPatient.gender}) | Phone: {unlockedPatient.phone}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddRecordModal(true)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Diagnostic / Prescription
              </button>

              {unlockedPatient.activeAdmission ? (
                <button
                  onClick={handleDischarge}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <BedDouble className="w-4 h-4" />
                  Discharge Patient
                </button>
              ) : (
                <button
                  onClick={() => setShowAdmitModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <BedDouble className="w-4 h-4" />
                  Admit Patient
                </button>
              )}

              <button
                onClick={resetLookup}
                className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Lock Session and Return"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                Close Session
              </button>
            </div>
          </div>

          {/* CRITICAL CLINICAL SAFETY BANNER: ALLERGIES & CHRONIC CONDITIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-rose-900 block text-sm">
                  CRITICAL DRUG ALLERGIES (DO NOT PRESCRIBE)
                </span>
                <span className="text-rose-800 font-semibold mt-0.5 block text-sm">
                  {unlockedPatient.allergies.length > 0 
                    ? unlockedPatient.allergies.join(' • ')
                    : 'No known allergies reported'}
                </span>
                <p className="text-[11px] text-rose-700 mt-1">
                  Reported from Metro Multi-Specialty Hospital appendectomy stay.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-start gap-3">
              <Activity className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-sky-900 block text-sm">
                  CHRONIC HEALTH CONDITIONS & BASELINE
                </span>
                <span className="text-sky-800 font-semibold mt-0.5 block">
                  {unlockedPatient.chronicConditions.length > 0
                    ? unlockedPatient.chronicConditions.join(' • ')
                    : 'None documented'}
                </span>
                <p className="text-[11px] text-sky-700 mt-1">
                  Blood Group: <strong>{unlockedPatient.bloodGroup}</strong> | Organ Donor: <strong>Yes</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Cross-Hospital Lifetime Medical Records Table */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Unified Lifetime Medical Records ({unlockedRecords.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Consolidated chronological history across all healthcare network institutions
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Cryptographic Verification OK
              </span>
            </div>

            <div className="space-y-3">
              {unlockedRecords.map((record) => (
                <div
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-xs transition bg-slate-50/50 hover:bg-white cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-sky-100 text-sky-800">
                        {record.recordType}
                      </span>
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {record.hospitalName} ({record.hospitalCity})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        {record.date}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-sky-700 flex items-center gap-1">
                      Inspect Report <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {record.title}
                    </h4>
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Diagnosis: </span>
                      {record.diagnosis}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {record.summary}
                    </p>
                  </div>

                  {/* Parameters or Medications mini badges */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Consultant: {record.doctorName} ({record.doctorSpecialty})</span>
                    <span className="font-mono text-slate-400 text-[10px]">Doc Hash: {record.documentHash.slice(0, 12)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Record Inspection Modal */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Add Record Modal */}
      {showAddRecordModal && unlockedPatient && (
        <AddRecordModal
          patientUhid={unlockedPatient.uhid}
          patientName={unlockedPatient.fullName}
          hospital={activeHospital}
          doctorName={doctorName}
          onClose={() => setShowAddRecordModal(false)}
          onSuccess={(newRecord) => {
            setUnlockedRecords([newRecord, ...unlockedRecords]);
            setShowAddRecordModal(false);
          }}
        />
      )}

      {/* Admit Patient Modal */}
      {showAdmitModal && lookupResult && (
        <AdmitModal
          patientUhid={lookupResult.uhid}
          patientName={lookupResult.fullName}
          hospital={activeHospital}
          onClose={() => setShowAdmitModal(false)}
          onSuccess={(adm) => {
            setShowAdmitModal(false);
            setLookupResult({ ...lookupResult, activeAdmission: adm });
            // Auto verify with admission
            handleVerifyAccess('ADMISSION');
          }}
        />
      )}

    </div>
  );
};
