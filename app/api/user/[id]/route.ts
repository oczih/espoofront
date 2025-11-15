// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-client";
import { connectDB } from "@/lib/mongoose";
import EspooUserModel, { EspooUserDocument } from "@/app/models/usermodel";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.id !== params.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updateFields: Partial<Pick<EspooUserDocument, "dob" | "number" | "hometown">> = {};
    
    
    if (body.dob) updateFields.dob = new Date(body.dob).toISOString(); // convert to string
    if (body.number) updateFields.number = body.number;
    if (body.hometown) updateFields.hometown = body.hometown;

    const updatedUser = await EspooUserModel.findByIdAndUpdate(params.id, updateFields, { new: true });

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("[User Update] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
