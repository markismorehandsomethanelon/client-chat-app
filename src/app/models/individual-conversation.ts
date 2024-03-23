import { Conversation } from "./conversation";

export class IndividualConversation extends Conversation {
    constructor(){
        super();
        this.instanceOf = "INDIVIDUAL";
    }
}
