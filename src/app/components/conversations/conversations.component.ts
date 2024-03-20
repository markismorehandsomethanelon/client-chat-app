import { Component, OnInit } from '@angular/core';
import { UserProfileModalService } from 'src/app/services/user-profile-modal.service';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';
import { ChangePasswordModalService } from 'src/app/services/change-password-modal.service';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { JoinGroupConversationModalService } from 'src/app/services/join-group-conversation-modal.service';
import { JoinGroupConversationModalComponent } from '../join-group-conversation-modal/join-group-conversation-modal.component';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { GroupConversationModalComponent } from 'src/app/components/group-conversation-modal/group-conversation-modal.component';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChangePasswordRequest } from 'src/app/requests/change-password.request';
import { GroupConversation } from 'src/app/models/group-conversation';
import { ConversationService } from 'src/app/services/conversation.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { SessionService } from 'src/app/services/session.service';
import { Observable, Subscription } from 'rxjs';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {

  currentUser: User;
  avatar?: any;

  currentUserSupscription: Subscription;

  constructor(private userProfileModalService: UserProfileModalService,
      private changePasswordModalService: ChangePasswordModalService,
      private joinConversationModalService: JoinGroupConversationModalService,
      private groupConversationModalService: GroupConversationModalService,
      private userService: UserService,
      private authService: AuthService,
      private fileDownloadService: FileDownloadService
    ) {}
  
  ngOnInit(): void {
    this.currentUser = SessionService.getCurrentUser();

    this.fileDownloadService.getFile(this.currentUser.avatarUrl).subscribe(
      (successRes: any) => {
        this.avatar = Util.getBase64FromBinary(successRes.data.data, successRes.data.contentType);
      },
      (errorRes: any) => {
        console.log(errorRes.error.message);
      }
    );

    this.currentUserSupscription = this.userService.onCurrentUserChanged().subscribe((user: User) => {
      this.currentUser = user;
    });
    
  }

  ngOnDestroy(): void {
    this.currentUserSupscription.unsubscribe();
  }

  openUserProfileModal(): void {
    this.userProfileModalService.openModal(UserProfileModalComponent, true, this.currentUser, this.avatar);
  }

  openChangePasswordModal(): void {
    this.changePasswordModalService.openModal(ChangePasswordModalComponent);
  }

  openJoinGroupConversationModal(): void {
    this.joinConversationModalService.openModal(JoinGroupConversationModalComponent);
  }

  openCreateGroupConversation(): void {
    this.groupConversationModalService.openModal(GroupConversationModalComponent, "Create group conversation", new GroupConversation());
  }
}
