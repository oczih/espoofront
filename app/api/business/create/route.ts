// app/api/business/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-client";
import { connectDB } from "@/lib/mongoose";
import Business from "@/app/models/businessmodel";
import EspooUserModel from "@/app/models/usermodel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    // Create business first to get the MongoDB _id
    const businessDoc = new Business({
      name,
      description,
      managers: [session.user.id],
    });

    businessDoc.businessId = businessDoc._id.toString(); // set businessId to MongoDB _id

    await businessDoc.save();

    // Attach business to the user
    await EspooUserModel.findByIdAndUpdate(session.user.id, {
      $push: { business: businessDoc._id },
    });

    return NextResponse.json({ success: true, business: businessDoc });
  } catch (err) {
    console.error("[Business Create] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
