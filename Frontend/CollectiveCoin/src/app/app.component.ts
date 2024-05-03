import { Component, HostListener, ViewChild } from '@angular/core';
import { ClearStorageService } from './shared/services/clear-storage.service';
import { LoginDataService } from './shared/services/login-data.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CollectiveCoin';
  @ViewChild(SidebarComponent) sidebarcomponent!: SidebarComponent;
  constructor() {}
}
