import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkCompletedComponent } from './mark-completed.component';

describe('MarkCompletedComponent', () => {
  let component: MarkCompletedComponent;
  let fixture: ComponentFixture<MarkCompletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarkCompletedComponent]
    });
    fixture = TestBed.createComponent(MarkCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
