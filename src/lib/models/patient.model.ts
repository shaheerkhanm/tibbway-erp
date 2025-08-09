import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Patient } from '@/lib/types';

const PatientSchema = new Schema<Patient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Treatment', 'Discharged', 'Cancelled'], required: true },
  assignedHospital: { type: String, required: true },
  assignedDoctor: { type: String, required: true },
  treatmentDate: { type: String, required: true },
  avatar: { type: String, required: true },
});

const PatientModel = (models.Patient as Model<Patient>) || mongoose.model<Patient>('Patient', PatientSchema);

export default PatientModel;
