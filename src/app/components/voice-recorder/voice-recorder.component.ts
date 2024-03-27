import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
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

  constructor(private voiceRecorderService: VoiceRecorderService,
    private voiceRecorderModalSerivce: VoiceRecorderModalService,
    private sanitizer: DomSanitizer) { }

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
    const audioBlob = await this.voiceRecorderService.stopRecording();
    this.isRecording = false;
    this.audioPlayer.nativeElement.src = URL.createObjectURL(audioBlob as Blob);
  }


  onClose(): void {
    this.voiceRecorderModalSerivce.closeModal();
  }
}
