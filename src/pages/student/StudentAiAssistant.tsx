import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';
import { ChatMessage } from '../../types/academic';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Calendar,
  AlertCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StudentAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello ${user.name}! I am your **Smart Academic Platform AI Assistant**.
I can help you with:
- Explaining complex Computer Science concepts & algorithmic proofs
- Formulating personalized study schedules for upcoming mid-terms
- Clarifying university attendance policies (including your current **CS303** recovery steps)
- Tracing data structures with code examples in Python, C++, or Java

What academic topic can I help you with today?`,
      timestamp: '10:00 AM',
      suggestions: [
        'How many classes do I need to attend to get back to 75% in CS303?',
        'Explain Dijkstra algorithm with time complexity and Python code',
        'Give me a 5-day study plan for Database Systems (CS302)',
        'What is the difference between 3NF and BCNF with examples?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    setHasError(false);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    try {
      const response = await aiService.askAssistant(query, messages);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI response error', err);
      setHasError(true);
      toast.error('Failed to receive response from academic AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied text to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-10rem)]">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Smart Academic AI Assistant</span>
              <Badge variant="info" size="sm">
                {aiService.isRealApiConfigured() ? 'Gemini 2.5 Active' : 'Academic Engine'}
              </Badge>
            </h2>
            <p className="text-[11px] text-slate-500">
              Department of Computer Science & Engineering Knowledge System
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMessages([messages[0]]);
            toast.info('Chat session restarted');
          }}
        >
          Clear History
        </Button>
      </div>

      {/* Chat Messages Log */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-sky-100 text-sky-700 border border-sky-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {/* Render message body */}
                    <div className="whitespace-pre-wrap font-sans space-y-2">
                      {msg.text}
                    </div>

                    {/* Sources citation if available */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] text-slate-500 space-y-0.5">
                        <span className="font-semibold text-slate-700 block">Sources & Regulations:</span>
                        {msg.sources.map((s, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span>•</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${isUser ? 'justify-end' : ''}`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-slate-600 p-0.5 rounded cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* Contextual Suggestions Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sugg, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sugg)}
                          className="text-[11px] text-slate-600 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-2xs text-left"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Generating indicator */}
          {isGenerating && (
            <div className="flex gap-3 max-w-xl mr-auto animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>Consulting syllabus, timetable, and academic knowledge base...</span>
              </div>
            </div>
          )}

          {/* Error retry banner */}
          {hasError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Unable to fetch AI response. Network error or API timeout.</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleRetryLast} leftIcon={<RotateCcw className="w-3 h-3" />}>
                Retry
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask anything about algorithms, syllabus, exam prep, or attendance rules..."
              className="flex-1 text-xs sm:text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 focus:bg-white transition-colors"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              isLoading={isGenerating}
              rightIcon={<Send className="w-3.5 h-3.5" />}
              className="rounded-xl px-4"
            >
              Ask
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
