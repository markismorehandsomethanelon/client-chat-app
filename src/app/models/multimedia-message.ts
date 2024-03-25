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

    static isImageType(message: MultimediaMessage): boolean {
        return message.type === 'IMAGE';
    }

    static isAudioType(message: MultimediaMessage): boolean {
        return message.type === 'AUDIO';
    }

    static isVideoType(message: MultimediaMessage): boolean {
        return message.type === 'VIDEO';
    }

    static isFileType(message: MultimediaMessage): boolean {
        return message.type === 'FILE';
    }

    static isDocumentType(message: MultimediaMessage): boolean {
        return message.type === 'DOCUMENT';
    }

    static isPresentationType(message: MultimediaMessage): boolean {
        return message.type === 'PRESENTATION';
    }

    static isSheetType(message: MultimediaMessage): boolean {
        return message.type === 'SHEET';
    }

    static isPdfType(message: MultimediaMessage): boolean {
        return message.type === 'PDF';
    }

    static isOtherType(message: MultimediaMessage): boolean {
        return message.type === 'OTHER';
    }

}
