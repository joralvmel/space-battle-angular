import { Component, HostListener } from '@angular/core';
import { GameService } from '../services/game.service';
import { AsyncPipe } from '@angular/common';

const BATTLESHIP_WIDTH = 40;

@Component({
  selector: 'app-battleship',
  templateUrl: './battleship.component.html',
  standalone: true,
  imports: [AsyncPipe],
  styleUrls: ['./battleship.component.css']
})
export class BattleshipComponent {
  constructor(protected gameService: GameService) {}

  private calculateMaxRight = (): number => 100 - (BATTLESHIP_WIDTH / window.innerWidth) * 100;

  private calculateBoundedX = (clientX: number): number => {
    const maxRight = window.innerWidth - BATTLESHIP_WIDTH;
    const x = (clientX / window.innerWidth) * 100;
    return Math.min(Math.max(x, 0), (maxRight / window.innerWidth) * 100);
  };

  @HostListener('window:mousemove', ['$event'])
  move = (event: MouseEvent) => {
    if (this.gameService.gameActive.getValue()) {
      const boundedX = this.calculateBoundedX(event.clientX);
      this.gameService.battleshipPosition.next(boundedX);
    }
  };

  @HostListener('window:keydown', ['$event'])
  onKeydown = (event: KeyboardEvent) => {
    if (this.gameService.gameActive.getValue()) {
      const currentPosition = this.gameService.battleshipPosition.getValue();
      const maxRight = this.calculateMaxRight();

      if (event.key === 'ArrowLeft') {
        this.gameService.battleshipPosition.next(Math.max(currentPosition - 1, 0));
      } else if (event.key === 'ArrowRight') {
        this.gameService.battleshipPosition.next(Math.min(currentPosition + 1, maxRight));
      }
    }
   };
}
