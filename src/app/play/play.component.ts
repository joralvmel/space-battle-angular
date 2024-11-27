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
  timerInterval: any;

  constructor(protected gameService: GameService) {}

  ngOnInit() {
    this.initGame();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
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
  }

  resetGame() {
    this.gameService.ufos.next([]);
    this.gameService.time.next(60);
    this.gameService.score.next(0);
    clearInterval(this.timerInterval);
  }

  generateUfos(count: number) {
    for (let i = 0; i < count; i++) {
      const ufo = {
        id: i,
        x: Math.random() * 90,
        y: Math.random() * 50
      };
      this.gameService.addUfo(ufo);
    }
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

  public endGame() {
    alert('Game Over!');
    clearInterval(this.timerInterval);
    this.initGame();
    // TODO Implement modal logic here
  }
}
