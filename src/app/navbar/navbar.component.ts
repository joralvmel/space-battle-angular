import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateLoginStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLoginStatus();
    });
  }

  updateLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.changeDetectorRef.detectChanges();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.changeDetectorRef.detectChanges();
    this.router.navigate(['/login']);
  }
}
