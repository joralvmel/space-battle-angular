import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor() { }

  savePreferences(numUFOs: number, gameTime: number): void {
    localStorage.setItem('numUFOs', numUFOs.toString());
    localStorage.setItem('gameTime', gameTime.toString());
  }

  loadPreferences(): { numUFOs: number, gameTime: number } {
    const numUFOs = parseInt(localStorage.getItem('numUFOs') || '5', 10);
    const gameTime = parseInt(localStorage.getItem('gameTime') || '60', 10);
    return { numUFOs, gameTime };
  }
}
