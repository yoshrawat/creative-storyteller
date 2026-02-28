const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function* fetchStoryStream(topic: string, style: string, format: string) {
  const response = await fetch(`${API_URL}/api/story?topic=${encodeURIComponent(topic)}&style=${encodeURIComponent(style)}&format=${encodeURIComponent(format)}`);
  
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim()) {
        try {
          yield JSON.parse(line);
        } catch (e) {
          console.error("Error parsing JSON line:", line, e);
        }
      }
    }
  }
}
