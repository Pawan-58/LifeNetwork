import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_HOSPITALS, 
  INITIAL_PATIENTS, 
  INITIAL_PAWAN_RECORDS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_METRICS 
} from './src/data/mockData';
import { Patient, MedicalRecord, HospitalAdmission, AccessAuditLog, Hospital } from './src/types/health';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProd = process.env.NODE_ENV === 'production';
// In development, dev server MUST run on port 3000 as per AI Studio constraints.
// Container proxy / Cloud Run already occupies 8080.
const PORT = isProd ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080) : 3000;

// High-throughput middleware & telemetry headers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// High availability & performance simulation headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Cluster-Node', 'omni-core-gateway-01a');
  res.setHeader('X-System-Availability', '99.998% High Availability SLA');
  res.setHeader('X-FHIR-Specification', 'HL7 FHIR Release 4.0.1');
  res.setHeader('X-RateLimit-Limit', '100000');
  res.setHeader('X-RateLimit-Remaining', '99984');
  next();
});

// In-Memory Database Store for Instant Cross-Hospital Synchronization
class HealthDataStore {
  private hospitals: Hospital[] = [...INITIAL_HOSPITALS];
  private patients: Patient[] = [...INITIAL_PATIENTS];
  private records: MedicalRecord[] = [...INITIAL_PAWAN_RECORDS];
  private auditLogs: AccessAuditLog[] = [...INITIAL_AUDIT_LOGS];

  getHospitals() {
    return this.hospitals;
  }

  getHospitalById(id: string) {
    return this.hospitals.find(h => h.id === id);
  }

  findPatient(query: string): Patient | undefined {
    const clean = query.trim().toLowerCase();
    return this.patients.find(
      p => p.uhid.toLowerCase() === clean || 
           p.phone.replace(/\D/g, '') === clean.replace(/\D/g, '') ||
           p.nationalHealthId.toLowerCase() === clean
    );
  }

  getPatientByUhid(uhid: string): Patient | undefined {
    return this.patients.find(p => p.uhid.toLowerCase() === uhid.toLowerCase());
  }

  createPatient(data: Omit<Patient, 'uhid' | 'nationalHealthId' | 'registeredDate' | 'temporaryPasses'>): Patient {
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newUhid = `UHID-9842-${randomSeq}`;
    const newNhid = `NHID-IND-${Date.now().toString().slice(-7)}-${data.fullName.slice(0, 4).toUpperCase()}`;

    const newPatient: Patient = {
      ...data,
      uhid: newUhid,
      nationalHealthId: newNhid,
      registeredDate: new Date().toISOString().split('T')[0],
      temporaryPasses: []
    };

    this.patients.unshift(newPatient);

    // Add registration audit log
    this.addAuditLog({
      uhid: newUhid,
      accessorName: data.fullName,
      accessorRole: 'Patient Self-Access',
      hospitalName: 'OmniHealth National Central Registry',
      accessMethod: 'Self-Portal Authentication',
      purpose: 'Initial Universal Patient Registration and Secure Health ID Generation',
      recordsViewedCount: 0,
      ipAddress: '127.0.0.1',
      status: 'Granted'
    });

    return newPatient;
  }

