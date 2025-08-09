import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Hospital } from '@/lib/types';

const HospitalSchema = new Schema<Hospital>({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  specialties: [{ type: String }],
  imageUrl: { type: String, required: true },
});

const HospitalModel = (models.Hospital as Model<Hospital>) || mongoose.model<Hospital>('Hospital', HospitalSchema);

export default HospitalModel;
