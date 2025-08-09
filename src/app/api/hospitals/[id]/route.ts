
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HospitalModel from "@/lib/models/hospital.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const hospital = await HospitalModel.findById(params.id);
    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }
    return NextResponse.json(hospital);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hospital" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const body = await request.json();
    const updatedHospital = await HospitalModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedHospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }
    return NextResponse.json(updatedHospital);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hospital" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const deletedHospital = await HospitalModel.findByIdAndDelete(params.id);
    if (!deletedHospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Hospital deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete hospital" }, { status: 500 });
  }
}
