
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Appointment } from '@/lib/types';

export interface IAppointment extends Omit<Appointment, '_id'>, Document {}

const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], required: true },
});

const AppointmentModel = (models.Appointment as Model<IAppointment>) || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default AppointmentModel;
