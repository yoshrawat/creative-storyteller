"use client";

import { useRef, useState } from "react";

export default function BlockAudio({
  content,
  audio_base64,
}: {
  content: string;
  audio_base64?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isFailed = audio_base64 === "";

  return (
    <div className={`group flex flex-col gap-3 p-5 rounded-3xl border transition-all duration-500 shadow-sm hover:shadow-md ${isFailed ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}>
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center h-12 w-12 rounded-2xl transition-all duration-500 ${audio_base64 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 group-hover:scale-110' : isFailed ? 'bg-red-400 text-white' : 'bg-slate-200 text-slate-400'}`}>
          {audio_base64 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isPlaying ? "animate-pulse" : ""}><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          ) : isFailed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-slate-300 border-t-slate-500" />
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-black uppercase tracking-widest ${isFailed ? 'text-red-900' : 'text-slate-900'}`}>
            Narration
          </p>
          {!audio_base64 && !isFailed && (
            <p className="text-[10px] text-blue-500 font-bold animate-pulse">Synthesizing Voice...</p>
          )}
          {isFailed && (
            <p className="text-[10px] text-red-500 font-bold uppercase">Synthesis Failed</p>
          )}
          {audio_base64 && (
            <p className="text-[10px] text-slate-400 font-bold uppercase">{isPlaying ? "Now Playing" : "Ready to Play"}</p>
          )}
        </div>
      </div>

      {audio_base64 ? (
        <div className="bg-white/50 rounded-2xl p-1 shadow-inner border border-white">
          <audio
            ref={audioRef}
            src={`data:audio/mp3;base64,${audio_base64}`}
            controls
            className="w-full h-10"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      ) : !isFailed ? (
        <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse" />
      ) : null}
    </div>
  );
}
