import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "lib/mongodb";
import Product from "@/app/models/Product";
import Chat from "@/app/models/Chat";

export async function POST(req: NextRequest) {
  const { messages, userId } = await req.json();
  const userMessage = messages[messages.length - 1]?.content;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "Chatbot is not configured yet." }, { status: 500 });
  }

  await connectMongo();

  const products = await Product.find(
    {},
    { name: 1, category: 1, basePrice: 1, tags: 1, _id: 0 }
  ).lean();

  const productList = products
    .map(
      (p: any) =>
        `- ${p.name} | หมวดหมู่: ${p.category} | ราคา: ${p.basePrice} บาท | Tags: ${(p.tags ?? []).join(", ")}`
    )
    .join("\n");

  const SYSTEM_PROMPT = `คุณคือผู้ช่วยแนะนำสินค้าของร้าน NIKO SPORTWEAR
หากคำถามไม่เกี่ยวกับสินค้า รองเท้า ราคา ไซส์ หรือการสั่งซื้อ ให้ตอบว่า "กรุณาถามเกี่ยวกับสินค้าเท่านั้นนะคะ"
หากเกี่ยวข้อง ให้แนะนำสินค้าจากรายการด้านล่างเพียง 1 ชิ้นที่เหมาะสมที่สุด พร้อมบอกชื่อ ราคา และเหตุผล
ตอบในภาษาเดียวกับที่ลูกค้าใช้ และตอบกระชับ

รายการสินค้า:
${productList}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4.1-mini",
      max_tokens: 512,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    return NextResponse.json(
      { reply: `เกิดข้อผิดพลาด: ${errorBody?.error?.message ?? "กรุณาลองใหม่"}` },
      { status: 500 }
    );
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content ?? "ขออภัย ไม่สามารถตอบได้ในขณะนี้";

  if (!reply.includes("กรุณาถามเกี่ยวกับสินค้าเท่านั้น")) {
    await Chat.create({ userId: userId ?? "guest", userMessage, aiReply: reply });
  }

  return NextResponse.json({ reply });
}