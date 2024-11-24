import { Component, OnInit } from '@angular/core';
import { PreferencesService } from './preferences.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  numUFOs: number = 5;
  gameTime: number = 60;

  constructor(private preferencesService: PreferencesService) { }

  ngOnInit(): void {
    const preferences = this.preferencesService.loadPreferences();
    this.numUFOs = preferences.numUFOs;
    this.gameTime = preferences.gameTime;
  }

  savePreferences(): void {
    this.preferencesService.savePreferences(this.numUFOs, this.gameTime);
    alert('Preferences Saved');
  }
}
