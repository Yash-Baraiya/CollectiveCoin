import { Component, HostListener, OnInit } from '@angular/core';
import { ClearStorageService } from './shared/clear-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CollectiveCoin';

  constructor(private clearstorage: ClearStorageService) {}

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    this.clearstorage.clearLocalStorage();
  }

  @HostListener('window:unload', ['$event'])
  onUnload(event: Event) {
    this.clearstorage.clearLocalStorage();
  }
}
