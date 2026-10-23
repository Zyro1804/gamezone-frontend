import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideojuegoFormModal } from './videojuego-form-modal';

describe('VideojuegoFormModal', () => {
  let component: VideojuegoFormModal;
  let fixture: ComponentFixture<VideojuegoFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideojuegoFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(VideojuegoFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
