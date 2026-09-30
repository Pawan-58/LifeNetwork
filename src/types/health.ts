export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export type RecordType = 
  | 'Lab Report' 
  | 'Radiology & Scans' 
  | 'Prescription' 
  | 'Discharge Summary' 
  | 'Surgery & OT' 
  | 'Vitals & Triage';

export type RecordPriority = 'Normal' | 'Urgent' | 'Critical Alert';

export interface ParameterResult {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'Normal' | 'High' | 'Low' | 'Abnormal';
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalRecord {
  id: string;
  uhid: string;
  hospitalId: string;
  hospitalName: string;
  hospitalCode: string;
  hospitalCity: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  recordType: RecordType;
  title: string;
  diagnosis: string;
  summary: string;
  status: 'Final' | 'Verified' | 'Preliminary';
  priority: RecordPriority;
  parameters?: ParameterResult[];
  medications?: MedicationItem[];
  labFindingsSummary?: string;
  documentHash: string; // e.g. SHA-256 for integrity verification
  attachmentUrl?: string;
  fileName?: string;
}

export interface HospitalAdmission {
  id: string;
  uhid: string;
  hospitalId: string;
  hospitalName: string;
  admissionDate: string;
  dischargeDate?: string;
  ward: string;
  bed: string;
  attendingDoctor: string;
  department: string;
  admissionReason: string;
  admissionToken: string;
  status: 'Active' | 'Discharged';
  notes?: string;
}

export interface AccessAuditLog {
  id: string;
  uhid: string;
  timestamp: string;
  accessorName: string;
  accessorRole: 'Doctor' | 'Chief Medical Officer' | 'Nurse/Triage' | 'Hospital Admin' | 'Patient Self-Access';
  hospitalName: string;
  accessMethod: 'Patient PIN Authorization' | 'Active Admission Override' | 'Emergency Doctor Bypass' | 'Self-Portal Authentication';
  purpose: string;
  recordsViewedCount: number;
  ipAddress: string;
  status: 'Granted' | 'Denied - Invalid PIN';
}

export interface TemporaryPass {
  passCode: string;
  targetHospitalName?: string;
  issuedAt: string;
  expiresAt: string;
  status: 'Active' | 'Used' | 'Expired';
}

export interface Patient {
  uhid: string; // e.g. UHID-9842-4410
  nationalHealthId: string; // e.g. NHID-IND-7782190
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  pin: string; // 4-digit numeric PIN
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  organDonorStatus: boolean;
  activeAdmission?: HospitalAdmission;
  temporaryPasses: TemporaryPass[];
  registeredDate: string;
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  networkTier: 'Apex Institute' | 'Super Specialty' | 'Tertiary Care' | 'Trauma Level 1' | 'Diagnostic Hub';
  status: 'Connected' | 'Synchronized' | 'High Availability Active';
  licenseNo: string;
  totalRecordsShared: number;
  latencyMs: number;
  activeDoctorsCount: number;
  bedsCapacity: number;
  phone: string;
  address: string;
}

export interface SystemMetrics {
  uptime: string;
  nodesOnline: number;
  totalHospitals: number;
  totalPatientsRegistered: number;
  totalRecordsEncrypted: number;
  queriesPerSecond: number;
  avgLatencyMs: number;
  fhirVersion: string;
  dataIntegrityRate: string;
}
