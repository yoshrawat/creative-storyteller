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

export default function Home() {
  const [topic, setTopic] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].label);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setBlocks([]); // Reset previous story

    const styleValue = STYLES.find(s => s.label === selectedStyle)?.value || "";

    try {
      const stream = fetchStoryStream(topic, styleValue);
      for await (const chunk of stream) {
        const { index, block } = chunk;
        setBlocks((prev) => {
          const newBlocks = [...prev];
          // Ensure we have enough slots in the array
          while (newBlocks.length <= index) {
            newBlocks.push(null);
          }
          newBlocks[index] = block;
          // Filter out nulls but keep empty indexes if necessary
          // Actually, NDJSON might return blocks in any order
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
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">
          🎬 Creative Storyteller
        </h1>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter story topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 border p-2 rounded-lg"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 text-white px-6 rounded-lg disabled:bg-gray-400 font-semibold"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Art Style:</label>
            <select 
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="border p-2 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {STYLES.map(style => (
                <option key={style.label} value={style.label}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <StoryRenderer blocks={blocks.filter(b => b !== null)} />
      </div>
    </main>
  );
}
