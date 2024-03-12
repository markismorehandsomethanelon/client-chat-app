import { Message } from "./message";
import { User } from "./user";

export class Conversation {
    id: number;
    lastestMessage: Message;
    messages: Message[];
    members: User[];
}
