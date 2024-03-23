import { Message } from "./message";

export class TextMessage extends Message {
    content: string;

    constructor(){
        super();
        this.instanceOf = "TEXT";
    }
}
