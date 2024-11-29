import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from "../button/button.component";
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ButtonComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  username: string | null = null;

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }
}
