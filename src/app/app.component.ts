import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AudioService } from './services/audio.service';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'space-battle-angular';

  constructor(private audioService: AudioService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/play') {
          this.audioService.stopMenuSong();
        } else {
          this.audioService.playMenuSong();
        }
      }
    });
  }
}
