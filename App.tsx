
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  RotateCcw, 
  Calendar, 
  Target, 
  UtensilsCrossed, 
  Menu, 
  X,
  MessageSquareCode,
  Wallet,
  BrainCircuit,
  StickyNote,
  UserCircle
} from 'lucide-react';
import { ModuleType, InventoryItem, RoutineTask, Goal, Recipe, PlanEvent, ChatSession, Expense, Note, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Routines from './components/Routines';
import Goals from './components/Goals';
import Recipes from './components/Recipes';
import PlanMonth from './components/PlanMonth';
import Chatbot from './components/Chatbot';
import Expenses from './components/Expenses';
import Notes from './components/Notes';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Usuario OmniControl',
    nickname: 'OmniMaster',
    age: '28',
    country: 'España',
    language: 'Español',
    joinedDate: new Date().toISOString(),
    bio: 'Buscando el balance perfecto entre productividad y bienestar.',
    values: ['Disciplina', 'Curiosidad', 'Gratitud'],
    priorities: ['Salud mental', 'Crecimiento profesional', 'Ahorro'],
    mainObjective: 'Optimizar mi sistema de vida personal al 100%',
    mood: '😊',
    energyLevel: 80,
    motivationLevel: 90,
    theme: 'dark',
    accentColor: '#3b82f6',
    notificationSettings: {
      routines: true,
      goals: true,
      expenses: true,
      inventory: true
    }
  });

  // States
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Zapatillas Running', category: 'Ropa', status: 'Usado', useFrequency: 'Diario', lastUsed: '2023-10-25', quantity: 1 },
    { id: '2', name: 'Serum Facial', category: 'Aseo', status: 'Agotándose', useFrequency: 'Diario', lastUsed: '2023-10-26', quantity: 1 },
  ]);
  const [invCategories, setInvCategories] = useState(['Ropa', 'Aseo', 'Tecnología', 'Otros']);

  const [routines, setRoutines] = useState<RoutineTask[]>([
    { id: '1', title: 'Meditación 10m', completed: true, timeEstimate: 10, category: 'Mañana' },
    { id: '2', title: 'Lectura', completed: false, timeEstimate: 30, category: 'Tarde' },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Correr 10km', progress: 65, deadline: '2024-01-01', type: 'Corto Plazo', active: true, completed: false },
  ]);

  const [recipes, setRecipes] = useState<Recipe[]>([
    { id: '1', title: 'Quinoa Bowl', category: 'Comida', difficulty: 'Fácil', prepTime: 20, ingredients: ['Quinoa', 'Tomate'] },
  ]);
  const [recipeCategories, setRecipeCategories] = useState(['Comida', 'Postres', 'Varios']);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Netflix', category: 'Digital', amount: 15.99, date: '2023-10-20', type: 'Necesario', method: 'Transferencia' },
  ]);

  const [notes, setNotes] = useState<Note[]>([]);
  const [planEvents, setPlanEvents] = useState<PlanEvent[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const renderModule = () => {
    const commonProps = { inventory, routines, goals, expenses, notes, profile };
    switch (activeModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard {...commonProps} setActiveModule={setActiveModule} setRoutines={setRoutines} />;
      case ModuleType.INVENTORY:
        return <Inventory inventory={inventory} setInventory={setInventory} categories={invCategories} setCategories={setInvCategories} />;
      case ModuleType.ROUTINE:
        return <Routines routines={routines} setRoutines={setRoutines} />;
      case ModuleType.GOALS:
        return <Goals goals={goals} setGoals={setGoals} />;
      case ModuleType.RECIPES:
        return <Recipes recipes={recipes} setRecipes={setRecipes} inventory={inventory} categories={recipeCategories} setCategories={setRecipeCategories} />;
      case ModuleType.PLAN:
        return <PlanMonth events={planEvents} setEvents={setPlanEvents} />;
      case ModuleType.CHAT:
        return <Chatbot sessions={chatSessions} setSessions={setChatSessions} context={commonProps} />;
      case ModuleType.EXPENSES:
        return <Expenses expenses={expenses} setExpenses={setExpenses} inventory={inventory} goals={goals} />;
      case ModuleType.NOTES:
        return <Notes notes={notes} setNotes={setNotes} inventory={inventory} goals={goals} />;
      case ModuleType.PROFILE:
        return <Profile profile={profile} setProfile={setProfile} inventory={inventory} routines={routines} goals={goals} expenses={expenses} notes={notes} />;
      default:
        return <Dashboard {...commonProps} setActiveModule={setActiveModule} setRoutines={setRoutines} />;
    }
  };

  const navItems = [
    { id: ModuleType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ModuleType.CHAT, label: 'OmniAI', icon: MessageSquareCode },
    { id: ModuleType.NOTES, label: 'Notas', icon: BrainCircuit },
    { id: ModuleType.EXPENSES, label: 'Gastos', icon: Wallet },
    { id: ModuleType.INVENTORY, label: 'Inventario', icon: Package },
    { id: ModuleType.ROUTINE, label: 'Rutinas', icon: RotateCcw },
    { id: ModuleType.GOALS, label: 'Metas', icon: Target },
    { id: ModuleType.PLAN, label: 'Plan', icon: Calendar },
    { id: ModuleType.RECIPES, label: 'Cocina', icon: UtensilsCrossed },
    { id: ModuleType.PROFILE, label: 'Perfil', icon: UserCircle },
  ];

  return (
    <div className={`flex h-screen w-full bg-[#050505] text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30 theme-${profile.theme}`}>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={toggleSidebar}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 w-64 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col z-40`}>
        <div className="p-6 flex items-center justify-between">
          <span className="text-xl font-black bg-gradient-to-tr from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tighter uppercase">OmniControl</span>
          <button onClick={toggleSidebar} className="lg:hidden p-1.5 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveModule(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center p-3.5 rounded-2xl transition-all group relative ${
                activeModule === item.id 
                  ? 'bg-blue-600/10 text-blue-400 shadow-sm border border-blue-500/20' 
                  : 'hover:bg-white/5 text-slate-500'
              }`}
            >
              <item.icon size={20} className={`${activeModule === item.id ? 'text-blue-400' : 'group-hover:text-slate-300'} transition-colors`} />
              <span className="ml-4 font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Simple Profile Button in Sidebar */}
        <div className="p-4 border-t border-white/5">
           <button 
             onClick={() => { setActiveModule(ModuleType.PROFILE); setSidebarOpen(false); }}
             className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-xl transition-all"
           >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-sm overflow-hidden">
                {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : profile.name.charAt(0)}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold truncate">{profile.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{profile.nickname}</p>
              </div>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 lg:px-8 bg-black/20 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-1.5 hover:bg-white/10 rounded-xl">
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400">{navItems.find(i => i.id === activeModule)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-[10px] font-black uppercase text-slate-600 tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">
                V 2.5 Optimal
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gradient-to-b from-[#080808] to-[#050505]">
          {renderModule()}
        </div>
      </main>
    </div>
  );
};

export default App;
