import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInviteComponent } from './create-invite/create-invite.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { invitationResolver } from 'src/services/invitation.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RedirectComponent } from './common/redirect/redirect.component';
import { Oauth2Component } from './common/oauth2/oauth2.component';
import { loginGuard } from './common/login.guard';
import { LoginComponent } from './common/login/login.component';

const routes: Routes = [
  {
    path: "qr",
    component: RedirectComponent,
    pathMatch: 'full',

  },
  {
    path: "oauth2",
    component: Oauth2Component,
    pathMatch: 'full'
  },
  {
    path: "inivation/create",
    component: CreateInviteComponent,
    pathMatch: "full",
    canActivate: [loginGuard]
  },
  {
    path: "invitations",
    component: InvitationsComponent,
    pathMatch: "full",
    resolve: {
      invitations: invitationResolver
    },
    canActivate: [loginGuard]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    pathMatch: "full"
  },
  {
    path: "",
    component: LoginComponent,
    canActivate: [loginGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
