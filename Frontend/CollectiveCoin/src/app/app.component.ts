import { Component, HostListener, ViewChild } from '@angular/core';
import { ClearStorageService } from './shared/clear-storage.service';
import { LoginDataService } from './shared/login-data.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CollectiveCoin';
  @ViewChild(SidebarComponent) sidebarcomponent!: SidebarComponent;
  constructor(
    private clearstorage: ClearStorageService,
    private logindataservice: LoginDataService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    this.clearstorage.clearLocalStorage();
  }

  @HostListener('window:unload', ['$event'])
  onUnload(event: Event) {
    const loginToken = localStorage.getItem('LoginToken');
    console.log(loginToken);

    this.clearstorage.clearLocalStorage();
  }
}
