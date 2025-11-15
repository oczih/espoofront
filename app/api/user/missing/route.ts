// app/api/user/missing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import EspooUser from "@/app/models/usermodel";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id"); // pass session.user.id from client
  if (!userId) return NextResponse.json({ missingFields: [] });

  await connectDB();
  const user = await EspooUser.findOne({ _id: userId }).populate("business");
  if (!user) return NextResponse.json({ missingFields: [] });

  const missingFields: string[] = [];
  if (!user.dob) missingFields.push("dob");
  if (!user.number) missingFields.push("number");
  if (!user.hometown) missingFields.push("hometown");
  if (!user.business || (Array.isArray(user.business) && user.business.length === 0)) {
    missingFields.push("business.name", "business.description");
  } else if (user.business && !Array.isArray(user.business)) {
    if (!user.business.name) missingFields.push("business.name");
    if (!user.business.description) missingFields.push("business.description");
  }

  return NextResponse.json({ missingFields });
}
