
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/lib/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const users = await UserModel.find({}).select('-password').lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    // In a real app, hash the password before saving
    const user = await UserModel.create(body);
    const userObject = user.toObject();
    delete userObject.password;
    return NextResponse.json(userObject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
