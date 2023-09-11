import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import { Invitation, InvitationService } from 'src/services/invitation.service';
import * as XLSX from 'xlsx';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, from, map, of, pluck, switchMap, tap } from 'rxjs';

type AOA = any[][];
@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.css']
})
export class CreateInviteComponent implements AfterViewInit {
  @Output('inviteFormUpdate')
  inviteFormEvent= new EventEmitter();
  searching: boolean;
  isContactInput:boolean;
  isContactsNotSupported:boolean = false;
  public contactCity : string;
  searchFailed: boolean;
  contacts:any[]
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private ngbModalService: NgbModal,
    private inviteService: InvitationService) {
      this.isContactInput = false;
  }
  mobileSearch:OperatorFunction<string, readonly string[]> =(text$:Observable<string>)=>this.search(text$,'mobile')
  fnameSearch:OperatorFunction<string, readonly string[]> =(text$:Observable<string>)=>this.search(text$,'fname')
  placeSearch:OperatorFunction<string, readonly string[]> =(text$:Observable<string>)=>this.search(text$,'place')

 async getContacts(){

    let supported = ('contacts' in navigator && 'ContactsManager' in window);
    console.log(supported);
    supported = true;
    console.log(supported);
    if (supported) {
      this.isContactInput = true
    }else{
      this.isContactsNotSupported = true

    }
  }

   search =(text$:Observable<string>,column)=> text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
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

  ngAfterViewInit(): void {
    // this.getContacts();
    if (this.editMode) {
      this.invitationForm.get("fname")?.disable()
      this.invitationForm.get("mobile")?.disable()
      this.invitationForm.get("date")?.disable()
      this.invitationForm.get("fname").setValue(this.inputInvitation.fname)
      this.invitationForm.get("mobile").setValue(this.inputInvitation.mobile)
      this.invitationForm.get("date").setValue(this.inputInvitation.date)
      this.invitationForm.get("count").setValue(this.inputInvitation.count??1);
      this.invitationForm.get("completed").setValue(this.inputInvitation.completed)
      this.invitationForm.get("place").setValue(this.inputInvitation.place)
      // console.log(this.invitationForm.errors);
      this.invitationForm.valueChanges.subscribe(data=>{
        console.log(data);
        this.inviteFormEvent.emit(this.invitationForm.value)
      })
    }
  }
  @Input()
  inputInvitation: Invitation
  @Input()
  editMode: boolean
  data: any[] = []
  invitationForm: FormGroup = this.formBuilder.group({
    fname: [''],
    mobile: null,
    count: 1,
    date: new Date(),
    completed: false,
    place: ''
  })
  createInvitation() {
    this.commonService.loaderShow()
    this.inviteService.save(this.invitationForm.value).then(
      () => {
        this.invitationForm.reset()
      }
    ).finally(
      () => { this.commonService.loaderHide() }
    )
  }
  readContentOfexcel(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // console.log(XLSX.utils.sheet_to_json(ws));

      /* save data */
      let temp = XLSX.utils.sheet_to_json(ws).map((data:any)=>{
        data.mobile=data.mobile.toString();
        return data;
      });
      this.data =[...temp]
      // temp.forEach((data: any[]) => {
      //   // delete data["__rowNum__"]
      //   this.data.push(data)
      // })
    };
    reader.readAsBinaryString(target.files[0]);
    reader.DONE

  }
   handleResults(contacts: any) {
    console.log(contacts);
  this.contacts = contacts;
  let formattedContacts:any[] =[]
   this.contacts.forEach((elem:{})=>{
    let contact ={
      fname: '',
      mobile: null,
      count: 1,
      date: new Date(),
      completed: false,
      place: ''
    }
    contact.place = this.contactCity
    contact.mobile = elem['tel'][0]
    contact.fname =elem['name'][0]
    formattedContacts.push(contact)
  }  )
  this.contacts =formattedContacts;
this.inviteService.saveMany(this.contacts)
this.isContactInput = false

  }
  async updateContacts(){
    const props = ['name', 'tel', 'address'];
    const opts = {multiple: true};
    try {
      const contacts = await (navigator as any).contacts.select(props, opts);
      this.handleResults(contacts);
    } catch (ex) {
      // Handle any errors here.
    }}
}
