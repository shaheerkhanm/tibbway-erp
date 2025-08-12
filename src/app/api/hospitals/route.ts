
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import HospitalModel from "@/lib/models/hospital.model";
import mongoose from "mongoose";

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
                { location: { $regex: q, $options: 'i' } },
                { country: { $regex: q, $options: 'i' } },
                { specialties: { $regex: q, $options: 'i' } }
            ]
        }
    }
    const hospitals = await HospitalModel.find(query).lean();
    return NextResponse.json(hospitals);
  } catch (error) {
    console.error("Failed to fetch hospitals:", error);
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
    console.error("Failed to create hospital:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Hospital with this name already exists.", code: 11000 }, { status: 409 });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 });
  }
}
