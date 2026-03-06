"use client";

import { useState } from "react";

interface AnalysisResult {
  pain_points: string;
  sentiment: { ready_to_buy: number; comparing: number; unsure: number };
  demand_trend: string;
  missing_products: string[];
  total: number;
}

function SentimentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className={`font-bold ${color}`}>{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div className={`h-1.5 rounded-full ${color.replace("text-", "bg-")}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ChatAnalysisWidget() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/chat-analysis");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "เกิดข้อผิดพลาด");
      } else {
        setResult(data);
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">
            AI Chat Analysis
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            วิเคราะห์พฤติกรรมลูกค้าจากบทสนทนา chatbot
          </p>
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          className="rounded-lg bg-green-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "กำลังวิเคราะห์..." : result ? "วิเคราะห์ใหม่" : "เริ่มวิเคราะห์"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
          </div>
          AI กำลังอ่านบทสนทนาและวิเคราะห์...
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-2 gap-4 mt-2">

          {/* Pain Points */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Pain Points ลูกค้า
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">{result.pain_points}</p>
          </div>

          {/* Sentiment */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Sentiment ลูกค้า
            </p>
            <div className="space-y-3">
              <SentimentBar label="พร้อมซื้อ" value={result.sentiment.ready_to_buy} color="text-green-600" />
              <SentimentBar label="กำลังเปรียบเทียบ" value={result.sentiment.comparing} color="text-amber-500" />
              <SentimentBar label="ยังลังเล" value={result.sentiment.unsure} color="text-gray-400" />
            </div>
          </div>

          {/* Demand Trend */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Demand Trend
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">{result.demand_trend}</p>
          </div>

          {/* Missing Products */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              สินค้าที่ลูกค้าหาแต่ไม่มีในร้าน
            </p>
            {result.missing_products.length === 0 ? (
              <p className="text-xs text-gray-400">ไม่พบสินค้าที่ขาด</p>
            ) : (
              <ul className="space-y-1.5">
                {result.missing_products.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <p className="text-xs text-gray-400 mt-2">
          กดปุ่ม "เริ่มวิเคราะห์" เพื่อให้ AI วิเคราะห์บทสนทนาล่าสุด 150 รายการ
        </p>
      )}
    </div>
  );
}
