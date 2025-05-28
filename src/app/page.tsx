'use client';

import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  url: string;
  summary: string;
};

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/get-latest-news')
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        🧠 Latest AI News
      </h1>
      <ul className="space-y-6">
        {news.map((item, idx) => (
          <li key={idx} className="border-b pb-4">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {item.title}
            </a>
            <p className="text-gray-700">{item.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
