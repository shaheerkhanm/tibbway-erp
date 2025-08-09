
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HospitalModel from "@/lib/models/hospital.model";

export async function GET() {
  await connectDB();
  try {
    const hospitals = await HospitalModel.find({});
    return NextResponse.json(hospitals);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hospitals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const hospital = await HospitalModel.create(body);
    return NextResponse.json(hospital, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 });
  }
}
