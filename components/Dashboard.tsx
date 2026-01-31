
import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Target,
  Sparkles,
  Wallet,
  Calendar,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import { InventoryItem, RoutineTask, Goal, ModuleType, Expense, Note } from '../types';

interface Props {
  inventory: InventoryItem[];
  routines: RoutineTask[];
  goals: Goal[];
  expenses: Expense[];
  notes: Note[];
  setActiveModule: (m: ModuleType) => void;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineTask[]>>;
}

const Dashboard: React.FC<Props> = ({ inventory, routines, goals, expenses, notes, setActiveModule, setRoutines }) => {
  const routineProgress = routines.length > 0 ? (routines.filter(r => r.completed).length / routines.length) * 100 : 0;
  const urgentItems = inventory.filter(i => i.status === 'Agotándose' || i.status === 'Desgastado');
  const activeGoals = goals.filter(g => !g.completed);
  const recentNote = notes[notes.length - 1];

  const toggleRoutine = (id: string) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tighter">Panel de Control</h1>
          <p className="text-slate-500 font-medium text-sm lg:text-base">Mente clara, vida organizada.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs lg:text-sm font-bold w-full sm:w-auto">
          <Calendar size={16} className="text-blue-400" />
          {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={<Clock />} title="Hábitos" value={`${Math.round(routineProgress)}%`} color="blue" />
        <StatCard icon={<Wallet />} title="Gasto Mes" value={`$${monthlyTotal(expenses)}`} color="indigo" />
        <StatCard icon={<Target />} title="Metas" value={activeGoals.length} color="emerald" />
        <StatCard icon={<AlertTriangle />} title="Alertas" value={urgentItems.length} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h3 className="text-lg lg:text-xl font-bold flex items-center gap-3">
                <span className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><Clock size={18} /></span>
                Hábitos Hoy
              </h3>
              <button onClick={() => setActiveModule(ModuleType.ROUTINE)} className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400 tracking-widest">Configurar</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {routines.slice(0, 4).map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleRoutine(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    task.completed 
                    ? 'bg-emerald-500/5 border-emerald-500/10 opacity-60' 
                    : 'bg-white/[0.03] border-white/5 hover:border-blue-500/20 shadow-md'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'}`}>
                    {task.completed && <CheckCircle2 size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-xs truncate ${task.completed ? 'line-through text-emerald-400/50' : 'text-slate-200'}`}>{task.title}</p>
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{task.timeEstimate} MIN</span>
                  </div>
                </div>
              ))}
              {routines.length === 0 && <p className="col-span-full text-center text-slate-600 py-4 text-xs italic">No hay rutinas hoy</p>}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 text-blue-500/10"><BrainCircuit size={100} /></div>
             <h3 className="text-lg lg:text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
               <span className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400"><BrainCircuit size={18} /></span>
               Pensamiento del Día
             </h3>
             {recentNote ? (
               <div className="relative z-10 space-y-4">
                 <p className="text-sm lg:text-lg font-medium text-slate-300 italic leading-relaxed">"{recentNote.title}: {recentNote.content.slice(0, 100)}..."</p>
                 <button onClick={() => setActiveModule(ModuleType.NOTES)} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 tracking-widest flex items-center gap-2">Abrir notas <ChevronRight size={14} /></button>
               </div>
             ) : (
               <div className="relative z-10 text-center py-6">
                 <p className="text-slate-600 text-sm font-medium mb-4">Descarga tu mente ahora.</p>
                 <button onClick={() => setActiveModule(ModuleType.NOTES)} className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-xs font-bold transition-all border border-white/5">Crear Nota Rápida</button>
               </div>
             )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <Sparkles size={40} className="absolute -top-2 -right-2 text-white/10" />
            <h3 className="text-lg lg:text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb size={20} /> OmniAI Insight
            </h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              "Has mantenido el 90% de tus rutinas este mes. Tienes un objeto 'Jabón' agotándose, agrégalo a la lista de compras."
            </p>
            <button onClick={() => setActiveModule(ModuleType.CHAT)} className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95">Abrir OmniAI</button>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <span className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400"><Target size={18} /></span>
              Metas
            </h3>
            <div className="space-y-5">
              {activeGoals.slice(0, 3).map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">{goal.title}</span>
                    <span className="text-blue-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                </div>
              ))}
              {activeGoals.length === 0 && <p className="text-center text-slate-700 text-xs py-2 italic">Sin metas activas</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const monthlyTotal = (expenses: Expense[]) => {
  return expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0).toFixed(2);
};

const StatCard = ({ icon, title, value, color }: { icon: any, title: string, value: any, color: string }) => {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400",
    indigo: "bg-indigo-500/10 text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    rose: "bg-rose-500/10 text-rose-400",
  };
  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] shadow-lg flex flex-col sm:flex-row items-center gap-3 lg:gap-5 text-center sm:text-left">
      <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl flex-shrink-0 ${colors[color]}`}>{React.cloneElement(icon, { size: 20 })}</div>
      <div className="min-w-0">
        <p className="text-[9px] lg:text-[10px] font-black uppercase text-slate-500 tracking-widest truncate">{title}</p>
        <p className="text-lg lg:text-2xl font-black truncate">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
