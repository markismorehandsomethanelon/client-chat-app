import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { RouterModule } from '@angular/router';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ConversationDetailComponent } from './components/conversation-detail/conversation-detail.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';
import { ContactFeaturesComponent } from './components/contact-features/contact-features.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { IncomingContactRequestComponent } from './components/incoming-contact-requests/incoming-contact-requests.component';
import { OutgoingContactRequestComponent } from './components/outgoing-contact-requests/outgoing-contact-requests.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthComponent } from './components/auth/auth.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MainComponent } from './components/main/main.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserProfileModalComponent } from './components/user-profile-modal/user-profile-modal.component';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { GroupConversationModalComponent } from './components/group-conversation-modal/group-conversation-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { JoinGroupConversationModalComponent } from './components/join-group-conversation-modal/join-group-conversation-modal.component';
import { FindContactModelComponent } from './components/find-contact-modal/find-contact-modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastsComponent } from './components/toasts/toasts.component';
import { RxStompService } from '@stomp/ng2-stompjs';
import { StompService } from './services/stomp.service';
import { ViewModalComponent } from './components/view-modal/view-modal.component';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './components/message/message.component';
import { VoiceRecorderComponent } from './components/voice-recorder/voice-recorder.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ConversationsComponent,
    ConversationListComponent,
    ConversationDetailComponent,
    PageNotFoundComponent,
    ScrollToBottomDirective,
    ContactFeaturesComponent,
    ContactsComponent,
    IncomingContactRequestComponent,
    OutgoingContactRequestComponent,
    FooterComponent,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    MainComponent,
    WelcomeComponent,
    UserProfileModalComponent,
    ChangePasswordModalComponent,
    GroupConversationModalComponent,
    ConfirmModalComponent,
    JoinGroupConversationModalComponent,
    FindContactModelComponent,
    ToastsComponent,
    ViewModalComponent,
    MessageComponent,
    VoiceRecorderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [
    RxStompService,
    StompService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
