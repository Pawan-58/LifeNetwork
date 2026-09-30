import { Hospital, Patient, MedicalRecord, HospitalAdmission, AccessAuditLog, SystemMetrics } from '../types/health';

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-metro',
    name: 'Metro Multi-Specialty Hospital',
    code: 'MMSH-01',
    city: 'Mumbai',
    state: 'Maharashtra',
    networkTier: 'Super Specialty',
    status: 'High Availability Active',
    licenseNo: 'MH-MED-2018-9941',
    totalRecordsShared: 148200,
    latencyMs: 14,
    activeDoctorsCount: 184,
    bedsCapacity: 650,
    phone: '+91 22 4589 1100',
    address: 'Central Health District, Sector 4, Mumbai'
  },
  {
    id: 'hosp-apollo',
    name: 'Apollo Heart & Vascular Institute',
    code: 'AHVI-09',
    city: 'New Delhi',
    state: 'Delhi NCR',
    networkTier: 'Apex Institute',
    status: 'High Availability Active',
    licenseNo: 'DL-HOSP-2015-8821',
    totalRecordsShared: 219400,
    latencyMs: 19,
    activeDoctorsCount: 240,
    bedsCapacity: 800,
    phone: '+91 11 2692 5858',
    address: 'Sarita Vihar, Mathura Road, New Delhi'
  },
  {
    id: 'hosp-stjude',
    name: 'St. Jude Orthopedic & Trauma Centre',
    code: 'SJOT-14',
    city: 'Bengaluru',
    state: 'Karnataka',
    networkTier: 'Trauma Level 1',
    status: 'Synchronized',
    licenseNo: 'KA-TRAU-2020-4491',
    totalRecordsShared: 98600,
    latencyMs: 22,
    activeDoctorsCount: 110,
    bedsCapacity: 420,
    phone: '+91 80 2553 9000',
    address: '100 Feet Road, Indiranagar, Bengaluru'
  },
  {
    id: 'hosp-apex',
    name: 'Apex Diagnostic & Pathology Center',
    code: 'ADPC-03',
    city: 'Hyderabad',
    state: 'Telangana',
    networkTier: 'Diagnostic Hub',
    status: 'Synchronized',
    licenseNo: 'TS-DIAG-2019-3382',
    totalRecordsShared: 384100,
    latencyMs: 16,
    activeDoctorsCount: 75,
    bedsCapacity: 50,
    phone: '+91 40 6712 3456',
    address: 'Banjara Hills Road No. 12, Hyderabad'
  },
  {
    id: 'hosp-citycare',
    name: 'City Care General Hospital',
    code: 'CCGH-22',
    city: 'Pune',
    state: 'Maharashtra',
    networkTier: 'Tertiary Care',
    status: 'Connected',
    licenseNo: 'MH-GEN-2017-1123',
    totalRecordsShared: 84300,
    latencyMs: 27,
    activeDoctorsCount: 95,
    bedsCapacity: 350,
    phone: '+91 20 2612 8899',
    address: 'Kalyani Nagar, Pune'
  }
];

