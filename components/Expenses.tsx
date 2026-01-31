
import React, { useState } from 'react';
import { Wallet, Plus, Trash2, Edit3, CreditCard, DollarSign, X, TrendingUp, Filter, ArrowDownCircle } from 'lucide-react';
import { Expense, ExpenseType, PaymentMethod, InventoryItem, Goal } from '../types';

interface Props {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  inventory: InventoryItem[];
  goals: Goal[];
}

const Expenses: React.FC<Props> = ({ expenses, setExpenses, inventory, goals }) => {
  const [modalState, setModalState] = useState<{ show: boolean, expense: Partial<Expense> | null }>({ show: false, expense: null });
  const [filter, setFilter] = useState<string>('Todos');

  const openAdd = () => setModalState({ 
    show: true, 
    expense: { type: 'Necesario', method: 'Transferencia', date: new Date().toISOString().split('T')[0] } 
  });
  const openEdit = (expense: Expense) => setModalState({ show: true, expense });

  const saveExpense = () => {
    const { expense } = modalState;
    if (!expense?.name || !expense?.amount) return;
    if (expense.id) {
      setExpenses(prev => prev.map(e => e.id === expense.id ? (expense as Expense) : e));
    } else {
      const newExp: Expense = {
        ...expense,
        id: Math.random().toString(36).substr(2, 9),
      } as Expense;
      setExpenses([newExp, ...expenses]);
    }
    setModalState({ show: false, expense: null });
  };

  const deleteExpense = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("¿Eliminar este registro de gasto?")) setExpenses(expenses.filter(e => e.id !== id));
  };

  const currentMonth = new Date().getMonth();
  const monthlyTotal = expenses
    .filter(e => new Date(e.date).getMonth() === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = filter === 'Todos' ? expenses : expenses.filter(e => e.type === filter);

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 lg:p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
          <Wallet size={64} className="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2">Presupuesto Ejecutado</p>
          <h3 className="text-3xl lg:text-4xl font-black">${monthlyTotal.toFixed(2)}</h3>
          <p className="text-[10px] text-blue-200 mt-4 flex items-center gap-2">
            <TrendingUp size={14} /> Gestión saludable activa
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 lg:p-8 rounded-[2rem] shadow-xl flex flex-col justify-between">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Registrar Nuevo Movimiento</p>
          <button onClick={openAdd} className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 mt-4">
            <Plus size={24} />
          </button>
        </div>
        
        <div className="hidden lg:flex bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] shadow-xl flex-col justify-center items-center text-center">
           <ArrowDownCircle size={32} className="text-blue-400 mb-3" />
           <p className="text-slate-400 text-sm font-medium">Tus finanzas son el reflejo de tus decisiones diarias.</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['Todos', 'Necesario', 'Gusto', 'Impulsivo'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Concepto / Fecha</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Monto</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredExpenses.map(e => (
                <tr key={e.id} onClick={() => openEdit(e)} className="group hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-200">{e.name}</p>
                    <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{e.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase border tracking-widest ${
                      e.type === 'Necesario' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : 
                      e.type === 'Gusto' ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' : 
                      'bg-rose-500/5 text-rose-400 border-rose-500/10'
                    }`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-lg text-slate-200">${e.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       {/* Renamed event parameter from 'e' to 'event' to avoid shadowing the expense object 'e' */}
                       <button onClick={(event) => deleteExpense(e.id, event)} className="p-2 text-slate-600 hover:text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-700 italic text-sm">Sin registros para mostrar</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-md p-10 relative shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setModalState({ show: false, expense: null })} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={24} /></button>
            <h3 className="text-3xl font-black tracking-tighter mb-8">{modalState.expense?.id ? 'Editar Gasto' : 'Nuevo Gasto'}</h3>
            <div className="space-y-5">
              <InputGroup label="Concepto" value={modalState.expense?.name || ''} onChange={(v:any) => setModalState(s => ({...s, expense: {...s.expense!, name: v}}))} placeholder="¿En qué se fue el dinero?" />
              
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Monto ($)" type="number" value={modalState.expense?.amount || 0} onChange={(v:any) => setModalState(s => ({...s, expense: {...s.expense!, amount: Number(v)}}))} placeholder="0.00" />
                <SelectGroup label="Tipo" options={['Necesario', 'Gusto', 'Impulsivo']} value={modalState.expense?.type || ''} onChange={(v:any) => setModalState(s => ({...s, expense: {...s.expense!, type: v as any}}))} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="Pago" options={['Transferencia', 'Efectivo']} value={modalState.expense?.method || ''} onChange={(v:any) => setModalState(s => ({...s, expense: {...s.expense!, method: v as any}}))} />
                <InputGroup label="Fecha" type="date" value={modalState.expense?.date || ''} onChange={(v:any) => setModalState(s => ({...s, expense: {...s.expense!, date: v}}))} />
              </div>
              
              <SelectGroup label="Vincular a" options={['Ninguno', ...goals.map(g => g.title), ...inventory.map(i => i.name)]} value={modalState.expense?.relatedId || 'Ninguno'} onChange={(v:any) => setModalState(s => ({...s, expense: {...s.expense!, relatedId: v}}))} />

              <button onClick={saveExpense} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest mt-6 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">
                Sincronizar Gasto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold" />
  </div>
);

const SelectGroup = ({ label, options, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-bold appearance-none">
      {options.map((o: any) => <option key={o} value={o} className="bg-[#0f0f0f]">{o}</option>)}
    </select>
  </div>
);

export default Expenses;
