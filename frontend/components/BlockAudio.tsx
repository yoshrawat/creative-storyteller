"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (audio_base64 && audioRef.current) {
      audioRef.current.play().catch((err) => {
        // Browser might block auto-play until user interaction
        console.warn("Auto-play blocked:", err);
      });
    }
  }, [audio_base64]);

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${isFailed ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${audio_base64 ? 'bg-blue-500 text-white' : isFailed ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-400'}`}>
          {audio_base64 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          ) : isFailed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
            <div className="h-5 w-5 animate-pulse bg-gray-300 rounded-full" />
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${isFailed ? 'text-red-900' : 'text-blue-900'}`}>Audio Narration</p>
          {!audio_base64 && !isFailed && (
            <p className="text-xs text-blue-600 animate-pulse font-medium">Synthesizing voice...</p>
          )}
          {isFailed && (
            <p className="text-xs text-red-600 font-medium">Failed to generate audio</p>
          )}
        </div>
      </div>

      {audio_base64 ? (
        <audio
          ref={audioRef}
          src={`data:audio/mp3;base64,${audio_base64}`}
          controls
          className="w-full h-8 mt-1"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : !isFailed ? (
        <div className="h-8 w-full bg-gray-100 rounded-md animate-pulse" />
      ) : null}
      
      {!isFailed && (
        <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-wider font-bold">
          {isPlaying ? "Now Playing" : "Ready to Play"}
        </p>
      )}
    </div>
  );
}
