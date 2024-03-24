import { User } from "./user";
import { Message } from "./message";

export class MessageNotification {
    id: number;
    read: boolean;
    userId: number;
    messageId: number;
}
