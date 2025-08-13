
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import PatientModel from "@/lib/models/patient.model";

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
                { email: { $regex: q, $options: 'i' } },
                { patientId: { $regex: q, $options: 'i' } },
                { country: { $regex: q, $options: 'i' } },
                { assignedHospital: { $regex: q, $options: 'i' } },
                { assignedDoctor: { $regex: q, $options: 'i' } }
            ]
        }
    }

    const patients = await PatientModel.find(query).lean();
    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.avatar) {
        body.avatar = `https://placehold.co/100x100.png?text=${body.name.charAt(0)}`;
    }

    const patient = await PatientModel.create(body);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
