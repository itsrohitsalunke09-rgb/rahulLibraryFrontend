import { Component, OnInit } from '@angular/core';
import { LibraryApiService } from '../library-api.service';
import { BookIssue, PagedResponse } from '../models';
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

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sortField = 'issueDate';
  sortDirection = 'desc';

  constructor(
    private api: LibraryApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
  }

  loadData() {
    this.loading = true;
    this.api.myIssuesPaged(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (response: any) => {
        this.issues = response.content || response;
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.loadData();
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
      accept: () => this.returnBook(issue)
    });
  }

  returnBook(issue: BookIssue) {
    this.api.returnBook(issue.id).subscribe({
      next: () => {
        this.loadData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book returned successfully.' });
      },
      error: () => {}
    });
  }

}
