
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DoctorModel from "@/lib/models/doctor.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const doctor = await DoctorModel.findById(params.id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const body = await request.json();
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(updatedDoctor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const deletedDoctor = await DoctorModel.findByIdAndDelete(params.id);
    if (!deletedDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
  }
}
