import { Component, OnInit } from '@angular/core';
import { AddContactModalService } from 'src/app/services/add-contact-modal.service';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.css']
})
export class AddContactModalComponent implements OnInit {

  ceditable: boolean;

  image: string | ArrayBuffer | null = '';
  
  constructor(private addContactModalService: AddContactModalService){

  }
  
  ngOnInit(): void {
  }

  onSend(): void {
  }

  onFind(value: string): void {

  }

  onClose(): void {
    this.addContactModalService.closeModal();
  }

}
