import { CommonModule } from '@angular/common';
import {  AfterViewInit,  Component,  ElementRef,  OnDestroy,  ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { PageFlip } from 'page-flip';
@Component({
  selector: 'app-library-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library-3d.component.html',
  styleUrls: ['./library-3d.component.scss']
})
export class Library3DComponent implements  OnDestroy {
  @ViewChild('bookContainer', { static: true })
  bookContainer!: ElementRef<HTMLElement>;

  private pageFlip?: any;

  currentPage = 1;
  totalPages = 0;

  /*
   * Your temporary test pages.
   *
   * Later we will replace/add pages when you
   * provide the complete book.
   */
  readonly pages: string[] = [
    'assets/digital-book/cover.jpeg',
    'assets/digital-book/page-001.jpeg',
    'assets/digital-book/page-002.jpeg',
    'assets/digital-book/page-003.jpeg',
    'assets/digital-book/page-004.jpeg',
    'assets/digital-book/page-005.jpeg',
    'assets/digital-book/page-006.jpeg',
    'assets/digital-book/page-007.jpeg',
    'assets/digital-book/page-008.jpeg',
    'assets/digital-book/page-009.jpeg',
    'assets/digital-book/page-010.jpeg',
    'assets/digital-book/page-011.jpeg',
    'assets/digital-book/page-012.jpeg',
    'assets/digital-book/page-013.jpeg',
    'assets/digital-book/page-014.jpeg',
    'assets/digital-book/page-015.jpeg',
    'assets/digital-book/page-016.jpeg',
    'assets/digital-book/page-017.jpeg',
    'assets/digital-book/page-018.jpeg',
    'assets/digital-book/page-019.jpeg'
  ];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initializeBook();
  }

  private initializeBook(): void {

    const container = this.bookContainer.nativeElement;

    this.pageFlip = new PageFlip(container, {

      width: 420,
      height: 600,

      size: 'stretch',

      minWidth: 280,
      maxWidth: 600,

      minHeight: 400,
      maxHeight: 850,

      drawShadow: true,

      maxShadowOpacity: 0.45,

      flippingTime: 900,

      usePortrait: true,

      showCover: true,

      mobileScrollSupport: true,

      swipeDistance: 30,

      useMouseEvents: true,

      disableFlipByClick: false,

      startPage: 0,

      autoSize: true
    });

    /*
     * Update page number whenever
     * the user turns a page.
     */
    this.pageFlip.on('flip', (event:any) => {

      this.currentPage = Number(event.data) + 1;

    });

    /*
     * Load the actual book images.
     */
    this.pageFlip.loadFromImages(this.pages);

    this.totalPages = this.pages.length;
  }

  /*
   * Previous page button
   */
  previousPage(): void {

    this.pageFlip?.flipPrev('bottom');

  }

  /*
   * Next page button
   */
  nextPage(): void {

    this.pageFlip?.flipNext('bottom');

  }

  /*
   * Return to login page
   */
  goBack(): void {

    this.router.navigate(['/login']);

  }

  /*
   * Clean up the page-flip instance
   * when leaving the component.
   */
  ngOnDestroy(): void {

    this.pageFlip?.destroy();

  }

  goToLogin() {
    window.location.href = '/login';
  }

  goToRegister() {
    window.location.href = '/register';
  }
}
