export default function BlockText({ content }: { content: string }) {
  return (
    <div className="prose prose-slate prose-lg max-w-none">
      <p className="text-xl leading-relaxed text-slate-700 font-serif italic selection:bg-yellow-100">
        {content}
      </p>
    </div>
  );
}
