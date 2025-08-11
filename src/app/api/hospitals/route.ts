
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HospitalModel from "@/lib/models/hospital.model";

export async function GET() {
  try {
    await connectDB();
    const hospitals = await HospitalModel.find({}).lean();
    return NextResponse.json(hospitals);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const hospital = await HospitalModel.create(body);
    return NextResponse.json(hospital, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Hospital with this name already exists.", code: 11000 }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 });
  }
}
