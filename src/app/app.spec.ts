import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { MainLayout } from './core/layouts/main-layout/main-layout';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([{ path: '', component: MainLayout }])],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it('should render the main layout for the root route', async () => {
    await harness.navigateByUrl('/');

    const routeElement = harness.routeNativeElement as HTMLElement | null;

    expect(routeElement?.querySelector('.main-layout-container')).toBeTruthy();
  });
});
