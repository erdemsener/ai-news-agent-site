import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      title: "OpenAI introduces GPT-4o with multimodal capabilities",
      url: "https://openai.com/index/gpt-4o",
      summary: "The new model processes text, audio, and vision inputs, offering faster and more affordable performance."
    },
    {
      title: "Anthropic releases Claude 3, a powerful new LLM",
      url: "https://www.anthropic.com/news/claude-3",
      summary: "Claude 3 brings improved reasoning and a larger context window for better user experience."
    },
    {
      title: "Google announces Gemini Pro for advanced AI apps",
      url: "https://blog.google/technology/ai/gemini-1-5/",
      summary: "Gemini Pro offers strong performance in multilingual and coding tasks, pushing AI boundaries further."
    }
  ]);
}
