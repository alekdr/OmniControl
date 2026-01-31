
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  ROUTINE = 'ROUTINE',
  PLAN = 'PLAN',
  GOALS = 'GOALS',
  RECIPES = 'RECIPES',
  CHAT = 'CHAT',
  EXPENSES = 'EXPENSES',
  NOTES = 'NOTES',
  PROFILE = 'PROFILE'
}

export type ItemStatus = 'Nuevo' | 'Usado' | 'Desgastado' | 'Agotándose';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  status: ItemStatus;
  useFrequency: 'Diario' | 'Semanal' | 'Mensual' | 'Raro';
  lastUsed: string;
  quantity: number;
  image?: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  completed: boolean;
  timeEstimate: number;
  category: 'Mañana' | 'Tarde' | 'Noche';
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  type: 'Corto Plazo' | 'Mediano Plazo' | 'Largo Plazo';
  active: boolean;
  completed: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  prepTime: number;
  ingredients: string[];
  image?: string;
}

export interface PlanEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'Evento' | 'Nota' | 'Recordatorio';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: string;
}

export type ExpenseType = 'Necesario' | 'Gusto' | 'Impulsivo';
export type PaymentMethod = 'Efectivo' | 'Transferencia';

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: ExpenseType;
  method: PaymentMethod;
  relatedId?: string;
}

export type NoteCategory = 'Mentales' | 'Prácticas' | 'Conocimiento' | 'Creativas';
export type MentalState = 'Idea' | 'Plan' | 'Pensamiento' | 'Proyecto' | 'Recordatorio';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  mentalState: MentalState;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  relatedId?: string;
  image?: string;
}

export interface UserProfile {
  name: string;
  nickname: string;
  age: string;
  country: string;
  language: string;
  joinedDate: string;
  avatar?: string;
  bio: string;
  values: string[];
  priorities: string[];
  mainObjective: string;
  mood: string;
  energyLevel: number;
  motivationLevel: number;
  theme: 'dark' | 'light' | 'minimal';
  accentColor: string;
  notificationSettings: {
    routines: boolean;
    goals: boolean;
    expenses: boolean;
    inventory: boolean;
  };
}
