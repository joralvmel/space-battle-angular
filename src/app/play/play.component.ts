import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GameService } from '../services/game.service';
import { BattleshipComponent } from './battleship/battleship.component';
import { UfoComponent } from './ufo/ufo.component';
import { LaserComponent } from './laser/laser.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

const MODAL_TITLE_GAME_OVER = 'Game Over';
const MODAL_MESSAGE_SCORE = 'Your final score is ';

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
    this.initializeGame();
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.initializeGame();
      }
    });
  }

  ngOnDestroy() {
    this.cleanup();
    this.gameService.stopPlaySong();
  }

  private initializeGame() {
    this.gameService.initGame();
    this.gameService.startTimer(() => this.handleEndGame());
    this.gameService.startAnimationLoop((elapsedTime) => this.gameService.updateUfoPositions(elapsedTime));
    this.gameService.setEndGameCallback(() => this.handleEndGame());
  }

  private cleanup() {
    this.gameService.clearIntervals();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private handleEndGame() {
    this.gameService.endGame();
    const finalScore = this.gameService.calculateFinalScore();
    this.modalTitle = MODAL_TITLE_GAME_OVER;
    this.modalMessage = `${MODAL_MESSAGE_SCORE}${finalScore}.`;
    this.modal.showModal();
  }

  playAgain() {
    this.modal.hideModal();
    setTimeout(() => {
      this.initializeGame();
    }, 100);
  }

  navigateToRecords() {
    this.router.navigate(['/records']).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  saveRecord() {
    console.log(`${this.gameService.calculateFinalScore()} score saved`);
  }
}
