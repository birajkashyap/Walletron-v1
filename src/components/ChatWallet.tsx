"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// --- Theme & Style Constants ---
// Dark Navy Background: #0b0f19 (using custom class for precision)
// Neon Blue Accent: #2962ff
const BACKGROUND_COLOR = "bg-[#0b0f19]";
const ACCENT_COLOR = "bg-[#2962ff] hover:bg-blue-700";
const TEXT_COLOR = "text-gray-200";

// --- Type Definitions ---

type Message = {
  id: number;
  sender: "user" | "bot";
  type: "text" | "suggestion" | "json";
  content: string | string[];
  data?: Record<string, any>; // For structured JSON data
};

// Mock response for unclear intent (to avoid unnecessary API calls)
const UNCLEAR_INTENT_PHRASES = ["help", "what can i do", "commands", "options"];
const SUGGESTIONS = [
  "Check balance",
  "Recent transactions",
  "Who do I send the most to?",
  "Send 1 SOL to Ananya",
];

// --- Sub-Components ---

// Helper component for message bubbles
const ChatBubble: React.FC<{
  message: Message;
  handleSuggestionClick: (text: string) => void;
}> = ({ message, handleSuggestionClick }) => {
  const isUser = message.sender === "user";
  const baseClasses = `p-3 rounded-xl max-w-[80%] my-1 shadow-lg transform transition-all duration-300 ${TEXT_COLOR}`;

  const userClasses = `self-end ${baseClasses} bg-blue-600 rounded-br-none`;
  const botClasses = `self-start ${baseClasses} bg-gray-800 rounded-tl-none`;

  // Framer Motion variants for message entry
  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const renderContent = () => {
    if (message.type === "json" && message.data) {
      // Render structured data in a stylized box
      return (
        <div className="space-y-3">
          <p className="font-semibold">{message.content}</p>
          {/* Render data content nicely */}
          <pre className="p-3 text-xs bg-gray-900 rounded-lg overflow-x-auto border border-gray-700">
            {JSON.stringify(message.data, null, 2)}
          </pre>
        </div>
      );
    }
    if (message.type === "suggestion" && Array.isArray(message.content)) {
      // Render text plus clickable suggestion chips
      return (
        <div className="space-y-3">
          <p>{message.content[0]}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((suggestion, index) => (
              <motion.button
                key={index}
                className={`text-xs px-3 py-1 rounded-full border border-[#2962ff] text-[#2962ff] transition-colors ${BACKGROUND_COLOR} hover:bg-blue-900/50`}
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      );
    }
    // Render plain text
    return <p>{message.content}</p>;
  };

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <div className={isUser ? userClasses : botClasses}>{renderContent()}</div>
    </motion.div>
  );
};

const ChatWallet = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      type: "text",
      content: "Hello! Ask me anything about your wallet.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to call the backend API (UPDATED to handle normalized responses)
  const callNLApi = useCallback(async (text: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/wallet/nl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      let botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        type: "text",
        content: "Something went wrong.",
      };

      if (response.ok) {
        // Handle analytics/data queries (Backend returns { result: data })
        if (result.result && typeof result.result === "object") {
          botMessage = {
            id: Date.now(),
            sender: "bot",
            type: "json",
            content: "📊 Here's what I found:",
            data: result.result,
          };
        }

        // Handle send / balance actions (Backend returns { status: "success" })
        else if (result.status === "success") {
          botMessage = {
            id: Date.now(),
            sender: "bot",
            type: "text",
            content: `✅ Success: ${text}`, // Provide context for the success
          };
        } else {
          // General OK response, but no recognizable structure
          botMessage.content = JSON.stringify(result, null, 2);
        }
      } else {
        // Handle error response from backend (e.g., status 400 or 500)
        botMessage = {
          id: Date.now() + 1,
          sender: "bot",
          type: "text",
          content: result.error || "I couldn't understand that.",
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          type: "text",
          content: "⚠️ Network error. Try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, []);

  // Main send handler
  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() || isLoading) return;

    // 1. Add user message to chat
    const newUserMessage: Message = {
      id: Date.now(),
      sender: "user",
      type: "text",
      content: textToSend,
    };

    // Optimistic UI update: Add user message and loading state instantly
    setMessages((prev) => {
      const nextMessages = [...prev, newUserMessage];
      // Add loading indicator immediately after user message
      if (!isLoading) {
        nextMessages.push({
          id: Date.now() + 0.5,
          sender: "bot",
          type: "text",
          content: "...",
        });
      }
      return nextMessages;
    });

    setInput("");
    setIsLoading(true);

    const standardizedText = textToSend.trim().toLowerCase();

    // Function to remove the temporary loading message
    const removeLoadingMessage = () => {
      setMessages((prev) => prev.filter((msg) => msg.content !== "..."));
    };

    // 2. Check for unclear intent
    if (
      UNCLEAR_INTENT_PHRASES.some((phrase) => standardizedText.includes(phrase))
    ) {
      removeLoadingMessage();

      const suggestionMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        type: "suggestion",
        content: ["I'm not sure how to help. Try one of these:"],
        data: { suggestions: SUGGESTIONS },
      };
      setMessages((prev) => [...prev, suggestionMessage]);
      setIsLoading(false);
      return;
    }

    // 3. Call NL API
    removeLoadingMessage();
    await callNLApi(textToSend);
  };

  // Handler for suggestion chips
  const handleSuggestionClick = (text: string) => {
    // Auto-send the suggested text
    handleSend(text);
  };

  return (
    <div
      className={`flex flex-col h-full w-full rounded-2xl shadow-2xl overflow-hidden ${BACKGROUND_COLOR} ${TEXT_COLOR}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Chat Header (Minimal) */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#2962ff]">Walletron AI</h2>
        <span className="text-sm text-gray-500">
          Natural Language Wallet Control
        </span>
      </div>

      {/* Message Area */}
      <motion.div className="flex-1 p-4 space-y-4 overflow-y-auto" layout>
        <motion.div layout className="flex flex-col space-y-4 pt-2">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              handleSuggestionClick={handleSuggestionClick}
            />
          ))}
          {/* Loading Indicator */}
          {isLoading && messages.find((m) => m.content === "...") && (
            <ChatBubble
              message={{
                id: Date.now(),
                sender: "bot",
                type: "text",
                content: "...",
              }}
              handleSuggestionClick={handleSuggestionClick}
            />
          )}
        </motion.div>
        <div ref={chatEndRef} />
      </motion.div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex space-x-3">
        <input
          type="text"
          className={`flex-1 p-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2962ff]`}
          placeholder="Ask Walletron..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <motion.button
          className={`px-6 py-3 rounded-xl font-semibold text-white transition-colors disabled:opacity-50 ${ACCENT_COLOR}`}
          onClick={() => handleSend()}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? "Wait..." : "Send"}
        </motion.button>
      </div>
    </div>
  );
};

export default ChatWallet;
