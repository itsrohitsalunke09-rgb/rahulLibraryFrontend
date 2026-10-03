import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library-3d.component.html',
  styleUrls: ['./library-3d.component.scss']
})
export class Library3DComponent implements OnInit, OnDestroy {
  features = [
    {
      icon: 'pi pi-book',
      title: 'Vast Collection',
      description: 'Over 10,000 books across various genres including literature, science, history, and more.'
    },
    {
      icon: 'pi pi-clock',
      title: 'Extended Hours',
      description: 'Open 12 hours a day, 6 days a week for your convenience.'
    },
    {
      icon: 'pi pi-wifi',
      title: 'Digital Access',
      description: 'Access e-books and digital resources from anywhere with your membership.'
    },
    {
      icon: 'pi pi-users',
      title: 'Community Events',
      description: 'Regular book clubs, author talks, and reading workshops for all ages.'
    },
    {
      icon: 'pi pi-search',
      title: 'Smart Search',
      description: 'Find any book instantly with our advanced catalog search system.'
    },
    {
      icon: 'pi pi-heart',
      title: 'Reading Spaces',
      description: 'Comfortable reading areas with natural light and quiet zones.'
    }
  ];

  stats = [
    { number: '10,000+', label: 'Books' },
    { number: '500+', label: 'Active Members' },
    { number: '12+', label: 'Categories' },
    { number: '6', label: 'Days Open/Week' }
  ];

  ngOnInit() {}

  ngOnDestroy() {
    // cleanup if needed
  }

  goToLogin() {
    window.location.href = '/login';
  }

  goToRegister() {
    window.location.href = '/register';
  }
}