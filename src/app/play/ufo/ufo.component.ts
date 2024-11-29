import { Component, Input } from '@angular/core';
import { GameService } from '../../services/game.service';
import { NgIf } from '@angular/common';
import { ExplosionComponent } from './explosion/explosion.component';

const UFO_HIT_SCORE = 100;

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
    this.gameService.score.next(this.gameService.score.getValue() + UFO_HIT_SCORE);
  }
}
