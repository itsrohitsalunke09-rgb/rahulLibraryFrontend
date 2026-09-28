import { Component, OnInit } from '@angular/core';
import { LibraryApiService } from '../library-api.service';
import { Dashboard, Book, BookIssue, UserAccount, PagedResponse, Role } from '../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats?: Dashboard;
  error = '';

  modalTitle = '';
  // modalType: 'books' | 'available' | 'issued' | 'overdue' | 'students' | 'librarians' | null = null;

  // Table data
  books: Book[] = [];
  issues: BookIssue[] = [];
  users: UserAccount[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(private api: LibraryApiService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  showModal = false;
  modalType = '';

  openDetails(type: string, event: Event): void {
    event.stopPropagation();

    this.modalType = type;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalType = '';
  }

  onDashboardClick(event: Event): void {
    if (this.showModal) {
      this.closeModal();
    }
  }
  loadDashboard() {
    this.api.dashboard().subscribe({
      next: stats => this.stats = stats,
      error: () => this.error = 'Could not load dashboard.'
    });
  }

  // openDetails(type: 'books' | 'available' | 'issued' | 'overdue' | 'students' | 'librarians') {
  //   this.modalType = type;
  //   this.currentPage = 0;
  //   this.showModal = true;
  //   this.loadModalData(type);
  // }


  loadModalData(type: string) {
    switch (type) {
      case 'books':
        this.modalTitle = 'All Books';
        this.loadPagedBooks();
        break;
      case 'available':
        this.modalTitle = 'Available Copies';
        this.loadPagedAvailableBooks();
        break;
      case 'issued':
        this.modalTitle = 'Issued Copies';
        this.loadIssuedBooks();
        break;
      case 'overdue':
        this.modalTitle = 'Overdue Books';
        this.loadOverdueBooks();
        break;
      case 'students':
        this.modalTitle = 'Students';
        this.loadStudents();
        break;
      case 'librarians':
        this.modalTitle = 'Librarians';
        this.loadLibrarians();
        break;
    }
  }

  loadPagedBooks() {
    this.api.booksPaged('', this.currentPage, this.pageSize).subscribe({
      next: (res: PagedResponse<Book>) => {
        this.books = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
      },
      error: () => this.error = 'Could not load books.'
    });
  }

  loadPagedAvailableBooks() {
    this.api.booksPaged('', this.currentPage, this.pageSize).subscribe({
      next: (res: PagedResponse<Book>) => {
        this.books = res.content.filter(b => b.availableCopies > 0);
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
      },
      error: () => this.error = 'Could not load books.'
    });
  }

  loadIssuedBooks() {
    this.api.issues().subscribe({
      next: (issues:any) => {
        this.issues = issues.content;
        this.totalElements = this.issues.length;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      },
      error: () => this.error = 'Could not load issued books.'
    });
  }

  loadOverdueBooks() {
    this.api.issues().subscribe({
      next: (issues:any) => {
        this.issues = issues.content.filter((i:any) => i.status === 'OVERDUE');
        this.totalElements = this.issues.length;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      },
      error: () => this.error = 'Could not load overdue books.'
    });
  }

  loadStudents() {
    this.api.usersPaged('STUDENT' as Role, this.currentPage, this.pageSize).subscribe({
      next: (res: PagedResponse<UserAccount>) => {
        this.users = res.content.filter(u => u.active);
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
      },
      error: () => this.error = 'Could not load students.'
    });
  }

  loadLibrarians() {
    this.api.usersPaged('LIBRARIAN' as Role, this.currentPage, this.pageSize).subscribe({
      next: (res: PagedResponse<UserAccount>) => {
        this.users = res.content.filter(u => u.active);
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
      },
      error: () => this.error = 'Could not load librarians.'
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.modalType) {
      this.loadModalData(this.modalType);
    }
  }

  onPaginatorChange(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    if (this.modalType) {
      this.loadModalData(this.modalType);
    }
  }

  getStatusBadge(status: string): string {
    if (status === 'RETURNED') return 'ok';
    if (status === 'OVERDUE') return 'danger';
    return 'warn';
  }
}
