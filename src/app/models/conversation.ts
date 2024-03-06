import { Message } from "./message";

export class Conversation {
    id: number;
    lastestMessage: Message;
    messages: Message[];

    constructor(id: number, lastestMessage: Message, messages: Message[]){
        this.id = id;
        this.lastestMessage = lastestMessage;
        this.messages = messages;
    }
}
