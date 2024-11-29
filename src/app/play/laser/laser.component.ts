import { Component, HostListener, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

const LASER_START_Y = 90;

@Component({
  selector: 'app-laser',
  templateUrl: './laser.component.html',
  standalone: true,
  styleUrls: ['./laser.component.css'],
  imports: [CommonModule]
})
export class LaserComponent implements OnDestroy {
  lasers: Observable<{ x: number; y: number }[]>;

  constructor(private gameService: GameService) {
    this.lasers = this.gameService.lasers.asObservable();

    this.gameService.gameActive.subscribe(active => {
      if (!active) {
        this.gameService.clearLaserAnimation();
      }
    });
  }

  ngOnDestroy() {
    this.gameService.clearLaserAnimation();
  }

  @HostListener('window:click', ['$event'])
  onLeftClick(event: MouseEvent) {
    if (event.button === 0 && this.gameService.gameActive.getValue() && !event.defaultPrevented) {
      this.fireLaser();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onSpacePress(event: KeyboardEvent) {
    if (event.code === 'Space' && this.gameService.gameActive.getValue()) {
      this.fireLaser();
    }
  }

  private fireLaser() {
    const x = this.gameService.battleshipPosition.getValue() + 1.1;
    this.gameService.addLaser({ x, y: LASER_START_Y });
  }
}
