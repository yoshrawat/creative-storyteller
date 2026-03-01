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

const FORMATS = ["Storybook", "Social Media", "Marketing", "Educational"];

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
    <main className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm">
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✨ Multimodal AI Agent
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-4">
            Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">Storyteller</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Weave together text, cinematic visuals, and neural voiceovers in a fluid, interactive stream.
          </p>
        </div>

        {/* Main Control Panel (Glassmorphism) */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12 animate-in fade-in zoom-in-95 duration-700 delay-150">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="What's your story about?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="w-full bg-white/80 border-2 border-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium text-slate-700 placeholder-slate-400 shadow-inner"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 min-w-[180px]"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Create
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200/50">
            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Art Style
              </label>
              <div className="relative">
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full appearance-none border-2 border-slate-100 py-3 pl-4 pr-10 rounded-xl bg-white/80 text-sm font-bold text-slate-700 focus:border-purple-400 outline-none cursor-pointer hover:border-slate-200 transition-all shadow-sm"
                >
                  {STYLES.map(style => (
                    <option key={style.label} value={style.label}>
                      {style.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Output Format
              </label>
              <div className="relative">
                <select 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full appearance-none border-2 border-slate-100 py-3 pl-4 pr-10 rounded-xl bg-white/80 text-sm font-bold text-slate-700 focus:border-blue-400 outline-none cursor-pointer hover:border-slate-200 transition-all shadow-sm"
                >
                  {FORMATS.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <StoryRenderer blocks={blocks.filter(b => b !== null)} />
        </div>
        
      </div>
    </main>
  );
}
