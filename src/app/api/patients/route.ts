
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PatientModel from "@/lib/models/patient.model";

export async function GET() {
  await connectDB();
  try {
    const patients = await PatientModel.find({});
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const patient = await PatientModel.create(body);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
