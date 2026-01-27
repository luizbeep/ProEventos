import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoDetalhe } from './evento-detalhe';

describe('EventoDetalhe', () => {
  let component: EventoDetalhe;
  let fixture: ComponentFixture<EventoDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
