"use client";

import { useState } from "react";
import { fetchStoryStream } from "@/lib/api";
import StoryRenderer from "@/components/StoryRenderer";

const STYLES = [
  { label: "Pixar", value: "3D digital art, Pixar animation style, highly detailed, expressive characters" },
  { label: "Anime", value: "Anime style, vibrant colors, detailed line work, Studio Ghibli inspired" },
  { label: "Realistic", value: "Realistic cinematic style, high resolution, detailed textures, natural lighting" },
  { label: "Watercolor", value: "Watercolor painting, soft edges, pastel colors, artistic textures" },
  { label: "Cyberpunk", value: "Cyberpunk aesthetic, neon lights, high-tech, futuristic, rainy urban setting" }
];

const FORMATS = ["Storybook", "Social Media"];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].label);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setBlocks([]); // Reset previous story

    const styleValue = STYLES.find(s => s.label === selectedStyle)?.value || "";

    try {
      const stream = fetchStoryStream(topic, styleValue, selectedFormat);
      for await (const chunk of stream) {
        const { index, block } = chunk;
        setBlocks((prev) => {
          const newBlocks = [...prev];
          while (newBlocks.length <= index) {
            newBlocks.push(null);
          }
          newBlocks[index] = block;
          return [...newBlocks]; 
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error generating story");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            🎬 <span className="text-blue-600">Creative</span> Storyteller
          </h1>
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="What's your story about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl disabled:bg-gray-400 font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : "Generate"}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Art Style</label>
              <select 
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="border-2 border-gray-200 p-3 rounded-xl bg-white text-sm font-semibold focus:border-blue-500 outline-none cursor-pointer hover:border-gray-300 transition-all"
              >
                {STYLES.map(style => (
                  <option key={style.label} value={style.label}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Format</label>
              <select 
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="border-2 border-gray-200 p-3 rounded-xl bg-white text-sm font-semibold focus:border-blue-500 outline-none cursor-pointer hover:border-gray-300 transition-all"
              >
                {FORMATS.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <StoryRenderer blocks={blocks.filter(b => b !== null)} />
      </div>
      
      <p className="text-center mt-8 text-gray-400 text-sm font-medium">
        Powered by <span className="text-blue-500">Google Gemini & Imagen 3</span>
      </p>
    </main>
  );
}
