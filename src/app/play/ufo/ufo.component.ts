import { Component, Input } from '@angular/core';
import { GameService } from '../services/game.service';
import {NgIf} from '@angular/common';
import {ExplosionComponent} from './explosion/explosion.component';

@Component({
  selector: 'app-ufo',
  templateUrl: './ufo.component.html',
  standalone: true,
  styleUrls: ['./ufo.component.css'],
  imports: [
    NgIf,
    ExplosionComponent
  ]
})
export class UfoComponent {
  @Input() ufo!: { id: number; x: number; y: number; isExploding: boolean };

  constructor(private gameService: GameService) {}

  onHit() {
    this.gameService.markUfoAsHit(this.ufo.id);

    const currentScore = this.gameService.score.getValue();
    this.gameService.score.next(currentScore + 100);
  }
}
