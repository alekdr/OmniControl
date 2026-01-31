
import React, { useState } from 'react';
import { Plus, Trash2, Search, X, Edit3, Star, BrainCircuit, List, BookOpen, Lightbulb, Grid, Columns, Clock, Tag } from 'lucide-react';
import { Note, NoteCategory, MentalState, InventoryItem, Goal } from '../types';

interface Props {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  inventory: InventoryItem[];
  goals: Goal[];
}

const Notes: React.FC<Props> = ({ notes, setNotes, inventory, goals }) => {
  const [filter, setFilter] = useState<NoteCategory | 'Todas'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<{ show: boolean, note: Partial<Note> | null }>({ show: false, note: null });
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const openAdd = () => setModalState({ 
    show: true, 
    note: { 
      category: 'Mentales', 
      mentalState: 'Pensamiento', 
      isFavorite: false,
      tags: [],
      content: ''
    } 
  });
  const openEdit = (note: Note) => setModalState({ show: true, note });

  const saveNote = () => {
    const { note } = modalState;
    if (!note?.title || !note?.content) return;
    const now = new Date().toISOString();
    if (note.id) {
      setNotes(notes.map(n => n.id === note.id ? { ...note as Note, updatedAt: now } : n));
    } else {
      const newNote: Note = {
        ...note,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now,
        updatedAt: now,
        isFavorite: note.isFavorite || false,
        tags: note.tags || []
      } as Note;
      setNotes([newNote, ...notes]);
    }
    setModalState({ show: false, note: null });
  };

  const deleteNote = (id: string) => {
    if (confirm("¿Borrar esta nota permanentemente?")) setNotes(notes.filter(n => n.id !== id));
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  const filteredNotes = notes.filter(n => {
    const matchesFilter = filter === 'Todas' || n.category === filter;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categoryIcons = {
    Mentales: <BrainCircuit size={18} />,
    Prácticas: <List size={18} />,
    Conocimiento: <BookOpen size={18} />,
    Creativas: <Lightbulb size={18} />
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white/[0.02] p-4 lg:p-6 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
          {(['Todas', 'Mentales', 'Prácticas', 'Conocimiento', 'Creativas'] as const).map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${filter === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
            >
              {cat !== 'Todas' && categoryIcons[cat as NoteCategory]}
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar pensamientos..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
            />
          </div>
          <button onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')} className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors">
            {viewType === 'grid' ? <Columns size={20} /> : <Grid size={20} />}
          </button>
          <button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 transition-all active:scale-95">
            <Plus size={18} /> Nueva Nota
          </button>
        </div>
      </div>

      {/* Notes Display */}
      <div className={viewType === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            onClick={() => openEdit(note)}
            className={`bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 group hover:border-indigo-500/40 transition-all duration-500 shadow-xl cursor-pointer relative overflow-hidden flex flex-col ${viewType === 'list' ? 'flex-row items-center py-4' : ''}`}
          >
            <div className="absolute top-0 right-0 p-8 text-indigo-500/5 -z-10 group-hover:scale-110 transition-transform duration-700">
               {categoryIcons[note.category]}
            </div>
            
            <div className={`flex justify-between items-start ${viewType === 'list' ? 'w-1/3' : 'mb-4'}`}>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 block flex items-center gap-1.5">
                  <span className="text-indigo-400">{categoryIcons[note.category]}</span>
                  {note.mentalState}
                </span>
                <h4 className="text-xl font-black tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">{note.title}</h4>
              </div>
              <button 
                onClick={(e) => toggleFavorite(note.id, e)} 
                className={`p-2 transition-colors ${note.isFavorite ? 'text-amber-400' : 'text-slate-700 hover:text-white'}`}
              >
                <Star size={18} fill={note.isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            <p className={`text-slate-400 text-sm leading-relaxed mb-6 font-medium ${viewType === 'list' ? 'flex-1 mb-0 mx-8 line-clamp-1' : 'line-clamp-4'}`}>
              {note.content}
            </p>

            <div className={`flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest pt-5 border-t border-white/5 mt-auto ${viewType === 'list' ? 'w-1/4 border-t-0 pt-0 mt-0 border-l pl-8' : ''}`}>
              <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(note.updatedAt).toLocaleDateString()}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                 <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="text-rose-500/50 hover:text-rose-500"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-20 border border-dashed border-white/10 rounded-[3rem]">
             <BrainCircuit size={64} className="mx-auto mb-4" />
             <p className="text-lg font-black uppercase tracking-widest">Nada por aquí, el silencio es oro.</p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {modalState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-3xl p-8 lg:p-12 relative shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-4xl font-black tracking-tighter">{modalState.note?.id ? 'Explorar Pensamiento' : 'Descarga Mental'}</h3>
              <div className="flex gap-4">
                 <button onClick={(e) => setModalState(s => ({...s, note: {...s.note!, isFavorite: !s.note?.isFavorite}}))} className={`p-3 rounded-2xl border border-white/5 transition-all ${modalState.note?.isFavorite ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                   <Star size={20} fill={modalState.note?.isFavorite ? "currentColor" : "none"} />
                 </button>
                 <button onClick={() => setModalState({ show: false, note: null })} className="p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-2xl"><X size={24} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">Categoría del pensamiento</label>
                   <div className="flex gap-2">
                     {(['Mentales', 'Prácticas', 'Conocimiento', 'Creativas'] as NoteCategory[]).map(c => (
                       <button 
                         key={c}
                         onClick={() => setModalState(s => ({...s, note: {...s.note!, category: c}}))}
                         className={`flex-1 p-3 rounded-xl border text-[9px] font-black uppercase tracking-tighter transition-all flex flex-col items-center gap-1 ${modalState.note?.category === c ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                       >
                         {categoryIcons[c]}
                         {c}
                       </button>
                     ))}
                   </div>
                 </div>
                 <SelectGroup label="Estado Mental" options={['Idea', 'Plan', 'Pensamiento', 'Proyecto', 'Recordatorio']} value={modalState.note?.mentalState || 'Pensamiento'} onChange={(v:any) => setModalState(s => ({...s, note: {...s.note!, mentalState: v as MentalState}}))} />
               </div>

               <InputGroup label="Título del pensamiento" value={modalState.note?.title || ''} onChange={(v:any) => setModalState(s => ({...s, note: {...s.note!, title: v}}))} placeholder="¿De qué trata esto?" />
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">Contenido libre</label>
                  <textarea 
                    value={modalState.note?.content || ''} 
                    onChange={e => setModalState(s => ({...s, note: {...s.note!, content: e.target.value}}))} 
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium text-slate-200 min-h-[250px] resize-none text-lg leading-relaxed placeholder:text-slate-800"
                    placeholder="Escribe sin miedo, aquí no hay juicio..."
                  />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SelectGroup 
                    label="Vincular a Meta" 
                    options={['Ninguna', ...goals.map(g => g.title)]} 
                    value={modalState.note?.relatedId || 'Ninguna'} 
                    onChange={(v:any) => setModalState(s => ({...s, note: {...s.note!, relatedId: v}}))} 
                  />
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">Etiquetas (Separadas por comas)</label>
                     <input 
                       type="text" 
                       value={modalState.note?.tags?.join(', ') || ''} 
                       onChange={e => setModalState(s => ({...s, note: {...s.note!, tags: e.target.value.split(',').map(t => t.trim())}}))} 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-bold placeholder:text-slate-800"
                       placeholder="vida, trabajo, futuro..."
                     />
                  </div>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
               {modalState.note?.id && <button onClick={() => { deleteNote(modalState.note!.id!); setModalState({show: false, note: null}); }} className="p-5 bg-rose-500/10 text-rose-500 rounded-3xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={24} /></button>}
               <button onClick={saveNote} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all text-sm">Sincronizar pensamiento</button>
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
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-bold placeholder:text-slate-800" />
  </div>
);

const SelectGroup = ({ label, options, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer font-bold appearance-none">
      {options.map((o: any) => <option key={o} value={o} className="bg-[#0f0f0f]">{o}</option>)}
    </select>
  </div>
);

export default Notes;
