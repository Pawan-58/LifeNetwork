import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PatientPortal } from './components/PatientPortal';
import { DoctorDesk } from './components/DoctorDesk';
import { NetworkGrid } from './components/NetworkGrid';
import { RegisterModal } from './components/RegisterModal';
import { Patient, Hospital } from './types/health';
import { INITIAL_PATIENTS, INITIAL_HOSPITALS } from './data/mockData';
import { api } from './utils/api';
import { ShieldCheck, Heart, AlertCircle, Building2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'network'>('patient');
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(INITIAL_PATIENTS[0]); // Default to Pawan Kumar
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>({
    message: 'Loaded Pawan Kumar profile. 4 Connected Hospitals synchronized with UHID-9842-4410.',
    type: 'success'
  });

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load hospitals from API
  useEffect(() => {
    api.getHospitals()
      .then(data => {
        if (data && data.length > 0) setHospitals(data);
      })
      .catch(err => {
        console.warn('Using local hospitals cache:', err);
      });
  }, []);

  const handleQuickSelectDemo = (type: 'pawan' | 'doctor') => {
    if (type === 'pawan') {
      setCurrentPatient(INITIAL_PATIENTS[0]);
      setActiveTab('patient');
      setNotification({
        message: 'Active profile set to Pawan Kumar (UHID-9842-4410).',
        type: 'success'
      });
    } else if (type === 'doctor') {
      setActiveTab('doctor');
      setNotification({
        message: 'Switched to Doctor Clinical Desk. Search patient by UHID or Phone.',
        type: 'info'
      });
    }
  };

  const handleRegisterSuccess = (newPatient: Patient) => {
    setCurrentPatient(newPatient);
    setShowRegisterModal(false);
    setActiveTab('patient');
    setNotification({
      message: `Welcome, ${newPatient.fullName}! Your Universal Health ID is ${newPatient.uhid}.`,
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPatient={currentPatient}
        onLogoutPatient={() => {
          setCurrentPatient(null);
          setNotification({
            message: 'Patient logged out. Records locked with PIN privacy.',
            type: 'info'
          });
        }}
        onOpenRegister={() => setShowRegisterModal(true)}
        onQuickSelectDemo={handleQuickSelectDemo}
      />

      {/* Ephemeral Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs flex items-center gap-2.5 max-w-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0"></span>
            <span className="font-medium text-slate-200">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white ml-2 text-sm font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'patient' && (
          <PatientPortal
            currentPatient={currentPatient}
            onLoginSuccess={(patient) => {
              setCurrentPatient(patient);
              setNotification({
                message: `Medical records unlocked for ${patient.fullName}.`,
                type: 'success'
              });
            }}
            onOpenRegister={() => setShowRegisterModal(true)}
            hospitals={hospitals}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorDesk
            hospitals={hospitals}
          />
        )}

        {activeTab === 'network' && (
          <NetworkGrid
            hospitals={hospitals}
          />
        )}
      </main>

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleRegisterSuccess}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-slate-200">OmniHealth Network</span>
            <span>—</span>
            <span>National Patient Identifier & Multi-Hospital Health Grid</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>High-Availability Edge Cluster</span>
            <span>•</span>
            <span>HL7 FHIR v4 Protocol</span>
            <span>•</span>
            <span>256-Bit Cryptographic Ledger</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
