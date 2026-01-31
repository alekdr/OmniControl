
import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Award, 
  Activity, 
  Calendar, 
  Flag, 
  Quote, 
  Smile, 
  Zap, 
  Target, 
  ChevronRight, 
  Trash2, 
  Download, 
  Key,
  Globe,
  Heart
} from 'lucide-react';
import { UserProfile, InventoryItem, RoutineTask, Goal, Expense, Note } from '../types';

interface Props {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  inventory: InventoryItem[];
  routines: RoutineTask[];
  goals: Goal[];
  expenses: Expense[];
  notes: Note[];
}

const Profile: React.FC<Props> = ({ profile, setProfile, inventory, routines, goals, expenses, notes }) => {
  const [activeTab, setActiveTab] = useState<'identidad' | 'estadisticas' | 'configuracion'>('identidad');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const organizationLevel = Math.round(
    ((routines.filter(r => r.completed).length / (routines.length || 1)) * 40) +
    ((goals.filter(g => g.completed).length / (goals.length || 1)) * 30) +
    (Math.min(notes.length, 10) * 2) +
    (Math.min(inventory.length, 10) * 1)
  );

  const stats = [
    { label: 'Días Activos', value: '42', icon: <Calendar size={18} /> },
    { label: 'Rutinas Logradas', value: routines.filter(r => r.completed).length, icon: <Activity size={18} /> },
    { label: 'Metas Finalizadas', value: goals.filter(g => g.completed).length, icon: <Target size={18} /> },
    { label: 'Pensamientos', value: notes.length, icon: <Quote size={18} /> }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header / Hero */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 lg:p-12 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 text-blue-500/5 -z-0"><User size={250} /></div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] bg-blue-600 flex items-center justify-center font-black text-6xl shadow-2xl overflow-hidden">
              {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : profile.name.charAt(0)}
            </div>
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-[2.5rem]">
              <Camera size={32} className="text-white" />
              <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
            </label>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2.5 rounded-2xl text-white shadow-lg border-4 border-[#050505]">
              <Award size={20} />
            </div>
          </div>

          <div className="text-center md:text-left space-y-4 flex-1">
            <div className="space-y-1">
               <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">{profile.name}</h1>
               <p className="text-slate-500 font-black uppercase tracking-widest text-xs">@{profile.nickname} • Miembro desde {new Date(profile.joinedDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
            </div>
            <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">"{profile.bio}"</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
               <div className="bg-blue-600/10 border border-blue-500/20 px-5 py-2 rounded-2xl text-blue-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                 Organización: {organizationLevel}%
               </div>
               <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                 <Globe size={14} /> {profile.country}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-3xl w-full max-w-lg mx-auto overflow-hidden">
        {(['identidad', 'estadisticas', 'configuracion'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Identidad Section */}
      {activeTab === 'identidad' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
              <h3 className="text-xl font-black flex items-center gap-3"><Heart size={20} className="text-rose-500" /> Valores & Prioridades</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2">Tus Valores</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.values.map(v => (
                      <span key={v} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold">{v}</span>
                    ))}
                    <button className="px-3 py-2 border border-dashed border-white/20 rounded-xl text-slate-600 hover:text-rose-400 transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest flex items-center gap-2">Prioridades Actuales</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.priorities.map(p => (
                      <span key={p} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-xs font-bold">{p}</span>
                    ))}
                    <button className="px-3 py-2 border border-dashed border-white/20 rounded-xl text-slate-600 hover:text-blue-400 transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-4">Misión Personal</p>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-slate-200 font-medium italic">
                   "{profile.mainObjective}"
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
              <h3 className="text-xl font-black flex items-center gap-3"><Smile size={20} className="text-amber-400" /> Estado de Bienestar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                 <div className="space-y-3 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Ánimo Hoy</p>
                    <div className="text-5xl">{profile.mood}</div>
                    <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Cambiar</button>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Energía</p>
                    <div className="h-10 bg-white/5 rounded-2xl overflow-hidden p-1 border border-white/10 flex items-center">
                       <div className="h-full bg-amber-500 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-1000" style={{ width: `${profile.energyLevel}%` }}></div>
                    </div>
                    <p className="text-right text-[10px] font-black text-amber-500">{profile.energyLevel}%</p>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Motivación</p>
                    <div className="h-10 bg-white/5 rounded-2xl overflow-hidden p-1 border border-white/10 flex items-center">
                       <div className="h-full bg-emerald-500 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${profile.motivationLevel}%` }}></div>
                    </div>
                    <p className="text-right text-[10px] font-black text-emerald-500">{profile.motivationLevel}%</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <Zap className="absolute -top-4 -right-4 text-white/10 w-32 h-32" />
               <h4 className="text-lg font-black mb-4 flex items-center gap-2">Nivel de Vida</h4>
               <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6">"Estás en el top 10% de usuarios organizados de tu región. ¡Sigue así!"</p>
               <button className="w-full bg-white text-blue-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Ver Logros Globales</button>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Línea de Tiempo</h4>
              <div className="space-y-6">
                 <TimelineItem date="Hoy" label="OmniControl v2.5 activado" icon={<Zap size={14} />} />
                 <TimelineItem date="Ayer" label="Meta 'Correr 10km' 65%" icon={<Target size={14} />} />
                 <TimelineItem date="Hace 5 días" label="Nueva racha de 7 días" icon={<Award size={14} />} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadisticas Section */}
      {activeTab === 'estadisticas' && (
        <div className="space-y-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(s => (
                <div key={s.label} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] text-center space-y-3">
                   <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto">{s.icon}</div>
                   <div>
                     <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{s.label}</p>
                     <p className="text-3xl font-black">{s.value}</p>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10">
              <h3 className="text-xl font-black mb-10 flex items-center gap-3"><Activity size={20} className="text-indigo-400" /> Rendimiento Histórico</h3>
              <div className="h-64 flex items-end gap-2 px-4">
                 {[40, 60, 45, 80, 75, 90, 85, 95, 80, 88, 92, 100].map((v, i) => (
                   <div key={i} className="flex-1 space-y-2 group">
                      <div 
                        className="w-full bg-blue-600/20 group-hover:bg-blue-600/40 rounded-t-xl transition-all duration-700 relative" 
                        style={{ height: `${v}%` }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-blue-400">{v}%</div>
                      </div>
                      <div className="text-[8px] font-black text-slate-700 uppercase tracking-tighter text-center">MES {i + 1}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Configuracion Section */}
      {activeTab === 'configuracion' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-10">
              <h3 className="text-xl font-black flex items-center gap-3"><Palette size={20} className="text-blue-400" /> Personalización</h3>
              <div className="space-y-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Tema del Sistema</p>
                    <div className="grid grid-cols-3 gap-3">
                       {['dark', 'light', 'minimal'].map(t => (
                         <button 
                           key={t}
                           onClick={() => setProfile(p => ({...p, theme: t as any}))}
                           className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${profile.theme === t ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-500'}`}
                         >
                            {t}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Color de Acento</p>
                    <div className="flex gap-4">
                       {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                         <button 
                           key={c}
                           onClick={() => setProfile(p => ({...p, accentColor: c}))}
                           className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 ${profile.accentColor === c ? 'border-white' : 'border-transparent'}`}
                           style={{ backgroundColor: c }}
                         />
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-10">
              <h3 className="text-xl font-black flex items-center gap-3"><Bell size={20} className="text-amber-400" /> Notificaciones</h3>
              <div className="space-y-6">
                 <ToggleSetting 
                    label="Rutinas Diarias" 
                    active={profile.notificationSettings.routines} 
                    onChange={() => setProfile(p => ({...p, notificationSettings: {...p.notificationSettings, routines: !p.notificationSettings.routines}}))} 
                 />
                 <ToggleSetting 
                    label="Metas Proyectadas" 
                    active={profile.notificationSettings.goals} 
                    onChange={() => setProfile(p => ({...p, notificationSettings: {...p.notificationSettings, goals: !p.notificationSettings.goals}}))} 
                 />
                 <ToggleSetting 
                    label="Control de Gastos" 
                    active={profile.notificationSettings.expenses} 
                    onChange={() => setProfile(p => ({...p, notificationSettings: {...p.notificationSettings, expenses: !p.notificationSettings.expenses}}))} 
                 />
                 <ToggleSetting 
                    label="Alertas de Inventario" 
                    active={profile.notificationSettings.inventory} 
                    onChange={() => setProfile(p => ({...p, notificationSettings: {...p.notificationSettings, inventory: !p.notificationSettings.inventory}}))} 
                 />
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-10 md:col-span-2">
              <h3 className="text-xl font-black flex items-center gap-3"><Shield size={20} className="text-emerald-400" /> Seguridad & Datos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <ActionCard title="Bloqueo de App" desc="Activa PIN o Biometría" icon={<Key size={24} />} />
                 <ActionCard title="Respaldar Datos" desc="Exportar todo en JSON/CSV" icon={<Download size={24} />} />
                 <ActionCard title="Borrar Cuenta" desc="Eliminación permanente" icon={<Trash2 size={24} />} danger />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const TimelineItem = ({ date, label, icon }: { date: string, label: string, icon: any }) => (
  <div className="flex gap-4 relative">
     <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 relative z-10 border border-blue-500/10">{icon}</div>
     <div className="absolute top-8 left-4 w-px h-full bg-white/5 -z-0"></div>
     <div>
        <p className="text-[8px] font-black uppercase text-slate-600 tracking-tighter">{date}</p>
        <p className="text-xs font-bold text-slate-300">{label}</p>
     </div>
  </div>
);

const ToggleSetting = ({ label, active, onChange }: { label: string, active: boolean, onChange: () => void }) => (
  <div className="flex items-center justify-between group">
     <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{label}</span>
     <button 
       onClick={onChange}
       className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${active ? 'bg-blue-600' : 'bg-white/10'}`}
     >
        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
     </button>
  </div>
);

const ActionCard = ({ title, desc, icon, danger }: { title: string, desc: string, icon: any, danger?: boolean }) => (
  <button className={`p-8 rounded-[2rem] border transition-all text-left space-y-4 group ${danger ? 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/40' : 'bg-white/5 border-white/10 hover:border-blue-500/40'}`}>
     <div className={`p-3 rounded-2xl w-fit ${danger ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'} group-hover:scale-110 transition-transform`}>{icon}</div>
     <div>
        <h5 className="font-bold text-sm">{title}</h5>
        <p className="text-[10px] text-slate-500 font-medium">{desc}</p>
     </div>
  </button>
);

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default Profile;
