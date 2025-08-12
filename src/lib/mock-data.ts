
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
  { _id: 'H01', name: 'Apollo Hospitals', country: 'India', location: 'Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006', contact: 'info@apollochennai.com', phone: '+91-44-2829-3333', contactPerson: 'Dr. Prathap C. Reddy', specialties: ['Cardiology', 'Oncology', 'Neurology', 'Pediatrics'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 45, totalPatients: 234 },
  { _id: 'H02', name: 'Fortis Healthcare', country: 'India', location: 'Sector 62, Phase - VIII, Mohali, Punjab 160062', contact: 'info@fortishealthcare.com', phone: '+91-172-496-7000', contactPerson: 'Dr. Ashok Seth', specialties: ['Cardiac Surgery', 'Gastroenterology', 'Urology', 'Orthopedics'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 32, totalPatients: 187 },
  { _id: 'H03', name: 'Max Healthcare', country: 'India', location: 'Press Enclave Road, Saket, New Delhi, Delhi 110017', contact: 'info@maxhealthcare.com', phone: '+91-11-2651-5050', contactPerson: 'Dr. Sandeep Budhiraja', specialties: ['Plastic Surgery', 'IVF', 'Radiology', 'Dermatology'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 28, totalPatients: 156 },
  { _id: 'H04', name: 'Manipal Hospitals', country: 'India', location: '98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017', contact: 'info@manipalhospitals.com', phone: '+91-80-2502-5500', contactPerson: 'Dr. Sudarshan Ballal', specialties: ['Nephrology', 'Urology', 'Robotic Surgery'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 52, totalPatients: 210 },
];

export const mockDoctors: Doctor[] = [
  { _id: 'D001', name: 'Dr. Rajesh Kumar', specialty: 'Cardiothoracic Surgery', hospital: 'Apollo Hospitals', email: 'rajesh.kumar@apollo.com', phone: '+91-98765-43210', experience: 15, availableSlots: ['09:00-12:00', '14:00-17:00'], activePatients: 12, totalPatients: 145, rating: 4.8, imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'D002', name: 'Dr. Priya Sharma', specialty: 'Orthopedic Surgery', hospital: 'Fortis Healthcare', email: 'priya.sharma@fortis.com', phone: '+91-98765-43211', experience: 12, availableSlots: ['10:00-13:00', '15:00-18:00'], activePatients: 8, totalPatients: 98, rating: 4.9, imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'D003', name: 'Dr. Anil Gupta', specialty: 'Plastic & Cosmetic Surgery', hospital: 'Max Healthcare', email: 'anil.gupta@max.com', phone: '+91-98765-43212', experience: 18, availableSlots: ['08:00-11:00', '16:00-19:00'], activePatients: 15, totalPatients: 203, rating: 4.7, imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'D004', name: 'Dr. Sunita Patel', specialty: 'Nephrology', hospital: 'Manipal Hospitals', email: 'sunita.patel@manipal.com', phone: '+91-98765-43213', experience: 10, availableSlots: ['09:30-12:30'], activePatients: 10, totalPatients: 112, rating: 4.8, imageUrl: 'https://placehold.co/100x100.png' },
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

    
