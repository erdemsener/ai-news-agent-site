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

// Gemini API ile özetleme fonksiyonu
async function summarizeWithGemini(title: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyA17G1j7TaA1EoSf4EjmdP8zuhhFlcNt8g";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const prompt = `Aşağıdaki haber başlığını 1-2 cümlede özetle:
${title}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = await res.json();
  try {
    return data.candidates?.[0]?.content?.parts?.[0]?.text || title;
  } catch {
    return title;
  }
}

// Basit anahtar kelime çıkarıcı (etiket)
function extractTags(title: string): string[] {
  return title
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter((w) => w.length > 3)
    .slice(0, 3)
    .map((w) => w.toUpperCase());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const items = await fetchHackerNews(limit);
  // Gemini ile özetleme ve anahtar kelime çıkarma
  const processed = await Promise.all(
    items.map(async (item) => {
      const summary = await summarizeWithGemini(item.title);
      const tags = extractTags(item.title);
      return { ...item, summary, tags };
    })
  );
  return NextResponse.json({ articles: processed });
}
