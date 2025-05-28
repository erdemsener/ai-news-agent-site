'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Article = {
  id: number;
  url?: string;
  title: string;
  summary: string;
  tags?: string[];
  time?: number;
  by?: string;
  score?: number;
};

const placeholderImages = [
  '/globe.svg',
  '/window.svg',
  '/file.svg',
  '/vercel.svg',
  '/next.svg',
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-hackernews?limit=12')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] text-gray-900 p-0">
      <div className="max-w-7xl mx-auto py-12 px-2 md:px-8">
        <h1 className="text-5xl font-extrabold mb-4 text-center tracking-tight text-cyan-700 drop-shadow-lg">
          📰 AI News Agent
        </h1>
        <p className="text-xl mb-10 text-center text-cyan-900/80">
          En güncel AI ve teknoloji haberleri, özetlenmiş ve etiketlenmiş şekilde.
        </p>
        <div className="flex justify-center mb-12">
          <Link
            href="/llm"
            className="bg-gradient-to-r from-cyan-400 to-emerald-300 hover:from-cyan-500 hover:to-emerald-400 transition px-8 py-4 rounded-2xl font-bold shadow-xl text-gray-900 text-xl animate-bounce border-2 border-cyan-200 hover:border-emerald-300"
          >
            🤖 Kişisel LLM Önerisi Al
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-cyan-700 text-lg">Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((a, i) => (
              <div
                key={a.id}
                className="group bg-white/90 rounded-3xl p-0 shadow-xl hover:scale-[1.03] hover:bg-emerald-50 transition-all border border-cyan-100 hover:border-emerald-200 flex flex-col overflow-hidden relative min-h-[420px]"
              >
                <div className="relative w-full h-44 bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center">
                  <Image
                    src={placeholderImages[i % placeholderImages.length]}
                    alt="Haber görseli"
                    fill
                    className="object-contain p-8 opacity-90 group-hover:scale-105 transition"
                  />
                </div>
                <div className="flex flex-wrap gap-2 px-6 pt-4">
                  {a.tags?.map((tag) => (
                    <span key={tag} className="text-xs bg-emerald-200/90 px-3 py-1 rounded-full text-cyan-900 font-bold uppercase tracking-wide shadow">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="px-6 pt-2 pb-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold group-hover:underline mb-2 text-cyan-900 line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="text-gray-700 text-base mb-4 line-clamp-3">
                    {a.summary}
                  </p>
                  <div className="flex items-center gap-3 mt-auto text-xs text-cyan-700">
                    <span>{a.by ? `by ${a.by}` : 'Kaynak: HN'}</span>
                    <span className="ml-auto">{a.score ? `${a.score} puan` : ''}</span>
                    <span>{a.time ? new Date(a.time * 1000).toLocaleDateString() : ''}</span>
                  </div>
                  <a
                    href={a.url || `https://news.ycombinator.com/item?id=${a.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full bg-gradient-to-r from-cyan-400 to-emerald-300 hover:from-cyan-500 hover:to-emerald-400 text-gray-900 font-bold py-2 rounded-xl shadow-lg text-center transition"
                  >
                    Habere Git
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
