import { Message } from "./message";

export class MultimediaMessage extends Message {
    fileName: string;
    data: string;
    size: string;
    type: string;
}
