'use client';

import { useState, useEffect, useRef } from 'react';
import { UserProfile, Language } from '../app/types';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const BACKEND_URL = 'http://127.0.0.1:8000/chat/prompt';

interface AIAssistantProps {
  language: Language;
  userProfile: UserProfile | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const translations = {
  en: {
    title: 'AI Business Assistant',
    subtitle: 'Get instant answers to your business questions',
    placeholder: 'Ask me anything about starting your business...',
    send: 'Send',
    suggestions: 'Suggested Questions',
    typing: 'AI is thinking...',
    clearChat: 'Clear Chat',
    welcomeMessage: 'Hello! I\'m your AI business assistant. I can help you with questions about funding, taxation, permits, banking, insurance, and all aspects of starting and growing your business in Finland. How can I assist you today?',
    suggestedQuestions: [
      'What funding options are available for technology startups?',
      'How do I register for VAT in Finland?',
      'What permits do I need for a restaurant business?',
      'Which bank is best for a small online business?',
      'Do I need YEL insurance if I\'m just starting?',
    ],
  },
  fi: {
    title: 'AI-yritysavustaja',
    subtitle: 'Saa välittömiä vastauksia yrityskysymyksiisi',
    placeholder: 'Kysy mitä tahansa yrityksen perustamisesta...',
    send: 'Lähetä',
    suggestions: 'Ehdotetut kysymykset',
    typing: 'AI ajattelee...',
    clearChat: 'Tyhjennä keskustelu',
    welcomeMessage: 'Hei! Olen tekoäly-yritysavustajasi. Voin auttaa sinua kysymyksissä rahoituksesta, verotuksesta, luvista, pankkipalveluista, vakuutuksista ja kaikissa liiketoiminnan aloittamiseen ja kasvattamiseen liittyvissä asioissa Suomessa. Miten voin auttaa sinua tänään?',
    suggestedQuestions: [
      'Mitä rahoitusvaihtoehtoja on saatavilla teknologia-startupeille?',
      'Miten rekisteröidyn ALV:n maksajaksi Suomessa?',
      'Mitä lupia tarvitsen ravintolaliiketoimintaan?',
      'Mikä pankki on paras pienelle verkkoyritykselle?',
      'Tarvitsenko YEL-vakuutuksen, jos olen vasta aloittamassa?',
    ],
  }
};

export default function AIAssistant({ language, userProfile }: AIAssistantProps) {
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydration and localStorage loading
  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem('aiMessages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
        setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    } else {
      // Add welcome message only if no saved messages
      setMessages([{
        id: '1',
        role: 'assistant',
        content: t.welcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [t.welcomeMessage]);

  // Save messages to localStorage
  useEffect(() => {
    if (isHydrated && messages.length > 0) {
      localStorage.setItem('aiMessages', JSON.stringify(messages));
    }
  }, [messages, isHydrated]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: userInput,
          conversation_history: conversationHistory,
          user_profile: userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'No response from server',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the server. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  const handleClearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: t.welcomeMessage,
      timestamp: new Date(),
    }]);
    localStorage.removeItem('aiMessages');
  };

  if (!isHydrated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t.clearChat}
          </button>
        </div>
      </div>

      <Card className="flex flex-col h-[600px]">
        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString(language === 'fi' ? 'fi-FI' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-600">{t.typing}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 py-3 border-t bg-gray-50">
            <p className="text-gray-600 mb-2">{t.suggestions}</p>
            <div className="flex flex-wrap gap-2">
              {t.suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestion(question)}
                  className="px-3 py-2 text-sm text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              label=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={t.placeholder}
              className="flex-1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">{t.send}</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
