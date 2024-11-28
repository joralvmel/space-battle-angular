import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from './services/game.service';
import { BattleshipComponent } from './battleship/battleship.component';
import { UfoComponent } from './ufo/ufo.component';
import { LaserComponent } from './laser/laser.component';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  standalone: true,
  imports: [
    BattleshipComponent,
    UfoComponent,
    LaserComponent,
    NgForOf,
    AsyncPipe
  ],
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {
  timerInterval: ReturnType<typeof setInterval> | undefined;
  animationFrameId: ReturnType<typeof setInterval> | undefined;
  lastUpdateTime: number = 0;

  constructor(protected gameService: GameService) {}

  ngOnInit() {
    this.initGame();
  }

  ngOnDestroy() {
    this.clearIntervals();
  }

  initGame() {
    this.resetGame();

    const gameTime = localStorage.getItem('gameTime');
    const numUFOs = localStorage.getItem('numUFOs');

    const time = gameTime ? parseInt(gameTime, 10) : 60;
    const ufos = numUFOs ? parseInt(numUFOs, 10) : 5;

    this.gameService.time.next(time);
    this.generateUfos(ufos);
    this.startTimer();
    this.startAnimationLoop();
  }

  resetGame() {
    this.gameService.ufos.next([]);
    this.gameService.time.next(60);
    this.gameService.score.next(0);
    this.clearIntervals();
  }

  public endGame() {
    alert('Game Over!');
    this.clearIntervals();
    this.initGame();
    // TODO Implement modal logic here
  }

  generateUfos(count: number) {
    for (let i = 0; i < count; i++) {
      const ufo = {
        id: i,
        x: Math.random() * 90,
        y: Math.random() * 50,
        direction: Math.random() < 0.5 ? 'left' as 'left' : 'right' as 'right',
        speed: 5 + Math.random() * 5,
        isExploding: false
      };
      this.gameService.addUfo(ufo);
    }
  }

  updateUfoPositions(elapsedTime: number) {
    const ufoWidth = 40;
    const maxRight = 100 - (ufoWidth / window.innerWidth) * 100;
    const oscillationSpeed = 0.005;

    const ufos = this.gameService.ufos.getValue().map(ufo => {
      const distance = ufo.speed * (elapsedTime / 1000);
      if (ufo.direction === 'left') {
        ufo.x -= distance;
        if (ufo.x <= 0) {
          ufo.direction = 'right';
        }
      } else {
        ufo.x += distance;
        if (ufo.x >= maxRight) {
          ufo.direction = 'left';
        }
      }

      const timeFactor = performance.now() * oscillationSpeed;
      const phaseOffset = ufo.id * Math.PI / 4;
      ufo.y += Math.sin(timeFactor + phaseOffset) * 0.1;
      return ufo;
    });
    this.gameService.ufos.next(ufos);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const currentTime = this.gameService.time.getValue();
      if (currentTime > 0) {
        this.gameService.time.next(currentTime - 1);
      } else {
        clearInterval(this.timerInterval);
        this.endGame();
      }
    }, 1000);
  }

  startAnimationLoop() {
    const intervalTime = 16;

    this.animationFrameId = setInterval(() => {
      const timestamp = performance.now();
      if (!this.lastUpdateTime) {
        this.lastUpdateTime = timestamp;
      }
      const elapsedTime = timestamp - this.lastUpdateTime;
      this.updateUfoPositions(elapsedTime);
      this.lastUpdateTime = timestamp;
    }, intervalTime);
  }

  clearIntervals() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.animationFrameId) {
      clearInterval(this.animationFrameId);
    }
  }
}
