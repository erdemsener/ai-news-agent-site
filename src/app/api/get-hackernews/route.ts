import { NextResponse, NextRequest } from 'next/server';

// Basit Hacker News API örneği (Google News API anahtar gerektiriyor, HN ücretsiz)
const HN_API = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM = 'https://hacker-news.firebaseio.com/v0/item/';

type HackerNewsItem = {
  id: number;
  title: string;
  url?: string;
  by?: string;
  score?: number;
  time?: number;
  type?: string;
  descendants?: number;
  // Diğer alanlar eklenebilir
};

async function fetchHackerNews(limit = 10): Promise<HackerNewsItem[]> {
  const idsRes = await fetch(HN_API);
  const ids: number[] = await idsRes.json();
  const topIds = ids.slice(0, limit);
  const items = await Promise.all(
    topIds.map(async (id: number) => {
      const res = await fetch(`${HN_ITEM}${id}.json`);
      return res.json() as Promise<HackerNewsItem>;
    })
  );
  return items;
}

// Basit özetleme ve etiketleme (dummy, LLM ile geliştirilecek)
function summarizeAndTag(item: HackerNewsItem) {
  return {
    ...item,
    summary: item.title,
    tags: ['AI', 'Tech'],
  };
}

// OpenAI özetleme fonksiyonu
async function summarizeAndTagWithLLM(item: HackerNewsItem) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Anahtar yoksa dummy özetle dön
    return summarizeAndTag(item);
  }
  const prompt = `Bir haber başlığını özetle ve 2-3 anahtar kelimeyle etiketle:\nBaşlık: ${item.title}\nURL: ${item.url || ''}\nYanıt formatı: {\"summary\": \"...\", \"tags\": [\"etiket1\", \"etiket2\"]}`;
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const items = await fetchHackerNews(limit);
  // LLM ile özetleme ve etiketleme
  const processed = await Promise.all(items.map(summarizeAndTagWithLLM));
  return NextResponse.json({ articles: processed });
}
