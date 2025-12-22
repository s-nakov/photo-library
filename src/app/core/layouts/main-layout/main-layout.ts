import { Component } from '@angular/core';
import { Header } from "../../navigation/header/header";
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-main-layout',
  imports: [Header, RouterOutlet, MatTabsModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
