import { Component, OnInit, ViewChild } from '@angular/core';
import { PreferencesService } from './preferences.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent
  ],
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  numUFOs: number = 5;
  gameTime: number = 60;
  modalTitle: string = '';
  modalMessage: string = '';

  @ViewChild(ModalComponent) modal!: ModalComponent;

  constructor(private preferencesService: PreferencesService, private router: Router) {}

  ngOnInit(): void {
    const preferences = this.preferencesService.loadPreferences();
    this.numUFOs = preferences.numUFOs;
    this.gameTime = preferences.gameTime;
  }

  savePreferences(): void {
    this.preferencesService.savePreferences(this.numUFOs, this.gameTime);
    this.modalTitle = 'Preferences Saved';
    this.modalMessage = 'Your preferences have been successfully saved.';
    this.modal.showModal();
  }

  navigateToPlay() {
    this.router.navigate(['/play']);
  }
}
