import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../services/records.service';
import { AuthService } from '../services/auth.service';
import { NgForOf, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe
  ],
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  records: any[] = [];
  userRecords: any[] = [];
  username: string | null = null;

  constructor(private recordsService: RecordsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.recordsService.fetchTopTenScores().subscribe(
      data => this.records = data,
      error => console.error('Error fetching data:', error)
    );

    if (this.authService.isAuthorized()) {
      this.username = localStorage.getItem('username');
      if (this.username) {
        this.recordsService.fetchUserTopTenScores(this.username).subscribe(
          data => this.userRecords = data,
          error => console.error('Error fetching user data:', error)
        );
      }
    }
  }
}
