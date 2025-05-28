'use client';

import Link from 'next/link';
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-0">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center tracking-tight">
          📰 AI News Agent
        </h1>
        <p className="text-lg mb-8 text-center text-gray-300">
          En güncel AI ve teknoloji haberleri, özetlenmiş ve etiketlenmiş şekilde.
        </p>
        <div className="flex justify-center mb-8">
          <Link
            href="/llm"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold shadow-lg text-white text-lg animate-pulse"
          >
            🤖 LLM Karşılaştırıcıyı Dene
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-400">Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((a) => (
              <a
                key={a.id}
                href={a.url || `https://news.ycombinator.com/item?id=${a.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800/80 rounded-xl p-5 shadow-lg hover:scale-[1.03] hover:bg-blue-900/80 transition-all border border-gray-700 hover:border-blue-500 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-700/80 px-2 py-1 rounded text-white font-bold uppercase tracking-wide">
                    {a.tags?.join(', ')}
                  </span>
                  <span className="ml-auto text-xs text-gray-400">
                    {a.time
                      ? new Date(a.time * 1000).toLocaleDateString()
                      : ''}
                  </span>
                </div>
                <h2 className="text-xl font-semibold group-hover:underline mb-1">
                  {a.title}
                </h2>
                <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                  {a.summary}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <span className="text-xs text-gray-400">by {a.by}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {a.score} puan
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
