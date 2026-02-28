export default function BlockImage({
  prompt,
  image_base64,
}: {
  prompt: string;
  image_base64?: string;
}) {
  const isFailed = image_base64 === "";
  const isLoading = image_base64 === undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
        {image_base64 ? (
          <img
            src={`data:image/png;base64,${image_base64}`}
            alt={prompt}
            className="h-full w-full object-cover transition-opacity duration-500"
          />
        ) : isFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-red-50 text-red-400 p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm font-medium">Generation blocked by safety filters</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
              <p className="text-sm font-medium">Generating image...</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs italic text-gray-500 text-center px-4">
        "{prompt}"
      </p>
    </div>
  );
}
