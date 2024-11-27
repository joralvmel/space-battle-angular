import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  score = new BehaviorSubject<number>(0);
  time = new BehaviorSubject<number>(60);
  ufos = new BehaviorSubject<{ id: number; x: number; y: number; isExploding: boolean }[]>([]);
  battleshipPosition = new BehaviorSubject<number>(50);

  addUfo(ufo: { id: number; x: number; y: number }) {
    const current = this.ufos.getValue();
    this.ufos.next([...current, { ...ufo, isExploding: false }]);
  }

  markUfoAsHit(id: number) {
    const current = this.ufos.getValue();
    const updated = current.map(ufo =>
      ufo.id === id ? { ...ufo, isExploding: true } : ufo
    );
    this.ufos.next(updated);
    const currentScore = this.score.getValue();
    this.score.next(currentScore + 100);
    setTimeout(() => this.removeUfo(id), 500);
  }

  removeUfo(id: number) {
    const current = this.ufos.getValue().filter(ufo => ufo.id !== id);
    this.ufos.next(current);
  }
}
