import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Kamu adalah asisten virtual ASHIRA GROUP - PT. ASHIRA NIAGA INDONESIA.
Nama kamu adalah "Ashira Assistant".
Tugasmu membantu calon pelanggan dengan informasi seputar:
- Produk: jersey, kaos, jaket varsity, jaket kerja, seragam korporat
- Proses pemesanan custom
- Estimasi harga dan minimum order
- Material dan kualitas produk
- Waktu produksi dan pengiriman
Jawab dengan ramah, profesional, dan dalam Bahasa Indonesia.
Jika ada pertanyaan di luar topik, arahkan kembali ke produk Ashira.`,
      },
      history,
    });

    const response = await chat.sendMessage({ message: lastMessage });

    return NextResponse.json({ message: response.text });
  } catch (error: any) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}