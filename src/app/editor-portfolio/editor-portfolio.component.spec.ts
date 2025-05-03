import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPortfolioComponent } from './editor-portfolio.component';

describe('EditorPortfolioComponent', () => {
  let component: EditorPortfolioComponent;
  let fixture: ComponentFixture<EditorPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
