import { Component, OnInit } from '@angular/core';
import { LibraryApiService } from '../library-api.service';
import { BookIssue } from '../models';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class MyBooksComponent implements OnInit {
  issues: BookIssue[] = [];
  loading = false;

  constructor(private api: LibraryApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.api.myIssues().subscribe({
      next: (issues: BookIssue[]) => {
        this.issues = issues;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load your books.' });
      }
    });
  }

  badge(status: string) {
    if (status === 'RETURNED') { return 'ok'; }
    if (status === 'OVERDUE') { return 'danger'; }
    return 'warn';
  }

  isOverdue(issue: any): boolean {
    if (issue.status !== 'ISSUED') return false;
    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    return dueDate < today;
  }

  confirmReturn(issue: BookIssue) {
    this.confirmationService.confirm({
      header: 'Confirm Return',
      message: `Mark "${issue.bookTitle}" as returned?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.returnBook(issue);
      }
    });
  }

  returnBook(issue: BookIssue) {
    this.api.returnBook(issue.id).subscribe({
      next: () => {
        this.reload();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book returned successfully.' });
      },
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not mark return.' })
    });
  }
}