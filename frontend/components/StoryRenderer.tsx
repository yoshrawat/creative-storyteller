"use client";

import { useState, useMemo } from "react";
import BlockText from "./BlockText";
import BlockImage from "./BlockImage";
import BlockAudio from "./BlockAudio";
import BlockSummary from "./BlockSummary";

type Block =
  | { type: "metadata"; style_guide: string }
  | { type: "text"; content: string }
  | { type: "audio"; content: string; audio_base64?: string }
  | { type: "image"; prompt: string; image_base64?: string }
  | { type: "summary"; content: string };

interface Scene {
  text?: string;
  audio?: { content: string; audio_base64?: string };
  image?: { prompt: string; image_base64?: string };
}

export default function StoryRenderer({ blocks }: { blocks: Block[] }) {
  const [currentPage, setCurrentPage] = useState(0);

  // Group blocks into Scenes (Text + Audio + Image)
  const scenes = useMemo(() => {
    const result: Scene[] = [];
    let currentScene: Scene = {};

    blocks.forEach((block) => {
      if (block.type === "text") {
        if (currentScene.text) {
          result.push(currentScene);
          currentScene = {};
        }
        currentScene.text = block.content;
      } else if (block.type === "audio") {
        currentScene.audio = { content: block.content, audio_base64: block.audio_base64 };
      } else if (block.type === "image") {
        currentScene.image = { prompt: block.prompt, image_base64: block.image_base64 };
      }
    });

    if (Object.keys(currentScene).length > 0) {
      result.push(currentScene);
    }
    return result;
  }, [blocks]);

  const metadata = blocks.find((b) => b.type === "metadata") as { style_guide: string } | undefined;
  const summary = blocks.find((b) => b.type === "summary") as { content: string } | undefined;

  if (blocks.length === 0) return null;

  const totalPages = scenes.length + (summary ? 1 : 0);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header / Metadata */}
      {metadata && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Character Style Guide
          </p>
          <p className="text-sm text-gray-600 italic">{metadata.style_guide}</p>
        </div>
      )}

      {/* 2. Interactive Book Container */}
      <div className="relative min-h-[500px] flex flex-col items-center">
        {currentPage < scenes.length ? (
          <div className="w-full bg-white border-2 border-amber-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] transition-all duration-500 transform hover:scale-[1.01]">
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-amber-50 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-amber-100">
              {scenes[currentPage].image ? (
                <BlockImage
                  prompt={scenes[currentPage].image!.prompt}
                  image_base64={scenes[currentPage].image!.image_base64}
                />
              ) : (
                <div className="animate-pulse text-amber-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Page {currentPage + 1}</span>
                  <div className="h-1 w-12 bg-amber-200 rounded-full" />
                </div>
                
                {scenes[currentPage].text && (
                  <div className="prose prose-amber">
                    <p className="text-xl leading-relaxed text-gray-800 font-serif italic">
                      {scenes[currentPage].text}
                    </p>
                  </div>
                )}
                
                {scenes[currentPage].audio && (
                  <BlockAudio
                    content={scenes[currentPage].audio!.content}
                    audio_base64={scenes[currentPage].audio!.audio_base64}
                  />
                )}
              </div>

              <div className="mt-8 flex justify-center text-xs text-amber-300 font-medium italic">
                - The End of the Scene -
              </div>
            </div>
          </div>
        ) : (
          /* Summary Page */
          summary && (
            <div className="w-full max-w-2xl transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
              <BlockSummary content={summary.content} />
            </div>
          )
        )}

        {/* 3. Navigation Controls */}
        <div className="mt-8 flex items-center gap-6">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-3 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === currentPage ? "bg-blue-600 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-3 rounded-full bg-blue-600 shadow-lg text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
