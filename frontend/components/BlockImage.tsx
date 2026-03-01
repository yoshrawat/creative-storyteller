export default function BlockImage({
  prompt,
  image_base64,
}: {
  prompt: string;
  image_base64?: string;
}) {
  const isFailed = image_base64 === "";

  return (
    <div className="flex flex-col gap-3 w-full h-full justify-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner group">
        {image_base64 ? (
          <img
            src={`data:image/png;base64,${image_base64}`}
            alt={prompt}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : isFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-red-50 text-red-400 p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm font-bold">Safety Filter Blocked</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
              <p className="text-xs font-bold uppercase tracking-widest">Generating Visual</p>
            </div>
          </div>
        )}
      </div>
      <div className="px-4">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter mb-1">Visual Prompt</p>
        <p className="text-xs italic text-slate-500 leading-tight">
          "{prompt}"
        </p>
      </div>
    </div>
  );
}