  getRecords(uhid: string): MedicalRecord[] {
    return this.records
      .filter(r => r.uhid.toLowerCase() === uhid.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addRecord(record: MedicalRecord) {
    this.records.unshift(record);
    // Update hospital stats
    const hospital = this.hospitals.find(h => h.id === record.hospitalId);
    if (hospital) {
      hospital.totalRecordsShared += 1;
    }
    return record;
  }

  admitPatient(uhid: string, admissionData: {
    hospitalId: string;
    ward: string;
    bed: string;
    attendingDoctor: string;
    department: string;
    admissionReason: string;
  }): HospitalAdmission | null {
    const patient = this.getPatientByUhid(uhid);
    if (!patient) return null;

    const hospital = this.getHospitalById(admissionData.hospitalId) || {
      name: 'Admitting Healthcare Center'
    };

    const admissionToken = `ADM-${(hospital.name.slice(0, 3) || 'HOS').toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAdmission: HospitalAdmission = {
      id: `adm-${Date.now()}`,
      uhid: patient.uhid,
      hospitalId: admissionData.hospitalId,
      hospitalName: hospital.name,
      admissionDate: new Date().toISOString(),
      ward: admissionData.ward,
      bed: admissionData.bed,
      attendingDoctor: admissionData.attendingDoctor,
      department: admissionData.department,
      admissionReason: admissionData.admissionReason,
      admissionToken: admissionToken,
      status: 'Active',
      notes: `Active in-patient admission. Clinical team granted emergency cross-hospital record access under Inpatient Protocol.`
    };

    patient.activeAdmission = newAdmission;

    this.addAuditLog({
      uhid: patient.uhid,
      accessorName: admissionData.attendingDoctor,
      accessorRole: 'Doctor',
      hospitalName: hospital.name,
      accessMethod: 'Active Admission Override',
      purpose: `In-Patient Emergency Admission (${admissionData.admissionReason}) - Ward ${admissionData.ward}`,
      recordsViewedCount: this.getRecords(patient.uhid).length,
      ipAddress: '10.12.0.44',
      status: 'Granted'
    });

    return newAdmission;
  }

  dischargePatient(uhid: string): boolean {
    const patient = this.getPatientByUhid(uhid);
    if (!patient || !patient.activeAdmission) return false;

    const currentAdm = patient.activeAdmission;
    currentAdm.status = 'Discharged';
    currentAdm.dischargeDate = new Date().toISOString();

    // Create a discharge summary record automatically in records list
    this.addRecord({
      id: `rec-dc-${Date.now()}`,
      uhid: patient.uhid,
      hospitalId: currentAdm.hospitalId,
      hospitalName: currentAdm.hospitalName,
      hospitalCode: 'ADM-DC',
      hospitalCity: 'Central',
      doctorName: currentAdm.attendingDoctor,
      doctorSpecialty: currentAdm.department,
      date: new Date().toISOString().split('T')[0],
      recordType: 'Discharge Summary',
      title: `Hospital Discharge Summary & In-Patient Clinical Notes`,
      diagnosis: currentAdm.admissionReason,
      summary: `Patient successfully completed inpatient care in ${currentAdm.ward}. Discharged in clinically stable and ambulant condition. Follow up advice documented.`,
      status: 'Final',
      priority: 'Normal',
      documentHash: Math.random().toString(36).substring(2) + Date.now().toString(36),
      fileName: `Discharge_${currentAdm.admissionToken}.pdf`
    });

    patient.activeAdmission = undefined;
    return true;
  }

  generateTemporaryPass(uhid: string, targetHospitalName?: string): string | null {
    const patient = this.getPatientByUhid(uhid);
    if (!patient) return null;

    const passCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    patient.temporaryPasses.unshift({
      passCode,
      targetHospitalName: targetHospitalName || 'Any Connected Hospital Staff',
      issuedAt: new Date().toISOString(),
      expiresAt: expires,
      status: 'Active'
    });

    return passCode;
  }

  revokePass(uhid: string, passCode: string): boolean {
    const patient = this.getPatientByUhid(uhid);
    if (!patient) return false;
    const pass = patient.temporaryPasses.find(p => p.passCode === passCode);
    if (pass) {
      pass.status = 'Expired';
      return true;
    }
    return false;
  }

  updatePin(uhid: string, oldPin: string, newPin: string): boolean {
    const patient = this.getPatientByUhid(uhid);
    if (!patient) return false;
    if (patient.pin !== oldPin) return false;
    patient.pin = newPin;
    return true;
  }

  addAuditLog(log: Omit<AccessAuditLog, 'id' | 'timestamp'>) {
    const newLog: AccessAuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  getAuditLogs(uhid: string): AccessAuditLog[] {
    return this.auditLogs.filter(l => l.uhid.toLowerCase() === uhid.toLowerCase());
  }
}

const db = new HealthDataStore();

// ======================== API ROUTES ========================

// System Health & High Availability Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    availability: '99.998%',
    cluster: 'primary-apac-multiregion',
    activeHospitals: db.getHospitals().length,
    fhirStandard: 'HL7 FHIR Release 4.0.1',
    serverTimestamp: new Date().toISOString(),
    metrics: INITIAL_METRICS
  });
});

// Get Connected Hospitals Directory
app.get('/api/hospitals', (req: Request, res: Response) => {
  res.json(db.getHospitals());
});

// Patient Login (by UHID/Phone + PIN)
app.post('/api/auth/patient-login', (req: Request, res: Response) => {
  const { identifier, pin } = req.body;
  if (!identifier || !pin) {
    return res.status(400).json({ error: 'Please provide Patient UHID / Mobile Number and 4-digit PIN.' });
  }

  const patient = db.findPatient(identifier);
  if (!patient) {
    return res.status(404).json({ error: 'No patient record found with this UHID or phone number.' });
  }

  if (patient.pin !== pin) {
    db.addAuditLog({
      uhid: patient.uhid,
      accessorName: patient.fullName,
      accessorRole: 'Patient Self-Access',
      hospitalName: 'OmniHealth Citizen Portal',
      accessMethod: 'Self-Portal Authentication',
      purpose: 'Patient sign-in attempt',
      recordsViewedCount: 0,
      ipAddress: req.ip || '127.0.0.1',
      status: 'Denied - Invalid PIN'
    });
    return res.status(401).json({ error: 'Incorrect 4-digit PIN. Please verify your passcode.' });
  }

  db.addAuditLog({
    uhid: patient.uhid,
    accessorName: patient.fullName,
    accessorRole: 'Patient Self-Access',
    hospitalName: 'OmniHealth Citizen Portal',
    accessMethod: 'Self-Portal Authentication',
    purpose: 'Patient authenticated to view personal lifetime medical history',
    recordsViewedCount: db.getRecords(patient.uhid).length,
    ipAddress: req.ip || '127.0.0.1',
    status: 'Granted'
  });

  return res.json({
    success: true,
    patient,
    token: `PATIENT_SESSION_${patient.uhid}_${Date.now()}`
  });
});

// Register New Patient
app.post('/api/auth/register-patient', (req: Request, res: Response) => {
  const { fullName, phone, dateOfBirth, gender, bloodGroup, pin, address, emergencyContact, allergies, chronicConditions } = req.body;

  if (!fullName || !phone || !pin) {
    return res.status(400).json({ error: 'Full name, mobile phone number, and 4-digit PIN are required.' });
  }

  const existing = db.findPatient(phone);
  if (existing) {
    return res.status(409).json({ error: 'A patient with this mobile phone number is already registered under ' + existing.uhid });
  }

  const newPatient = db.createPatient({
    fullName,
    phone,
    dateOfBirth: dateOfBirth || '1995-01-01',
    gender: gender || 'Male',
    bloodGroup: bloodGroup || 'O+',
    pin,
    email: `${fullName.toLowerCase().replace(/\s+/g, '.') || 'patient'}@healthvault.in`,
    address: address || 'Universal Health Network Member',
    emergencyContact: emergencyContact || { name: 'Emergency Contact', relation: 'Family', phone: phone },
    allergies: allergies || [],
    chronicConditions: chronicConditions || [],
    organDonorStatus: true
  });

  return res.status(201).json({
    success: true,
    message: 'Patient registered successfully in national universal health registry.',
    patient: newPatient
  });
});

// Search Patient for Hospital / Doctor Lookup (Restricted View before PIN or Admission)
app.get('/api/doctor/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  if (!query) {
    return res.status(400).json({ error: 'Search query (UHID or Phone) is required.' });
  }

  const patient = db.findPatient(query);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found in the national grid with this identifier.' });
  }

  // Return non-sensitive triage demographic header only until PIN or Admission is verified
  res.json({
    uhid: patient.uhid,
    nationalHealthId: patient.nationalHealthId,
    fullName: patient.fullName,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    phone: patient.phone.slice(-4).padStart(patient.phone.length, '*'),
    allergiesCount: patient.allergies.length,
    chronicConditionsCount: patient.chronicConditions.length,
    activeAdmission: patient.activeAdmission || null,
    totalRecordsInVault: db.getRecords(patient.uhid).length,
    hasActiveTemporaryPass: patient.temporaryPasses.some(p => p.status === 'Active')
  });
});

// Doctor Verification & Cross-Hospital Medical History Unlock
app.post('/api/doctor/verify-access', (req: Request, res: Response) => {
  const { uhid, hospitalId, hospitalName, doctorName, doctorSpecialty, accessMethod, pinOrPassCode, admissionToken, purpose } = req.body;

  if (!uhid || !hospitalId) {
    return res.status(400).json({ error: 'Patient UHID and Hospital ID are required.' });
  }

  const patient = db.getPatientByUhid(uhid);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found.' });
  }

  let granted = false;
  let grantedMethod: AccessAuditLog['accessMethod'] = 'Patient PIN Authorization';

  if (accessMethod === 'PIN') {
    // Check master PIN
    if (patient.pin === pinOrPassCode) {
      granted = true;
      grantedMethod = 'Patient PIN Authorization';
    } else {
      // Check active temporary passes
      const validPass = patient.temporaryPasses.find(
        p => p.passCode === pinOrPassCode && p.status === 'Active' && new Date(p.expiresAt).getTime() > Date.now()
      );
      if (validPass) {
        granted = true;
        grantedMethod = 'Patient PIN Authorization';
      }
    }
  } else if (accessMethod === 'ADMISSION') {
    // Check if patient currently has an active admission at this hospital, or matching token
    if (patient.activeAdmission && patient.activeAdmission.status === 'Active') {
      if (
        patient.activeAdmission.hospitalId === hospitalId || 
        (admissionToken && patient.activeAdmission.admissionToken === admissionToken)
      ) {
        granted = true;
        grantedMethod = 'Active Admission Override';
      }
    }
  } else if (accessMethod === 'EMERGENCY') {
    // Emergency Trauma override with mandatory reporting
    granted = true;
    grantedMethod = 'Emergency Doctor Bypass';
  }

  if (!granted) {
    db.addAuditLog({
      uhid: patient.uhid,
      accessorName: doctorName || 'Clinical Doctor',
      accessorRole: 'Doctor',
      hospitalName: hospitalName || 'Connected Hospital',
      accessMethod: accessMethod === 'ADMISSION' ? 'Active Admission Override' : 'Patient PIN Authorization',
      purpose: purpose || 'Clinical record review request',
      recordsViewedCount: 0,
      ipAddress: req.ip || '192.168.1.50',
      status: 'Denied - Invalid PIN'
    });

    return res.status(403).json({
      error: accessMethod === 'ADMISSION'
        ? 'No active inpatient admission found for this patient at your facility. Please enter the Patient PIN or admit the patient.'
        : 'Invalid Passcode / PIN. Patient must authorize access with their 4-digit security PIN.'
    });
  }

  // Access Granted!
  const records = db.getRecords(patient.uhid);

  db.addAuditLog({
    uhid: patient.uhid,
    accessorName: doctorName || 'Consulting Physician',
    accessorRole: 'Doctor',
    hospitalName: hospitalName || 'Hospital Network Clinic',
    accessMethod: grantedMethod,
    purpose: purpose || 'Clinical consultation and diagnosis review across connected hospitals',
    recordsViewedCount: records.length,
    ipAddress: req.ip || '192.168.1.50',
    status: 'Granted'
  });

  return res.json({
    success: true,
    message: 'Record unlocked successfully. Full lifetime medical history granted.',
    patient,
    records,
    grantedMethod
  });
});

// Get Records for authenticated patient or session
app.get('/api/patients/:uhid/records', (req: Request, res: Response) => {
  const { uhid } = req.params;
  const patient = db.getPatientByUhid(uhid);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found.' });
  }

  const records = db.getRecords(uhid);
  res.json({
    uhid: patient.uhid,
    fullName: patient.fullName,
    totalRecords: records.length,
    records
  });
});

// Connected Hospital Uploads New Record
app.post('/api/records', (req: Request, res: Response) => {
  const { uhid, hospitalId, hospitalName, doctorName, doctorSpecialty, recordType, title, diagnosis, summary, parameters, medications, labFindingsSummary, priority } = req.body;

  if (!uhid || !title || !hospitalName) {
    return res.status(400).json({ error: 'UHID, Title, and Hospital Name are required.' });
  }

  const patient = db.getPatientByUhid(uhid);
  if (!patient) {
    return res.status(404).json({ error: 'Target patient UHID not found in registry.' });
  }

  const hospital = db.getHospitalById(hospitalId);

  const newRecord: MedicalRecord = {
    id: `rec-${Date.now()}`,
    uhid: patient.uhid,
    hospitalId: hospitalId || 'hosp-metro',
    hospitalName: hospitalName,
    hospitalCode: hospital?.code || 'HLTH-01',
    hospitalCity: hospital?.city || 'Central',
    doctorName: doctorName || 'Attending Physician',
    doctorSpecialty: doctorSpecialty || 'General Medicine',
    date: new Date().toISOString().split('T')[0],
    recordType: recordType || 'Lab Report',
    title,
    diagnosis: diagnosis || title,
    summary: summary || 'Clinical report recorded and synchronized across national healthcare grid.',
    status: 'Verified',
    priority: priority || 'Normal',
    parameters: parameters || [],
    medications: medications || [],
    labFindingsSummary: labFindingsSummary || '',
    documentHash: Math.random().toString(36).substring(2) + Date.now().toString(36),
    fileName: `${hospitalName.replace(/\s+/g, '_')}_${title.slice(0, 15).replace(/\s+/g, '_')}.pdf`
  };

  db.addRecord(newRecord);

  db.addAuditLog({
    uhid: patient.uhid,
    accessorName: doctorName || 'Attending Physician',
    accessorRole: 'Doctor',
    hospitalName: hospitalName,
    accessMethod: 'Patient PIN Authorization',
    purpose: `New diagnostic / clinical entry uploaded: ${title}`,
    recordsViewedCount: 1,
    ipAddress: req.ip || '127.0.0.1',
    status: 'Granted'
  });

  res.status(201).json({
    success: true,
    message: 'Medical report successfully synchronized to patient lifetime vault.',
    record: newRecord
  });
});

// Admit Patient
app.post('/api/admissions/admit', (req: Request, res: Response) => {
  const { uhid, hospitalId, ward, bed, attendingDoctor, department, admissionReason } = req.body;
  if (!uhid || !hospitalId || !ward) {
    return res.status(400).json({ error: 'UHID, Hospital ID, and Ward are required.' });
  }

  const admission = db.admitPatient(uhid, {
    hospitalId,
    ward,
    bed: bed || 'General Bed 1',
    attendingDoctor: attendingDoctor || 'Dr. On Duty',
    department: department || 'Emergency & Critical Care',
    admissionReason: admissionReason || 'Observation & Acute Treatment'
  });

  if (!admission) {
    return res.status(404).json({ error: 'Patient not found.' });
  }

  res.json({
    success: true,
    message: 'Patient admitted successfully. Cross-hospital record access active for this facility.',
    admission
  });
});

// Discharge Patient
app.post('/api/admissions/discharge', (req: Request, res: Response) => {
  const { uhid } = req.body;
  if (!uhid) {
    return res.status(400).json({ error: 'UHID is required.' });
  }

  const discharged = db.dischargePatient(uhid);
  if (!discharged) {
    return res.status(400).json({ error: 'No active admission found for this patient.' });
  }

  res.json({
    success: true,
    message: 'Patient discharged. Inpatient admission token closed and discharge summary generated.'
  });
});

// Generate Temporary Access Pass
app.post('/api/patients/:uhid/passes', (req: Request, res: Response) => {
  const { uhid } = req.params;
  const { targetHospitalName } = req.body;

  const passCode = db.generateTemporaryPass(uhid, targetHospitalName);
  if (!passCode) {
    return res.status(404).json({ error: 'Patient not found.' });
  }

  res.json({
    success: true,
    passCode,
    message: 'Temporary 24-hour doctor passcode generated.'
  });
});

// Revoke Pass
app.post('/api/patients/:uhid/passes/revoke', (req: Request, res: Response) => {
  const { uhid } = req.params;
  const { passCode } = req.body;

  const revoked = db.revokePass(uhid, passCode);
  res.json({ success: revoked });
});

// Update PIN
app.put('/api/patients/:uhid/pin', (req: Request, res: Response) => {
  const { uhid } = req.params;
  const { oldPin, newPin } = req.body;

  if (!oldPin || !newPin || newPin.length !== 4) {
    return res.status(400).json({ error: 'New PIN must be exactly 4 digits.' });
  }

  const updated = db.updatePin(uhid, oldPin, newPin);
  if (!updated) {
    return res.status(401).json({ error: 'Current PIN is incorrect.' });
  }

  res.json({ success: true, message: 'PIN updated successfully.' });
});

// Audit Logs
app.get('/api/patients/:uhid/audit-logs', (req: Request, res: Response) => {
  const { uhid } = req.params;
  const logs = db.getAuditLogs(uhid);
  res.json(logs);
});

// Start Express Server with Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Mount Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static production build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OmniHealth Grid Node] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
