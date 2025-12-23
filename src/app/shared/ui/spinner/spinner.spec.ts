import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Spinner } from './spinner';

describe('Spinner', () => {
  let component: Spinner;
  let fixture: ComponentFixture<Spinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spinner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a material progress spinner', () => {
    const spinnerDebugElement = fixture.debugElement.query(By.directive(MatProgressSpinner));

    expect(spinnerDebugElement).toBeTruthy();
  });

  it('should render the spinner in indeterminate mode', () => {
    const spinnerDebugElement = fixture.debugElement.query(By.directive(MatProgressSpinner));
    const spinnerInstance = spinnerDebugElement.componentInstance as MatProgressSpinner;

    expect(spinnerInstance.mode).toBe('indeterminate');
  });
});
