'use client';

import React, { useState } from 'react';

type ModelSWOT = {
  name: string;
  strengths: string[];
  weaknesses: string[];
};

const models: ModelSWOT[] = [
  {
    name: 'GPT-4o',
    strengths: [
      'Multimodal (text, image, audio input)',
      'Fast and cost-efficient',
      'Strong reasoning & creativity',
    ],
    weaknesses: [
      'Requires OpenAI API or ChatGPT+',
      'Limited control over output formatting',
    ],
  },
  {
    name: 'Claude 3',
    strengths: [
      'Extremely long context (100K+ tokens)',
      'Great summarization and memory',
      'Very safe, alignment-focused',
    ],
    weaknesses: [
      'Limited availability outside US/UK',
      'Less creative than GPT in storytelling',
    ],
  },
  {
    name: 'Gemini',
    strengths: [
      'Good integration with Google services',
      'Strong on factual Q&A and search',
      'Competitive free access in Bard',
    ],
    weaknesses: [
      'Inferior coding and reasoning',
      'Interface less flexible',
    ],
  },
  {
    name: 'Mistral',
    strengths: [
      'Open-source, customizable',
      'Lightweight and fast on edge devices',
    ],
    weaknesses: [
      'Smaller context window',
      'Weaker in general-purpose reasoning',
    ],
  },
];

const FormLLMRecommender = ({
  onSelect,
}: {
  onSelect: (modelName: string) => void;
}) => {
  const [form, setForm] = useState({
    purpose: '',
    longDocs: '',
    free: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.purpose === 'coding') {
      onSelect('GPT-4o');
    } else if (form.longDocs === 'yes') {
      onSelect('Claude 3');
    } else if (form.free === 'yes') {
      onSelect('Gemini');
    } else {
      onSelect('GPT-4o');
    }
  };

  return (
    <div className="my-12 bg-white/80 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🔍 Which LLM Fits You?
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            What’s your main purpose?
          </label>
          <select
            className="w-full border p-2 rounded-md shadow-sm"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            required
          >
            <option value="">-- Select --</option>
            <option value="coding">Coding</option>
            <option value="writing">Content Writing</option>
            <option value="chat">Customer Chat / Helpdesk</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Do you work with long documents?
          </label>
          <select
            className="w-full border p-2 rounded-md shadow-sm"
            value={form.longDocs}
            onChange={(e) => setForm({ ...form, longDocs: e.target.value })}
            required
          >
            <option value="">-- Select --</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Do you prefer free access?
          </label>
          <select
            className="w-full border p-2 rounded-md shadow-sm"
            value={form.free}
            onChange={(e) => setForm({ ...form, free: e.target.value })}
            required
          >
            <option value="">-- Select --</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Suggest LLM
        </button>
      </form>
    </div>
  );
};

export default function LLMPage() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const selected = models.find((m) => m.name === selectedModel);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e0f2fe] to-[#f8fafc] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center text-blue-800 tracking-tight drop-shadow-lg">
          🤖 LLM Comparator
        </h1>
        <p className="text-center text-blue-700 mb-14 text-xl">
          Kişisel ihtiyaçlarına göre en iyi dil modelini bul!
        </p>

        <FormLLMRecommender onSelect={setSelectedModel} />

        {selected && (
          <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-blue-200 transition duration-300 max-w-3xl mx-auto mt-12 border-2 border-blue-100">
            <h2 className="text-3xl font-bold mb-4 text-blue-700 text-center">
              {selected.name}
            </h2>
            <div>
              <strong className="block text-green-700 mb-1">Strengths:</strong>
              <ul className="list-disc list-inside text-green-900">
                {selected.strengths.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <strong className="block text-red-700 mb-1">Weaknesses:</strong>
              <ul className="list-disc list-inside text-red-900">
                {selected.weaknesses.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
