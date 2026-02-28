export default function BlockSummary({ content }: { content: string }) {
  return (
    <div className="bg-yellow-100 p-4 rounded-xl">
      <strong>Summary:</strong> {content}
    </div>
  );
}