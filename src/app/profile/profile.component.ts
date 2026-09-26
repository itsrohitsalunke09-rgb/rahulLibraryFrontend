import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthUser } from '../models';
import { LibraryApiService } from '../library-api.service';
import { UserAccount } from '../models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  user: AuthUser | null = null;
  userDetails: UserAccount | null = null;
  loading = false;
  editing = false;
  editForm: Partial<UserAccount> & { password?: string; confirmPassword?: string } = {};

  constructor(public auth: AuthService, private api: LibraryApiService, private messageService: MessageService) {}

  ngOnInit() {
    this.auth.user().subscribe(value => this.user = value);
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.loading = true;
    this.api.getProfile().subscribe({
      next: (userDetails: UserAccount) => {
        this.userDetails = userDetails;
        this.resetEditForm();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load profile details.' });
      }
    });
  }

  startEdit() {
    this.editing = true;
    this.resetEditForm();
  }

  cancelEdit() {
    this.editing = false;
    this.resetEditForm();
  }

  resetEditForm() {
    if (this.userDetails) {
      this.editForm = {
        fullName: this.userDetails.fullName,
        email: this.userDetails.email,
        phone: this.userDetails.phone,
        dateOfBirth: this.userDetails.dateOfBirth,
        address: this.userDetails.address,
        password: '',
        confirmPassword: ''
      };
    }
  }

  save() {
    if (!this.userDetails) return;
    
    // Validate required fields
    if (!this.editForm.fullName?.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Full name is required.' });
      return;
    }
    
    // Validate phone number (Indian format: 10 digits, starts with 6-9)
    if (this.editForm.phone && !this.isValidPhone(this.editForm.phone)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enter a valid 10-digit mobile number starting with 6-9.' });
      return;
    }
    
    if (this.editForm.password && this.editForm.password !== this.editForm.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match.' });
      return;
    }
    
    this.loading = true;
    // Remove confirmPassword from payload
    const { confirmPassword, ...payload } = this.editForm;
    this.api.updateProfile(payload).subscribe({
      next: (updatedUser: UserAccount) => {
        this.userDetails = updatedUser;
        this.editing = false;
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully.' });
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Could not update profile.' });
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
    this.editForm.phone = value;
  }
}