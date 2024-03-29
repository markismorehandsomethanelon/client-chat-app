import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Conversation } from 'src/app/models/conversation';
import { GroupConversation } from 'src/app/models/group-conversation';
import { Message } from 'src/app/models/message';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { ViewModalService } from 'src/app/services/view-modal.service';
import { FileUtil } from 'src/app/utils/file-util';
import { ViewModalComponent } from '../view-modal/view-modal.component';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() messageType: string;

  @Input() message: Message;

  @Input() conversation: Conversation;

  constructor(private sanitizer: DomSanitizer,
    private viewModalService: ViewModalService ) { }

  ngOnInit(): void {
  }

  isSentMessage(): boolean {
    return this.message.sender.id === SessionService.getCurrentUser().id;
  }

  isOwner(): boolean {
    if (Conversation.isGroupConversation(this.conversation)){
      return (this.conversation as GroupConversation).ownerId === this.message.sender.id;
    }
    return false;
  }

  getAvatar(): string {
    return FileUtil.getBase64FromBinary(this.message.sender.avatarFile.data, this.message.sender.avatarFile.contentType);
  }

  getData(): SafeUrl {
    const multimediaMessage: MultimediaMessage = this.message as MultimediaMessage;
    return this.sanitizer.bypassSecurityTrustUrl(FileUtil.getBase64FromBinary(multimediaMessage.dataFile.data, multimediaMessage.dataFile.contentType));
  }

  getFileName(): string {
    const multimediaMessage: MultimediaMessage = this.message as MultimediaMessage;
    return multimediaMessage.fileName;
  }

  openViewModal(): void {
    this.viewModalService.openModal(ViewModalComponent, this.message);
  }
}
