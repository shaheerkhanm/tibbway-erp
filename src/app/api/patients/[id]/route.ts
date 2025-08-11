
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PatientModel from "@/lib/models/patient.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const patient = await PatientModel.findById(params.id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const updatedPatient = await PatientModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedPatient = await PatientModel.findByIdAndDelete(params.id);
    if (!deletedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
