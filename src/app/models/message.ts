import { User } from "./user";

export class Message {
    id: number;
    sender: User;
    content: string;
    sentAt: string;

    constructor(id: number, sender: User, content: string, sentAt: string){
        this.id = id;
        this.sender = sender;
        this.content = content;
        this.sentAt = sentAt;
    }
}
