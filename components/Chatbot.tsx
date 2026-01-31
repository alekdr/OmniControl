
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Trash2, MessageSquare, Plus, Clock, Search, X } from 'lucide-react';
// Added UserProfile to the imports from types
import { ChatSession, ChatMessage, InventoryItem, RoutineTask, Goal, Expense, Note, UserProfile } from '../types';
import { chatWithGemini } from '../services/geminiService';

interface Props {
  sessions: ChatSession[];
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  // Updated context interface to include profile as required by chatWithGemini
  context: { 
    inventory: InventoryItem[]; 
    routines: RoutineTask[]; 
    goals: Goal[]; 
    expenses: Expense[]; 
    notes: Note[];
    profile: UserProfile;
  };
}

const Chatbot: React.FC<Props> = ({ sessions, setSessions, context }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeSession?.messages]);

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nuevo Chat',
      messages: [],
      timestamp: new Date().toISOString()
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setHistoryOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let targetSession = activeSession;
    if (!targetSession) {
      const newSession: ChatSession = {
        id: Math.random().toString(36).substr(2, 9),
        title: input.slice(0, 30),
        messages: [],
        timestamp: new Date().toISOString()
      };
      setSessions([newSession, ...sessions]);
      setActiveSessionId(newSession.id);
      targetSession = newSession;
    }

    const userMsg: ChatMessage = { role: 'user', text: input.trim() };
    const updatedMessages = [...targetSession.messages, userMsg];
    
    setSessions(prev => prev.map(s => s.id === targetSession!.id ? { ...s, messages: updatedMessages, title: s.title === 'Nuevo Chat' ? input.slice(0, 30) : s.title } : s));
    setInput('');
    setIsLoading(true);

    // Fixed line 61: context now matches the expected type with profile included
    const response = await chatWithGemini(updatedMessages, userMsg.text, context);
    
    setSessions(prev => prev.map(s => s.id === targetSession!.id ? { ...s, messages: [...updatedMessages, { role: 'model', text: response }] } : s));
    setIsLoading(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Eliminar este chat permanentemente?")) {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSessionId === id) setActiveSessionId(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] border border-white/5 rounded-[2.5rem] overflow-hidden bg-black/20 backdrop-blur-3xl animate-in zoom-in-95 duration-500 relative">
      {/* Sidebar Historial (Desktop / Mobile Overlay) */}
      <aside className={`absolute inset-y-0 left-0 z-30 w-72 border-r border-white/5 bg-[#0a0a0a]/95 backdrop-blur-3xl flex flex-col p-4 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isHistoryOpen ? 'translate-x-0 shadow-2xl shadow-blue-500/10' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-6 px-2">
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Historial OmniAI</p>
           <button onClick={() => setHistoryOpen(false)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-xl text-slate-500"><X size={18} /></button>
        </div>

        <button onClick={startNewChat} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest transition-all mb-6 shadow-xl shadow-blue-600/10 active:scale-95 flex-shrink-0">
          <Plus size={18} /> Nuevo Chat
        </button>
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5">
          {sessions.map(s => (
            <div 
              key={s.id} 
              onClick={() => { setActiveSessionId(s.id); setHistoryOpen(false); }}
              className={`group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border ${activeSessionId === s.id ? 'bg-white/10 text-white border-white/10 shadow-sm' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border-transparent'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className={activeSessionId === s.id ? 'text-blue-400' : 'text-slate-600'} />
                <span className="text-xs font-bold truncate pr-4">{s.title}</span>
              </div>
              <button 
                onClick={(e) => deleteSession(s.id, e)} 
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-lg"
                title="Borrar Chat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="py-20 text-center opacity-20">
               <Clock size={48} className="mx-auto mb-4" />
               <p className="text-[10px] font-black uppercase tracking-tighter">Sin historial</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-gradient-to-b from-transparent to-black/30 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
           <button onClick={() => setHistoryOpen(true)} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white"><Clock size={20} /></button>
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Conversación</h3>
           <button onClick={startNewChat} className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl"><Plus size={20} /></button>
        </div>

        {!activeSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 text-center animate-in fade-in duration-1000">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-600 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 active:scale-95 cursor-pointer" onClick={startNewChat}>
              <Bot size={40} className="text-white lg:hidden" />
              <Bot size={48} className="text-white hidden lg:block" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tighter mb-4">¿En qué puedo ayudarte?</h2>
            <p className="text-slate-500 max-w-sm mb-8 font-medium text-sm">Explora tus datos con la ayuda de OmniAI. Gestión de inventario, finanzas y metas en un solo lugar.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
               {['¿Cómo van mis gastos?', '¿Qué rutinas me faltan?', '¿Tengo stock de jabón?', 'Sugiéreme una receta'].map(p => (
                 <button key={p} onClick={() => { setInput(p); handleSend(); }} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all text-center">{p}</button>
               ))}
            </div>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 lg:space-y-8 no-scrollbar scroll-smooth">
              {activeSession?.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`flex gap-3 lg:gap-4 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl ${msg.role === 'user' ? 'bg-slate-800' : 'bg-blue-600'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] text-sm leading-relaxed font-medium shadow-sm border ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none border-blue-500/20' : 'bg-white/[0.03] text-slate-200 border-white/5 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse shadow-xl">
                      <Bot size={20} />
                    </div>
                    <div className="p-6 bg-white/[0.03] rounded-[2rem] rounded-tl-none border border-white/5 flex gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 lg:p-10 bg-gradient-to-t from-black/50 to-transparent">
              <div className="relative max-w-4xl mx-auto group">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Pregunta a OmniAI..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl lg:rounded-3xl py-4 lg:py-5 pl-6 lg:pl-8 pr-14 lg:pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium placeholder:text-slate-600 shadow-2xl"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2.5 lg:right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 lg:p-3 rounded-xl lg:rounded-2xl transition-all disabled:opacity-20 shadow-xl shadow-blue-600/20 active:scale-90"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[8px] lg:text-[10px] text-center text-slate-600 mt-4 uppercase font-black tracking-widest">IA de Contexto Total • OmniControl v2.5</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Chatbot;
