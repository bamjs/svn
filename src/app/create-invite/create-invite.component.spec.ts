import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInviteComponent } from './create-invite.component';

describe('InviteCompleteComponent', () => {
  let component: CreateInviteComponent;
  let fixture: ComponentFixture<CreateInviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInviteComponent]
    });
    fixture = TestBed.createComponent(CreateInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
