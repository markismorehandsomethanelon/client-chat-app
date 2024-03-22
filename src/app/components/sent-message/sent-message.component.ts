import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Message } from 'src/app/models/message';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { ViewModalService } from 'src/app/services/view-modal.service';
import { Util } from 'src/app/utils/util';
import { ViewModalComponent } from '../view-modal/view-modal.component';

@Component({
  selector: 'app-sent-message',
  templateUrl: './sent-message.component.html',
  styleUrls: ['./sent-message.component.css']
})
export class SentMessageComponent implements OnInit {


  @Input() messageType: string;

  @Input() message: Message;

  constructor(private sanitizer: DomSanitizer,
    private viewModalService: ViewModalService ) { }

  ngOnInit(): void {
  }

  getAvatar(): string {
    return Util.getBase64FromBinary(this.message.sender.avatarFile.data, this.message.sender.avatarFile.contentType);
  }

  getData(): SafeUrl {
    const multimediaMessage: MultimediaMessage = this.message as MultimediaMessage;
    return this.sanitizer.bypassSecurityTrustUrl(Util.getBase64FromBinary(multimediaMessage.dataFile.data, multimediaMessage.dataFile.contentType));
  }

  getFileName(): string {
    const multimediaMessage: MultimediaMessage = this.message as MultimediaMessage;
    return multimediaMessage.fileName;
  }

  openViewModal(): void {
    this.viewModalService.openModal(ViewModalComponent, this.message);
  }


}
