import { useState, useRef, useEffect } from "react";

export default function GuardianChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/guardian-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl">
      <div className="relative w-full max-w-xl h-[80vh] bg-white/5 backdrop-blur-3xl rounded-3xl shadow-2xl flex flex-col border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white/10 border-b border-white/20">
          <h2 className="text-white font-bold text-xl tracking-wide">Guardian Chat</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-2xl hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] break-words shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-white/20 text-white rounded-bl-none"
                } transition-all duration-300`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="flex p-4 gap-3 border-t border-white/20 bg-white/5 backdrop-blur-3xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 text-white placeholder-gray-300 px-4 py-2 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-5 py-2 rounded-2xl hover:bg-blue-600 font-semibold"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
