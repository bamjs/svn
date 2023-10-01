import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import { Invitation, InvitationService } from 'src/services/invitation.service';
import * as XLSX from 'xlsx';
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, from, map, of, pluck, switchMap, tap } from 'rxjs';
import { ToastService } from 'src/services/toast.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

type AOA = any[][];
@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.css']
})
export class CreateInviteComponent implements AfterViewInit, OnInit {
  @Output('inviteFormUpdate')
  inviteFormEvent = new EventEmitter();
  searching: boolean;
  isContactInput: boolean;
  isContactsNotSupported: boolean = false;
  public contactCity: string;
  searchFailed: boolean;
  contacts: any[];
  @Input()
  inputInvitation: Invitation
  @Input()
  editMode: boolean
  @Input()
  modalRef:NgbModalRef
  data: any[] = []
  invitationForm: FormGroup = this.formBuilder.group({
    fname: [''],
    mobile: null,
    count: 1,
    date: new Date(),
    completed: false,
    place: ''
  })
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastService: ToastService,
    private inviteService: InvitationService) {
    this.isContactInput = false;
  }
  mobileSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => this.search(text$, 'mobile')
  fnameSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => this.search(text$, 'fname')
  placeSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => this.search(text$, 'place')



  search = (text$: Observable<string>, column) => text$.pipe(
    debounceTime(50),
    distinctUntilChanged(),
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
  ngOnInit(): void {
    this.checkForContactSupport()
  }
  ngAfterViewInit(): void {
    if (this.editMode) {
      // this.invitationForm.get("fname")?.disable()
      // this.invitationForm.get("mobile")?.disable()
      // this.invitationForm.get("date")?.disable()
      this.invitationForm.get("fname").setValue(this.inputInvitation.fname)
      this.invitationForm.get("mobile").setValue(Array.isArray(this.inputInvitation.mobile) ? this.inputInvitation.mobile[0] : this.inputInvitation.mobile)
      this.invitationForm.get("date").setValue(this.inputInvitation.date)
      this.invitationForm.get("count").setValue(this.inputInvitation.count ?? 1);
      this.invitationForm.get("completed").setValue(this.inputInvitation.completed)
      this.invitationForm.get("place").setValue(this.inputInvitation.place)
      // console.log(this.invitationForm.errors);
      this.invitationForm.valueChanges.subscribe(data => {
        this.inviteFormEvent.emit(this.invitationForm.value)
      })
    }
  }

  createInvitation() {
    this.commonService.loaderShow()
    this.inviteService.save(this.invitationForm.value).then(
      () => {
        this.toastService.show(`New Guest Added`, { className: 'bg-success text-light', delay: 1500 })
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
      let temp = XLSX.utils.sheet_to_json(ws).map((data: any) => {
        data.mobile = data.mobile == null ? "" : data.mobile.toString();
        return data;
      });
      this.data = [...temp]
      console.log(this.data);

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
    let formattedContacts: any[] = []
    this.contacts.forEach((elem: {}) => {
      let contact = {
        fname: '',
        mobile: null,
        count: 1,
        date: new Date(),
        completed: false,
        place: ''
      }
      let telephones = []
      elem['tel'].forEach(e => telephones.push(e.replace(/\s/g, '').replace('-', '')))
      telephones = [...new Set(telephones)]
      contact.place = this.contactCity
      contact.mobile = telephones
      contact.fname = elem['name'][0]
      formattedContacts.push(contact)
    })
    this.contacts = formattedContacts;
    this.inviteService.saveMany(this.contacts)
    this.toastService.show(`Successfully imported ${this.contacts.length} contacts!`, { className: 'bg-success text-light', delay: 1500 })
    this.isContactInput = false

  }
  async updateContacts() {
    const props = ['name', 'tel', 'address'];
    const opts = { multiple: true };
    try {
      const contacts = await (navigator as any).contacts.select(props, opts);
      this.handleResults(contacts);
    } catch (ex) {
      // Handle any errors here.
    }
  }

  async getContacts() {
    let supported = ('contacts' in navigator && 'ContactsManager' in window);
    if (supported) {
      this.isContactInput = true
    } else {
      this.isContactsNotSupported = true
      this.toastService.show("Importing Contacts Not Supported", { className: "bg-danger text-light", delay: 1500 })
    }
  }
  update() {
    this.inviteService.updateWithId(this.inputInvitation["_id"],this.invitationForm.value).then(data => {
      console.log("updated",data);
      this.modalRef.close()
    }
    )
  }
  checkForContactSupport() {
    let supported = ('contacts' in navigator && 'ContactsManager' in window);
    if (!supported) {
      this.isContactsNotSupported = true
    }
  }
}
