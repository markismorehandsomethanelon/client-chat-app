import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';

@Component({
  selector: 'app-group-conversation-modal',
  templateUrl: './group-conversation-modal.component.html',
  styleUrls: ['./group-conversation-modal.component.css']
})
export class GroupConversationModalComponent implements OnInit {

  title: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

  image: string | ArrayBuffer | null = '';

  constructor(private groupConversationModalService: GroupConversationModalService){

  }
  
  ngOnInit(): void {
  }

  onSave(): void {
  }

  onClose(): void {
    this.groupConversationModalService.closeModal();
  }

  setTitle(title: string): void {
    this.title = title;
  }

  changeFile(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  chooseFile(): void {
    this.fileInput.nativeElement.click();
  }

}