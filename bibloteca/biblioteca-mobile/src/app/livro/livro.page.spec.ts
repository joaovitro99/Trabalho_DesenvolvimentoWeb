import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivroPage } from './livro.page';

describe('LivroPage', () => {
  let component: LivroPage;
  let fixture: ComponentFixture<LivroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LivroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
