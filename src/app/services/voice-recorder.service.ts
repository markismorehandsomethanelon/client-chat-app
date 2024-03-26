import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class VoiceRecorderService {

  private mediaRecorder: MediaRecorder;
  private recordedChunks: Blob[] = [];

  constructor() { }

  startRecording(): void {
    this.recordedChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
      (stream: MediaStream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.start();
      }
    );
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
  }

  getRecordedChunks(): Blob[] {
    return this.recordedChunks;
  }

  clearRecordedData(): void {
    this.recordedChunks = [];
  }
}