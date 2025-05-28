import { NextResponse } from 'next/server';

// Basit Hacker News API örneği (Google News API anahtar gerektiriyor, HN ücretsiz)
const HN_API = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM = 'https://hacker-news.firebaseio.com/v0/item/';

async function fetchHackerNews(limit = 10) {
  const idsRes = await fetch(HN_API);
  const ids = await idsRes.json();
  const topIds = ids.slice(0, limit);
  const items = await Promise.all(
    topIds.map(async (id: any) => {
      const res = await fetch(`${HN_ITEM}${id}.json`);
      return res.json();
    })
  );
  return items;
}

// Basit özetleme ve etiketleme (dummy, LLM ile geliştirilecek)
function summarizeAndTag(item: { title: any; }) {
  return {
    ...item,
    summary: item.title,
    tags: ['AI', 'Tech'],
  };
}

// OpenAI özetleme fonksiyonu
async function summarizeAndTagWithLLM(item: { title: string; url?: string; }) {
  // OpenAI API anahtarınızı .env dosyasına OPENAI_API_KEY olarak ekleyin
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Anahtar yoksa dummy özetle dön
    return summarizeAndTag(item);
  }
  const prompt = `Bir haber başlığını özetle ve 2-3 anahtar kelimeyle etiketle:
Başlık: ${item.title}
URL: ${item.url || ''}
Yanıt formatı: {\"summary\": \"...\", \"tags\": [\"etiket1\", \"etiket2\"]}`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
      temperature: 0.5,
    }),
  });
  const data = await res.json();
  try {
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return { ...item, summary: parsed.summary, tags: parsed.tags };
  } catch {
    return summarizeAndTag(item);
  }
}

export async function GET(request: { url: string | URL; }) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const items = await fetchHackerNews(limit);
  // LLM ile özetleme ve etiketleme
  const processed = await Promise.all(items.map(summarizeAndTagWithLLM));
  return NextResponse.json({ articles: processed });
}
