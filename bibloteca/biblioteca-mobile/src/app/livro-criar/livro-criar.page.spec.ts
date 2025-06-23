import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivroCriarPage } from './livro-criar.page';

describe('LivroCriarPage', () => {
  let component: LivroCriarPage;
  let fixture: ComponentFixture<LivroCriarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LivroCriarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
