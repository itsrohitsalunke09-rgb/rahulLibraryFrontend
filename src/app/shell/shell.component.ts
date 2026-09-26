import { Component, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthUser, Role } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements AfterViewInit {
  user: AuthUser | null = null;

  constructor(public auth: AuthService, private router: Router) {
    this.auth.user().subscribe(value => this.user = value);
  }

  ngAfterViewInit() {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {}

  can(roles: Role[]) {
    return !!this.user && roles.includes(this.user.role);
  }

  navigateToProfile() {
    this.router.navigate(['/app/profile']);
  }

  logout() {
    this.auth.logout();
  }
}
