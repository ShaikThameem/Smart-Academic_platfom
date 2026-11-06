import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  User,
  Shield,
  FileText,
  BarChart,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface HodChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const HOD_PROMPT_SUGGESTIONS = [
  'Draft an official department circular announcing the Semester 5 Continuous Internal Evaluation (CIE-2) exam schedule.',
  'Analyze optimal faculty workload distribution between theory lectures and specialized lab immersion blocks.',
  'Draft an NBA Self-Assessment Report (SAR) executive summary for Program Outcome 1 & 2 attainment.',
  'Recommend remediation strategy for students whose attendance has fallen below 75% in Semester 5.',
];

export const HodAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<HodChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      content:
        `Welcome Dr. ${user.name.split(' ').slice(-1)[0] || 'Davis'}. I am your Department Executive AI Assistant. I can help draft official circulars, analyze faculty workload equity, synthesize NBA/NIRF documentation, or evaluate academic progression trends. How can I assist your department administration today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: HodChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          role: 'hod',
          context: {
            hodName: user.name,
            department: 'Computer Science & Engineering',
            studentCount: 480,
            facultyCount: 32,
            activeSemester: 'Semester 5 Autumn 2024',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: HodChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'Here is the executive administrative summary for your review.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      toast.error('Could not reach AI Executive Assistant.');
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content:
            'I encountered a temporary connection glitch. Here is an administrative guideline: For department circulars, ensure all dates, room locations, invigilator rosters, and Dean approvals are clearly cited.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'assistant',
        content: `Chat session cleared. How can I assist with departmental administration?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">HOD Executive AI Advisor</h2>
              <Badge variant="teal">Governance & NBA Compliance</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Department administration, faculty workload balance, institutional reports, and circular drafting.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleClearChat}>
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Reset Chat
        </Button>
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-teal-300'
                    : 'bg-teal-700 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed space-y-1.5 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] text-right font-mono ${
                    msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-200" />
                <span>Generating administrative analysis...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Prompts:</span>
          {HOD_PROMPT_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 rounded-full transition-colors cursor-pointer text-slate-700"
            >
              {sug.slice(0, 50)}...
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask for circular drafts, accreditation summaries, workload recommendations..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button variant="teal" type="submit" disabled={isLoading || !inputMessage.trim()}>
              <Send className="w-4 h-4 mr-1.5" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
