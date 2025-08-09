
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AppointmentModel from "@/lib/models/appointment.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const appointment = await AppointmentModel.findById(params.id);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const body = await request.json();
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const deletedAppointment = await AppointmentModel.findByIdAndDelete(params.id);
    if (!deletedAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
