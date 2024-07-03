import { Message } from "./msgInterface";

export interface MessageResponse {
  msgs?: Message[]
  message?: string
}