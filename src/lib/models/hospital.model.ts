
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Hospital } from '@/lib/types';

export interface IHospital extends Omit<Hospital, '_id'>, Document {}

const HospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  specialties: [{ type: String }],
  imageUrl: { type: String, required: true },
});

const HospitalModel = (models.Hospital as Model<IHospital>) || mongoose.model<IHospital>('Hospital', HospitalSchema);

export default HospitalModel;
