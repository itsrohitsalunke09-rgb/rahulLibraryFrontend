import { Component, OnInit } from '@angular/core';
import { LibraryApiService } from '../library-api.service';
import { BookIssue, PagedResponse } from '../models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class IssuesComponent implements OnInit {
  issues: BookIssue[] = [];
  query = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sortField = 'issueDate';
  sortDirection = 'desc';
  statusFilter = '';

  // Dashboard stats
  stats?: {
    all: number;
    issued: number;
    returned: number;
    overdue: number;
  };

  statusOptions: SelectItem[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Issued', value: 'ISSUED' },
    { label: 'Returned', value: 'RETURNED' },
    { label: 'Overdue', value: 'OVERDUE' }
  ];

  constructor(private api: LibraryApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.api.issuesCounts().subscribe({
      next: (counts) => {
        this.stats = {
          all: counts.all,
          issued: counts.issued,
          overdue: counts.overdue,
          returned: counts.returned
        };
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load dashboard.' })
    });
  }

  reload() {
    this.api.issuesPaged(this.currentPage, this.pageSize, this.sortField, this.sortDirection, this.statusFilter, this.query).subscribe({
      next: (response: PagedResponse<BookIssue>) => {
        this.issues = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load issues.' })
    });
  }

  filterByStatus(status: '' | 'ISSUED' | 'RETURNED' | 'OVERDUE') {
    this.statusFilter = status;
    this.currentPage = 0;
    this.query = '';
    this.reload();
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

  returnBook(issue: BookIssue) {
    this.api.returnBook(issue.id).subscribe({
      next: () => {
        this.reload();
        this.loadDashboard();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book returned successfully.' });
      },
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not mark return.' })
    });
  }

  badge(status: string) {
    if (status === 'RETURNED') { return 'ok'; }
    if (status === 'OVERDUE') { return 'danger'; }
    return 'warn';
  }

  confirm(issue: BookIssue) {
    this.confirmationService.confirm({
      header: 'Confirm Return',
      message: `Mark "${issue.bookTitle}" as returned by ${issue.studentName}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.returnBook(issue);
      }
    });
  }
}