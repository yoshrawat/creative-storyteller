export default function BlockImage({
  prompt,
  image_base64,
}: {
  prompt: string;
  image_base64?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
        {image_base64 ? (
          <img
            src={`data:image/png;base64,${image_base64}`}
            alt={prompt}
            className="h-full w-full object-cover transition-opacity duration-500"
          />
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
