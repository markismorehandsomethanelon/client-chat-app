import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { ConversationDetailComponent } from './components/conversation-detail/conversation-detail.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ContactFeaturesComponent } from './components/contact-features/contact-features.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AuthComponent } from './components/auth/auth.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MainComponent } from './components/main/main.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ContactRequestsComponent } from './components/contact-requests/contact-requests.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'signin',
        component: SignInComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      { path: '', redirectTo: 'signin', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'conversations',
        component: ConversationsComponent,
        children: [
          {
            path: '',
            component: WelcomeComponent
          },
          {
            path: ':id',
            component: ConversationDetailComponent
          }
        ]
      },
      {
        path: 'contactFeatures',
        component: ContactFeaturesComponent,
        children: [
          {
            path: 'contacts',
            component: ContactsComponent
          },
          {
            path: 'contactRequests',
            component: ContactRequestsComponent
          }
        ]
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
