import { Component, HostListener } from '@angular/core';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';
import { PlayComponent } from '../play.component';

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
  private gameStarted = false;

  constructor(private gameService: GameService, private playComponent: PlayComponent) {
    this.gameService.time.subscribe(time => {
      if (time === 60) {
        this.gameStarted = true;
      }
    });
  }

  @HostListener('window:click', ['$event'])
  onLeftClick(event: MouseEvent) {
    if (event.button === 0 && this.gameStarted) {
      this.fireLaser();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onSpacePress(event: KeyboardEvent) {
    if (event.code === 'Space' && this.gameStarted) {
      this.fireLaser();
    }
  }

  private fireLaser() {
    const x = this.gameService.battleshipPosition.getValue() + 1.1;
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
      .filter(laser => {
        if (laser.y < 0) {
          this.reduceScoreForMiss();
          return false;
        }
        return true;
      });
    this.checkCollision();
  }

  private checkCollision() {
    const ufos = this.gameService.ufos.getValue();
    const remainingLasers: { x: number; y: number }[] = [];

    this.lasers.forEach(laser => {
      const hitUfo = ufos.find(ufo =>
        !ufo.isExploding && // Ignore if already exploding
        laser.x >= ufo.x && laser.x <= ufo.x + 5 &&
        laser.y >= ufo.y && laser.y <= ufo.y + 5
      );

      if (hitUfo) {
        this.gameService.markUfoAsHit(hitUfo.id);
      } else {
        remainingLasers.push(laser);
      }
    });

    this.lasers = remainingLasers;

    if (this.gameService.ufos.getValue().length === 0) {
      this.playComponent.endGame();
    }
  }

  private reduceScoreForMiss() {
    const currentScore = this.gameService.score.getValue();
    this.gameService.score.next(currentScore - 20);
  }
}
