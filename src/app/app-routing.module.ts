import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInviteComponent } from './create-invite/create-invite.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { invitationResolver } from 'src/services/invitation.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RedirectComponent } from './common/redirect/redirect.component';

const routes: Routes = [
  {
    path: "qr",
    component: RedirectComponent,
    pathMatch: 'full'
  },
  {
    path: "inivation/create",
    component: CreateInviteComponent,
    pathMatch: "full"
  },
  {
    path: "invitations",
    component: InvitationsComponent,
    pathMatch: "full",
    resolve: {
      invitations: invitationResolver
    }
  }, {
    path: "",
    component: DashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
