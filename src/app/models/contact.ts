import { User } from "./user";

export class Contact {
    id: number;
    sender: User;
    receiver: User;
    status: string;
    conversationId: number;
}