
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DoctorModel from "@/lib/models/doctor.model";

export async function GET() {
  try {
    await connectDB();
    const doctors = await DoctorModel.find({}).lean();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error(error);
    // Ensure that even on error, we return something that won't crash the client
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const doctor = await DoctorModel.create(body);
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
