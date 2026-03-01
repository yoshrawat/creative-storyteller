"use client";

import { useState, useMemo } from "react";
import BlockText from "./BlockText";
import BlockImage from "./BlockImage";
import BlockAudio from "./BlockAudio";
import BlockVideo from "./BlockVideo";
import BlockSummary from "./BlockSummary";

type Block =
  | { type: "metadata"; style_guide: string }
  | { type: "social_meta"; caption: string; hashtags: string[] }
  | { type: "text"; content: string }
  | { type: "audio"; content: string; audio_base64?: string }
  | { type: "image"; prompt: string; image_base64?: string }
  | { type: "video"; video_prompt: string; video_base64?: string }
  | { type: "summary"; content: string };

interface Scene {
  text?: string;
  audio?: { content: string; audio_base64?: string };
  image?: { prompt: string; image_base64?: string };
  video?: { video_prompt: string; video_base64?: string };
}

export default function StoryRenderer({ blocks }: { blocks: Block[] }) {
  const [currentPage, setCurrentPage] = useState(0);

  // Group blocks into Scenes
  const scenes = useMemo(() => {
    const result: Scene[] = [];
    let currentScene: Scene = {};

    blocks.forEach((block) => {
      if (block.type === "text") {
        if (Object.keys(currentScene).length > 0) {
          result.push(currentScene);
          currentScene = {};
        }
        currentScene.text = block.content;
      } else if (block.type === "audio") {
        currentScene.audio = { content: block.content, audio_base64: block.audio_base64 };
      } else if (block.type === "image") {
        currentScene.image = { prompt: block.prompt, image_base64: block.image_base64 };
      } else if (block.type === "video") {
        currentScene.video = { video_prompt: block.video_prompt, video_base64: block.video_base64 };
      }
    });

    if (Object.keys(currentScene).length > 0) {
      result.push(currentScene);
    }
    return result;
  }, [blocks]);

  const metadata = blocks.find((b) => b.type === "metadata") as { style_guide: string } | undefined;
  const socialMeta = blocks.find((b) => b.type === "social_meta") as { caption: string; hashtags: string[] } | undefined;
  const summary = blocks.find((b) => b.type === "summary") as { content: string } | undefined;

  if (blocks.length === 0) return null;

  // Social Media Mode
  if (socialMeta) {
    const mainScene = scenes[0] || {};
    return (
      <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-4 flex items-center gap-3 border-b border-gray-50">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
            <div className="h-full w-full rounded-full bg-white p-[2px]">
              <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-lg">🎭</div>
            </div>
          </div>
          <span className="font-bold text-sm text-gray-800">Creative_Storyteller</span>
        </div>

        <div className="aspect-square bg-gray-50 flex items-center justify-center">
          {mainScene.image ? (
            <BlockImage prompt={mainScene.image.prompt} image_base64={mainScene.image.image_base64} />
          ) : (
            <div className="animate-pulse flex flex-col items-center gap-2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4 bg-white">
          <div className="flex gap-4 text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-red-500 cursor-pointer transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-blue-500 cursor-pointer transition-colors"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-green-500 cursor-pointer transition-colors"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </div>
          <div className="space-y-2">
            <p className="text-sm leading-snug">
              <span className="font-bold mr-2 text-gray-900">Creative_Storyteller</span>
              <span className="text-gray-700 font-medium">{socialMeta.caption}</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {socialMeta.hashtags.map(tag => (
                <span key={tag} className="text-sm text-blue-600 font-semibold hover:underline cursor-pointer">{tag}</span>
              ))}
            </div>
          </div>
          {mainScene.audio && (
            <div className="pt-2 border-t border-gray-50">
              <BlockAudio content={mainScene.audio.content} audio_base64={mainScene.audio.audio_base64} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Storybook / Marketing / Educational Mode (Paginated)
  const totalPages = scenes.length + (summary ? 1 : 0);
  return (
    <div className="flex flex-col gap-6">
      {metadata && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Creative Director Style Guide
          </p>
          <p className="text-sm text-gray-600 italic">{metadata.style_guide}</p>
        </div>
      )}

      <div className="relative min-h-[500px] flex flex-col items-center">
        {currentPage < scenes.length ? (
          <div className="w-full bg-white border-2 border-amber-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] transition-all duration-500 transform hover:scale-[1.01]">
            <div className="w-full md:w-1/2 bg-amber-50 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-amber-100 p-4">
              {scenes[currentPage].video ? (
                <BlockVideo video_prompt={scenes[currentPage].video!.video_prompt} video_base64={scenes[currentPage].video!.video_base64} />
              ) : scenes[currentPage].image ? (
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
                - Creative Session -
              </div>
            </div>
          </div>
        ) : (
          summary && (
            <div className="w-full max-w-2xl transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
              <BlockSummary content={summary.content} />
            </div>
          )
        )}

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
