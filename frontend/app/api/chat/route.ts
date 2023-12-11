import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OPENAI_API_KEY, GPT_ENGINE } from '@/services/config';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (OPENAI_API_KEY) {
    const openai = new OpenAI();
    const result = await openai.chat.completions.create({
      model: GPT_ENGINE ?? 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const stream = OpenAIStream(result);

    return new StreamingTextResponse(stream);
  }

  return new Response('No OpenAI API key found', { status: 200 });
}
