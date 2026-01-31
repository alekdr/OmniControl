
import React, { useState } from 'react';
import { Target, Trash2, CheckCircle, X, Plus, Edit3, Calendar } from 'lucide-react';
import { Goal } from '../types';

interface Props {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const Goals: React.FC<Props> = ({ goals, setGoals }) => {
  const [modalState, setModalState] = useState<{ show: boolean, goal: Partial<Goal> | null }>({ show: false, goal: null });

  const openAdd = () => setModalState({ show: true, goal: { type: 'Corto Plazo', progress: 0, active: true, completed: false } });
  const openEdit = (goal: Goal) => setModalState({ show: true, goal });

  const saveGoal = () => {
    const { goal } = modalState;
    if (!goal?.title) return;
    if (goal.id) {
      setGoals(prev => prev.map(g => g.id === goal.id ? (goal as Goal) : g));
    } else {
      setGoals([...goals, { ...goal, id: Math.random().toString(36).substr(2, 9), completed: (goal.progress || 0) >= 100 } as Goal]);
    }
    setModalState({ show: false, goal: null });
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? 0 : 100 } : g));
  };

  const deleteGoal = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("¿Eliminar esta meta permanentemente?")) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <div className="space-y-8 lg:space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white/[0.02] p-4 lg:p-6 rounded-[2rem] border border-white/5">
         <div className="flex gap-2 lg:gap-4 overflow-x-auto no-scrollbar">
            <StatSmall label="Logradas" value={goals.filter(g => g.completed).length} color="emerald" />
            <StatSmall label="Activas" value={goals.filter(g => !g.completed).length} color="blue" />
         </div>
         <button 
           onClick={openAdd} 
           className="w-12 h-12 lg:w-14 lg:h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 active:scale-90 transition-all flex-shrink-0"
           title="Nueva Meta"
         >
            <Plus size={24} />
         </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {goals.map(goal => (
          <div key={goal.id} className={`bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 transition-all hover:border-emerald-500/40 shadow-xl group relative overflow-hidden ${goal.completed ? 'opacity-50' : ''}`}>
            {goal.completed && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-x-1/2 -translate-y-1/2 flex items-end justify-start p-6 text-emerald-400"><CheckCircle size={24} /></div>}
            
            <div className="flex justify-between items-start mb-6 lg:mb-8">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{goal.type}</span>
                <h4 className={`text-xl lg:text-2xl font-black tracking-tight truncate ${goal.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{goal.title}</h4>
              </div>
              <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                <button onClick={(e) => deleteGoal(goal.id, e)} className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/20 transition-all"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="text-emerald-400">{goal.progress}% LOGRADO</span>
                  <span className="flex items-center gap-2"><Calendar size={12} /> {goal.deadline || 'PENDIENTE'}</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
              
              {!goal.completed && (
                <div className="flex gap-3 pt-2">
                   <button onClick={() => toggleGoal(goal.id)} className="flex-1 bg-white/5 hover:bg-emerald-500/10 border border-white/5 text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl transition-all active:scale-95">Marcar como Lograda</button>
                   <button onClick={() => openEdit(goal)} className="px-5 bg-white/5 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors"><Edit3 size={16} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-20 border border-dashed border-white/10 rounded-[3rem]">
             <Target size={64} className="mx-auto mb-4" />
             <p className="text-lg font-black uppercase tracking-widest">Sin metas para conquistar</p>
          </div>
        )}
      </div>

      {modalState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[3rem] w-full max-w-md p-8 lg:p-12 relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setModalState({ show: false, goal: null })} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-3xl lg:text-4xl font-black tracking-tighter mb-8 lg:mb-10">{modalState.goal?.id ? 'Refinar Propósito' : 'Nuevo Objetivo'}</h3>
            <div className="space-y-6">
              <InputGroup label="¿Cuál es tu gran meta?" value={modalState.goal?.title || ''} onChange={(v:any) => setModalState(s => ({...s, goal: {...s.goal!, title: v}}))} placeholder="Ejem: Correr mi primer maratón" />
              <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="Marco de tiempo" options={['Corto Plazo', 'Mediano Plazo', 'Largo Plazo']} value={modalState.goal?.type || ''} onChange={(v:any) => setModalState(s => ({...s, goal: {...s.goal!, type: v as any}}))} />
                <InputGroup label="Progreso actual %" type="number" value={modalState.goal?.progress || 0} onChange={(v:any) => setModalState(s => ({...s, goal: {...s.goal!, progress: Number(v)}}))} />
              </div>
              <InputGroup label="Fecha límite estimada" type="date" value={modalState.goal?.deadline || ''} onChange={(v:any) => setModalState(s => ({...s, goal: {...s.goal!, deadline: v}}))} />
              <button onClick={saveGoal} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest mt-6 shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 text-sm">Guardar Objetivo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatSmall = ({ label, value, color }: any) => {
  const colors: any = { emerald: "text-emerald-400 bg-emerald-400/10", blue: "text-blue-400 bg-blue-400/10" };
  return (
    <div className={`px-5 py-2.5 rounded-2xl border border-white/5 ${colors[color]} flex items-center gap-3 shadow-lg flex-shrink-0`}>
       <span className="text-xl font-black">{value}</span>
       <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-bold text-slate-100 placeholder:text-slate-800" />
  </div>
);

const SelectGroup = ({ label, options, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer font-bold appearance-none text-slate-100">
      {options.map((o: any) => <option key={o} value={o} className="bg-[#0f0f0f]">{o}</option>)}
    </select>
  </div>
);

export default Goals;
