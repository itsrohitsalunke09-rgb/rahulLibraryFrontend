import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library-3d',
  template: `
    <div class="library-3d-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Library 3D View</h1>
          <p class="subtitle">Explore our library in 3D</p>
        </div>
        <a routerLink="/login" class="back-btn">
          <i class="pi pi-arrow-left"></i>
          <span>Back to Login</span>
        </a>
      </header>

      <div class="library-3d-container">
        <!-- 3D Book Viewer -->
        <div class="book-viewer-section">
          <div class="book-viewer">
            <div class="book-3d-container">
              <div class="book-3d" #book3d>
                <!-- Book Cover -->
                <div class="book-cover">
                  <div class="cover-front">
                    <div class="cover-content">
                      <h2 class="book-title">राहुल सार्व. वाचनालय</h2>
                      <p class="book-subtitle">Rahul Public Library</p>
                      <div class="book-emblem">
                        <i class="pi pi-book"></i>
                      </div>
                      <p class="book-tagline">ज्ञान की धरोहर</p>
                    </div>
                  </div>
                  <!-- Book Spine -->
                  <div class="book-spine">
                    <span class="spine-text">राहुल सार्व. वाचनालय</span>
                  </div>
                  <!-- Book Back -->
                  <div class="book-back">
                    <div class="back-content">
                      <h3>Library Information</h3>
                      <ul class="library-info">
                        <li><i class="pi pi-map-marker"></i> Shindewadi, Madha, Solapur</li>
                        <li><i class="pi pi-phone"></i> +91-XXXXXXXXXX</li>
                        <li><i class="pi pi-envelope"></i> rahul.library&#64;example.com</li>
                        <li><i class="pi pi-clock"></i> Mon-Sat: 8:00 AM - 8:00 PM</li>
                        <li><i class="pi pi-book"></i> 10,000+ Books</li>
                        <li><i class="pi pi-users"></i> 500+ Active Members</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Library Features -->
          <div class="features-section">
            <h2>Library Features</h2>
            <div class="features-grid">
              <div class="feature-card" *ngFor="let feature of features">
                <div class="feature-icon">
                  <i [class]="feature.icon"></i>
                </div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- Library Stats -->
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card" *ngFor="let stat of stats">
                <div class="stat-number">{{ stat.number }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="actions">
            <button class="btn btn-primary" (click)="goToLogin()">
              <i class="pi pi-sign-in"></i>
              <span>Go to Login</span>
            </button>
            <button class="btn btn-secondary" (click)="goToRegister()">
              <i class="pi pi-user-plus"></i>
              <span>Register as Student</span>
            </button>
          </div>
        </div>
      </div>
    `,
  styles: [`
    .library-3d-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f0e8 0%, #e8dfd0 100%);
      font-family: 'Inter', sans-serif;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-content h1 {
      margin: 0 0 0.25rem;
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      font-family: 'Inter', serif;
    }

    .subtitle {
      margin: 0;
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #ecf0f1;
      border: none;
      border-radius: 8px;
      color: #34495e;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .back-btn:hover {
      background: #bdc3c7;
      transform: translateX(-2px);
    }

    .library-3d-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem 3rem;
    }

    /* 3D Book Viewer */
    .book-viewer-section {
      margin-bottom: 3rem;
    }

    .book-viewer {
      perspective: 1500px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 500px;
    }

    .book-3d-container {
      width: 300px;
      height: 450px;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateY(-15deg) rotateX(5deg);
      transition: transform 0.5s ease;
    }

    .book-3d-container:hover {
      transform: rotateY(15deg) rotateX(-5deg);
    }

    .book-3d {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotateX(2deg); }
      50% { transform: translateY(-10px) rotateX(-2deg); }
    }

    .book-cover,
    .book-back,
    .book-spine {
      position: absolute;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .book-cover {
      width: 100%;
      height: 100%;
      background: linear-gradient(145deg, #2c3e50 0%, #1a252f 100%);
      transform: translateZ(25px);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #c0392b;
    }

    .cover-front {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      color: white;
    }

    .book-title {
      margin: 0 0 0.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .book-subtitle {
      margin: 0 0 1rem;
      font-size: 1rem;
      opacity: 0.9;
      font-style: italic;
    }

    .book-emblem {
      margin: 1rem 0;
      font-size: 3rem;
      opacity: 0.9;
    }

    .book-tagline {
      margin: 1rem 0 0;
      font-size: 1.1rem;
      font-weight: 500;
      opacity: 0.9;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    }

    .book-spine {
      width: 50px;
      height: 100%;
      background: linear-gradient(145deg, #c0392b 0%, #8b1515 100%);
      transform: rotateY(-90deg) translateZ(150px);
      border-left: 3px solid #8b1515;
      border-right: 3px solid #c0392b;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spine-text {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      color: #f1c40f;
      font-weight: 700;
      font-size: 1.2rem;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      letter-spacing: 2px;
    }

    .book-back {
      width: 100%;
      height: 100%;
      background: linear-gradient(145deg, #2c3e50 0%, #1a252f 100%);
      transform: translateZ(-25px) rotateY(180deg);
      border: 3px solid #c0392b;
      padding: 2rem;
      color: white;
      overflow-y: auto;
    }

    .back-content h3 {
      margin: 0 0 1.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #f1c40f;
      text-align: center;
      border-bottom: 2px solid #c0392b;
      padding-bottom: 0.75rem;
    }

    .library-info {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .library-info li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      color: #ecf0f1;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .library-info li:last-child {
      border-bottom: none;
    }

    .library-info i {
      color: #f1c40f;
      font-size: 1.1rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
      width: 24px;
    }

    /* Features Section */
    .features-section {
      margin-bottom: 3rem;
    }

    .features-section h2 {
      text-align: center;
      margin: 0 0 2rem;
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      border: 1px solid #ecf0f1;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 20px rgba(44, 62, 80, 0.3);
    }

    .feature-icon i {
      font-size: 2.5rem;
      color: #f1c40f;
    }

    .feature-card h3 {
      margin: 0 0 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .feature-card p {
      margin: 0;
      color: #7f8c8d;
      line-height: 1.6;
    }

    /* Stats Section */
    .stats-section {
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .stat-card {
      background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .stat-number {
      font-size: 3.5rem;
      font-weight: 800;
      color: #f1c40f;
      line-height: 1;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .stat-label {
      font-size: 1.1rem;
      opacity: 0.9;
      font-weight: 500;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
      color: white;
      box-shadow: 0 8px 20px rgba(44, 62, 80, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(44, 62, 80, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #2c3e50;
      border: 2px solid #ecf0f1;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .btn-secondary:hover {
      background: #f8f9fa;
      border-color: #bdc3c7;
      transform: translateY(-2px);
    }

    .btn i {
      font-size: 1.1rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .header-content h1 {
        font-size: 2rem;
      }

      .book-3d-container {
        width: 250px;
        height: 375px;
      }

      .book-title {
        font-size: 1.4rem;
      }

      .spine-text {
        font-size: 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stat-number {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .page-header {
        padding: 1.5rem 1rem 0.5rem;
      }

      .book-3d-container {
        width: 220px;
        height: 330px;
      }

      .book-title {
        font-size: 1.2rem;
      }

      .actions {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 300px;
        justify-content: center;
      }
    }
  `]
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

  ngOnDestroy() {}

  goToLogin() {
    window.location.href = '/login';
  }

  goToRegister() {
    window.location.href = '/register';
  }
}