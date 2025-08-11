
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PatientModel from "@/lib/models/patient.model";

export async function GET() {
  try {
    await connectDB();
    const patients = await PatientModel.find({}).lean();
    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const patient = await PatientModel.create(body);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
