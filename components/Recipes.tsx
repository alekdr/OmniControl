
import React, { useState } from 'react';
// Added Camera to the import list to fix the "Cannot find name 'Camera'" error.
import { UtensilsCrossed, Clock, Check, Plus, Trash2, X, Edit3, Image as ImageIcon, ChefHat, Flame, Camera } from 'lucide-react';
import { Recipe, InventoryItem } from '../types';

interface Props {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  inventory: InventoryItem[];
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const Recipes: React.FC<Props> = ({ recipes, setRecipes, inventory, categories, setCategories }) => {
  const [filter, setFilter] = useState('Todos');
  const [modalState, setModalState] = useState<{ show: boolean, recipe: Partial<Recipe> | null }>({ show: false, recipe: null });
  const [ingInput, setIngInput] = useState('');

  const openAdd = () => setModalState({ show: true, recipe: { category: categories[0], difficulty: 'Fácil', prepTime: 20, ingredients: [] } });
  const openEdit = (recipe: Recipe) => setModalState({ show: true, recipe });

  const saveRecipe = () => {
    const { recipe } = modalState;
    if (!recipe?.title) return;
    if (recipe.id) {
      setRecipes(recipes.map(r => r.id === recipe.id ? (recipe as Recipe) : r));
    } else {
      const newRecipe: Recipe = { ...recipe, id: Math.random().toString(36).substr(2, 9) } as Recipe;
      setRecipes([...recipes, newRecipe]);
    }
    setModalState({ show: false, recipe: null });
  };

  const checkIngredients = (ingredients: string[]) => {
    return ingredients.every(ing => inventory.some(item => item.name.toLowerCase().includes(ing.toLowerCase())));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalState(prev => ({ ...prev, recipe: { ...prev.recipe!, image: reader.result as string } }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    if (ingInput.trim()) {
      setModalState(s => ({ ...s, recipe: { ...s.recipe!, ingredients: [...(s.recipe!.ingredients || []), ingInput.trim()] } }));
      setIngInput('');
    }
  };

  const removeIngredient = (idx: number) => {
    setModalState(s => ({ ...s, recipe: { ...s.recipe!, ingredients: s.recipe!.ingredients?.filter((_, i) => i !== idx) } }));
  };

  const addCategory = () => {
    const name = prompt("Nombre de la nueva categoría culinaria:");
    if (name && !categories.includes(name)) setCategories([...categories, name]);
  };

  const deleteCategory = (cat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar categoría de cocina "${cat}"? Las recetas se moverán a "Varios".`)) {
      setCategories(categories.filter(c => c !== cat));
      setRecipes(recipes.map(r => r.category === cat ? { ...r, category: 'Varios' } : r));
      if (filter === cat) setFilter('Todos');
    }
  };

  const filtered = filter === 'Todos' ? recipes : recipes.filter(r => r.category === filter);

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/[0.02] p-4 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 no-scrollbar px-2">
          <button 
            onClick={() => setFilter('Todos')} 
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'Todos' ? 'bg-orange-600 text-white shadow-xl shadow-orange-500/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
          >
            Todas
          </button>
          {categories.map(cat => (
            <div key={cat} className="relative group flex-shrink-0">
              <button 
                onClick={() => setFilter(cat)} 
                className={`px-6 py-3 pr-10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-orange-600 text-white shadow-xl shadow-orange-500/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
              >
                {cat}
              </button>
              {cat !== 'Varios' && (
                <button 
                  onClick={(e) => deleteCategory(cat, e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button onClick={addCategory} className="flex-shrink-0 p-3 bg-white/5 border border-dashed border-white/20 rounded-2xl text-slate-500 hover:text-orange-400 transition-all">
            <Plus size={18} />
          </button>
        </div>
        <button onClick={openAdd} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-500/30 transition-all hover:scale-[1.02] whitespace-nowrap">
          <ChefHat size={18} /> Crear Receta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(recipe => {
          const hasIngredients = checkIngredients(recipe.ingredients);
          return (
            <div key={recipe.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-orange-500/40 transition-all duration-500 shadow-xl flex flex-col">
              <div className="h-60 bg-slate-900 relative overflow-hidden">
                {recipe.image ? (
                  <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-800"><ImageIcon size={64} /></div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => openEdit(recipe)} className="p-4 bg-white/10 backdrop-blur-md rounded-[1.5rem] text-white hover:bg-orange-600 transition-all shadow-2xl"><Edit3 size={20} /></button>
                  <button onClick={() => setRecipes(recipes.filter(r => r.id !== recipe.id))} className="p-4 bg-rose-500/20 backdrop-blur-md rounded-[1.5rem] text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-2xl"><Trash2 size={20} /></button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">{recipe.category}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg ${recipe.difficulty === 'Fácil' ? 'bg-emerald-600' : recipe.difficulty === 'Medio' ? 'bg-orange-600' : 'bg-rose-600'}`}>{recipe.difficulty}</span>
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:text-orange-400 transition-colors">{recipe.title}</h3>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 pb-6 border-b border-white/5">
                   <span className="flex items-center gap-2"><Clock size={16} className="text-orange-400" /> {recipe.prepTime} MIN</span>
                   <span className={`flex items-center gap-2 ${hasIngredients ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {hasIngredients ? <Check size={16} /> : <X size={16} />}
                      {hasIngredients ? 'LISTO' : 'FALTAN INGS'}
                   </span>
                </div>
                <div className="space-y-3 mb-10 flex-1">
                  {recipe.ingredients.slice(0, 5).map((ing, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold">
                       <span className="text-slate-400 flex items-center gap-2"><Flame size={12} className="text-orange-500/50" /> {ing}</span>
                       {inventory.some(item => item.name.toLowerCase().includes(ing.toLowerCase())) ? <Check size={14} className="text-emerald-500" /> : <X size={14} className="text-rose-600" />}
                    </div>
                  ))}
                  {recipe.ingredients.length > 5 && <p className="text-[10px] text-slate-600 font-black uppercase italic">+ {recipe.ingredients.length - 5} ingredientes más</p>}
                </div>
                <button 
                  className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all shadow-2xl active:scale-95 ${
                    hasIngredients ? 'bg-orange-600 text-white shadow-orange-600/30 hover:bg-orange-700' : 'bg-white/5 text-slate-600 border border-white/10'
                  }`}
                  onClick={() => hasIngredients ? alert("¡A cocinar!") : openEdit(recipe)}
                >
                  {hasIngredients ? 'Empezar Preparación' : 'Editar Ingredientes'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-3xl p-12 relative shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setModalState({ show: false, recipe: null })} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-4xl font-black tracking-tighter mb-10">{modalState.recipe?.id ? 'Editar Receta' : 'Nueva Receta'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-8">
                 <div className="aspect-[4/3] bg-white/[0.03] rounded-[2rem] overflow-hidden border border-white/5 relative group shadow-inner">
                    {modalState.recipe?.image ? (
                      <img src={modalState.recipe.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-800">
                        <Camera size={48} className="mb-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Foto del Plato</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                       <span className="text-xs font-black uppercase tracking-widest">Subir Imagen</span>
                       <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                 </div>
                 <InputGroup label="Título de la Receta" value={modalState.recipe?.title || ''} onChange={(v:any) => setModalState(s => ({...s, recipe: {...s.recipe!, title: v}}))} />
                 <div className="grid grid-cols-2 gap-4">
                    <SelectGroup label="Categoría" options={categories} value={modalState.recipe?.category || ''} onChange={(v:any) => setModalState(s => ({...s, recipe: {...s.recipe!, category: v}}))} />
                    <InputGroup label="Tiempo (Min)" type="number" value={modalState.recipe?.prepTime || 20} onChange={(v:any) => setModalState(s => ({...s, recipe: {...s.recipe!, prepTime: Number(v)}}))} />
                 </div>
               </div>

               <div className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">Ingredientes Necesarios</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={ingInput} 
                         onChange={e => setIngInput(e.target.value)} 
                         onKeyDown={e => e.key === 'Enter' && addIngredient()} 
                         placeholder="Ej: Salmón, Arroz..." 
                         className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-bold" 
                       />
                       <button onClick={addIngredient} className="bg-orange-600/10 text-orange-400 p-4 rounded-2xl hover:bg-orange-600 hover:text-white transition-all"><Plus size={20} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 no-scrollbar">
                       {modalState.recipe?.ingredients?.map((ing, i) => (
                         <span key={i} className="bg-white/5 text-[10px] font-black uppercase py-2.5 px-4 rounded-xl border border-white/10 flex items-center gap-3 transition-all hover:bg-white/10">
                            {ing} <button onClick={() => removeIngredient(i)} className="text-slate-600 hover:text-rose-500"><X size={14} /></button>
                         </span>
                       ))}
                       {modalState.recipe?.ingredients?.length === 0 && <p className="text-[10px] text-slate-700 italic font-medium">Añade al menos un ingrediente...</p>}
                    </div>
                 </div>
                 <SelectGroup label="Nivel de Dificultad" options={['Fácil', 'Medio', 'Difícil']} value={modalState.recipe?.difficulty || ''} onChange={(v:any) => setModalState(s => ({...s, recipe: {...s.recipe!, difficulty: v as any}}))} />
                 <button onClick={saveRecipe} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-orange-600/20 active:scale-95 transition-all text-sm mt-10">Guardar Receta</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-bold" />
  </div>
);

const SelectGroup = ({ label, options, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-600 ml-1 tracking-widest">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer font-bold appearance-none">
      {options.map((o: any) => <option key={o} value={o} className="bg-[#0f0f0f]">{o}</option>)}
    </select>
  </div>
);

export default Recipes;
