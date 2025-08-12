
import type { Patient, Hospital, Doctor, Invoice, Appointment, User } from '@/lib/types';
import { addDays, subDays, format } from 'date-fns';

const today = new Date();

export const mockHospitals: Hospital[] = [
  { _id: 'HOS01', name: 'Apollo Hospitals', country: 'India', location: 'Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006', contact: 'contact@apollo.com', phone: '+91-44-2829-3333', contactPerson: 'Dr. Prathap C. Reddy', specialties: ['Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 'Transplants'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 45, totalPatients: 234 },
  { _id: 'HOS02', name: 'Fortis Healthcare', country: 'India', location: 'Sector 62, Phase - VIII, Mohali, Punjab 160062', contact: 'contact@fortis.com', phone: '+91-172-496-7000', contactPerson: 'Dr. Ashok Seth', specialties: ['Cardiac Surgery', 'Gastroenterology', 'Urology', 'Orthopedics'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 32, totalPatients: 187 },
  { _id: 'HOS03', name: 'Max Healthcare', country: 'India', location: 'Press Enclave Road, Saket, New Delhi, Delhi 110017', contact: 'contact@max.com', phone: '+91-11-2651-5050', contactPerson: 'Dr. Sandeep Budhiraja', specialties: ['Plastic Surgery', 'IVF', 'Radiology', 'Dermatology', 'Neurology'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 28, totalPatients: 156 },
  { _id: 'HOS04', name: 'Manipal Hospitals', country: 'India', location: '98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017', contact: 'contact@manipal.com', phone: '+91-80-2502-5500', contactPerson: 'Dr. Sudarshan Ballal', specialties: ['Nephrology', 'Urology', 'Robotic Surgery', 'Oncology'], imageUrl: 'https://placehold.co/600x400.png', activePatients: 52, totalPatients: 210 },
];

export const mockDoctors: Doctor[] = [
  { _id: 'DOC01', name: 'Dr. Rajesh Kumar', specialty: 'Cardiothoracic Surgery', hospital: 'Apollo Hospitals', email: 'rajesh.kumar@apollo.com', phone: '+91-98765-43210', experience: 15, availableSlots: ['09:00-12:00', '14:00-17:00'], activePatients: 12, totalPatients: 145, rating: 4.8, imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'DOC02', name: 'Dr. Priya Sharma', specialty: 'Orthopedic Surgery', hospital: 'Fortis Healthcare', email: 'priya.sharma@fortis.com', phone: '+91-98765-43211', experience: 12, availableSlots: ['10:00-13:00', '15:00-18:00'], activePatients: 8, totalPatients: 98, rating: 4.9, imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'DOC03', name: 'Dr. Anil Gupta', specialty: 'Plastic & Cosmetic Surgery', hospital: 'Max Healthcare', email: 'anil.gupta@max.com', phone: '+91-98765-43212', experience: 18, availableSlots: ['08:00-11:00', '16:00-19:00'], activePatients: 15, totalPatients: 203, rating: 4.7, imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'DOC04', name: 'Dr. Sunita Patel', specialty: 'Nephrology', hospital: 'Manipal Hospitals', email: 'sunita.patel@manipal.com', phone: '+91-98765-43213', experience: 10, availableSlots: ['09:30-12:30'], activePatients: 10, totalPatients: 112, rating: 4.8, imageUrl: 'https://placehold.co/100x100.png' },
  { _id: 'DOC05', name: 'Dr. Emily Carter', specialty: 'Neurology', hospital: 'Apollo Hospitals', email: 'emily.carter@apollo.com', phone: '+91-98765-43214', experience: 9, availableSlots: ['11:00-14:00'], activePatients: 7, totalPatients: 85, rating: 4.6, imageUrl: 'https://placehold.co/100x100.png' },
];

export const mockPatients: Patient[] = [
  { _id: 'PAT001', patientId: 'US-87236', name: 'John Doe', email: 'john.doe@example.com', phone: '+1-202-555-0191', country: 'United States', status: 'In Treatment', assignedHospital: 'Apollo Hospitals', assignedDoctor: 'Dr. Rajesh Kumar', treatmentDate: format(addDays(today, 15), 'yyyy-MM-dd'), avatar: 'https://placehold.co/100x100.png' },
  { _id: 'PAT002', patientId: 'CA-94023', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1-416-555-0123', country: 'Canada', status: 'Pending', assignedHospital: 'Fortis Healthcare', assignedDoctor: 'Dr. Priya Sharma', treatmentDate: format(addDays(today, 30), 'yyyy-MM-dd'), avatar: 'https://placehold.co/100x100.png' },
  { _id: 'PAT003', patientId: 'AE-34789', name: 'Ahmed Al-Farsi', email: 'ahmed.farsi@example.com', phone: '+971-50-555-1234', country: 'United Arab Emirates', status: 'Discharged', assignedHospital: 'Max Healthcare', assignedDoctor: 'Dr. Anil Gupta', treatmentDate: format(subDays(today, 20), 'yyyy-MM-dd'), avatar: 'https://placehold.co/100x100.png' },
  { _id: 'PAT004', patientId: 'MA-23987', name: 'Fatima Zohra', email: 'fatima.zohra@example.com', phone: '+212-661-555-123', country: 'Morocco', status: 'In Treatment', assignedHospital: 'Apollo Hospitals', assignedDoctor: 'Dr. Rajesh Kumar', treatmentDate: format(addDays(today, 5), 'yyyy-MM-dd'), avatar: 'https://placehold.co/100x100.png' },
  { _id: 'PAT005', patientId: 'CN-87234', name: 'Chen Wei', email: 'chen.wei@example.com', phone: '+86-139-1234-5678', country: 'China', status: 'Cancelled', assignedHospital: 'Fortis Healthcare', assignedDoctor: 'Dr. Priya Sharma', treatmentDate: format(addDays(today, 45), 'yyyy-MM-dd'), avatar: 'https://placehold.co/100x100.png' },
  { _id: 'PAT006', patientId: 'RU-19823', name: 'Olga Petrova', email: 'olga.petrova@example.com', phone: '+7-916-123-45-67', country: 'Russia', status: 'Confirmed', assignedHospital: 'Max Healthcare', assignedDoctor: 'Dr. Anil Gupta', treatmentDate: format(addDays(today, 10), 'yyyy-MM-dd'), avatar: 'https://placehold.co/100x100.png' },
  { _id: 'PAT007', patientId: 'GB-34598', name: 'David Beckham', email: 'david.beckham@example.com', phone: '+44-7700-900123', country: 'United Kingdom', status: 'Lead', assignedHospital: 'Manipal Hospitals', assignedDoctor: 'Dr. Sunita Patel', treatmentDate: format(addDays(today, 60), 'yyyy-MM-dd'), avatar: 'https://placehold.co/100x100.png' },
];

export const mockInvoices: Invoice[] = [
  { _id: 'INV-2024-001', patientName: 'John Doe', patientId: 'PAT001', amount: 15000, status: 'Paid', dueDate: '2024-08-01', issuedDate: '2024-07-15' },
  { _id: 'INV-2024-002', patientName: 'Ahmed Al-Farsi', patientId: 'PAT003', amount: 8500, status: 'Paid', dueDate: '2024-07-10', issuedDate: '2024-06-25' },
  { _id: 'INV-2024-003', patientName: 'Fatima Zohra', patientId: 'PAT004', amount: 22000, status: 'Unpaid', dueDate: format(addDays(today, 10), 'yyyy-MM-dd'), issuedDate: format(subDays(today, 5), 'yyyy-MM-dd') },
  { _id: 'INV-2024-004', patientName: 'Jane Smith', patientId: 'PAT002', amount: 12500, status: 'Unpaid', dueDate: format(addDays(today, 25), 'yyyy-MM-dd'), issuedDate: format(addDays(today, 10), 'yyyy-MM-dd') },
  { _id: 'INV-2024-005', patientName: 'Olga Petrova', patientId: 'PAT006', amount: 500, status: 'Overdue', dueDate: format(subDays(today, 5), 'yyyy-MM-dd'), issuedDate: format(subDays(today, 20), 'yyyy-MM-dd') },
];

export const mockAppointments: Appointment[] = [
    { 
        _id: 'APP001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        doctorId: 'DOC01',
        doctorName: 'Dr. Rajesh Kumar',
        hospitalId: 'HOS01',
        hospitalName: 'Apollo Hospitals',
        appointmentDate: new Date(),
        reason: 'Follow-up consultation for cardiology.',
        status: 'Scheduled'
    },
    { 
        _id: 'APP002',
        patientId: 'PAT004',
        patientName: 'Fatima Zohra',
        doctorId: 'DOC01',
        doctorName: 'Dr. Rajesh Kumar',
        hospitalId: 'HOS01',
        hospitalName: 'Apollo Hospitals',
        appointmentDate: addDays(today, 2),
        reason: 'Pre-surgery checkup.',
        status: 'Scheduled'
    },
    {
        _id: 'APP003',
        patientId: 'PAT006',
        patientName: 'Olga Petrova',
        doctorId: 'DOC03',
        doctorName: 'Dr. Anil Gupta',
        hospitalId: 'HOS03',
        hospitalName: 'Max Healthcare',
        appointmentDate: new Date(),
        reason: 'Cosmetic surgery consultation.',
        status: 'Scheduled'
    },
     { 
        _id: 'APP004',
        patientId: 'PAT002',
        patientName: 'Jane Smith',
        doctorId: 'DOC02',
        doctorName: 'Dr. Priya Sharma',
        hospitalId: 'HOS02',
        hospitalName: 'Fortis Healthcare',
        appointmentDate: addDays(today, -1),
        reason: 'Knee replacement follow-up.',
        status: 'Completed'
    },
];

export const mockUsers: Omit<User, 'password'>[] = [
    { _id: 'USR01', name: 'Super Admin', email: 'admin@tibbway.com', role: 'Super Admin', avatar: 'https://placehold.co/100x100.png' },
    { _id: 'USR02', name: 'Alicia Keys', email: 'alicia@tibbway.com', role: 'Admin', avatar: 'https://placehold.co/100x100.png' },
    { _id: 'USR03', name: 'Ben Affleck', email: 'ben@tibbway.com', role: 'Staff', avatar: 'https://placehold.co/100x100.png' },
    { _id: 'USR04', name: 'Catherine Zeta', email: 'catherine@tibbway.com', role: 'Staff', avatar: 'https://placehold.co/100x100.png' },
];
