import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_GAME_TIME = 60;
const DEFAULT_NUM_UFOS = 5;
const LASER_HIT_SCORE = 100;
const LASER_MISS_PENALTY = 20;
const UFO_EXPLOSION_DELAY = 500;
const TIMER_INTERVAL = 1000;
const ANIMATION_INTERVAL = 16;
const LASER_SPEED = 2;
const LASER_ANIMATION_INTERVAL = 50;
const MAX_RIGHT = 100 - (40 / window.innerWidth) * 100;

@Injectable({
  providedIn: 'root',
})
export class GameService implements OnDestroy {
  private endGameCallback: (() => void) | null = null;

  score = new BehaviorSubject<number>(0);
  time = new BehaviorSubject<number>(DEFAULT_GAME_TIME);
  ufos = new BehaviorSubject<{ id: number; x: number; y: number; isExploding: boolean; direction: 'left' | 'right'; speed: number; }[]>([]);
  lasers = new BehaviorSubject<{ x: number; y: number }[]>([]);
  battleshipPosition = new BehaviorSubject<number>(50);
  gameActive = new BehaviorSubject<boolean>(true);
  timerInterval: ReturnType<typeof setInterval> | undefined;
  animationFrameId: ReturnType<typeof setInterval> | undefined;
  laserInterval: ReturnType<typeof setInterval> | undefined;
  lastUpdateTime: number = 0;

  ngOnDestroy() {
    this.clearIntervals();
  }

  markUfoAsHit(id: number) {
    const updated = this.ufos.getValue().map(ufo =>
      ufo.id === id ? { ...ufo, isExploding: true } : ufo
    );
    this.ufos.next(updated);
    this.score.next(this.score.getValue() + LASER_HIT_SCORE);
    setTimeout(() => this.removeUfo(id), UFO_EXPLOSION_DELAY);
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
    this.time.next(DEFAULT_GAME_TIME);
    this.score.next(0);
    this.gameActive.next(true);
  }

  initGame() {
    this.resetGame();
    const gameTime = localStorage.getItem('gameTime');
    const numUFOs = localStorage.getItem('numUFOs');
    this.time.next(gameTime ? parseInt(gameTime, 10) : DEFAULT_GAME_TIME);
    this.generateUfos(numUFOs ? parseInt(numUFOs, 10) : DEFAULT_NUM_UFOS);
  }

  generateUfos(count: number) {
    const ufos = Array.from({ length: count }, (_, i) => this.createUfo(i));
    this.ufos.next(ufos);
  }

  private createUfo(id: number) {
    return {
      id,
      x: Math.random() * MAX_RIGHT,
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
    }, TIMER_INTERVAL);
  }

  startAnimationLoop(updateUfoPositionsCallback: (elapsedTime: number) => void) {
    this.animationFrameId = setInterval(() => {
      const timestamp = performance.now();
      if (!this.lastUpdateTime) {
        this.lastUpdateTime = timestamp;
      }
      const elapsedTime = timestamp - this.lastUpdateTime;
      updateUfoPositionsCallback(elapsedTime);
      this.lastUpdateTime = timestamp;
    }, ANIMATION_INTERVAL);
  }

  clearIntervals() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.animationFrameId) {
      clearInterval(this.animationFrameId);
    }
    if (this.laserInterval) {
      clearInterval(this.laserInterval);
    }
  }

  updateUfoPositions(elapsedTime: number) {
    const ufos = this.ufos.getValue().map(ufo => {
      const distance = ufo.speed * (elapsedTime / 1000);
      if (ufo.direction === 'left') {
        ufo.x -= distance;
        if (ufo.x <= 0) {
          ufo.direction = 'right';
        }
      } else {
        ufo.x += distance;
        if (ufo.x >= MAX_RIGHT) {
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

  addLaser(laser: { x: number; y: number }) {
    const lasers = this.lasers.getValue();
    lasers.push(laser);
    this.lasers.next(lasers);

    if (!this.laserInterval) {
      this.startLaserAnimation();
    }
  }

  private startLaserAnimation() {
    this.laserInterval = setInterval(() => {
      this.updateLaserPositions();
    }, LASER_ANIMATION_INTERVAL);
  }

  clearLaserAnimation() {
    if (this.laserInterval) {
      clearInterval(this.laserInterval);
      this.laserInterval = undefined;
    }
  }

  private updateLaserPositions() {
    const lasers = this.lasers.getValue()
      .map(laser => this.moveLaser(laser))
      .filter(laser => this.isLaserInBounds(laser));
    this.lasers.next(lasers);
    this.checkCollision();
  }

  private moveLaser(laser: { x: number; y: number }) {
    return { x: laser.x, y: laser.y - LASER_SPEED };
  }

  private isLaserInBounds(laser: { x: number; y: number }) {
    if (laser.y < 0) {
      this.reduceScoreForMiss();
      return false;
    }
    return true;
  }

  private checkCollision() {
    const ufos = this.ufos.getValue();
    const lasers = this.lasers.getValue();
    const remainingLasers: { x: number; y: number }[] = [];

    lasers.forEach(laser => {
      const hitUfo = ufos.find(ufo =>
        !ufo.isExploding &&
        laser.x >= ufo.x && laser.x <= ufo.x + 5 &&
        laser.y >= ufo.y && laser.y <= ufo.y + 5
      );

      if (hitUfo) {
        this.markUfoAsHit(hitUfo.id);
      } else {
        remainingLasers.push(laser);
      }
    });

    this.lasers.next(remainingLasers);

    if (this.ufos.getValue().length === 0 && this.endGameCallback) {
      this.endGameCallback();
    }
  }

  private reduceScoreForMiss() {
    const currentScore = this.score.getValue();
    this.score.next(currentScore - LASER_MISS_PENALTY);
  }
}
