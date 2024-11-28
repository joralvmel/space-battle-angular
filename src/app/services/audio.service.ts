import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private menuSong = new Audio('assets/audio/menu-song.mp3');
  private isPlaying = false;

  playMenuSong() {
    if (!this.isPlaying) {
      this.menuSong.loop = true;
      this.menuSong.play();
      this.isPlaying = true;
    }
  }

  stopMenuSong() {
    if (this.isPlaying) {
      this.menuSong.pause();
      this.menuSong.currentTime = 0;
      this.isPlaying = false;
    }
  }
}

