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
        if (currentScene.text) {
          result.push({ ...currentScene });
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
      <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-5 flex items-center gap-3 border-b border-slate-50">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
            <div className="h-full w-full rounded-full bg-white p-[2px]">
              <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-lg">🎭</div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-900 leading-tight">Creative_Director</span>
            <span className="text-[10px] text-slate-400 font-medium">AI Generated Content</span>
          </div>
        </div>

        <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
          {mainScene.image || mainScene.video ? (
            mainScene.video ? (
              <BlockVideo video_prompt={mainScene.video.video_prompt} video_base64={mainScene.video.video_base64} />
            ) : (
              <BlockImage prompt={mainScene.image!.prompt} image_base64={mainScene.image!.image_base64} />
            )
          ) : (
            <div className="animate-pulse flex flex-col items-center gap-3 text-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <p className="text-xs font-bold uppercase tracking-widest">Rendering Media</p>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-red-500 cursor-pointer transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-blue-500 cursor-pointer transition-colors"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-green-500 cursor-pointer transition-colors"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-slate-900 cursor-pointer transition-colors"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>

          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-slate-800">
              <span className="font-bold mr-2 text-slate-900">Creative_Director</span>
              {socialMeta.caption}
            </p>
            <div className="flex flex-wrap gap-2">
              {socialMeta.hashtags.map(tag => (
                <span key={tag} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">{tag}</span>
              ))}
            </div>
          </div>

          {mainScene.audio && (
            <div className="pt-4 border-t border-slate-50">
              <BlockAudio content={mainScene.audio.content} audio_base64={mainScene.audio.audio_base64} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Storybook / Marketing / Educational
  const totalPages = scenes.length + (summary ? 1 : 0);
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {metadata && (
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 p-5 rounded-3xl shadow-sm animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Creative Style Guide</p>
          </div>
          <p className="text-sm text-slate-600 font-medium italic leading-relaxed">"{metadata.style_guide}"</p>
        </div>
      )}

      <div className="relative min-h-[600px] flex flex-col items-center">
        {currentPage < scenes.length ? (
          <div className="w-full bg-white border border-slate-100 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[600px] transition-all duration-500 group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
            {/* Visual Side */}
            <div className="w-full md:w-1/2 bg-slate-50 relative flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-100">
              {scenes[currentPage].video || scenes[currentPage].image ? (
                scenes[currentPage].video ? (
                  <BlockVideo video_prompt={scenes[currentPage].video!.video_prompt} video_base64={scenes[currentPage].video!.video_base64} />
                ) : (
                  <BlockImage
                    prompt={scenes[currentPage].image!.prompt}
                    image_base64={scenes[currentPage].image!.image_base64}
                  />
                )
              ) : (
                <div className="animate-pulse text-slate-200 flex flex-col items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <p className="text-xs font-black uppercase tracking-widest">Generating Content</p>
                </div>
              )}
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white relative">
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Scene</span>
                    <span className="text-3xl font-serif text-slate-900 font-bold">Page {currentPage + 1}</span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300">
                    {String(currentPage + 1).padStart(2, '0')}
                  </div>
                </div>
                
                {scenes[currentPage].text && (
                  <div className="prose prose-slate prose-lg max-w-none">
                    <p className="text-xl leading-relaxed text-slate-700 font-serif italic selection:bg-yellow-100">
                      {scenes[currentPage].text}
                    </p>
                  </div>
                )}
                
                {scenes[currentPage].audio && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <BlockAudio
                      content={scenes[currentPage].audio!.content}
                      audio_base64={scenes[currentPage].audio!.audio_base64}
                    />
                  </div>
                )}
              </div>

              <div className="mt-12 flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Storyteller AI</span>
                <div className="h-[1px] flex-1 bg-slate-100" />
              </div>
            </div>
          </div>
        ) : (
          summary && (
            <div className="w-full max-w-2xl transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
              <BlockSummary content={summary.content} />
            </div>
          )
        )}

        {/* Improved Pagination Navigation */}
        <div className="mt-12 flex items-center gap-8 animate-in fade-in duration-1000 delay-500">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="group p-4 rounded-2xl bg-white shadow-lg border border-slate-100 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="flex gap-3 items-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === currentPage ? "bg-blue-600 w-10 shadow-lg shadow-blue-200" : "bg-slate-200 w-2.5 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="group p-4 rounded-2xl bg-blue-600 shadow-xl shadow-blue-200 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
