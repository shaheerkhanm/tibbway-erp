import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Invoice } from '@/lib/types';

const InvoiceSchema = new Schema<Invoice>({
  patientName: { type: String, required: true },
  patientId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue'], required: true },
  dueDate: { type: String, required: true },
  issuedDate: { type: String, required: true },
});

const InvoiceModel = (models.Invoice as Model<Invoice>) || mongoose.model<Invoice>('Invoice', InvoiceSchema);

export default InvoiceModel;
