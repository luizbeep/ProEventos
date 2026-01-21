import { TestBed } from '@angular/core/testing';
import { Artistas } from './artistas';

describe('Artistas', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Artistas] // Artistas já importa TituloComponent
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Artistas);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
