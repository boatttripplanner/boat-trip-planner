import { NextRequest, NextResponse } from 'next/server';

export type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json();
  const lastUserMsg = (messages as Message[])
    ?.filter((m) => m.sender === 'user')
    .pop()?.text || '';
  // Simulación de respuesta IA
  const aiResponse = `Simulación IA: Recibido "${lastUserMsg}"\n\nContexto actual: ${context ? JSON.stringify(context) : 'sin contexto'}`;
  return NextResponse.json({ reply: aiResponse });
} 