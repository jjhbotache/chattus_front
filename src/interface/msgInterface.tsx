export interface Message {
  message: string;
  sender: string;
  kind: "message" | "image" | "video" | "audio";
}