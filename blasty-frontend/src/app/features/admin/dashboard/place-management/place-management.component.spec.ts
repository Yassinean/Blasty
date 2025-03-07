import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceManagementComponent } from './place-management.component';

describe('PlaceManagementComponent', () => {
  let component: PlaceManagementComponent;
  let fixture: ComponentFixture<PlaceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
