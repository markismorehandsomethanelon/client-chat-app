import { MessageNotification } from "./message-notification";
import { User } from "./user";

export class Message {
    id: number;
    sentAt: string;
    sender: User;
    conversationId: number;
    instanceOf: string;
    notifications: MessageNotification[] = [];
}
