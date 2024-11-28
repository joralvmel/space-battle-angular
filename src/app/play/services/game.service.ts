import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private endGameCallback: (() => void) | null = null;

  score = new BehaviorSubject<number>(0);
  time = new BehaviorSubject<number>(60);
  ufos = new BehaviorSubject<{ id: number; x: number; y: number; isExploding: boolean; direction: 'left' | 'right'; speed: number; }[]>([]);
  battleshipPosition = new BehaviorSubject<number>(50);
  gameActive = new BehaviorSubject<boolean>(true);
  timerInterval: ReturnType<typeof setInterval> | undefined;
  animationFrameId: ReturnType<typeof setInterval> | undefined;
  lastUpdateTime: number = 0;

  markUfoAsHit(id: number) {
    const current = this.ufos.getValue();
    const updated = current.map(ufo =>
      ufo.id === id ? { ...ufo, isExploding: true } : ufo
    );
    this.ufos.next(updated);
    this.score.next(this.score.getValue() + 100);
    setTimeout(() => this.removeUfo(id), 500);
  }

  removeUfo(id: number) {
    this.ufos.next(this.ufos.getValue().filter(ufo => ufo.id !== id));
    if (this.ufos.getValue().length === 0 && this.endGameCallback) {
      this.endGameCallback();
    }
  }

  endGame() {
    this.clearIntervals();
    this.gameActive.next(false);
  }

  resetGame() {
    this.ufos.next([]);
    this.time.next(60);
    this.score.next(0);
    this.gameActive.next(true);
  }

  initGame() {
    this.resetGame();

    const gameTime = localStorage.getItem('gameTime');
    const numUFOs = localStorage.getItem('numUFOs');

    this.time.next(gameTime ? parseInt(gameTime, 10) : 60);
    this.generateUfos(numUFOs ? parseInt(numUFOs, 10) : 5);
  }

  generateUfos(count: number) {
    const ufos = Array.from({ length: count }, (_, i) => this.createUfo(i));
    this.ufos.next(ufos);
  }

  private createUfo(id: number) {
    const maxRight = 100 - (40 / window.innerWidth) * 100;
    return {
      id,
      x: Math.random() * maxRight,
      y: Math.random() * 40,
      direction: Math.random() < 0.5 ? 'left' as 'left' : 'right' as 'right',
      speed: 5 + Math.random() * 5,
      isExploding: false
    };
  }

  startTimer(endGameCallback: () => void) {
    this.timerInterval = setInterval(() => {
      const currentTime = this.time.getValue();
      if (currentTime > 0) {
        this.time.next(currentTime - 1);
      } else {
        clearInterval(this.timerInterval);
        endGameCallback();
      }
    }, 1000);
  }

  startAnimationLoop(updateUfoPositionsCallback: (elapsedTime: number) => void) {
    const intervalTime = 16;

    this.animationFrameId = setInterval(() => {
      const timestamp = performance.now();
      if (!this.lastUpdateTime) {
        this.lastUpdateTime = timestamp;
      }
      const elapsedTime = timestamp - this.lastUpdateTime;
      updateUfoPositionsCallback(elapsedTime);
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

  updateUfoPositions(elapsedTime: number) {
    const maxRight = 100 - (40 / window.innerWidth) * 100;

    const ufos = this.ufos.getValue().map(ufo => {
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

      const timeFactor = performance.now() * 0.005;
      const phaseOffset = ufo.id * Math.PI / 4;
      ufo.y += Math.sin(timeFactor + phaseOffset) * 0.1;
      return ufo;
    });
    this.ufos.next(ufos);
  }

  calculateFinalScore(): number {
    const currentScore = this.score.getValue();
    const gameTime = localStorage.getItem('gameTime');
    const numUFOs = localStorage.getItem('numUFOs');
    const minutes = gameTime ? parseInt(gameTime, 10) / 60 : 1;
    let finalScore = currentScore / minutes;
    const ufoCount = numUFOs ? parseInt(numUFOs, 10) : 1;

    if (ufoCount > 1) {
      finalScore -= (ufoCount - 1) * 50;
    }

    return finalScore;
  }

  setEndGameCallback(callback: () => void) {
    this.endGameCallback = callback;
  }
}
