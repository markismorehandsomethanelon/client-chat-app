import { Conversation } from "./conversation";
import { Message } from "./message";
import { User } from "./user";

export class GroupConversation extends Conversation {
    name: string;
    avatar: string;
    ownerId: number;

    constructor(){
        super();
        this.instanceOf = "group";
    }
}
