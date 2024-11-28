import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GameService } from './services/game.service';
import { BattleshipComponent } from './battleship/battleship.component';
import { UfoComponent } from './ufo/ufo.component';
import { LaserComponent } from './laser/laser.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  standalone: true,
  imports: [
    BattleshipComponent,
    UfoComponent,
    LaserComponent,
    NgForOf,
    AsyncPipe,
    ModalComponent
  ],
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {
  modalTitle: string = '';
  modalMessage: string = '';
  private routerSubscription: Subscription | undefined;

  @ViewChild(ModalComponent) modal!: ModalComponent;

  constructor(protected gameService: GameService, private router: Router) {}

  ngOnInit() {
    this.gameService.initGame();
    this.gameService.startTimer(() => this.handleEndGame());
    this.gameService.startAnimationLoop((elapsedTime) => this.gameService.updateUfoPositions(elapsedTime));

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.gameService.initGame();
      }
    });

    this.gameService.setEndGameCallback(() => this.handleEndGame());
  }

  ngOnDestroy() {
    this.gameService.clearIntervals();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  handleEndGame() {
    this.gameService.endGame();
    const finalScore = this.gameService.calculateFinalScore();
    this.modalTitle = 'Game Over';
    this.modalMessage = `Your final score is ${finalScore}.`;
    this.modal.showModal();
  }

  playAgain() {
    this.modal.hideModal();
    setTimeout(() => {
      this.gameService.initGame();
      this.gameService.startTimer(() => this.handleEndGame());
      this.gameService.startAnimationLoop((elapsedTime) => this.gameService.updateUfoPositions(elapsedTime));
    }, 100);
  }

  navigateToRecords() {
    this.router.navigate(['/records']).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}
