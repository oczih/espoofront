// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Appointment from "@/app/models/appointmentmodel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-client";

export async function GET(req: NextRequest) {
    await connectDB();
  
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const url = new URL(req.url);
      const businessId = url.searchParams.get("businessId");
      if (!businessId) {
        return NextResponse.json({ message: "Missing businessId" }, { status: 400 });
      }
  
      const appointments = await Appointment.find({ business: businessId })
        .sort({ date: 1 })
        .lean();
  
      return NextResponse.json({ appointments }, { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
  
export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { businessId, date, type, notes, status = "scheduled" } = body;

    if (!businessId || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const appointment = await Appointment.create({
      business: businessId,
      user: session.user.id, // ensure your session contains user ID
      date: new Date(date),
      notes,
      type,
      status,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
