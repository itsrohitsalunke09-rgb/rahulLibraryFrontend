import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  demos = [
    { label: 'Admin', username: 'admin', password: 'admin123' },
    { label: 'Librarian', username: 'librarian', password: 'lib123' },
    { label: 'Student', username: 'student', password: 'student123' }
  ];

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.snapshot()) {
      this.goHome();
    }
  }

  fill(demo: { username: string; password: string }) {
    this.username = demo.username;
    this.password = demo.password;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.goHome(),
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Could not sign in. Check username and password.';
      }
    });
  }

  private goHome() {
    const role = this.auth.role();
    this.router.navigate([role === 'STUDENT' ? '/app/catalog' : '/app/dashboard']);
  }
}
