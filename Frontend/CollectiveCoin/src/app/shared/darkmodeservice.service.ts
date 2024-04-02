// theme-toggle.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeToggleService {
  darkModeEnabled: boolean = false;

  toggleTheme(): void {
    this.darkModeEnabled = !this.darkModeEnabled;
    const theme = this.darkModeEnabled ? 'dark' : '';
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}
