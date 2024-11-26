import { Component, Input } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-ufo',
  templateUrl: './ufo.component.html',
  standalone: true,
  styleUrls: ['./ufo.component.css']
})
export class UfoComponent {
  @Input() ufo!: { id: number; x: number; y: number };

  constructor(private gameService: GameService) {}

  onHit() {
    this.gameService.removeUfo(this.ufo.id);
    const currentScore = this.gameService.score.getValue();
    this.gameService.score.next(currentScore + 100);
  }
}
