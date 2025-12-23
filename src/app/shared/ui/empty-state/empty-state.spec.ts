import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  const setup = async (inputs: { text: string; subtext?: string; icon?: string }) => {
    const fixture = TestBed.createComponent(EmptyState);

    fixture.componentRef.setInput('text', inputs.text);

    if (inputs.subtext !== undefined) {
      fixture.componentRef.setInput('subtext', inputs.subtext);
    }

    if (inputs.icon !== undefined) {
      fixture.componentRef.setInput('icon', inputs.icon);
    }

    fixture.detectChanges();
    await fixture.whenStable();

    return fixture;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState]
    })
      .compileComponents();
  });

  it('should create', async () => {
    const fixture = await setup({ text: 'No photos yet' });

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the required text', async () => {
    const text = 'No photos yet';
    const fixture = await setup({ text });
    const textElement = fixture.debugElement.query(By.css('.text'));

    expect(textElement.nativeElement.textContent.trim()).toBe(text);
  });

  it('should render the default icon when none is provided', async () => {
    const fixture = await setup({ text: 'No photos yet' });
    const iconElement = fixture.debugElement.query(By.css('.icon'));

    expect(iconElement.nativeElement.textContent.trim()).toBe('info');
  });

  it('should render a custom icon when provided', async () => {
    const icon = 'photo';
    const fixture = await setup({ text: 'No photos yet', icon });
    const iconElement = fixture.debugElement.query(By.css('.icon'));

    expect(iconElement.nativeElement.textContent.trim()).toBe(icon);
  });

  it('should render the subtext when provided', async () => {
    const subtext = 'Upload your first photo to get started.';
    const fixture = await setup({ text: 'No photos yet', subtext });
    const subtextElement = fixture.debugElement.query(By.css('.subtext'));

    expect(subtextElement).toBeTruthy();
    expect(subtextElement.nativeElement.textContent.trim()).toBe(subtext);
  });

  it('should not render the subtext when it is not provided', async () => {
    const fixture = await setup({ text: 'No photos yet' });
    const subtextElement = fixture.debugElement.query(By.css('.subtext'));

    expect(subtextElement).toBeFalsy();
  });
});
