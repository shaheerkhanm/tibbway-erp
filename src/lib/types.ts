
export type Patient = {
  _id: string;
  patientId?: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  status: 'Pending' | 'In Treatment' | 'Discharged' | 'Cancelled' | 'Confirmed' | 'Lead';
  assignedHospital: string;
  assignedDoctor: string;
  treatmentDate: string;
  avatar: string;
};

export type Hospital = {
  _id: string;
  name: string;
  location: string;
  contact: string;
  specialties: string[];
  imageUrl: string;
};

export type Doctor = {
  _id: string;
  name: string;
  specialty: string;
  hospital: string;
  contact: string;
  imageUrl: string;
};

export type Invoice = {
  _id: string;
  patientName: string;
  patientId: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  issuedDate: string;
};

export type Appointment = {
  _id: string;
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

export type UserRole = 'Super Admin' | 'Admin' | 'Staff';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
