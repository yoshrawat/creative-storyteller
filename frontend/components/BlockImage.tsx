export default function BlockImage({ prompt }: { prompt: string }) {
  return (
    <div className="bg-gray-200 p-4 rounded-xl text-sm text-gray-700">
      🖼 Image Prompt:
      <br />
      {prompt}
    </div>
  );
}