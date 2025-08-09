
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import InvoiceModel from "@/lib/models/invoice.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const invoice = await InvoiceModel.findById(params.id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const body = await request.json();
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(updatedInvoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const deletedInvoice = await InvoiceModel.findByIdAndDelete(params.id);
    if (!deletedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
