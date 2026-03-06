import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import Chat from "@/app/models/Chat";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || userId === "guest") {
    return NextResponse.json([]);
  }

  await connectMongo();

  const chats = await Chat.find({ userId })
    .sort({ createdAt: 1 })
    .limit(30)
    .lean() as { userMessage: string; aiReply: string }[];

  // Flatten into message pairs
  const messages = chats.flatMap((c) => [
    { role: "user", content: c.userMessage },
    { role: "assistant", content: c.aiReply },
  ]);

  return NextResponse.json(messages);
}
