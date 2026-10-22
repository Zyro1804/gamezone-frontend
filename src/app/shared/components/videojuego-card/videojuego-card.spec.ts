import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideojuegoCard } from './videojuego-card';

describe('VideojuegoCard', () => {
  let component: VideojuegoCard;
  let fixture: ComponentFixture<VideojuegoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideojuegoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(VideojuegoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
