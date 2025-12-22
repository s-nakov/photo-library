import { Component, input } from '@angular/core';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Link {
  label: string;
  path: string;
  routerLinkActiveOptions: {
    exact: boolean;
  }
}

@Component({
  selector: 'app-header',
  imports: [MatTabsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  tabPanel = input.required<MatTabNavPanel>();

  links = <Array<Link>>[
    { label: 'Photos', path: '/', routerLinkActiveOptions: { exact: true } },
    { label: 'Favorites', path: '/favorites', routerLinkActiveOptions: { exact: false } }
  ];
}
