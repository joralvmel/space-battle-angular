import { Component, HostListener } from '@angular/core';
import { GameService } from '../services/game.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-battleship',
  templateUrl: './battleship.component.html',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./battleship.component.css']
})
export class BattleshipComponent {
  private readonly battleshipWidth = 40;

  constructor(protected gameService: GameService) {}

  private calculateMaxRight(): number {
    return 100 - (this.battleshipWidth / window.innerWidth) * 100;
  }

  private calculateBoundedX(clientX: number): number {
    const maxRight = window.innerWidth - this.battleshipWidth;
    const x = (clientX / window.innerWidth) * 100;
    return Math.min(Math.max(x, 0), (maxRight / window.innerWidth) * 100);
  }

  @HostListener('window:mousemove', ['$event'])
  move(event: MouseEvent) {
    const boundedX = this.calculateBoundedX(event.clientX);
    this.gameService.battleshipPosition.next(boundedX);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const currentPosition = this.gameService.battleshipPosition.getValue();
    const maxRight = this.calculateMaxRight();

    if (event.key === 'ArrowLeft') {
      this.gameService.battleshipPosition.next(Math.max(currentPosition - 1, 0));
    } else if (event.key === 'ArrowRight') {
      this.gameService.battleshipPosition.next(Math.min(currentPosition + 1, maxRight));
    }
  }
}
