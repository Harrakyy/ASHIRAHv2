"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { WHATSAPP_URL } from "@/data/hero-slides";
import { CANVAS_URL } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

function formatTime(date: Date): string {
  return date
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false })
    .padStart(5, "0");
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input;
    if (!content.trim() || loading) return;

    const userMessage: Message = { role: "user", content, timestamp: new Date() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const messagesForApi = newMessages.filter(m => m.content !== "__AI_ERROR__");
      const res = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesForApi }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "AI tidak tersedia");
      
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message, timestamp: new Date() },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "__AI_ERROR__", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  return (
    <>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .chat-bounce-dot-1 { animation: chatBounce 1.4s infinite ease-in-out both; animation-delay: 0s; }
        .chat-bounce-dot-2 { animation: chatBounce 1.4s infinite ease-in-out both; animation-delay: 0.16s; }
        .chat-bounce-dot-3 { animation: chatBounce 1.4s infinite ease-in-out both; animation-delay: 0.32s; }
        @keyframes chatBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>

      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 sm:bottom-6 sm:right-6 sm:w-14 sm:h-14 rounded-full bg-ashira-royal hover:bg-ashira-deep text-white shadow-lg flex items-center justify-center transition-all"
        style={!open ? { animation: "scaleIn 0.3s ease-out" } : undefined}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-96 max-sm:w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100dvh-7rem)] shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-ashira-royal to-ashira-ink text-white px-4 py-3 flex items-center gap-2.5">
            <span className="font-medium text-sm">ASHIRA Assistant</span>
            <button onClick={handleToggle} className="ml-auto hover:bg-white/10 rounded-full p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <span className="text-5xl mb-4">👋</span>
                <p className="font-semibold text-gray-800 text-base">Halo! Saya asisten ASHIRA</p>
                <p className="text-sm text-gray-500 mt-1 mb-5">Ada yang bisa saya bantu hari ini?</p>
              </div>
            )}

            {messages.map((msg, i) => {
              if (msg.content === "__AI_ERROR__") {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-[85%] shadow-sm">
                      <p className="font-semibold text-gray-800">Asisten sedang sibuk</p>
                      <p className="text-sm text-gray-600 mt-1">Kamu bisa langsung order via Kanvas atau WhatsApp.</p>
                      <div className="mt-3 flex gap-2">
                        <a href={CANVAS_URL} className="text-xs bg-ashira-royal text-white px-3 py-1.5 rounded-full">Buka Kanvas</a>
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full">WhatsApp</a>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ashira-royal to-ashira-deep flex items-center justify-center text-white text-[11px] font-bold">A</div>
                  )}
                  <div className="flex flex-col max-w-[80%]">
                    <div className={`text-sm leading-relaxed px-3.5 py-2.5 whitespace-pre-wrap ${
                      msg.role === "user" ? "bg-ashira-royal text-white rounded-2xl rounded-br-sm" : "bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-0.5 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ashira-royal to-ashira-deep flex items-center justify-center text-white text-[11px] font-bold">A</div>
                <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full chat-bounce-dot-1" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full chat-bounce-dot-2" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full chat-bounce-dot-3" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-ashira-royal"
              />
              <button type="submit" disabled={loading || !input.trim()} className="rounded-full bg-ashira-royal hover:bg-ashira-deep p-2 text-white disabled:opacity-40 transition">
                <ArrowUp className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
