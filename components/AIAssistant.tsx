'use client';

import { useState, useEffect, useRef } from 'react';
import { UserProfile, Language } from '../app/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
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
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aiMessages');
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        return parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    }
    return [];
  });
  
  const hasInitializedRef = useRef(false);
  
  // Initialize welcome message if messages are empty (only once)
  // Using setTimeout to defer the state update avoids synchronous setState in effect
  useEffect(() => {
    if (!hasInitializedRef.current && messages.length === 0 && typeof window !== 'undefined') {
      hasInitializedRef.current = true;
      const timer = setTimeout(() => {
        setMessages([{
          id: '1',
          role: 'assistant' as const,
          content: t.welcomeMessage,
          timestamp: new Date(),
        }]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [t.welcomeMessage, messages.length]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Save messages to localStorage
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('aiMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Personalized responses based on user profile
    const userName = userProfile?.name || 'there';
    const userIndustry = userProfile?.industry || '';
    const userStage = userProfile?.businessStage || '';

    // Funding related
    if (lowerMessage.includes('fund') || lowerMessage.includes('money') || lowerMessage.includes('rahoitus')) {
      return `Great question about funding! Based on your ${userStage} stage, I recommend exploring:\n\n1. **Business Finland** - Offers grants and loans for innovative projects, especially good for technology and growth-oriented businesses.\n\n2. **TE Services Start-up Grant** - Provides monthly support (€840-€1,260) for 6 months during your startup phase. Perfect if you're currently unemployed or at risk.\n\n3. **Finnvera** - State-backed loans when traditional bank financing is difficult to obtain.\n\n${userIndustry === 'technology' ? 'For tech businesses, also consider angel investors through FiBAN and venture capital firms like Lifeline Ventures or Inventure.' : ''}\n\nWould you like more details on any of these options?`;
    }

    // VAT/Tax related
    if (lowerMessage.includes('vat') || lowerMessage.includes('alv') || lowerMessage.includes('tax') || lowerMessage.includes('vero')) {
      return `Regarding taxation in Finland:\n\n**VAT Registration**: Required when your annual turnover exceeds €15,000. The standard VAT rate is 24%, with reduced rates of 14% and 10% for certain goods.\n\n**Business Income Tax**: Corporate income tax is 20%. For sole proprietors, profits are taxed as personal income (6-44%).\n\n**YEL Pension Insurance**: Mandatory for all entrepreneurs. About 24.1% of your assessed income.\n\nKey deadlines:\n- VAT returns: 12th of the following month (monthly filers)\n- Income tax: End of February for sole traders\n\nI recommend consulting with a tax advisor for your specific situation. Would you like information about any specific tax type?`;
    }

    // Permits/licenses
    if (lowerMessage.includes('permit') || lowerMessage.includes('license') || lowerMessage.includes('lupa')) {
      let response = `For permits and licenses, here's what you typically need:\n\n**Universal Requirements:**\n1. Trade Register entry (€110-€380)\n2. VAT registration (if turnover > €15,000)\n3. Prepayment Tax Register (for B2B invoicing)\n\n`;
      
      if (userIndustry === 'hospitality') {
        response += `**For your hospitality business:**\n- Food handling permit from local health authority\n- Alcohol license from AVI (€500-€5,000, 2-6 months)\n- Building permit for renovations\n\n`;
      } else if (userIndustry === 'healthcare') {
        response += `**For healthcare services:**\n- Healthcare service license from Valvira (€150-€400)\n- Qualified healthcare professionals required\n\n`;
      } else if (userIndustry === 'manufacturing') {
        response += `**For manufacturing:**\n- Environmental permit (if applicable)\n- Building permit for facilities\n\n`;
      }
      
      response += `The Finnish Patent and Registration Office (PRH) handles most registrations. Would you like details on any specific permit?`;
      return response;
    }

    // Banking
    if (lowerMessage.includes('bank') || lowerMessage.includes('pankki') || lowerMessage.includes('account')) {
      return `For business banking in Finland, here are your main options:\n\n**Traditional Banks:**\n- **OP Financial Group**: Finland's largest, excellent for SMEs\n- **Nordea**: Strong Nordic presence, good for international business\n- **Danske Bank**: Full-service banking\n\n**Digital Banking:**\n- **Holvi**: Perfect for freelancers and small businesses, includes invoicing and accounting tools\n\n**What you need to open an account:**\n- Business ID (Y-tunnus)\n- Proof of registration\n- Valid ID\n- Business plan\n\n${userIndustry === 'technology' || userIndustry === 'services' ? 'For online payments, consider Paytrail (Finnish payment gateway) or Stripe (international, great API).' : ''}\n\nWhich aspect of banking would you like to know more about?`;
    }

    // Insurance
    if (lowerMessage.includes('insurance') || lowerMessage.includes('vakuutus') || lowerMessage.includes('yel')) {
      return `Regarding business insurance:\n\n**Required:**\n- **YEL Insurance**: Mandatory for all entrepreneurs. Provides pension and disability coverage. About 24.1% of assessed income (minimum €8,575/year). Must arrange within 6 months of starting.\n- **Vehicle Insurance**: If you use vehicles (third-party minimum)\n\n**Highly Recommended:**\n- **Business Liability Insurance**: Protects against claims (€200-€2,000/year)\n- **Property Insurance**: Covers equipment and inventory (€300-€3,000/year)\n- **Professional Indemnity**: Essential for consultants and advisors (€500-€5,000/year)\n\n**Consider:**\n- Cyber insurance (increasingly important)\n- Key person insurance\n\nYes, you need YEL insurance even when just starting if you're working in your business! What specific insurance would you like to know more about?`;
    }

    // Timeline/steps
    if (lowerMessage.includes('how long') || lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('aikataulu')) {
      return `Here's a typical timeline for starting a business in Finland:\n\n**Week 1-2:**\n- Finalize business plan\n- Choose business structure\n- Reserve company name (if applicable)\n\n**Week 2-4:**\n- Register with Trade Register (2-4 weeks processing)\n- Receive Business ID (Y-tunnus)\n- Arrange YEL insurance\n\n**Week 4-6:**\n- Open business bank account\n- Register for VAT (if applicable)\n- Apply for Prepayment Tax Register\n\n**Week 6-8:**\n- Apply for industry-specific permits\n- Set up accounting system\n- Arrange additional insurance\n\n**Week 8-12:**\n- Launch business operations\n- Start marketing\n- First customer engagements\n\nTotal time: 2-3 months on average. ${userStage === 'idea' ? 'Since you\'re in the idea stage, I recommend starting with the business plan and market research.' : ''}\n\nWhat specific step would you like guidance on?`;
    }

    // Default response
    return `That's a great question, ${userName}! While I can provide general guidance on:\n\n- Funding options (Business Finland, TE grants, Finnvera, angel investors)\n- Taxation (VAT, income tax, YEL insurance)\n- Permits and licenses (Trade Register, industry-specific permits)\n- Business banking (OP, Nordea, Holvi)\n- Insurance requirements (YEL, liability, property)\n- Step-by-step startup process\n\nFor your specific question, I recommend:\n1. Checking the relevant module in the platform for detailed information\n2. Consulting with a business advisor (use our "Prepare for Meeting" tool)\n3. Visiting official resources like the Finnish Patent Office (PRH) or Tax Administration\n\nCould you rephrase your question or ask about a specific topic from the list above?`;
  };

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
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: userInput,
        }),
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response body:', await response.clone().text());

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
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
                  className="text-left h-auto py-2"
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
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder}
              className="flex-1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 transition-colors hover:bg-blue-700"
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
