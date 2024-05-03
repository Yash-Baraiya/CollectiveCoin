import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateexpenseComponent } from './updateexpense.component';

describe('UpdateexpenseComponent', () => {
  let component: UpdateexpenseComponent;
  let fixture: ComponentFixture<UpdateexpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateexpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
