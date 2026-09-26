import { Component, OnInit } from '@angular/core';
import { LibraryApiService } from '../library-api.service';
import { Role, UserAccount, PagedResponse } from '../models';
import { AuthService } from '../auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit {
  users: UserAccount[] = [];
  editing: Partial<UserAccount> & { password?: string } | null = null;
  roles: Role[] = ['ADMIN', 'LIBRARIAN', 'STUDENT'];
  dialogVisible = false;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(private api: LibraryApiService, private auth: AuthService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  get isAdmin() {
    return this.auth.role() === 'ADMIN';
  }

  ngOnInit() {
  }

  reload() {
    this.api.usersPaged(undefined, this.currentPage, this.pageSize).subscribe({
      next: (response: PagedResponse<UserAccount>) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load people.' })
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.reload();
  }

  startNew() {
    this.editing = { username: '', fullName: '', email: '', phone: '', role: 'STUDENT', active: true, password: '', dateOfBirth: '', address: '' };
    this.dialogVisible = true;
  }

  edit(user: UserAccount) {
    this.editing = { ...user, password: '' };
    this.dialogVisible = true;
  }

  closeUserModal() {
    this.editing = null;
    this.dialogVisible = false;
  }

  save() {
    if (!this.editing?.username || !this.editing.fullName || !this.editing.role) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Name, username and role are required.' });
      return;
    }
    if (this.editing.phone && !this.isValidPhone(this.editing.phone)) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Enter a valid 10-digit mobile number starting with 6-9.' });
      return;
    }
    if (!this.editing.id && !this.editing.password) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Password is required for a new account.' });
      return;
    }
    this.api.saveUser(this.editing, this.editing.id).subscribe({
      next: () => {
        this.closeUserModal();
        this.reload();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.editing?.id ? 'Account updated successfully.' : 'Account created successfully.' });
      },
      error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not save user.' })
    });
  }

  delete(user: UserAccount) {
    this.confirmationService.confirm({
      message: `Delete user "${user.fullName}" (${user.username})?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deleteUser(user.id).subscribe({
          next: () => {
            this.reload();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully.' });
          },
          error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not delete user.' })
        });
      }
    });
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    input.value = value;
    if (this.editing) {
      this.editing.phone = value;
    }
  }
}
