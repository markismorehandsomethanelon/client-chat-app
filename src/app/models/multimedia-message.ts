import { FileData } from "./file-data";
import { Message } from "./message";

export class MultimediaMessage extends Message {
    fileName: string;
    dataFile: FileData;
    type: string;

    constructor() {
        super();
        this.instanceOf = "MULTIMEDIA";
    }
}
