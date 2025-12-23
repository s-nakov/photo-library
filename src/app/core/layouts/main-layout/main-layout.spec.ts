import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTabNavPanel } from '@angular/material/tabs';
import { provideRouter, RouterOutlet } from '@angular/router';

import { Header } from '../../navigation/header/header';
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  const setup = async (templateOverride?: string) => {
    TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([])]
    });

    if (templateOverride) {
      TestBed.overrideComponent(MainLayout, { set: { template: templateOverride } });
    }

    await TestBed.compileComponents();

    const fixture = TestBed.createComponent(MainLayout);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    return { component, fixture };
  };

  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should render the header when the tab panel is available', async () => {
    const { fixture } = await setup();
    const tabPanelDebugElement = fixture.debugElement.query(By.directive(MatTabNavPanel));
    const headerDebugElement = fixture.debugElement.query(By.directive(Header));

    expect(tabPanelDebugElement).toBeTruthy();
    expect(headerDebugElement).toBeTruthy();
  });

  it('should not render the header when the tab panel is unavailable', async () => {
    const templateOverride = `
      <div class="main-layout-container">
        <div class="header-container">
          @let tabPanel = null;
          @if (tabPanel) {
            <app-header [tabPanel]="tabPanel"></app-header>
          }
        </div>

        <main class="main-content"></main>
      </div>
    `;
    const { fixture } = await setup(templateOverride);
    const headerDebugElement = fixture.debugElement.query(By.directive(Header));

    expect(headerDebugElement).toBeFalsy();
  });

  it('should pass the mat tab panel instance to the header input', async () => {
    const { fixture } = await setup();
    const headerDebugElement = fixture.debugElement.query(By.directive(Header));
    const tabPanelDebugElement = fixture.debugElement.query(By.directive(MatTabNavPanel));

    expect(headerDebugElement).toBeTruthy();
    expect(tabPanelDebugElement).toBeTruthy();

    const headerInstance = headerDebugElement.componentInstance as Header;
    const tabPanelInstance = tabPanelDebugElement.injector.get(MatTabNavPanel);

    expect(headerInstance.tabPanel()).toBe(tabPanelInstance);
  });

  it('should render a router outlet inside the tab panel', async () => {
    const { fixture } = await setup();
    const routerOutletDebugElement = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(routerOutletDebugElement).toBeTruthy();
  });
});
