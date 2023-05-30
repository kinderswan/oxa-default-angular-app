import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCodeComponent } from './send-code.component';

describe('SendCodeComponent', () => {
  let component: SendCodeComponent;
  let fixture: ComponentFixture<SendCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SendCodeComponent]
    });
    fixture = TestBed.createComponent(SendCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
