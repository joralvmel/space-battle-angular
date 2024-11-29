import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../services/records.service';
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

  constructor(private recordsService: RecordsService) {}

  ngOnInit(): void {
    this.recordsService.fetchTopTenScores().subscribe(
      data => this.records = data,
      error => console.error('Error fetching data:', error)
    );
  }
}
