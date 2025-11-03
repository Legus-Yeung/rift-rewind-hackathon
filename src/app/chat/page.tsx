"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { YearEndSummaryData } from "~/lib/player";
import { placeholderYearEndData } from "~/lib/player";

interface ChatResponse {
  question: string;
  answer: string;
}

async function askBedrock(question: string, playerData?: YearEndSummaryData): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, playerData }),
  });

  if (!res.ok) {
    throw new Error("Failed to get response");
  }

  const data = await res.json() as ChatResponse;
  return data.answer;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  // TODO: Replace with actual player data from API or context
  // For now, using placeholder data for demonstration
  const [usePlayerData] = useState(true);
  const playerData = usePlayerData ? placeholderYearEndData : undefined;

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    
    try {
      const response: string = await askBedrock(userMessage.content, playerData);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Error: " + (error instanceof Error ? error.message : String(error)),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">League Coaching Agent</h1>
        <p className="text-gray-600 mt-1">
          Your year-end League of Legends retrospective coach! Get personalized insights and celebrate your achievements.
        </p>
        {playerData && (
          <p className="text-xs text-blue-600 mt-2">
            📊 Analyzing data for {playerData.playerOverview.summonerName}#{playerData.playerOverview.tagLine}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        <div className="flex-1 bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto min-h-[400px]">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-lg max-w-[80%] shadow-sm ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                          <span className="text-sm font-medium text-gray-600">Assistant</span>
                        </div>
                      )}
                      <div className="markdown-content">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">AI</span>
                  </div>
                  <p className="text-lg font-medium">Welcome to your year-end review! 🎉</p>
                  <p className="text-sm mt-1">
                    Ask me about your performance, achievements, or areas to improve. I'll analyze your year in League!
                  </p>
                  {playerData && (
                    <p className="text-xs mt-2 text-blue-600">
                      Try: "What did I do well this year?" or "Give me my year-end summary"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t bg-gray-50 p-4">
            <div className="flex gap-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && question.trim() && handleAsk()}
                placeholder="Type your question here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={handleAsk} 
                disabled={!question.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Powered by AWS Bedrock
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
