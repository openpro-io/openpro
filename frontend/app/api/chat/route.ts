import ai from '@/services/ai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { GPT_ENGINE } from '@/services/config';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = await ai.chat.completions.create({
    model: GPT_ENGINE ?? 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    max_tokens: 1024,
    stream: true,
  });

  const stream = OpenAIStream(result);

  return new StreamingTextResponse(stream);
}
