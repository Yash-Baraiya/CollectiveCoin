import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCartComponent } from './bar-cart.component';

describe('BarCartComponent', () => {
  let component: BarCartComponent;
  let fixture: ComponentFixture<BarCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarCartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