export const INITIAL_PAWAN_ADMISSION: HospitalAdmission = {
  id: 'adm-metro-2022-88',
  uhid: 'UHID-9842-4410',
  hospitalId: 'hosp-metro',
  hospitalName: 'Metro Multi-Specialty Hospital',
  admissionDate: '2022-11-14T03:30:00Z',
  dischargeDate: '2022-11-18T14:00:00Z',
  ward: 'Surgical ICU / Stepdown Post-Op Ward',
  bed: 'Bed 304-B',
  attendingDoctor: 'Dr. Anand Kulkarni, MS (Gen Surgery)',
  department: 'General & Minimally Invasive Surgery',
  admissionReason: 'Acute Suppurative Appendicitis with localized peritonitis',
  admissionToken: 'TOKEN-MMH-APP-7712',
  status: 'Discharged',
  notes: 'Patient underwent uneventful laparoscopic appendectomy. Post-op recovery satisfactory.'
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    uhid: 'UHID-9842-4410',
    nationalHealthId: 'NHID-IND-7782190-PAWAN',
    fullName: 'Pawan Kumar',
    dateOfBirth: '1994-06-15',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '9876543210',
    email: 'pawan.kumar@healthvault.in',
    address: 'Flat 402, Green Meadows Residency, Powai, Mumbai - 400076',
    pin: '1234',
    emergencyContact: {
      name: 'Sunita Kumar',
      relation: 'Spouse',
      phone: '+91 9876543211'
    },
    allergies: ['Penicillin (Severe Rash / Anaphylactoid)', 'Sulfa Antibiotics'],
    chronicConditions: ['Mild Essential Hypertension', 'Occasional Seasonal Rhinitis'],
    organDonorStatus: true,
    activeAdmission: undefined,
    temporaryPasses: [
      {
        passCode: '8834',
        targetHospitalName: 'Emergency Triage Access',
        issuedAt: '2026-09-29T18:00:00Z',
        expiresAt: '2026-09-30T18:00:00Z',
        status: 'Active'
      }
    ],
    registeredDate: '2021-03-12'
  },
  {
    uhid: 'UHID-4019-3320',
    nationalHealthId: 'NHID-IND-3391820-ANANYA',
    fullName: 'Ananya Sharma',
    dateOfBirth: '1998-11-20',
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '9811223344',
    email: 'ananya.sharma@domain.in',
    address: 'B-12 Vasundhara Enclave, East Delhi - 110096',
    pin: '5678',
    emergencyContact: {
      name: 'Ramesh Sharma',
      relation: 'Father',
      phone: '+91 9811223345'
    },
    allergies: ['Peanuts (Severe)', 'NSAIDs - Ibuprofen'],
    chronicConditions: ['Type-1 Diabetes Mellitus'],
    organDonorStatus: true,
    activeAdmission: {
      id: 'adm-apollo-curr-01',
      uhid: 'UHID-4019-3320',
      hospitalId: 'hosp-apollo',
      hospitalName: 'Apollo Heart & Vascular Institute',
      admissionDate: '2026-09-28T09:15:00Z',
      ward: 'Endocrinology Inpatient Unit',
      bed: 'Bed 112-A',
      attendingDoctor: 'Dr. Shalini Gupta, MD, DM',
      department: 'Endocrinology & Diabetology',
      admissionReason: 'Glycemic stabilization & Continuous Glucose Monitoring optimization',
      admissionToken: 'ADM-APOLLO-99120',
      status: 'Active',
      notes: 'Active admission - doctor records unlocked under Hospital Admission Protocol.'
    },
    temporaryPasses: [],
    registeredDate: '2022-08-19'
  }
];

