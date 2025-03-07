import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingManagementComponent } from './parking-management.component';

describe('ParkingManagementComponent', () => {
  let component: ParkingManagementComponent;
  let fixture: ComponentFixture<ParkingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
