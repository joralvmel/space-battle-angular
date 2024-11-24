import { Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLink
  ],
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() btnClass: string = 'btn btn-primary';
  @Input() routerLink: string = '';
  @Input() disabled: boolean = false;
}