export const INITIAL_PAWAN_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-2026-001',
    uhid: 'UHID-9842-4410',
    hospitalId: 'hosp-citycare',
    hospitalName: 'City Care General Hospital',
    hospitalCode: 'CCGH-22',
    hospitalCity: 'Pune',
    doctorName: 'Dr. Neha Deshmukh, MD (Pulmonology)',
    doctorSpecialty: 'Pulmonology & Respiratory Medicine',
    date: '2026-08-14',
    recordType: 'Prescription',
    title: 'Acute Bronchial Hyperreactivity & Post-Viral Cough Protocol',
    diagnosis: 'Post-Viral Bronchial Irritation with Nocturnal Cough',
    summary: 'Patient presented with 2-week history of dry spasmodic cough following seasonal flu. Chest auscultation revealed bilateral mild end-expiratory rhonchi without consolidation.',
    status: 'Final',
    priority: 'Normal',
    medications: [
      {
        name: 'Montelukast + Levocetirizine',
        dosage: '10mg / 5mg',
        frequency: '1 tablet once daily at bedtime',
        duration: '14 days',
        instructions: 'Take after dinner. Helps suppress bronchial inflammation.'
      },
      {
        name: 'Budesonide + Formoterol Inhaler',
        dosage: '200mcg / 6mcg',
        frequency: '2 puffs twice daily with spacer',
        duration: '10 days',
        instructions: 'Rinse mouth thoroughly with water after inhalation.'
      }
    ],
    documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fileName: 'CityCare_Prescription_Aug2026.pdf'
  },
  {
    id: 'rec-2025-002',
    uhid: 'UHID-9842-4410',
    hospitalId: 'hosp-apex',
    hospitalName: 'Apex Diagnostic & Pathology Center',
    hospitalCode: 'ADPC-03',
    hospitalCity: 'Hyderabad',
    doctorName: 'Dr. Suresh Reddy, MD (Pathology)',
    doctorSpecialty: 'Clinical Biochemistry & Molecular Pathology',
    date: '2025-10-18',
    recordType: 'Lab Report',
    title: 'Comprehensive Annual Executive Metabolic & Lipid Panel',
    diagnosis: 'Borderline Dyslipidemia with Optimal Glycemic Control',
    summary: 'Standard annual health screening requested. Fasting blood sample analyzed on automated cobas c502 Roche analyzer. Calibrations strictly validated.',
    status: 'Verified',
    priority: 'Normal',
    parameters: [
      { name: 'Fasting Plasma Glucose', value: '92', unit: 'mg/dL', referenceRange: '70 - 99', flag: 'Normal' },
      { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4', unit: '%', referenceRange: '4.0 - 5.6', flag: 'Normal' },
      { name: 'Total Cholesterol', value: '208', unit: 'mg/dL', referenceRange: '< 200', flag: 'High' },
      { name: 'LDL Cholesterol (Calculated)', value: '134', unit: 'mg/dL', referenceRange: '< 100', flag: 'High' },
      { name: 'HDL Cholesterol (Protective)', value: '48', unit: 'mg/dL', referenceRange: '> 40', flag: 'Normal' },
      { name: 'Triglycerides', value: '130', unit: 'mg/dL', referenceRange: '< 150', flag: 'Normal' },
      { name: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', referenceRange: '0.7 - 1.3', flag: 'Normal' },
      { name: 'eGFR (CKD-EPI)', value: '108', unit: 'mL/min/1.73m²', referenceRange: '> 90', flag: 'Normal' },
      { name: 'Serum Bilirubin (Total)', value: '0.8', unit: 'mg/dL', referenceRange: '0.2 - 1.2', flag: 'Normal' },
      { name: 'SGPT / ALT', value: '28', unit: 'U/L', referenceRange: '7 - 56', flag: 'Normal' }
    ],
    labFindingsSummary: 'Metabolic profile reveals mild elevation in total and LDL cholesterol. Hepatic and renal markers are fully within physiological limits. Advised low saturated fat diet and brisk cardio 30 min/day.',
    documentHash: '8f434346648f6b96df89dda901c5176b10f609fb613047192d4ec5424ff4c3b9',
    fileName: 'Apex_Executive_Metabolic_Report_2025.pdf'
  },
  {
    id: 'rec-2024-003',
    uhid: 'UHID-9842-4410',
    hospitalId: 'hosp-stjude',
    hospitalName: 'St. Jude Orthopedic & Trauma Centre',
    hospitalCode: 'SJOT-14',
    hospitalCity: 'Bengaluru',
    doctorName: 'Dr. Matthew Fernandes, MS, MCh (Ortho)',
    doctorSpecialty: 'Sports Medicine & Joint Arthroscopy',
    date: '2024-05-22',
    recordType: 'Radiology & Scans',
    title: 'High-Resolution 3.0T MRI Scan - Right Knee Joint',
    diagnosis: 'Grade-I Sprain of Anterior Cruciate Ligament (ACL) with Intact Menisci',
    summary: 'Patient sustained twisting injury while playing badminton. High field 3 Tesla MRI conducted with axial, sagittal and coronal proton density fat-saturated sequences.',
    status: 'Final',
    priority: 'Normal',
    labFindingsSummary: 'Increased intrasubstance signal intensity within proximal fibers of ACL consistent with Grade 1 interstitial strain. Medial and lateral meniscus demonstrate normal morphology without tear. No joint effusion or osteochondral defect.',
    medications: [
      {
        name: 'Aceclofenac + Paracetamol',
        dosage: '100mg / 325mg',
        frequency: '1 tablet twice daily after meals',
        duration: '5 days as needed for pain',
        instructions: 'Strictly avoid taking on empty stomach.'
      },
      {
        name: 'Hinged Knee Brace',
        dosage: 'Universal Medium',
        frequency: 'Wear during weight-bearing activities',
        duration: '3 weeks',
        instructions: 'Initiate isometric quadriceps exercises from Day 7.'
      }
    ],
    documentHash: 'c4ca4238a0b923820dcc509a6f75849b3842f1cf5937a0c102a06141a1829e1f',
    fileName: 'StJude_Right_Knee_MRI_Report.pdf'
  },
  {
    id: 'rec-2023-004',
    uhid: 'UHID-9842-4410',
    hospitalId: 'hosp-apollo',
    hospitalName: 'Apollo Heart & Vascular Institute',
    hospitalCode: 'AHVI-09',
    hospitalCity: 'New Delhi',
    doctorName: 'Dr. Vikram Singhania, MD, DM, FACC',
    doctorSpecialty: 'Cardiovascular Sciences & Interventional Cardiology',
    date: '2023-09-05',
    recordType: 'Lab Report',
    title: 'Cardiac Evaluation: 12-Lead Resting ECG & Transthoracic 2D Echo',
    diagnosis: 'Normal Resting Cardiac Function; No Evidence of Ischemia',
    summary: 'Preventive cardiology screening undertaken during company executive check. Patient reported occasional fluttering with heavy coffee consumption.',
    status: 'Final',
    priority: 'Normal',
    parameters: [
      { name: 'Heart Rate', value: '72', unit: 'bpm', referenceRange: '60 - 100', flag: 'Normal' },
      { name: 'Blood Pressure', value: '128/82', unit: 'mmHg', referenceRange: '< 120/80', flag: 'High' },
      { name: 'Left Ventricular Ejection Fraction (LVEF)', value: '64', unit: '%', referenceRange: '55 - 70', flag: 'Normal' },
      { name: 'Left Atrium Diameter', value: '3.4', unit: 'cm', referenceRange: '3.0 - 4.0', flag: 'Normal' },
      { name: 'Wall Motion Score Index', value: '1.0', unit: 'Score', referenceRange: '1.0 (Normal)', flag: 'Normal' },
      { name: 'Cardiac Troponin-I', value: '< 0.01', unit: 'ng/mL', referenceRange: '< 0.04', flag: 'Normal' }
    ],
    labFindingsSummary: 'Resting 12-lead ECG reveals regular sinus rhythm at 72 bpm, normal axis, normal PR and QT intervals. 2D Echo demonstrates preserved biventricular systolic function, no valvular stenosis or regurgitation.',
    documentHash: '012973a887d558a74e54823ee9ee3d1f11c750174092b3a9856f61fc1c37b8cb',
    fileName: 'Apollo_Cardiac_ECG_Echo_Report.pdf'
  },
  {
    id: 'rec-2022-005',
    uhid: 'UHID-9842-4410',
    hospitalId: 'hosp-metro',
    hospitalName: 'Metro Multi-Specialty Hospital',
    hospitalCode: 'MMSH-01',
    hospitalCity: 'Mumbai',
    doctorName: 'Dr. Anand Kulkarni, MS (Gen Surgery), FAIS',
    doctorSpecialty: 'Minimally Invasive General Surgery',
    date: '2022-11-18',
    recordType: 'Discharge Summary',
    title: 'Operative & Discharge Summary: Emergency Laparoscopic Appendectomy',
    diagnosis: 'Acute Phlegmonous Appendicitis (Operated)',
    summary: 'Pawan Kumar, 28M, presented to emergency with right lower quadrant tenderness, fever 101F, and leukocytosis. Emergency 3-port laparoscopic appendectomy performed under general anesthesia.',
    status: 'Final',
    priority: 'Urgent',
    parameters: [
      { name: 'Total Leukocyte Count (TLC)', value: '14200', unit: '/cu.mm', referenceRange: '4000 - 11000', flag: 'High' },
      { name: 'Neutrophils', value: '84', unit: '%', referenceRange: '40 - 75', flag: 'High' },
      { name: 'C-Reactive Protein (CRP)', value: '38.4', unit: 'mg/L', referenceRange: '< 5.0', flag: 'High' },
      { name: 'Hemoglobin', value: '14.8', unit: 'g/dL', referenceRange: '13.0 - 17.0', flag: 'Normal' }
    ],
    labFindingsSummary: 'Histopathology: Specimen measured 7.5cm x 1.2cm. Showed heavy transmural neutrophilic infiltration with mucosal ulceration and serositis. No dysplasia or malignancy noted. Surgical margins clear.',
    medications: [
      {
        name: 'Cefixime (Post-discharge course)',
        dosage: '200mg',
        frequency: '1 tablet twice daily after food',
        duration: '5 days completed',
        instructions: 'Note: Patient allergic to Penicillins; tolerated Cephalosporin under test supervision.'
      },
      {
        name: 'Paracetamol',
        dosage: '650mg',
        frequency: 'As needed for residual pain',
        duration: '3 days',
        instructions: 'Max 3 tablets daily.'
      }
    ],
    documentHash: '9b73c93d60fe7085f21ec15c599daf205c2a59f2a75eb3f806594b80eeddefb0',
    fileName: 'MetroHospital_Appendectomy_Discharge_Summary_2022.pdf'
  },
  {
    id: 'rec-2021-006',
    uhid: 'UHID-9842-4410',
    hospitalId: 'hosp-metro',
    hospitalName: 'Metro Multi-Specialty Hospital',
    hospitalCode: 'MMSH-01',
    hospitalCity: 'Mumbai',
    doctorName: 'Dr. Priya Nambiar, MD',
    doctorSpecialty: 'Preventive Health & Immunization Clinic',
    date: '2021-07-10',
    recordType: 'Vitals & Triage',
    title: 'National Immunization & Adult Booster Certificate',
    diagnosis: 'Adult Immunization Record Complete',
    summary: 'Administered Hepatitis-B adult booster dose 3 and Tetanus Toxoid / Diphtheria (Td) booster. Monitored for 30 minutes post-injection with zero adverse reaction.',
    status: 'Final',
    priority: 'Normal',
    labFindingsSummary: 'Anti-HBs antibody titer recheck confirmed protective immunity (> 100 mIU/mL). Validated on national immunization registry.',
    documentHash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    fileName: 'National_Immunization_Passport_Pawan.pdf'
  }
];

export const INITIAL_AUDIT_LOGS: AccessAuditLog[] = [
  {
    id: 'audit-001',
    uhid: 'UHID-9842-4410',
    timestamp: '2026-09-29T20:15:22Z',
    accessorName: 'Dr. Neha Deshmukh',
    accessorRole: 'Doctor',
    hospitalName: 'City Care General Hospital',
    accessMethod: 'Patient PIN Authorization',
    purpose: 'Review past pulmonary allergies and antibiotic sensitivities prior to bronchodilator prescription',
    recordsViewedCount: 5,
    ipAddress: '14.139.112.45',
    status: 'Granted'
  },
  {
    id: 'audit-002',
    uhid: 'UHID-9842-4410',
    timestamp: '2025-10-18T11:40:10Z',
    accessorName: 'Dr. Suresh Reddy',
    accessorRole: 'Chief Medical Officer',
    hospitalName: 'Apex Diagnostic & Pathology Center',
    accessMethod: 'Patient PIN Authorization',
    purpose: 'Uploaded Annual Metabolic Laboratory Results to lifetime national vault',
    recordsViewedCount: 1,
    ipAddress: '115.240.89.201',
    status: 'Granted'
  },
  {
    id: 'audit-003',
    uhid: 'UHID-9842-4410',
    timestamp: '2024-05-22T16:05:00Z',
    accessorName: 'Dr. Matthew Fernandes',
    accessorRole: 'Doctor',
    hospitalName: 'St. Jude Orthopedic & Trauma Centre',
    accessMethod: 'Patient PIN Authorization',
    purpose: 'Correlating knee joint pain with patient surgical history & uploading 3.0T MRI report',
    recordsViewedCount: 4,
    ipAddress: '49.207.18.99',
    status: 'Granted'
  },
  {
    id: 'audit-004',
    uhid: 'UHID-9842-4410',
    timestamp: '2022-11-14T03:32:15Z',
    accessorName: 'Emergency Trauma Triage Desk',
    accessorRole: 'Nurse/Triage',
    hospitalName: 'Metro Multi-Specialty Hospital',
    accessMethod: 'Active Admission Override',
    purpose: 'Emergency surgery prep: Checking drug allergies (Penicillin allergy verified in record)',
    recordsViewedCount: 6,
    ipAddress: '103.22.140.12',
    status: 'Granted'
  }
];

export const INITIAL_METRICS: SystemMetrics = {
  uptime: '99.998%',
  nodesOnline: 148,
  totalHospitals: 520,
  totalPatientsRegistered: 4892010,
  totalRecordsEncrypted: 24901840,
  queriesPerSecond: 18450,
  avgLatencyMs: 18,
  fhirVersion: 'HL7 FHIR Release 4.0.1 Unified Specification',
  dataIntegrityRate: '100% Cryptographically Verified'
};
