import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Book, BookIssue, Dashboard, PagedResponse, Role, UserAccount } from './models';

@Injectable({ providedIn: 'root' })
export class LibraryApiService {
  constructor(private http: HttpClient) {}

  dashboard() {
    return this.http.get<Dashboard>(`${environment.apiUrl}/dashboard`);
  }

  books(q = '') {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<Book[]>(`${environment.apiUrl}/books`, { params });
  }

  booksPaged(q = '', page = 0, size = 10, sort = 'title', direction = 'asc') {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PagedResponse<Book>>(`${environment.apiUrl}/books/paged`, { params });
  }

  saveBook(book: Partial<Book> & { totalCopies: number; title: string; author: string }, id?: number) {
    return id
      ? this.http.put<Book>(`${environment.apiUrl}/books/${id}`, book)
      : this.http.post<Book>(`${environment.apiUrl}/books`, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`${environment.apiUrl}/books/${id}`);
  }

  users(role?: Role) {
    let params = new HttpParams();
    if (role) {
      params = params.set('role', role);
    }
    return this.http.get<UserAccount[]>(`${environment.apiUrl}/users`, { params });
  }

  usersPaged(role?: Role, page = 0, size = 10) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (role) {
      params = params.set('role', role);
    }
    return this.http.get<PagedResponse<UserAccount>>(`${environment.apiUrl}/users`, { params });
  }

  searchStudents(q = '') {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<UserAccount[]>(`${environment.apiUrl}/users/students`, { params });
  }

  getProfile() {
    return this.http.get<UserAccount>(`${environment.apiUrl}/users/profile`);
  }

  saveUser(user: Partial<UserAccount> & { password?: string }, id?: number) {
    return id
      ? this.http.put<UserAccount>(`${environment.apiUrl}/users/${id}`, user)
      : this.http.post<UserAccount>(`${environment.apiUrl}/users`, user);
  }

  updateProfile(user: Partial<UserAccount> & { password?: string }) {
    return this.http.put<UserAccount>(`${environment.apiUrl}/users/profile`, user);
  }

  issues() {
    return this.http.get<BookIssue[]>(`${environment.apiUrl}/issues`);
  }

  issuesPaged(page = 0, size = 10, sort = 'issueDate', direction = 'desc', status?: string, q?: string) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);
    if (status) {
      params = params.set('status', status);
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PagedResponse<BookIssue>>(`${environment.apiUrl}/issues`, { params });
  }

  issuesCount(status?: string, q?: string) {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<number>(`${environment.apiUrl}/issues/count`, { params });
  }

  issuesCounts(q?: string) {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<{ all: number; issued: number; overdue: number; returned: number }>(`${environment.apiUrl}/issues/counts`, { params });
  }

  myIssues() {
    return this.http.get<BookIssue[]>(`${environment.apiUrl}/issues/mine`);
  }

  myIssuesPaged(page = 0, size = 10, sort = 'issueDate', direction = 'desc') {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);
    return this.http.get<PagedResponse<BookIssue>>(`${environment.apiUrl}/issues/mine`, { params });
  }

  issueBook(bookId: number, studentId: number, days = 14) {
    return this.http.post<BookIssue>(`${environment.apiUrl}/issues`, { bookId, studentId, days });
  }

  returnBook(id: number) {
    return this.http.post<BookIssue>(`${environment.apiUrl}/issues/${id}/return`, {});
  }

  getBookIssues(bookId: number) {
    return this.http.get<BookIssue[]>(`${environment.apiUrl}/books/${bookId}/issues`);
  }

  importBooks(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${environment.apiUrl}/books/import`, formData);
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
