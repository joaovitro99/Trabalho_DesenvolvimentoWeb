import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmprestimoPage } from './emprestimo.page';

describe('EmprestimoPage', () => {
  let component: EmprestimoPage;
  let fixture: ComponentFixture<EmprestimoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmprestimoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
