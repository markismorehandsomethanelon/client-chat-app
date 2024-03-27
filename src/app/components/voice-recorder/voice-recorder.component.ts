import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FileData } from 'src/app/models/file-data';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { User } from 'src/app/models/user';
import { ConversationService } from 'src/app/services/conversation.service';
import { VoiceRecorderModalService } from 'src/app/services/voice-recorder-modal.service';
import { VoiceRecorderService } from 'src/app/services/voice-recorder.service';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.css']
})
export class VoiceRecorderComponent implements OnInit {

  isRecording: boolean = false;

  @ViewChild('audioPlayer') audioPlayer: ElementRef;

  audioBob: any;

  constructor(private voiceRecorderService: VoiceRecorderService,
    private voiceRecorderModalSerivce: VoiceRecorderModalService,
    private conversationService: ConversationService) { }

  ngOnInit(): void {
    
  }

  toggleRecording(): void {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording(): void {
    this.voiceRecorderService.startRecording();
    this.isRecording = true;
  }

  async stopRecording() {
    this.audioBob = await this.voiceRecorderService.stopRecording();
    this.isRecording = false;
    this.audioPlayer.nativeElement.src = URL.createObjectURL(this.audioBob as Blob);
  }

  onSend(): void {
    const reader = new FileReader();
      reader.onloadend = () => {
      const message: MultimediaMessage = new MultimediaMessage();
      const sender: User = new User();
      sender.id = 1;
      message.sender = sender;
      message.sentAt = new Date().toISOString();
      message.dataFile = new FileData();
      message.dataFile.contentType = 'audio/wav';
      message.dataFile.extension = 'wav';
      message.dataFile.data = reader.result.toString().split(',')[1];
      message.type = 'AUDIO';
      this.conversationService.sendMultimediaMessageToChannel(this.conversationService.currentConversation, message);
    };
    reader.readAsDataURL(this.audioBob);
  }

  onClose(): void {
    this.voiceRecorderModalSerivce.closeModal();
  }
}
