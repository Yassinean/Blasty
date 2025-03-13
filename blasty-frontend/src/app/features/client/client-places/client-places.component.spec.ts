import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPlacesComponent } from './client-places.component';

describe('ClientPlacesComponent', () => {
  let component: ClientPlacesComponent;
  let fixture: ComponentFixture<ClientPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPlacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
