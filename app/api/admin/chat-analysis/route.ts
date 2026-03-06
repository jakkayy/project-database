import { NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import Chat from "@/app/models/Chat";
import Product from "@/app/models/Product";

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  await connectMongo();

  const chats = await Chat.find({}, { userMessage: 1 }).sort({ createdAt: -1 }).limit(150).lean() as { userMessage: string }[];
  if (chats.length === 0) {
    return NextResponse.json({ error: "ยังไม่มีข้อมูลบทสนทนา" }, { status: 400 });
  }

  const products = await Product.find({}, { name: 1, _id: 0 }).lean() as { name: string }[];
  const productNames = products.map((p) => p.name).join(", ");
  const messages = chats.map((c) => `- ${c.userMessage}`).join("\n");

  const prompt = `คุณเป็น business analyst วิเคราะห์ข้อมูลบทสนทนาของลูกค้าร้านขายรองเท้า NIKO SPORTWEAR

สินค้าที่มีในร้านปัจจุบัน: ${productNames}

ข้อความจากลูกค้า (${chats.length} รายการ):
${messages}

วิเคราะห์และตอบในรูปแบบ JSON เท่านั้น ห้ามมีข้อความอื่น:
{
  "pain_points": "สรุป 3-5 ประโยค ว่าลูกค้าส่วนใหญ่ต้องการอะไร มีปัญหาอะไร หรือมีข้อกังวลอะไร",
  "sentiment": {
    "ready_to_buy": <เปอร์เซ็นต์ที่ดูพร้อมซื้อ เช่น 40>,
    "comparing": <เปอร์เซ็นต์ที่กำลังเปรียบเทียบ เช่น 35>,
    "unsure": <เปอร์เซ็นต์ที่ยังลังเล เช่น 25>
  },
  "demand_trend": "สรุป 2-3 ประโยค ว่าสินค้าประเภทไหน style ไหน หรือ feature ไหนที่ลูกค้าถามมากที่สุด",
  "missing_products": ["สินค้า/คุณสมบัติที่ลูกค้าถามหาแต่ไม่มีในร้าน เช่น 'รองเท้าสีขาวล้วน'", "..."]
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4.1-mini",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? "{}";

  try {
    const result = JSON.parse(raw);
    return NextResponse.json({ ...result, total: chats.length });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
