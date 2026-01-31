
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCcw, BrainCircuit, Lightbulb, TrendingUp } from 'lucide-react';
import { getSmartSuggestions } from '../services/geminiService';
import { InventoryItem, RoutineTask, Goal, Expense, Note, UserProfile } from '../types';

interface Props {
  inventory: InventoryItem[];
  routines: RoutineTask[];
  goals: Goal[];
  expenses: Expense[];
  notes: Note[];
  profile: UserProfile;
}

const Suggestions: React.FC<Props> = ({ inventory, routines, goals, expenses, notes, profile }) => {
  const [suggestions, setSuggestions] = useState<{ category: string; title: string; description: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    const result = await getSmartSuggestions({ inventory, routines, goals, expenses, notes, profile });
    setSuggestions(result);
    setLoading(false);
  };

  useEffect(() => {
    if (suggestions.length === 0) {
      fetchSuggestions();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-3 flex items-center justify-center md:justify-start gap-4">
              <Sparkles size={36} className="text-blue-300" />
              Inteligencia OmniControl
            </h2>
            <p className="text-blue-100 text-lg max-w-md font-medium leading-relaxed">
              Analizamos tus finanzas, hábitos, pertenencias y metas para darte el control total.
            </p>
          </div>
          <button 
            onClick={fetchSuggestions}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all disabled:opacity-50 active:scale-95 border border-white/10"
          >
            <RefreshCcw size={24} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Analizando...' : 'Refrescar Análisis'}
          </button>
        </div>
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl animate-pulse">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl mb-6"></div>
              <div className="h-6 bg-slate-800 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            </div>
          ))
        ) : (
          suggestions.map((s, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-xl"></div>
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                {s.category === 'Finanzas' ? <TrendingUp size={28} /> : (idx % 2 === 0 ? <BrainCircuit size={28} /> : <Lightbulb size={28} />)}
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-black text-slate-100">{s.title}</h3>
                <span className="text-[10px] uppercase font-black text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg tracking-widest">{s.category}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm font-medium">{s.description}</p>
              <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><TrendingUp size={14} className="text-emerald-400" /> Impacto Estratégico</span>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">Ver Detalles</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Suggestions;
