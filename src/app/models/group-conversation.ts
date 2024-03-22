import { Conversation } from "./conversation";
import { FileData } from "./file-data";

export class GroupConversation extends Conversation {
    name: string;
    avatarFile: FileData;
    ownerId: number;

    constructor(){
        super();
        this.instanceOf = "group";
    }
}
