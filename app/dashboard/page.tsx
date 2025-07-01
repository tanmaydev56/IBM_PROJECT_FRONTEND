"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, SendHorizonal, Bot, } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  file?: string;
  complete?: boolean;
};

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionAsked, setQuestionAsked] = useState(false);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedResponse]);

  const simulateTypingEffect = (text: string) => {
    let i = 0;
    setStreamedResponse("");
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setStreamedResponse((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = text;
            lastMessage.complete = true;
          }
          return newMessages;
        });
      }
    }, 20);

    return () => clearInterval(typingInterval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!file) {
      alert("Please upload a PDF file first");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
      file: file.name,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setQuestionAsked(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", input);

      const res = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          complete: false,
        },
      ]);
      
      simulateTypingEffect(data.answer || "❌ No answer returned.");
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error: " + error.message,
          complete: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setFile(null);
    setMessages([]);
    setQuestionAsked(false);
    setInput("");
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          PDF Chat Assistant
        </h1>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="relative mb-6">
              <Bot className="w-16 h-16 text-gray-400" />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5">
                <Paperclip className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700">
              Upload a PDF and ask a question
            </p>
            <p className="text-sm mt-2 text-gray-500 max-w-md">
              You can ask one question per PDF upload
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {message.role === "user" && message.file && (
                    <div className="flex items-center text-xs mb-2 opacity-80">
                      <Paperclip className="w-3 h-3 mr-1" />
                      {message.file}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {message.role === "assistant" && !message.complete && index === messages.length - 1
                      ? streamedResponse
                      : message.content}
                    {isTyping && index === messages.length - 1 && !streamedResponse && (
                      <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {questionAsked && messages.length >= 2 && (
              <div className="flex flex-col items-center justify-center mt-6 text-center text-gray-500">
                <div className="relative mb-4">
                  <Bot className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  Want to ask another question?
                </p>
                <p className="text-sm mt-2 text-gray-500 max-w-md">
                  Please upload a new PDF to continue
                </p>
                <button
                  onClick={resetChat}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Upload New PDF
                </button>
              </div>
            )}
          </>
        )}
        {loading && !isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 max-w-3xl rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-md">
        {messages.length === 0 ? (
          <div className="mb-4">
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
              <Paperclip className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-600">
                {file ? (
                  <span className="font-medium text-blue-600">{file.name}</span>
                ) : (
                  <>
                    <span className="font-medium">Click to upload</span> or drag and drop PDF
                  </>
                )}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {file && (
              <form onSubmit={handleSubmit} className="flex space-x-3 mt-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the PDF..."
                    className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    <Paperclip className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[100px]">{file.name}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <SendHorizonal className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        ) : !questionAsked ? (
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about the PDF..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <Paperclip className="w-3 h-3 mr-1" />
                <span className="truncate max-w-[100px]">{file?.name}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || isTyping}
              className={`p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
                loading || isTyping
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <SendHorizonal className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <button
              onClick={resetChat}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Upload New PDF to Ask Another Question
            </button>
          </div>
        )}
      </div>
    </main>
  );
}