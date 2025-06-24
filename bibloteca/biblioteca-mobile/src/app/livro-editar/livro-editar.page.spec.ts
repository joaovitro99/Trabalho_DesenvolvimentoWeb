import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivroEditarPage } from './livro-editar.page';

describe('LivroEditarPage', () => {
  let component: LivroEditarPage;
  let fixture: ComponentFixture<LivroEditarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LivroEditarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
