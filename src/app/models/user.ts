import { FileData } from "./file-data";
import { MessageNotification } from "./message-notification";

export class User {
    id: number;
    name: string;
    avatarFile: FileData;
    messageNotifications: MessageNotification[] = [];
}
