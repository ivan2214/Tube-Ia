export function extractVideoId(input?: string): string | null {
  if (!input) {
    return null;
  }

  // Handle YouTube URLs
  const urlRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const urlMatch = input.match(urlRegex);

  if (urlMatch?.[1]) {
    return urlMatch[1];
  }

  // Check if the input is already a valid video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  return null;
}
