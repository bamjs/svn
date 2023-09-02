import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Invitation, InvitationService } from 'src/services/invitation.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MarkCompletedComponent } from '../mark-completed/mark-completed.component';
import { CommonService } from 'src/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, OperatorFunction,Subscription, catchError, debounceTime, distinctUntilChanged, from, map, of, pluck, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {

  @Input()
  tempData: Invitation[] = []
  collectionSize: number
  pageSizes = [5, 10, 15, 20]
  pageSize = this.pageSizes[0]
  page = 1
  invitations: Invitation[]
  navigationSubscription: Subscription;
  searching: boolean;
  searchFailed: boolean;
  mobileSearch:OperatorFunction<string, readonly string[]> =(text$:Observable<string>)=>this.search(text$,'mobile')
  fnameSearch:OperatorFunction<string, readonly string[]> =(text$:Observable<string>)=>this.search(text$,'fname')
  placeSearch:OperatorFunction<string, readonly string[]> =(text$:Observable<string>)=>this.search(text$,'place')
  searchInvitationForm: FormGroup = this.formBuilder.group({
    fname: [''],
    mobile: null,
    place: ''
  })



  constructor(private invitationService: InvitationService,
    private route: ActivatedRoute,
    private ngbModalService: NgbModal,
    private commonService: CommonService,
    private formBuilder:FormBuilder,
    private inviteService:InvitationService,
    private router: Router) {
  }


  ngOnInit(): void {
    if (this.tempData.length > 0) {
      this.invitations = this.tempData
    } else {
      this.loadData();
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.loadData();
        }
      });
    }
    this.invitationService.getCount().then(data => {
      this.collectionSize = data[0]["name"]
    });
  }


   search =(text$:Observable<string>,column)=> text$.pipe(
    debounceTime(300),
    // distinctUntilChanged(),
    tap(() => (this.searching = true)),
    switchMap((term) =>
      from(this.inviteService.search(column,term)).pipe(
        tap((data)=>console.log(data)),
        tap(() => (this.searchFailed = false)),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }),
      ),
    ),
    tap(() => (this.searching = false)),
  );
  loadData() {
    const resolveData = this.route.snapshot.data;
    this.invitations = resolveData['invitations'];
    this.collectionSize = this.invitations.length
    console.log(this.invitations);

  }
  bulkInsert() {
    console.log(this.tempData);
    this.commonService.loaderShow();
    console.log(this.invitationService.saveMany(this.tempData))
    this.commonService.loaderHide();
    this.router.navigate(['invitations'])
  }
  markCompleted(invitation: Invitation) {
    console.log(invitation['_id'].toString());
    invitation.completed = true
    this.invitationService.update(invitation)
    // this.invitationService.f
  }
  openModal(invitation: any) {
    const modalRef: NgbModalRef = this.ngbModalService.open(MarkCompletedComponent, { size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.invitation = invitation
    modalRef.result.then(invitation => {
      console.log(invitation);
      // invitation.completed = true
      let data = this.invitationService.update(invitation)
      console.log(data);

    })
  }
  updatePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.updateRecords()
  }
  updateRecords() {
    let skip = (this.page - 1) * this.pageSize
    let boole = this.page === 1
    this.invitationService.getAll(boole ? 0 : skip, this.pageSize).then(data => {
      this.invitations = data
    })
  }
  searchInvitation(){
    this.invitationService.multiSearch(this.searchInvitationForm.value).then(
     data=>this.invitations =data
    )
  }
}
