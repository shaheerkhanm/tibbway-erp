export type Patient = {
  id: string;
  name: string;
  email: string;
  country: string;
  status: 'Pending' | 'In Treatment' | 'Discharged' | 'Cancelled';
  assignedHospital: string;
  assignedDoctor: string;
  treatmentDate: string;
  avatar: string;
};

export type Hospital = {
  id: string;
  name: string;
  location: string;
  contact: string;
  specialties: string[];
  imageUrl: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  contact: string;
  imageUrl: string;
};

export type Invoice = {
  id: string;
  patientName: string;
  patientId: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  issuedDate: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  appointmentDate: Date;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
};
