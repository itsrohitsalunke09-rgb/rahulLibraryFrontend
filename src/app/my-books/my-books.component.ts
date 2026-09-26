import { Component, OnInit } from '@angular/core';
import { LibraryApiService } from '../library-api.service';
import { BookIssue } from '../models';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss']
})
export class MyBooksComponent implements OnInit {
  issues: BookIssue[] = [];
  error = '';

  constructor(private api: LibraryApiService) {}

  ngOnInit() {
    this.api.myIssues().subscribe({
      next: issues => this.issues = issues,
      error: () => this.error = 'Could not load your books.'
    });
  }

  badge(status: string) {
    if (status === 'RETURNED') { return 'ok'; }
    if (status === 'OVERDUE') { return 'danger'; }
    return 'warn';
  }
}
