
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, RoutineTask, Goal, ChatMessage, Expense, Note, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function getCompressedContext(context: { 
  inventory: InventoryItem[]; 
  routines: RoutineTask[]; 
  goals: Goal[]; 
  expenses: Expense[];
  notes: Note[];
  profile: UserProfile;
}) {
  const inv = context.inventory.slice(0, 30).map(i => `${i.name}(${i.status})`).join("|");
  const rout = context.routines.map(r => `${r.title}(${r.completed ? 'Ok' : 'No'})`).join("|");
  const gls = context.goals.map(g => `${g.title}(${g.progress}%)`).join("|");
  const exp = context.expenses.slice(-10).map(e => `${e.name}($${e.amount})`).join("|");
  const nts = context.notes.slice(-5).map(n => `${n.title}`).join("|");
  const prof = `Name:${context.profile.name}|Mood:${context.profile.mood}|Objs:${context.profile.priorities.join(",")}`;
  
  return `PROFILE:${prof}\nINV:${inv}\nROUT:${rout}\nGOALS:${gls}\nEXP:${exp}\nNOTES:${nts}`;
}

export async function chatWithGemini(
  history: ChatMessage[], 
  message: string, 
  context: { inventory: InventoryItem[]; routines: RoutineTask[]; goals: Goal[]; expenses: Expense[]; notes: Note[]; profile: UserProfile }
) {
  const recentHistory = history.slice(-10);
  const compressedContext = getCompressedContext(context);

  const systemInstruction = `Eres OmniAI, el cerebro de OmniControl.
Contexto del usuario:
${compressedContext}

Instrucciones:
1. Responde de forma concisa y directa.
2. Usa el contexto (incluyendo perfil, prioridades y estado de ánimo) para dar consejos altamente personalizados.
3. Si preguntan por stock, gastos o ideas guardadas en notas, sé preciso.
4. Mantén un tono motivador alineado con los valores del usuario (${context.profile.values.join(", ")}).`;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction, temperature: 0.7 }
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text || "No pude procesar la solicitud.";
  } catch (error: any) {
    console.error("Chat Error:", error);
    return "Error de conexión con la IA.";
  }
}

export async function getSmartSuggestions(context: { inventory: InventoryItem[]; routines: RoutineTask[]; goals: Goal[]; expenses: Expense[]; notes: Note[]; profile: UserProfile }) {
  const compressedContext = getCompressedContext(context);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Genera 4 sugerencias estratégicas basadas en mi vida actual, prioridades y estado de bienestar.',
      config: {
        systemInstruction: `Analiza este contexto: ${compressedContext}. Responde SOLO con un array JSON de 4 objetos {category, title, description}. Enfócate en sus prioridades actuales: ${context.profile.priorities.join(", ")}.`,
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text.trim());
  } catch (e) {
    return [
      { category: 'Organización', title: 'Revisa tu stock', description: 'Tienes items por agotarse.' },
      { category: 'Hábito', title: 'Rutina matutina', description: 'No olvides tu meditación.' }
    ];
  }
}
