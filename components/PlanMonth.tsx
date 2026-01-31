
import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
import { PlanEvent } from '../types';

interface Props {
  events: PlanEvent[];
  setEvents: React.Dispatch<React.SetStateAction<PlanEvent[]>>;
}

const PlanMonth: React.FC<Props> = ({ events, setEvents }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<PlanEvent>>({ type: 'Evento' });

  // Calendar calculations
  const { monthName, year, days, leadingEmptyDays } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Adjust to Monday start (0=Sun, 1=Mon... -> 0=Mon, 6=Sun)
    const leadingEmptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(viewDate);
    
    return { 
      monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1), 
      year, 
      days, 
      leadingEmptyDays 
    };
  }, [viewDate]);

  const currentMonthEvents = events.filter(e => e.date === selectedDate);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const addEvent = () => {
    if (!newEvent.title) return;
    const event: PlanEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      title: newEvent.title,
      description: newEvent.description || '',
      type: newEvent.type as any
    };
    setEvents([...events, event]);
    setNewEvent({ type: 'Evento' });
    setShowModal(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === viewDate.getMonth() && 
           today.getFullYear() === viewDate.getFullYear();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CalendarIcon className="text-blue-500" /> {monthName} {year}
            </h2>
            <p className="text-slate-500 text-sm">Gestiona tus eventos y notas diarias</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setViewDate(new Date())}
              className="px-3 py-1 text-xs font-bold bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors uppercase tracking-wider"
            >
              Hoy
            </button>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-7 gap-2">
            {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-500 py-2 uppercase tracking-widest">{d}</div>
            ))}
            
            {/* Empty slots for start of month */}
            {Array.from({ length: leadingEmptyDays }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            
            {/* Days of the month */}
            {days.map(day => {
              const dateStr = `${year}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isSel = selectedDate === dateStr;
              const isCurr = isToday(day);

              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative aspect-square border rounded-xl p-2 flex flex-col justify-between transition-all group ${
                    isSel 
                      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-slate-800/30 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className={`text-sm font-bold ${
                    isSel ? 'text-blue-400' : isCurr ? 'text-blue-500' : 'text-slate-400'
                  }`}>
                    {day}
                    {isCurr && <span className="ml-1 w-1 h-1 bg-blue-500 rounded-full inline-block mb-1"></span>}
                  </span>
                  
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-auto">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${
                          e.type === 'Recordatorio' ? 'bg-amber-400' : e.type === 'Nota' ? 'bg-indigo-400' : 'bg-blue-400'
                        }`}></div>
                      ))}
                      {dayEvents.length > 3 && <div className="text-[8px] text-slate-500">+</div>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[450px] flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="font-bold text-lg">Agenda Diaria</h3>
              <p className="text-xs text-slate-500 font-medium">{selectedDate}</p>
            </div>
            <button 
              onClick={() => setShowModal(true)} 
              className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex-1 space-y-3 relative z-10 overflow-y-auto no-scrollbar max-h-[500px]">
            {currentMonthEvents.map(e => (
              <div key={e.id} className="group p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    e.type === 'Recordatorio' ? 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 
                    e.type === 'Nota' ? 'bg-indigo-400 shadow-[0_0_5px_rgba(129,140,248,0.5)]' : 
                    'bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]'
                  }`}></div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">{e.type}</span>
                    <p className="font-bold text-slate-200 text-sm">{e.title}</p>
                    {e.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{e.description}</p>}
                  </div>
                </div>
                <button 
                  onClick={() => deleteEvent(e.id)} 
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {currentMonthEvents.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 mt-20">
                <CalendarIcon size={40} className="mb-3 text-slate-600" />
                <p className="text-sm font-medium">Día libre de planes</p>
                <p className="text-[10px] uppercase tracking-tighter">Click en + para añadir notas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-bold mb-8 text-white">Nueva entrada</h3>
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Título</label>
                <input 
                  autoFocus
                  type="text" 
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white" 
                  placeholder="¿Qué tienes planeado?" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Detalles</label>
                <textarea 
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white min-h-[100px]" 
                  placeholder="Información adicional o notas..."
                ></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tipo de entrada</label>
                <select 
                  onChange={e => setNewEvent({...newEvent, type: e.target.value as any})} 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white appearance-none cursor-pointer"
                >
                  <option value="Evento">Evento</option>
                  <option value="Nota">Nota</option>
                  <option value="Recordatorio">Recordatorio</option>
                </select>
              </div>
              <button 
                onClick={addEvent} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-bold mt-6 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all text-lg"
              >
                Guardar en Agenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanMonth;
