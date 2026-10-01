import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ShellComponent } from './shell/shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BooksComponent } from './books/books.component';
import { IssuesComponent } from './issues/issues.component';
import { UsersComponent } from './users/users.component';
import { MyBooksComponent } from './my-books/my-books.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'catalog' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'LIBRARIAN'] } },
      { path: 'catalog', component: BooksComponent },
      { path: 'issues', component: IssuesComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'LIBRARIAN'] } },
      { path: 'users', component: UsersComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'LIBRARIAN'] } },
      { path: 'my-books', component: MyBooksComponent, canActivate: [RoleGuard], data: { roles: ['STUDENT'] } },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
