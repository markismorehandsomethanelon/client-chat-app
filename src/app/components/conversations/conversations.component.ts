import { Component, OnInit } from '@angular/core';
import { UserProfileModalService } from 'src/app/services/user-profile-modal.service';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';
import { ChangePasswordModalService } from 'src/app/services/change-password-modal.service';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { JoinGroupConversationModalService } from 'src/app/services/join-group-conversation-modal.service';
import { JoinGroupConversationModalComponent } from '../join-group-conversation-modal/join-group-conversation-modal.component';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { GroupConversationModalComponent } from '../group-conversation-modal/group-conversation-modal.component';
import { User } from 'src/app/models/user';
import { Util } from 'src/app/utils/util';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {

  currentUser: User;

  constructor(private userProfileModalService: UserProfileModalService,
      private changePasswordModalService: ChangePasswordModalService,
      private joinConversationModalService: JoinGroupConversationModalService,
      private groupConversationModalService: GroupConversationModalService,
      private userService: UserService
    ) {}
  
  ngOnInit(): void {
    const currentUserString = sessionStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
    }
  }

  openUserProfileModal(): void {
    this.userProfileModalService.openModal(UserProfileModalComponent, true, this.currentUser);
    this.userProfileModalService.saveModal$.subscribe((user: User) => {
      this.userService.save(user).subscribe(
        responseSuccess => {
          this.currentUser = responseSuccess.data;
          sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.userProfileModalService.closeModal();
        },
        responseError => {
          this.userProfileModalService.showMessage(responseError.error.message);
        }
      );
    });
  }

  openChangePasswordModal(): void {
   this.changePasswordModalService.openModal(ChangePasswordModalComponent);
  }

  openJoinGroupConversationModal(): void {
    this.joinConversationModalService.openModal(JoinGroupConversationModalComponent);
  }

  openCreateGroupConversation(): void {
    this.groupConversationModalService.openModal(GroupConversationModalComponent, "Create group conversation");
  }
}
