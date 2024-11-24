import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from "../button/button.component";

@Component({
  selector: 'app-home',
    imports: [
        RouterLink,
        ButtonComponent
    ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
