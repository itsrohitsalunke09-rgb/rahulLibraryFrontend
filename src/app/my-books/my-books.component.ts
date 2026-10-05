import { Component, OnInit } from '@angular/core';
import { LibraryApiService } from '../library-api.service';
import { BookIssue, PagedResponse } from '../models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { AuthService } from '../auth.service';
import { Role } from '../models';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class MyBooksComponent implements OnInit {
  issues: BookIssue[] = [];
  query = '';
  loading = false;
  statusFilter = '';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sortField = 'issueDate';
  sortDirection = 'desc';

  statusOptions: SelectItem[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Issued', value: 'ISSUED' },
    { label: 'Returned', value: 'RETURNED' },
    { label: 'Overdue', value: 'OVERDUE' }
  ];

  constructor(private api: LibraryApiService, private auth: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  get canManageUsers() {
    const role = this.auth.role();
    return role === 'ADMIN' || role === 'LIBRARIAN';
  }

  get isAdmin() {
    return this.auth.role() === 'ADMIN';
  }

  get availableRoles(): Role[] {
    const role = this.auth.role();
    return role === 'ADMIN' ? ['ADMIN', 'LIBRARIAN', 'STUDENT'] : ['LIBRARIAN', 'STUDENT'];
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.api.issuesPaged(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (response: PagedResponse<BookIssue>) => {
        this.issues = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load your books.' });
      }
    });
  }

  onGlobalFilter(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    this.currentPage = 0;
    this.reload();
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.reload();
  }

  onSort(event: any) {
    this.sortField = event.field;
    this.sortDirection = event.order === 1 ? 'asc' : 'desc';
    this.currentPage = 0;
    this.reload();
  }

  onStatusFilterChange(event: any) {
    this.statusFilter = event.value || '';
    this.currentPage = 0;
    this.reload();
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

  confirmReturn(issue: any) {
    this.confirmationService.confirm({
      header: 'Confirm Return',
      message: `Mark "${issue.bookTitle}" as returned?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.returnBook(issue);
      }
    });
  }

  returnBook(issue: any) {
    this.api.returnBook(issue.id).subscribe({
      next: () => {
        this.reload();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book returned successfully.' });
      },
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not mark return.' })
    });
  }
}