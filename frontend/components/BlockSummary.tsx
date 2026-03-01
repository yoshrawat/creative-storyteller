export default function BlockSummary({ content }: { content: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Story Summary</h3>
      </div>
      <p className="text-indigo-800 leading-relaxed font-medium italic">
        "{content}"
      </p>
    </div>
  );
}
