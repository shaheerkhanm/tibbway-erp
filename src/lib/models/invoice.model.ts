
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Invoice } from '@/lib/types';

export interface IInvoice extends Omit<Invoice, '_id'>, Document {}

const InvoiceSchema = new Schema<IInvoice>({
  patientName: { type: String, required: true },
  patientId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue'], required: true },
  dueDate: { type: String, required: true },
  issuedDate: { type: String, required: true },
});

const InvoiceModel = (models.Invoice as Model<IInvoice>) || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default InvoiceModel;
