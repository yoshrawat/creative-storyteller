import BlockText from "./BlockText";
import BlockImage from "./BlockImage";
import BlockAudio from "./BlockAudio";
import BlockSummary from "./BlockSummary";

type Block =
  | { type: "metadata"; style_guide: string }
  | { type: "text"; content: string }
  | { type: "audio"; content: string; audio_base64?: string }
  | { type: "image"; prompt: string; image_base64?: string }
  | { type: "summary"; content: string };

export default function StoryRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "metadata":
            return (
              <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Character Style Guide</p>
                <p className="text-sm text-gray-600 italic">{block.style_guide}</p>
              </div>
            );

          case "text":
            return <BlockText key={index} content={block.content} />;

          case "audio":
            return (
              <BlockAudio
                key={index}
                content={block.content}
                audio_base64={block.audio_base64}
              />
            );

          case "image":
            return (
              <BlockImage
                key={index}
                prompt={block.prompt}
                image_base64={block.image_base64}
              />
            );

          case "summary":
            return <BlockSummary key={index} content={block.content} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
