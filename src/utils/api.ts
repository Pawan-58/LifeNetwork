import { Patient, MedicalRecord, Hospital, AccessAuditLog, HospitalAdmission } from '../types/health';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getHospitals(): Promise<Hospital[]> {
    const res = await fetch('/api/hospitals');
    return res.json();
  },

  async loginPatient(identifier: string, pin: string): Promise<{ success: boolean; patient: Patient; token: string }> {
    const res = await fetch('/api/auth/patient-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, pin })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async registerPatient(formData: Partial<Patient>): Promise<{ success: boolean; patient: Patient }> {
    const res = await fetch('/api/auth/register-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register patient');
    return data;
  },

  async searchPatient(query: string) {
    const res = await fetch(`/api/doctor/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Patient lookup failed');
    return data;
  },

  async verifyDoctorAccess(params: {
    uhid: string;
    hospitalId: string;
    hospitalName: string;
    doctorName: string;
    doctorSpecialty: string;
    accessMethod: 'PIN' | 'ADMISSION' | 'EMERGENCY';
    pinOrPassCode?: string;
    admissionToken?: string;
    purpose: string;
  }): Promise<{ success: boolean; patient: Patient; records: MedicalRecord[]; grantedMethod: string }> {
    const res = await fetch('/api/doctor/verify-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Access verification failed');
    return data;
  },

  async getPatientRecords(uhid: string): Promise<{ records: MedicalRecord[] }> {
    const res = await fetch(`/api/patients/${encodeURIComponent(uhid)}/records`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch medical records');
    return data;
  },

  async addRecord(recordData: Partial<MedicalRecord>): Promise<{ success: boolean; record: MedicalRecord }> {
    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload medical record');
    return data;
  },

  async admitPatient(params: {
    uhid: string;
    hospitalId: string;
    ward: string;
    bed: string;
    attendingDoctor: string;
    department: string;
    admissionReason: string;
  }): Promise<{ success: boolean; admission: HospitalAdmission }> {
    const res = await fetch('/api/admissions/admit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to admit patient');
    return data;
  },

  async dischargePatient(uhid: string): Promise<{ success: boolean }> {
    const res = await fetch('/api/admissions/discharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uhid })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to discharge patient');
    return data;
  },

  async generateTemporaryPass(uhid: string, targetHospitalName?: string): Promise<{ passCode: string }> {
    const res = await fetch(`/api/patients/${encodeURIComponent(uhid)}/passes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetHospitalName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate pass code');
    return data;
  },

  async getAuditLogs(uhid: string): Promise<AccessAuditLog[]> {
    const res = await fetch(`/api/patients/${encodeURIComponent(uhid)}/audit-logs`);
    return res.json();
  }
};
