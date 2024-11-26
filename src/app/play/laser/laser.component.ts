import { Component, HostListener } from '@angular/core';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-laser',
  templateUrl: './laser.component.html',
  standalone: true,
  styleUrls: ['./laser.component.css'],
  imports: [CommonModule]
})
export class LaserComponent {
  lasers: { x: number; y: number }[] = [];
  private interval: any;

  constructor(private gameService: GameService) {}

  @HostListener('window:click', ['$event'])
  onLeftClick(event: MouseEvent) {
    if (event.button === 0) {
      this.fireLaser();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onSpacePress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.fireLaser();
    }
  }

  private fireLaser() {
    const x = this.gameService.battleshipPosition.getValue() + 1.1 ;
    this.lasers.push({ x, y: 90 });

    if (!this.interval) {
      this.startLaserAnimation();
    }
  }

  private startLaserAnimation() {
    this.interval = setInterval(() => {
      this.updateLaserPositions();
    }, 50);
  }

  private updateLaserPositions() {
    this.lasers = this.lasers
      .map(laser => ({ x: laser.x, y: laser.y - 2 }))
      .filter(laser => laser.y >= 0);
  }

  private checkCollision() {
    // TODO add collision detection logic with UFOs
  }
}
