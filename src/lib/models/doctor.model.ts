import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Doctor } from '@/lib/types';

const DoctorSchema = new Schema<Doctor>({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  hospital: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
});

const DoctorModel = (models.Doctor as Model<Doctor>) || mongoose.model<Doctor>('Doctor', DoctorSchema);

export default DoctorModel;
