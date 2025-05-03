import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPreviewComponent } from './portfolio-preview.component';

describe('PortfolioPreviewComponent', () => {
  let component: PortfolioPreviewComponent;
  let fixture: ComponentFixture<PortfolioPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
