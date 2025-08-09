
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AppointmentModel from "@/lib/models/appointment.model";

export async function GET() {
  await connectDB();
  try {
    const appointments = await AppointmentModel.find({});
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const appointment = await AppointmentModel.create(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
