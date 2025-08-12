
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Patient } from '@/lib/types';

export interface IPatient extends Omit<Patient, '_id'>, Document {}

const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  country: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Treatment', 'Discharged', 'Cancelled', 'Confirmed', 'Lead'], required: true },
  assignedHospital: { type: String, required: true },
  assignedDoctor: { type: String, required: true },
  treatmentDate: { type: String, required: true },
  avatar: { type: String },
  patientId: { type: String },
});

const PatientModel = (models.Patient as Model<IPatient>) || mongoose.model<IPatient>('Patient', PatientSchema);

export default PatientModel;
