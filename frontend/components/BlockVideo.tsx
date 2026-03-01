"use client";

export default function BlockVideo({
  video_prompt,
  video_base64,
}: {
  video_prompt: string;
  video_base64?: string;
}) {
  const isFailed = video_base64 === "";

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
        {video_base64 ? (
          <video
            src={`data:video/mp4;base64,${video_base64}`}
            controls
            autoPlay
            loop
            muted
            className="h-full w-full object-cover"
          />
        ) : isFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-red-50 text-red-400 p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm font-medium">Video generation failed</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
              <p className="text-sm font-medium">Generating cinematic video...</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs italic text-gray-500 text-center px-4">
        "{video_prompt}"
      </p>
    </div>
  );
}
