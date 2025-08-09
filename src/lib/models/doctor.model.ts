
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Doctor } from '@/lib/types';

export interface IDoctor extends Omit<Doctor, '_id'>, Document {}

const DoctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  hospital: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
});

const DoctorModel = (models.Doctor as Model<IDoctor>) || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default DoctorModel;
