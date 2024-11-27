import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-explosion',
  template: `
    <div class="explosion" [style.left.%]="x" [style.top.%]="y"></div>
  `,
  styleUrls: ['./explosion.component.css'],
  standalone: true
})
export class ExplosionComponent implements OnInit {
  @Input() x!: number;
  @Input() y!: number;
  @Output() explosionEnded = new EventEmitter<void>();

  ngOnInit() {
    setTimeout(() => {
      this.explosionEnded.emit();
    }, 1000);
  }
}
