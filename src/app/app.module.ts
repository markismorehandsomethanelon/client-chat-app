import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { RouterModule } from '@angular/router';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ConversationDetailComponent } from './components/conversation-detail/conversation-detail.component';
import { SentMessageComponent } from './components/sent-message/sent-message.component';
import { ReceivedMessageComponent } from './components/received-message/received-message.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';
import { ContactFeaturesComponent } from './components/contact-features/contact-features.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContactRequestsComponent } from './components/contact-requests/contact-requests.component';
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
import { AddContactModalComponent } from './components/add-contact-modal/add-contact-modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ConversationsComponent,
    ConversationListComponent,
    ConversationDetailComponent,
    SentMessageComponent,
    ReceivedMessageComponent,
    PageNotFoundComponent,
    ScrollToBottomDirective,
    ContactFeaturesComponent,
    ContactsComponent,
    ContactRequestsComponent,
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
    AddContactModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
