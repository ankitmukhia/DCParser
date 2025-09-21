"use client";

import { useState } from "react";
import { generateUUID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";

export const Chat = ({
  initialId,
  leftWidth,
  initialMessages,
}: {
  initialId: string;
  leftWidth: number;
  initialMessages: Array<Message>;
}) => {
  const [chatId, setChatId] = useState(() => initialId || generateUUID());

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    id: chatId,
    initialMessages,
  });

  return (
    <div
      className="border-r border-gray-200 flex flex-col"
      style={{ width: leftWidth }}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <p className="text-sm mt-1">Ask questions about your documents</p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              placeholder="Ask about your document..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onChange={handleInputChange}
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
