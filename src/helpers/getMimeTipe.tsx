export default function getMimeType (prefix: string): string | null {
  const match = prefix.match(/:(.*?);/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};