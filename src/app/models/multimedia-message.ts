import { Message } from "./message";

export class MultimediaMessage extends Message {
    fileName: string;
    data: string;
    type: string;

    constructor() {
        super();
        this.instanceOf = "multimedia";
    }
}
