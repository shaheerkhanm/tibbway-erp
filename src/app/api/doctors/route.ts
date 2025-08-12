
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import DoctorModel from "@/lib/models/doctor.model";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    let query = {};
    if (q) {
        query = {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { specialty: { $regex: q, $options: 'i' } },
                { hospital: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
            ]
        }
    }

    const doctors = await DoctorModel.find(query).lean();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
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
