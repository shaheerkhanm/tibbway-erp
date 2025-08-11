
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import InvoiceModel from "@/lib/models/invoice.model";

export async function GET() {
  try {
    await connectDB();
    const invoices = await InvoiceModel.find({}).lean();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const invoice = await InvoiceModel.create(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}

