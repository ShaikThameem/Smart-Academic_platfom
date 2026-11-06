import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  User,
  GraduationCap,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FacultyChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const FACULTY_SUGGESTIONS = [
  'Generate 5 multiple-choice questions on B+ Tree Indexing with Bloom\'s taxonomy level and answer keys.',
  'Draft a 4-level rubric for an Operating Systems Virtual Memory laboratory experiment.',
  'Write a 50-minute lecture plan outline covering Two-Phase Locking (2PL) and Deadlock Prevention.',
  'Provide a remedial assignment outline for students scoring below 50% in CIE-1 Database Systems.',
];

export const FacultyAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<FacultyChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      content:
        `Hello Professor ${user.name.split(' ').slice(-1)[0] || 'Chen'}. I am your Faculty Academic Assistant. I can help you draft continuous internal assessment (CIE) questions, rubric matrices, lesson plans, or summarize course outcome mappings. How can I assist your teaching today?`,
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

    const userMsg: FacultyChatMessage = {
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
          role: 'faculty',
          context: {
            facultyName: user.name,
            department: 'Computer Science & Engineering',
            coursesTaught: ['CS501 Database Management Systems', 'CS504 Operating Systems'],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: FacultyChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'Here is the curriculum draft and evaluation guidance for your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      toast.error('Could not reach AI Assistant. Please check server status.');
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content:
            'I encountered a temporary connection issue. Here is a standard response: For university assessments, adhere to Bloom\'s cognitive levels (Remember, Understand, Apply, Analyze) with clearly allocated marks per sub-question.',
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
        content: `Chat session refreshed. What academic task can I help you draft?`,
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
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Faculty Academic AI Assistant</h2>
              <Badge variant="teal">Curriculum & Exam Prep</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Assisting in exam question creation, Bloom's taxonomy mapping, rubrics, and pedagogy.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleClearChat}>
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Reset Chat
        </Button>
      </div>

      {/* Chat Messages Body */}
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
                <span>Drafting academic response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Prompts:</span>
          {FACULTY_SUGGESTIONS.map((sug, i) => (
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
              placeholder="Ask for exam questions, rubric criteria, lesson plans..."
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
