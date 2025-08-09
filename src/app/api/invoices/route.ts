
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import InvoiceModel from "@/lib/models/invoice.model";

export async function GET() {
  await connectDB();
  try {
    const invoices = await InvoiceModel.find({});
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const invoice = await InvoiceModel.create(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
