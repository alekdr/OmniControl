
import React, { useState } from 'react';
// Added Package to the import list to fix the "Cannot find name 'Package'" error.
import { Plus, Trash2, Tag, Edit3, X, Image as ImageIcon, Camera, Package } from 'lucide-react';
import { InventoryItem, ItemStatus } from '../types';

interface Props {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const Inventory: React.FC<Props> = ({ inventory, setInventory, categories, setCategories }) => {
  const [filter, setFilter] = useState<string>('Todos');
  const [modalState, setModalState] = useState<{ show: boolean, item: Partial<InventoryItem> | null }>({ show: false, item: null });

  const openAdd = () => setModalState({ show: true, item: { category: categories[0], status: 'Nuevo', quantity: 1, useFrequency: 'Semanal' } });
  const openEdit = (item: InventoryItem) => setModalState({ show: true, item });

  const saveItem = () => {
    const { item } = modalState;
    if (!item?.name) return;
    if (item.id) {
      setInventory(inventory.map(i => i.id === item.id ? (item as InventoryItem) : i));
    } else {
      const newItem: InventoryItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        lastUsed: new Date().toISOString().split('T')[0],
      } as InventoryItem;
      setInventory([...inventory, newItem]);
    }
    setModalState({ show: false, item: null });
  };

  const deleteItem = (id: string) => {
    if (confirm("¿Eliminar este objeto permanentemente?")) setInventory(inventory.filter(i => i.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalState(prev => ({ ...prev, item: { ...prev.item!, image: reader.result as string } }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addCategory = () => {
    const name = prompt("Nombre de la nueva categoría:");
    if (name && !categories.includes(name)) setCategories([...categories, name]);
  };

  const deleteCategory = (cat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar categoría "${cat}"? Los objetos se moverán a "Otros".`)) {
      setCategories(categories.filter(c => c !== cat));
      setInventory(inventory.map(i => i.category === cat ? { ...i, category: 'Otros' } : i));
      if (filter === cat) setFilter('Todos');
    }
  };

  const filteredItems = filter === 'Todos' ? inventory : inventory.filter(i => i.category === filter);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/[0.02] p-4 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 no-scrollbar px-2">
          <button 
            onClick={() => setFilter('Todos')} 
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'Todos' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <div key={cat} className="relative group flex-shrink-0">
              <button 
                onClick={() => setFilter(cat)} 
                className={`px-6 py-3 pr-10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
              >
                {cat}
              </button>
              {cat !== 'Otros' && (
                <button 
                  onClick={(e) => deleteCategory(cat, e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addCategory} className="flex-shrink-0 p-3 bg-white/5 border border-dashed border-white/20 rounded-2xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all">
            <Plus size={18} />
          </button>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap">
          <Plus size={18} /> Añadir Objeto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/40 transition-all duration-500 shadow-xl hover:shadow-blue-500/5 flex flex-col">
            <div className="h-52 bg-slate-900 relative overflow-hidden">
              {item.image ? (
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-800"><ImageIcon size={64} /></div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => openEdit(item)} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-blue-600 transition-all"><Edit3 size={20} /></button>
                <button onClick={() => deleteItem(item.id)} className="p-3 bg-rose-500/20 backdrop-blur-md rounded-2xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
              <div className="absolute top-4 left-4">
                 <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">{item.status}</span>
              </div>
            </div>
            <div className="p-7 flex-1 flex flex-col">
              <h4 className="font-black text-xl leading-tight mb-1 group-hover:text-blue-400 transition-colors">{item.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">{item.category}</p>
              <div className="mt-auto flex justify-between items-center text-xs font-bold pt-5 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-slate-600 uppercase text-[9px] tracking-tighter">Stock</span>
                  <span className="text-slate-200">{item.quantity} uds.</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-slate-600 uppercase text-[9px] tracking-tighter">Uso</span>
                  <span className="text-blue-400">{item.useFrequency}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-20 border border-dashed border-white/10 rounded-[3rem]">
             <Package size={64} className="mb-4" />
             <p className="text-lg font-black uppercase tracking-widest">Sin objetos en esta categoría</p>
          </div>
        )}
      </div>

      {modalState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-2xl p-12 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setModalState({ show: false, item: null })} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-4xl font-black tracking-tighter mb-10">{modalState.item?.id ? 'Editar Objeto' : 'Nuevo Objeto'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="aspect-square bg-white/[0.03] rounded-[2rem] overflow-hidden border border-white/5 relative group shadow-inner">
                    {modalState.item?.image ? (
                      <img src={modalState.item.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-800">
                        <Camera size={48} className="mb-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Añadir Foto</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                       <div className="flex flex-col items-center gap-2">
                          <Camera size={24} />
                          <span className="text-xs font-black uppercase tracking-widest">Cambiar Imagen</span>
                       </div>
                       <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                 </div>
              </div>
              <div className="space-y-6 flex flex-col justify-center">
                <InputGroup label="Nombre del Objeto" value={modalState.item?.name || ''} onChange={(v:any) => setModalState(s => ({...s, item: {...s.item!, name: v}}))} />
                <div className="grid grid-cols-2 gap-4">
                  <SelectGroup label="Categoría" options={categories} value={modalState.item?.category || ''} onChange={(v:any) => setModalState(s => ({...s, item: {...s.item!, category: v}}))} />
                  <SelectGroup label="Estado" options={['Nuevo', 'Usado', 'Desgastado', 'Agotándose']} value={modalState.item?.status || ''} onChange={(v:any) => setModalState(s => ({...s, item: {...s.item!, status: v as any}}))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Cantidad" type="number" value={modalState.item?.quantity || 1} onChange={(v:any) => setModalState(s => ({...s, item: {...s.item!, quantity: Number(v)}}))} />
                  <SelectGroup label="Frecuencia" options={['Diario', 'Semanal', 'Mensual', 'Raro']} value={modalState.item?.useFrequency || ''} onChange={(v:any) => setModalState(s => ({...s, item: {...s.item!, useFrequency: v as any}}))} />
                </div>
              </div>
            </div>
            <button onClick={saveItem} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest mt-12 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all text-sm">Guardar en Inventario</button>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-bold placeholder:text-slate-800" />
  </div>
);

const SelectGroup = ({ label, options, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer font-bold appearance-none">
      {options.map((o: any) => <option key={o} value={o} className="bg-[#0f0f0f]">{o}</option>)}
    </select>
  </div>
);

export default Inventory;
