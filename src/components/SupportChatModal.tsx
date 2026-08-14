import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, MessageCircle, HelpCircle, Zap, Shield } from 'lucide-react';
import { FAQ_DATA } from '../data/mockData';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am your 24/7 Go Green Cars Singapore Assistant. How can I help you today with EV bookings, charging stations, or keyless unlock?',
      timestamp: 'Just now'
    }
  ]);

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Automated smart assistant response
    setTimeout(() => {
      let reply = 'Thank you for contacting Go Green Cars. For instant assistance, all electric charging across SP Mobility, Charge+, and Shell Recharge is 100% free with your rental booking.';
      const lower = userText.toLowerCase();

      if (lower.includes('charge') || lower.includes('charging') || lower.includes('sp')) {
        reply = '⚡ Charging is 100% free! Simply drive to any SP Mobility, Charge+, or Shell Recharge station. Use the virtual RFID in your mobile app to activate the charger immediately with zero out-of-pocket payment.';
      } else if (lower.includes('unlock') || lower.includes('key') || lower.includes('door')) {
        reply = '🔑 Digital Bluetooth Key: Ensure Bluetooth is turned on within 5 meters of your reserved vehicle. Click "Unlock Doors" in the app. The hazard lights will flash twice to indicate the doors are unlocked and immobilizer is disarmed.';
      } else if (lower.includes('license') || lower.includes('singpass') || lower.includes('requirement')) {
        reply = '🪪 Drivers require a valid Singapore Class 3 or 3A driving license (or valid International Driving Permit). Instant verification is completed within 30 seconds via Singpass MyInfo.';
      } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('deposit')) {
        reply = '💰 Rates start from S$6.00/hr (commercial) and S$7.50/hr (SUV). We have $0 deposit, and low mileage fees (from $0.35/km) cover all electricity, road tax, and insurance.';
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#c4c5da] flex flex-col h-[560px] overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0034c5] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Go Green Cars 24/7 AI Assistant</h3>
              <p className="text-[11px] text-blue-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online • Instant response
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#f3f2ff] px-4 py-2 border-b border-[#c4c5da] flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-[#0034c5]">
          <span className="text-[#545e77] whitespace-nowrap">Suggested:</span>
          <button
            onClick={() => handleSend('How does free charging at SP Mobility work?')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#c4c5da] hover:border-[#0034c5] whitespace-nowrap cursor-pointer"
          >
            ⚡ Free Charging Guide
          </button>
          <button
            onClick={() => handleSend('How do I unlock with digital Bluetooth key?')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#c4c5da] hover:border-[#0034c5] whitespace-nowrap cursor-pointer"
          >
            🔑 Bluetooth Unlock
          </button>
          <button
            onClick={() => handleSend('What are the Singapore license requirements?')}
            className="px-2.5 py-1 rounded-full bg-white border border-[#c4c5da] hover:border-[#0034c5] whitespace-nowrap cursor-pointer"
          >
            🪪 Singpass Check
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-[#fbf8ff]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-[#0034c5] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  EV
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0034c5] text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-[#191b25] border border-[#E2E8F0] rounded-bl-xs shadow-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-2.5 text-xs bg-[#fbf8ff] border border-[#c4c5da] rounded-xl focus:outline-hidden focus:border-[#0034c5]"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#0034c5] hover:bg-[#00248c] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
