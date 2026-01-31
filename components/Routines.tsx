
import React, { useState } from 'react';
import { Clock, CheckCircle2, Circle, Trash2, Plus, X, Edit3, Filter } from 'lucide-react';
import { RoutineTask } from '../types';

interface Props {
  routines: RoutineTask[];
  setRoutines: React.Dispatch<React.SetStateAction<RoutineTask[]>>;
}

const Routines: React.FC<Props> = ({ routines, setRoutines }) => {
  const [modalState, setModalState] = useState<{ show: boolean, task: Partial<RoutineTask> | null }>({ show: false, task: null });
  const [activeTab, setActiveTab] = useState<'Mañana' | 'Tarde' | 'Noche'>('Mañana');

  const openAdd = () => setModalState({ show: true, task: { category: activeTab, timeEstimate: 15, completed: false } });
  const openEdit = (task: RoutineTask) => setModalState({ show: true, task });

  const saveTask = () => {
    const { task } = modalState;
    if (!task?.title) return;
    if (task.id) {
      setRoutines(prev => prev.map(t => t.id === task.id ? (task as RoutineTask) : t));
    } else {
      setRoutines([...routines, { ...task, id: Math.random().toString(36).substr(2, 9) } as RoutineTask]);
    }
    setModalState({ show: false, task: null });
  };

  const toggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Borrar esta tarea permanentemente?")) {
      setRoutines(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-white/[0.02] p-4 lg:p-6 rounded-[2rem] border border-white/5">
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(['Mañana', 'Tarde', 'Noche'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 lg:px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95">
          <Plus size={18} /> Nueva Tarea
        </button>
      </div>

      <div className="space-y-3 lg:space-y-4">
        {routines.filter(r => r.category === activeTab).map(task => (
          <div 
            key={task.id} 
            onClick={(e) => toggleTask(task.id, e)}
            className={`group flex items-center justify-between p-5 lg:p-6 rounded-3xl border transition-all cursor-pointer ${task.completed ? 'bg-emerald-500/5 border-emerald-500/10 opacity-70' : 'bg-white/[0.02] border-white/5 hover:border-blue-500/20 shadow-sm'}`}
          >
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 text-slate-700'}`}>
                {task.completed && <CheckCircle2 size={16} />}
              </div>
              <div className="min-w-0 pr-4">
                <p className={`font-bold text-base lg:text-lg truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</p>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Clock size={12} /> {task.timeEstimate} min</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 lg:gap-2">
              <button onClick={(e) => { e.stopPropagation(); openEdit(task); }} className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-all"><Edit3 size={18} /></button>
              <button onClick={(e) => deleteTask(task.id, e)} className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {routines.filter(r => r.category === activeTab).length === 0 && (
           <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] animate-in fade-in zoom-in-95 duration-700">
              <Clock size={48} className="mx-auto mb-4 text-slate-800" />
              <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Nada planeado para la {activeTab.toLowerCase()}</p>
           </div>
        )}
      </div>

      {modalState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 lg:p-10 relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setModalState({ show: false, task: null })} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-3xl font-black tracking-tighter mb-8">{modalState.task?.id ? 'Refinar Hábito' : 'Nuevo Hábito'}</h3>
            <div className="space-y-6">
              <InputGroup label="¿Qué actividad quieres realizar?" value={modalState.task?.title || ''} onChange={(v:any) => setModalState(s => ({...s, task: {...s.task!, title: v}}))} placeholder="Ejem: Meditación guiada" />
              <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="Franja Horaria" options={['Mañana', 'Tarde', 'Noche']} value={modalState.task?.category || activeTab} onChange={(v:any) => setModalState(s => ({...s, task: {...s.task!, category: v as any}}))} />
                <InputGroup label="Tiempo estimado (m)" type="number" value={modalState.task?.timeEstimate || 15} onChange={(v:any) => setModalState(s => ({...s, task: {...s.task!, timeEstimate: Number(v)}}))} />
              </div>
              <button onClick={saveTask} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest mt-4 shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm">Sincronizar Rutina</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-bold text-slate-100 placeholder:text-slate-800" />
  </div>
);

const SelectGroup = ({ label, options, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer font-bold appearance-none text-slate-100">
      {options.map((o: any) => <option key={o} value={o} className="bg-[#0f0f0f]">{o}</option>)}
    </select>
  </div>
);

export default Routines;
