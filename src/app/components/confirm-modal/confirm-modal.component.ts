import { Component, OnInit } from '@angular/core';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  content?: string;

  constructor(private confirmModalService: ConfirmModalService){}

  setContent(content: string): void {
    this.content = content;
  }
  
  ngOnInit(): void {
  }

  onConfirm(): void {
    this.confirmModalService.confirm();
  }

  onClose(): void {
    this.confirmModalService.closeModal();
  }
}
