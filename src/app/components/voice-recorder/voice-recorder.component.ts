import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VoiceRecorderModalService } from 'src/app/services/voice-recorder-modal.service';
import { VoiceRecorderService } from 'src/app/services/voice-recorder.service';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.css']
})
export class VoiceRecorderComponent implements OnInit {

  private recordedChunks: Blob[];
  private isRecording: boolean = false;

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
    this.isRecording = true;
    this.voiceRecorderService.startRecording();
  }

  stopRecording(): void {
    if (this.isRecording) {
      this.isRecording = false;
      this.voiceRecorderService.stopRecording();
      this.recordedChunks = this.voiceRecorderService.getRecordedChunks();
    }
  }

  getRecordedChunks(): SafeUrl {
    const blob = new Blob(this.recordedChunks, { type: 'audio/wave' });
    const url = FileUtil.getBase64FromBinary(URL.createObjectURL(blob), 'audio/wave');
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onClose(): void {
    this.voiceRecorderModalSerivce.closeModal();
  }
}
