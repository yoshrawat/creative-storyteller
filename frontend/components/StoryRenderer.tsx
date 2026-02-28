import BlockText from "./BlockText";
import BlockImage from "./BlockImage";
import BlockSummary from "./BlockSummary";

type Block =
  | { type: "text"; content: string }
  | { type: "image"; prompt: string }
  | { type: "summary"; content: string };

export default function StoryRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return <BlockText key={index} content={block.content} />;

          case "image":
            return <BlockImage key={index} prompt={block.prompt} />;

          case "summary":
            return <BlockSummary key={index} content={block.content} />;

          default:
            return null;
        }
      })}
    </div>
  );
}