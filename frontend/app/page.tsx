"use client";

import { useState } from "react";
import { fetchStoryStream } from "@/lib/api";
import StoryRenderer from "@/components/StoryRenderer";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setBlocks([]); // Reset previous story

    try {
      const stream = fetchStoryStream(topic);
      for await (const chunk of stream) {
        const { index, block } = chunk;
        setBlocks((prev) => {
          const newBlocks = [...prev];
          // Ensure we have enough slots in the array
          while (newBlocks.length <= index) {
            newBlocks.push(null);
          }
          newBlocks[index] = block;
          return newBlocks.filter(b => b !== null);
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

        <div className="flex gap-2 mb-6">
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
            className="bg-blue-600 text-white px-4 rounded-lg disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <StoryRenderer blocks={blocks} />
      </div>
    </main>
  );
}
