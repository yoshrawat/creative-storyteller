export default function BlockVideo({
  video_prompt,
  video_base64,
}: {
  video_prompt: string;
  video_base64?: string;
}) {
  const isFailed = video_base64 === "";

  return (
    <div className="flex flex-col gap-3 w-full h-full justify-center">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner group">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm font-bold">Video Generation Failed</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-center px-4">Creating Cinematic Clip...</p>
            </div>
          </div>
        )}
      </div>
      <div className="px-4">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter mb-1">Cinematic Video Prompt</p>
        <p className="text-xs italic text-slate-500 leading-tight">
          "{video_prompt}"
        </p>
      </div>
    </div>
  );
}
