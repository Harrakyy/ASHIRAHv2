"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";

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

const quickReplies = ["Info Harga", "Cara Order", "Hubungi Kami"] as const;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    nama: "", email: "", whatsapp: "", produk: "", jumlah: ""
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const messagesForApi = newMessages.filter(
        (m) => m.content !== "__DEAL_CONFIRMED__" && m.content !== "__DEAL_REJECTED__" && m.content !== "__DETAIL_FORM__"
      );
      const res = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesForApi }),
      });
      const data = await res.json();
      const nextMessages: Message[] = [
        ...newMessages,
        { role: "assistant", content: data.message, timestamp: new Date() },
      ];
      if (data.showDetailForm) {
        const userText = newMessages.filter(m => m.role === 'user').map(m => m.content).join(' ').toLowerCase()
        const lastUserMsg = newMessages.filter(m => m.role === 'user').slice(-1)[0]?.content.toLowerCase() || ''
        const aiMsg = data.message?.toLowerCase() || ''
        const allText = userText + ' ' + lastUserMsg + ' ' + aiMsg
        let detectedProduk = ''
        if (allText.includes('jersey')) detectedProduk = 'Jersey Printing'
        else if (allText.includes('varsity')) detectedProduk = 'Varsity Jacket'
        else if (allText.includes('t-shirt') || allText.includes('kaos')) detectedProduk = 'T-Shirt Custom'
        else if (allText.includes('work jacket') || allText.includes('jaket kerja')) detectedProduk = 'Work Jacket'
        else if (allText.includes('corporate') || allText.includes('seragam') || allText.includes('uniform')) detectedProduk = 'Corporate Uniform'
        const pcsMatch = allText.match(/(\d+)\s*pcs/)
        const detectedJumlah = pcsMatch ? pcsMatch[1] : ''
        setFormData(prev => ({
          ...prev,
          produk: detectedProduk || prev.produk,
          jumlah: detectedJumlah || prev.jumlah,
        }))
        nextMessages.push({ role: "assistant", content: "__DETAIL_FORM__", timestamp: new Date() });
      }
      if (data.isDealConfirmed) {
        nextMessages.push({ role: "assistant", content: "__DEAL_CONFIRMED__", timestamp: new Date() });
      }
      if (data.isDealRejected) {
        nextMessages.push({ role: "assistant", content: "__DEAL_REJECTED__", timestamp: new Date() });
      }
      setMessages(nextMessages);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Maaf, terjadi error.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.nama.trim() || !formData.email.trim() || !formData.whatsapp.trim()) {
      alert("Mohon lengkapi semua data");
      return;
    }
    const formMessage = `FORM_DATA: Nama: ${formData.nama}, Email: ${formData.email}, WhatsApp: ${formData.whatsapp}, Produk: ${formData.produk}, Jumlah: ${formData.jumlah} pcs`;
    await sendMessage(formMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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

      {/* Floating button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        style={mounted && !open ? { animation: "scaleIn 0.3s ease-out" } : undefined}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-white">
                !
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-sm:w-[calc(100vw-2rem)] h-[500px] shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-3 flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
            </div>
            <span className="font-medium text-sm">Ashira Assistant</span>
            <span className="ml-auto inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
              AI
            </span>
            <button onClick={handleToggle} className="hover:bg-white/10 rounded-full p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <span className="text-5xl mb-4">👋</span>
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                  Halo! Saya Tim Ashira.co
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">
                  Ada yang bisa saya bantu hari ini?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="px-4 py-2 text-sm font-medium rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => {
              if (msg.content === "__DETAIL_FORM__") {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="bg-white border-2 border-blue-200 rounded-xl p-4 max-w-sm shadow-sm">
                      <p className="font-semibold text-blue-800 mb-1">📋 Detail Pesanan</p>
                      <p className="text-xs text-gray-500 mb-3">Data produk sudah terisi otomatis. Lengkapi data diri kamu 😊</p>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-600 font-medium">Nama Lengkap</label>
                          <input type="text" placeholder="Nama lengkap"
                            value={formData.nama}
                            onChange={e => setFormData(p => ({...p, nama: e.target.value}))}
                            className="w-full mt-1 px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 font-medium">Email</label>
                          <input type="email" placeholder="email@contoh.com"
                            value={formData.email}
                            onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                            className="w-full mt-1 px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 font-medium">WhatsApp</label>
                          <input type="tel" placeholder="08xxxxxxxxxx"
                            value={formData.whatsapp}
                            onChange={e => setFormData(p => ({...p, whatsapp: e.target.value}))}
                            className="w-full mt-1 px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 font-medium">Produk</label>
                          <input type="text" placeholder="Produk yang dipesan"
                            value={formData.produk}
                            onChange={e => setFormData(p => ({...p, produk: e.target.value}))}
                            className="w-full mt-1 px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 font-medium">Jumlah (pcs)</label>
                          <input type="number" placeholder="Minimum 12 pcs"
                            value={formData.jumlah}
                            onChange={e => setFormData(p => ({...p, jumlah: e.target.value}))}
                            className="w-full mt-1 px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleFormSubmit}
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                      >
                        Lanjutkan →
                      </button>
                    </div>
                  </div>
                );
              }

              if (msg.content === "__DEAL_CONFIRMED__") {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-[80%]">
                      <p className="font-semibold text-green-800">✅ Deal Terkonfirmasi!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Tim kami akan segera menghubungi kamu di WhatsApp untuk konfirmasi pesanan.
                      </p>
                    </div>
                  </div>
                );
              }

              if (msg.content === "__DEAL_REJECTED__") {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-[80%]">
                      <p className="font-semibold text-gray-800">Terima kasih sudah menghubungi Ashira.co!</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Jika berubah pikiran, kami siap membantu 😊
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm">
                      A
                    </div>
                  )}
                  <div className="flex flex-col max-w-[80%]">
                    <div
                       className={`text-sm leading-relaxed px-3.5 py-2.5 whitespace-pre-wrap ${
                         msg.role === "user"
                           ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                           : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm rounded-2xl rounded-bl-sm"
                       }`}
                    >
                      {msg.content}
                    </div>
                    <span
                      className={`text-[10px] text-gray-400 mt-0.5 ${
                        msg.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm">
                  A
                </div>
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full chat-bounce-dot-1" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full chat-bounce-dot-2" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full chat-bounce-dot-3" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="flex-1 text-sm border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 outline-none focus:border-blue-400 transition bg-transparent dark:text-gray-100 placeholder:text-gray-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="rounded-full bg-blue-600 hover:bg-blue-700 p-2 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
