import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateInviteComponent } from './create-invite/create-invite.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvitationsComponent } from './invitations/invitations.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkCompletedComponent } from './mark-completed/mark-completed.component';
import { SafePipe } from './safe.pipe';
import { LoaderComponent } from './common/loader/loader.component';
import { DashboardComponent } from './dashboard/dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    CreateInviteComponent,
    InvitationsComponent,
    MarkCompletedComponent,
    SafePipe,
    LoaderComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
