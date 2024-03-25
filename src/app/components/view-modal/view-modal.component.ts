import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { ViewModalService } from 'src/app/services/view-modal.service';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
  styleUrls: ['./view-modal.component.css']
})
export class ViewModalComponent implements OnInit {

  errorMessage?: string;

  message?: MultimediaMessage;

  constructor(private viewModalService: ViewModalService,
    private sanitizer: DomSanitizer){
  }
  
  ngOnInit(): void {
  }

  onClose(): void {
    this.viewModalService.closeModal();
  }

  setData(message: MultimediaMessage): void {
    this.message = message;
  }

  getData(): string {
    const multimediaMessage: MultimediaMessage = this.message as MultimediaMessage;
    return FileUtil.getBase64FromBinary(multimediaMessage.dataFile.data, multimediaMessage.dataFile.contentType);
  }

  getContent(): string {
    const multimediaMessage: MultimediaMessage = this.message as MultimediaMessage;
    return atob(multimediaMessage.dataFile.data);
  }
  
}
