export interface Message {
  message: string;
  sender: string;
  kind: "message" | "image" | "video" | "audio" | "file";
  extension?: string;
  replyingTo?: string;
}