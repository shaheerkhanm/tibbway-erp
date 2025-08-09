
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DoctorModel from "@/lib/models/doctor.model";

export async function GET() {
  await connectDB();
  try {
    const doctors = await DoctorModel.find({});
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const doctor = await DoctorModel.create(body);
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
