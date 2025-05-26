import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckSimulationComponent } from './truck-simulation.component';

describe('TruckSimulationComponent', () => {
  let component: TruckSimulationComponent;
  let fixture: ComponentFixture<TruckSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckSimulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TruckSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
