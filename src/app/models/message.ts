import { SessionService } from "../services/session.service";
import { MessageNotification } from "./message-notification";
import { User } from "./user";

export class Message {
    id: number;
    sentAt: string;
    sender: User;
    conversationId: number;
    instanceOf: string;

    static isTextMessage(message: Message): boolean {
        return message.instanceOf === 'TEXT';
    }

    static isSentMessage(message: Message): boolean {
        const CURRENT_USER: User = SessionService.getCurrentUser();
        return message.sender.id === CURRENT_USER.id;
    }
}
