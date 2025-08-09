import type { Patient, Hospital, Doctor, Invoice, Appointment } from '@/lib/types';

export const mockPatients: Patient[] = [
  { _id: 'MT001', name: 'John Doe', email: 'john.doe@example.com', country: 'USA', status: 'In Treatment', assignedHospital: 'Global Health Center', assignedDoctor: 'Dr. Emily Carter', treatmentDate: '2024-08-15', avatar: '/avatars/01.png' },
  { _id: 'MT002', name: 'Jane Smith', email: 'jane.smith@example.com', country: 'Canada', status: 'Pending', assignedHospital: 'Unity Medical', assignedDoctor: 'Dr. Ben Hanson', treatmentDate: '2024-09-01', avatar: '/avatars/02.png' },
  { _id: 'MT003', name: 'Ahmed Al-Farsi', email: 'ahmed.farsi@example.com', country: 'UAE', status: 'Discharged', assignedHospital: 'Wellness Hospital', assignedDoctor: 'Dr. Aisha Khan', treatmentDate: '2024-07-20', avatar: '/avatars/03.png' },
  { _id: 'MT004', name: 'Fatima Zohra', email: 'fatima.zohra@example.com', country: 'Morocco', status: 'In Treatment', assignedHospital: 'Global Health Center', assignedDoctor: 'Dr. Emily Carter', treatmentDate: '2024-08-22', avatar: '/avatars/04.png' },
  { _id: 'MT005', name: 'Chen Wei', email: 'chen.wei@example.com', country: 'China', status: 'Cancelled', assignedHospital: 'Unity Medical', assignedDoctor: 'Dr. Ben Hanson', treatmentDate: '2024-09-10', avatar: '/avatars/05.png' },
  { _id: 'MT006', name: 'Olga Petrova', email: 'olga.petrova@example.com', country: 'Russia', status: 'Pending', assignedHospital: 'Wellness Hospital', assignedDoctor: 'Dr. Aisha Khan', treatmentDate: '2024-09-05', avatar: '/avatars/06.png' },
];

export const mockHospitals: Hospital[] = [
  { _id: 'H01', name: 'Global Health Center', location: 'New York, USA', contact: 'contact@ghc.com', specialties: ['Cardiology', 'Oncology'], imageUrl: 'https://placehold.co/600x400.png' },
  { _id: 'H02', name: 'Unity Medical', location: 'Toronto, Canada', contact: 'info@unitymed.ca', specialties: ['Neurology', 'Orthopedics'], imageUrl: 'https://placehold.co/600x400.png' },
  { _id: 'H03', name: 'Wellness Hospital', location: 'Dubai, UAE', contact: 'admin@wellnessdxb.ae', specialties: ['Pediatrics', 'General Surgery'], imageUrl: 'https://placehold.co/600x400.png' },
];

export const mockDoctors: Doctor[] = [
  { _id: 'D001', name: 'Dr. Emily Carter', specialty: 'Cardiology', hospital: 'Global Health Center', contact: 'e.carter@ghc.com', imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'D002', name: 'Dr. Ben Hanson', specialty: 'Neurology', hospital: 'Unity Medical', contact: 'b.hanson@unitymed.ca', imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'D003', name: 'Dr. Aisha Khan', specialty: 'Pediatrics', hospital: 'Wellness Hospital', contact: 'a.khan@wellnessdxb.ae', imageUrl: 'https://placehold.co/100x100.png' },
];

export const mockInvoices: Invoice[] = [
  { _id: 'INV-2024-001', patientName: 'John Doe', patientId: 'MT001', amount: 15000, status: 'Paid', dueDate: '2024-08-01', issuedDate: '2024-07-15' },
  { _id: 'INV-2024-002', patientName: 'Ahmed Al-Farsi', patientId: 'MT003', amount: 8500, status: 'Paid', dueDate: '2024-07-10', issuedDate: '2024-06-25' },
  { _id: 'INV-2024-003', patientName: 'Fatima Zohra', patientId: 'MT004', amount: 22000, status: 'Unpaid', dueDate: '2024-09-01', issuedDate: '2024-08-15' },
  { _id: 'INV-2024-004', patientName: 'Jane Smith', patientId: 'MT002', amount: 12500, status: 'Unpaid', dueDate: '2024-09-20', issuedDate: '2024-09-05' },
  { _id: 'INV-2024-005', patientName: 'John Doe', patientId: 'MT001', amount: 500, status: 'Overdue', dueDate: '2024-08-25', issuedDate: '2024-08-10' },
];

export const mockAppointments: Appointment[] = [
    { 
        _id: 'APP001',
        patientId: 'MT001',
        patientName: 'John Doe',
        doctorId: 'D001',
        doctorName: 'Dr. Emily Carter',
        hospitalId: 'H01',
        hospitalName: 'Global Health Center',
        appointmentDate: new Date(),
        reason: 'Follow-up consultation for cardiology.',
        status: 'Scheduled'
    },
    { 
        _id: 'APP002',
        patientId: 'MT004',
        patientName: 'Fatima Zohra',
        doctorId: 'D001',
        doctorName: 'Dr. Emily Carter',
        hospitalId: 'H01',
        hospitalName: 'Global Health Center',
        appointmentDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        reason: 'Pre-surgery checkup.',
        status: 'Scheduled'
    }
];


export const kpiData = {
  monthlyPatients: 124,
  monthlyRevenue: 256000,
  topCountries: [
    { name: 'USA', value: 45 },
    { name: 'UAE', value: 30 },
    { name: 'Canada', value: 20 },
    { name: 'Russia', value: 15 },
    { name: 'China', value: 14 },
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 180000 },
    { month: 'Feb', revenue: 210000 },
    { month: 'Mar', revenue: 230000 },
    { month: 'Apr', revenue: 190000 },
    { month: 'May', revenue: 240000 },
    { month: 'Jun', revenue: 256000 },
  ]
};
