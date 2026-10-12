import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private auth: AuthService, private router: Router, route: ActivatedRoute) {
    if (this.auth.snapshot()) {
      this.goHome();
    } else if (route.snapshot.queryParamMap.has('expired')) {
      this.error = 'Your session has expired. Please sign in again.';
    }
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
