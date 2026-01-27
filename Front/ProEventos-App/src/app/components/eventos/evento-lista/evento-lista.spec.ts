import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoLista } from './evento-lista';

describe('EventoLista', () => {
  let component: EventoLista;
  let fixture: ComponentFixture<EventoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
