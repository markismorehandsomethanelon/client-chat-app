import { Component, OnInit } from '@angular/core';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  constructor(private confirmModalService: ConfirmModalService) { }

  ngOnInit(): void {
  }

  openConfirmModal(): void {
    const modalRef = this.confirmModalService.openModal(ConfirmModalComponent);
  }
}
