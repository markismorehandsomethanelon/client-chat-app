import { Component, OnInit } from '@angular/core';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  constructor(private confirmModalService: ConfirmModalService){

  }
  
  ngOnInit(): void {
  }

  onConfirm(): void {
  }

  onClose(): void {
    this.confirmModalService.closeModal();
  }
}
