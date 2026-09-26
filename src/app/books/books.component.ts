import {Component, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import { LibraryApiService } from '../library-api.service';
import { Book, BookIssue, PagedResponse, Role, UserAccount } from '../models';
import {AutoComplete} from "primeng/autocomplete";
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  students: UserAccount[] = [];
  studentSuggestions: UserAccount[] = [];
  selectedStudent?: UserAccount;
  query = '';
  error = '';
  message = '';
  editing: Partial<Book> | null = null;
  issueFor?: Book;
  days = 14;
  showReadersDialog = false;
  showBookReadersDialog = false;
  selectedBook?: Book;
  bookIssues: BookIssue[] = [];

  // Bulk import
  showImportModal = false;
  importFile: File | null = null;
  importResult: { totalRows: number; successful: number; failed: number; errors: string[] } | null = null;
  importLoading = false;

  // Pagination
  currentPage = 0;
  pageSize = 6;
  totalElements = 0;
  totalPages = 0;
  sortField = 'title';
  sortDirection = 'asc';

  constructor(private api: LibraryApiService, private auth: AuthService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  get canManage() {
    const role = this.auth.role();
    return role === 'ADMIN' || role === 'LIBRARIAN';
  }

  get isAdmin() {
    return this.auth.role() === 'ADMIN';
  }

  ngOnInit() {
  }

  reload() {
    this.api.booksPaged(this.query, this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (response: PagedResponse<Book>) => {
        this.books = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load catalog.' })
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.reload();
  }

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.reload();
  }

  onGlobalFilter(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    this.currentPage = 0;
    this.reload();
  }

  onPaginatorChange(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.reload();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  startNew() {
    this.editing = {
      title: '',
      author: '',
      category: '',
      description: '',
      totalCopies: 1,
      date: '',
      registrationNumber: '',
      publication: '',
      publicationYear: 0,
      pageCount: 0,
      seller: '',
      receiptNumber: '',
      price: 0
    };
  }

  edit(book: Book) {
    this.editing = { ...book };
  }

  closeBookModal() {
    this.editing = null;
  }

  openImportModal() {
    this.showImportModal = true;
    this.importFile = null;
    this.importResult = null;
    this.importLoading = false;
  }

  closeImportModal() {
    this.showImportModal = false;
    this.importFile = null;
    this.importResult = null;
    this.importLoading = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.importFile = input.files[0];
    }
  }

  importBooks() {
    if (!this.importFile) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a file first.' });
      return;
    }

    if (!this.importFile.name.endsWith('.xlsx') && !this.importFile.name.endsWith('.xls')) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a valid Excel file (.xlsx or .xls)' });
      return;
    }

    this.importLoading = true;
    this.error = '';
    this.message = '';

    this.api.importBooks(this.importFile).subscribe({
      next: (result: any) => {
        this.importResult = result;
        this.importLoading = false;
        this.message = `Import complete: ${result.successful} successful, ${result.failed} failed`;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Import complete: ${result.successful} successful, ${result.failed} failed` });
        if (result.successful > 0) {
          this.reload();
        }
      },
      error: err => {
        this.importLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Import failed' });
      }
    });
  }

  downloadTemplate() {
    const headers = ['Title', 'Author', 'Category', 'Total Copies', 'Description', 'Date (yyyy-MM-dd)', 'Registration Number', 'Publication', 'Publication Year', 'Page Count', 'Seller', 'Receipt Number', 'Price'];
    const sampleRow = ['Sample Book Title', 'Author Name', 'Science', '5', 'Book description', '2024-01-15', 'REG-001', 'Publisher Name', '2024', '300', 'Seller Name', 'RCPT-001', '299.99'];

    const csv = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'book_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  save() {
    if (!this.editing?.title || !this.editing.author || !this.editing.totalCopies) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Title, author and copies are required.' });
      return;
    }
    this.api.saveBook({
      title: this.editing.title,
      author: this.editing.author,
      category: this.editing.category,
      description: this.editing.description,
      date: this.editing.date,
      registrationNumber: this.editing.registrationNumber,
      publication: this.editing.publication,
      publicationYear: this.editing.publicationYear,
      pageCount: this.editing.pageCount,
      seller: this.editing.seller,
      receiptNumber: this.editing.receiptNumber,
      price: this.editing.price,
      totalCopies: this.editing.totalCopies
    }, this.editing.id).subscribe({
      next: () => {
        this.closeBookModal();
        this.reload();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.editing?.id ? 'Book updated successfully.' : 'Book created successfully.' });
      },
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not save book.' })
    });
  }

  remove(book: Book) {
    this.confirmationService.confirm({
      message: `Remove "${book.title}" from the catalog?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteBook(book.id).subscribe({
          next: () => {
            this.reload();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book deleted successfully.' });
          },
          error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not delete book.' })
        });
      }
    });
  }

  openIssue(book: Book) {
    this.issueFor = book;
    this.selectedStudent = undefined;
    this.studentSuggestions = [];
    this.days = 14;
    this.message = '';
  }

  closeIssueModal() {
    this.issueFor = undefined;
    this.selectedStudent = undefined;
    this.studentSuggestions = [];
    this.days = 14;
    this.message = '';
  }

  searchStudents(event: { query: string }) {
    const query = event.query.trim();
    if (query.length < 2) {
      this.studentSuggestions = [];
      return;
    }
    this.api.searchStudents(query).subscribe({
      next: (users: UserAccount[]) => {
        this.studentSuggestions = users.filter(u => u.active);
      },
      error: () => this.studentSuggestions = []
    });
  }
  @ViewChild('studentAutoComplete') studentAutoComplete!: AutoComplete;
  onStudentSelect(student: UserAccount) {
    this.selectedStudent = student;
    this.studentSuggestions=[];
    this.studentAutoComplete.hide()
  }

  toggleReadersDialog() {
    this.showReadersDialog = !this.showReadersDialog;
  }

  closeReadersDialog() {
    this.showReadersDialog = false;
  }

  openBookReaders(book: Book) {
    this.selectedBook = book;
    this.showBookReadersDialog = true;
    this.loadBookIssues(book.id);
  }

  closeBookReadersDialog() {
    this.showBookReadersDialog = false;
    this.selectedBook = undefined;
    this.bookIssues = [];
  }

  private loadBookIssues(bookId: number) {
    this.api.getBookIssues(bookId).subscribe({
      next: issues => this.bookIssues = issues,
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not load book readers.' })
    });
  }

  issue() {
    if (!this.issueFor || !this.selectedStudent) {
      return;
    }
    this.api.issueBook(this.issueFor.id, this.selectedStudent.id, this.days).subscribe({
      next: () => {
        this.message = 'Book issued.';
        this.issueFor = undefined;
        this.reload();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book issued successfully.' });
      },
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not issue book.' })
    });
  }

  badge(status: string) {
    if (status === 'RETURNED') { return 'ok'; }
    if (status === 'OVERDUE') { return 'danger'; }
    return 'warn';
  }
}
