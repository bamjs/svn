import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInviteComponent } from './create-invite/create-invite.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { invitationResolver } from 'src/services/invitation.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
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
  },{
    path:"",
    component:DashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
