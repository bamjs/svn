import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Invitation, InvitationService } from 'src/services/invitation.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MarkCompletedComponent } from '../mark-completed/mark-completed.component';
import { CommonService } from 'src/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, OperatorFunction, Subscription, catchError, debounceTime, from,  groupBy,  of, switchMap, tap } from 'rxjs';
import { ToastService } from 'src/services/toast.service';
import * as XLSX from 'xlsx';
import { CreateInviteComponent } from '../create-invite/create-invite.component';

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
  invitationSearch:boolean = false;
  mobileSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => this.search(text$, 'mobile')
  fnameSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => this.search(text$, 'fname')
  placeSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => this.search(text$, 'place')
  searchInvitationForm: FormGroup = this.formBuilder.group({
    fname: [''],
    mobile: null,
    place: ''
  })



  constructor(private invitationService: InvitationService,
    private route: ActivatedRoute,
    private ngbModalService: NgbModal,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private inviteService: InvitationService,
    private toastService: ToastService,
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
      this.toastService.show(`Total Invitations ${this.collectionSize}`)
    });
  }


  search = (text$: Observable<string>, column) => text$.pipe(
    debounceTime(50),
    // distinctUntilChanged(),
    tap(() => (this.searching = true)),
    switchMap((term) =>
      from(this.inviteService.search(column, term)).pipe(
        tap((data) => console.log(data)),
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
    this.invitationService.saveMany(this.tempData).then(data => {
      console.log(data);
      this.toastService.show(`Successfully Imported ${this.tempData.length}`, { className: 'bg-success text-light', delay: 5000 })
    }).catch(err => {
      console.log(err);
      this.toastService.show(`Unable to Import`, { className: 'bg-danger' })
    })
    this.commonService.loaderHide();
    this.router.navigate(['invitations'])
  }
  markCompleted(invitation: Invitation) {
    console.log(invitation['_id'].toString());
    invitation.completed = true
    this.invitationService.update(invitation)
    this.toastService.show(`Marked as Completed`)
    // this.invitationService.f
  }
  openModal(invitation: any) {
    const modalRef: NgbModalRef = this.ngbModalService.open(MarkCompletedComponent, { size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.invitation = invitation
    modalRef.result.then(invitation => {
      if (invitation) {
        let data = this.invitationService.update(invitation)
        this.toastService.show(`Marked as Completed`, { className: 'bg-success text-light', delay: 3000 })
      }
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
  searchInvitation() {
    this.invitationService.multiSearch(this.searchInvitationForm.value).then(
      data => {this.invitations = data
      this.invitationSearch = true
      console.log(this.invitationSearch);

    }
    )
  }
  isArray(mobile) {
    return Array.isArray(mobile)
  }
  getMobileArray(mobiles) {
    console.log(mobiles);

    return mobiles

    return [...mobiles]
  }
  exportData() {
    this.inviteService.getAll(0, 1000).then(
      data => {
        let filteredData = []
        data.forEach(el => {
          delete el['_id']
          filteredData.push(el)
        })
        this.commonService.loaderHide()
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data)
        XLSX.utils.book_append_sheet(wb, ws, "Invitations")
        XLSX.writeFile(wb, "invitations.xlsx");
      }
    );
  }
  edit(invitation) {
    const modalRef: NgbModalRef = this.ngbModalService.open(CreateInviteComponent)
    console.log(invitation);

    modalRef.componentInstance.inputInvitation = invitation
    modalRef.componentInstance.editMode = true
    modalRef.componentInstance.modalRef = modalRef
    modalRef.result.then(data => {
      console.log(data);
    })
  }
  prepareWTNumber(number) {
    let numberStr
    if (Array.isArray) {
      numberStr = String(number[0])
    } else {
      numberStr = String(number)
    }
    return numberStr.replace(/^\+91/, '')
  }
  prepareWTMsg() {
    return encodeURI("Join us in celebrating wedding of Nelima and Srikanth! October 19th&20th. Your presence will make it even more special! 💍🎉")
  }
  async exportText(){
    let text = ""
    let sortedInvitation =[]
    if (this.invitationSearch) {
      sortedInvitation =  this.invitations.sort((a,b)=>{
        return a.place.localeCompare(b.place)
       })
       console.log(sortedInvitation);
     }else{
      sortedInvitation  = await this.inviteService.getAll(0,-1)
      sortedInvitation = sortedInvitation.sort((a,b)=>{
          if (a.place) {
            return a.place.localeCompare(b.place)
          }else{
            return 0
          }
        })
      }
     console.log(sortedInvitation);

     let previousInvitationPlace
     for (let i = 0; i < sortedInvitation.length; i++) {
      const invitation = sortedInvitation[i];
      if (i==0|| previousInvitationPlace !=invitation.place) {
        previousInvitationPlace = invitation.place
        text+=`\n${'_'.padStart(90,'_')}\n\n`
        text+= `      *****      ${invitation.place}      *****      \n`
      }
      text+=`  ${invitation.fname?.padStart(50)}    >>    ${invitation.mobile}  \n`
     }
     console.log(text);
     this.saveFile(this.invitationSearch ? previousInvitationPlace+".txt":"invitations.txt",text)
    // fs.writeFileSync(this.invitationSearch ? previousInvitationPlace+".txt":"invitations.txt",text)
    }
    saveFile(filename,text){
      let file = new Blob([text], {type: '.txt'});
    let a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
    }

}
