import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTabNav, MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { provideRouter, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Header } from './header';

@Component({
  template: `
    <app-header [tabPanel]="tabPanel"></app-header>
    <mat-tab-nav-panel></mat-tab-nav-panel>
  `,
  imports: [Header, MatTabsModule],
})
class HeaderHostComponent {
  @ViewChild(MatTabNavPanel, { static: true }) tabPanel!: MatTabNavPanel;
}

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<HeaderHostComponent>;
  let hostComponent: HeaderHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderHostComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(Header)).componentInstance as Header;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should bind the tab panel to the nav bar', () => {
    const navBar = fixture.debugElement.query(By.directive(MatTabNav)).componentInstance as MatTabNav;

    expect(navBar.tabPanel).toBe(hostComponent.tabPanel);
  });

  it('should render a tab link for each configured link', () => {
    const tabLinks = fixture.debugElement.queryAll(By.css('a[mat-tab-link]'));

    expect(tabLinks.length).toBe(component.links.length);
    tabLinks.forEach((linkDebugElement, index) => {
      expect(linkDebugElement.nativeElement.textContent.trim()).toBe(component.links[index].label);
    });
  });

  it('should wire router link directives with configured paths', () => {
    const router = TestBed.inject(Router);
    const routerLinks = fixture.debugElement.queryAll(By.directive(RouterLink));

    expect(routerLinks.length).toBe(component.links.length);
    routerLinks.forEach((linkDebugElement, index) => {
      const routerLink = linkDebugElement.injector.get(RouterLink);
      const urlTree = routerLink.urlTree;

      expect(urlTree).toBeTruthy();
      expect(router.serializeUrl(urlTree!)).toBe(component.links[index].path);
    });
  });

  it('should pass router link active options to each link', () => {
    const activeLinks = fixture.debugElement.queryAll(By.directive(RouterLinkActive));

    expect(activeLinks.length).toBe(component.links.length);
    activeLinks.forEach((linkDebugElement, index) => {
      const routerLinkActive = linkDebugElement.injector.get(RouterLinkActive);

      expect(routerLinkActive.routerLinkActiveOptions).toEqual(
        component.links[index].routerLinkActiveOptions
      );
    });
  });
});
