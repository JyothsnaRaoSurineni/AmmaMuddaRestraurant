import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-wrapper">
      <!-- Top Info Bar -->
      <div class="top-bar">
        <div class="container top-bar-content">
          <div class="contact-info">
            <span><i class="bi bi-envelope-fill"></i> hr&#64;ammamudda.in</span>
            <span><i class="bi bi-telephone-fill"></i> +91 91696 95566</span>
            <span class="d-none-mobile"><i class="bi bi-geo-alt-fill"></i> Jubilee Hills & Kondapur, Hyderabad</span>
          </div>
          <div class="top-right">
            <span class="open-hours"><i class="bi bi-clock-fill"></i> 12:00 PM - 11:30 PM</span>
            <button class="admin-btn" (click)="openAdmin.emit()">
              <i class="bi bi-speedometer2"></i> Admin Portal
            </button>
          </div>
        </div>
      </div>

      <!-- Main Navbar -->
      <nav class="navbar" [class.scrolled]="isScrolled">
        <div class="container nav-content">
          <a href="#hero" class="brand-logo">
            <span class="logo-icon">🍲</span>
            <div class="brand-text">
              <span class="brand-title">AMMA MUDDA</span>
              <span class="brand-subtitle">Authentic Telugu Kitchen & Bar</span>
            </div>
          </a>

          <div class="nav-links" [class.active]="mobileNavOpen">
            <a href="#hero" (click)="closeMobileNav()"><i class="bi bi-house"></i> Home</a>
            <a href="#about" (click)="closeMobileNav()"><i class="bi bi-info-circle"></i> About</a>
            <a href="#menu" (click)="closeMobileNav()"><i class="bi bi-journal-richtext"></i> Menu</a>
            <a href="#reservations" (click)="closeMobileNav()"><i class="bi bi-calendar-check"></i> Book a Table</a>
            <a href="#gallery" (click)="closeMobileNav()"><i class="bi bi-images"></i> Gallery</a>
            <a href="#contact" (click)="closeMobileNav()"><i class="bi bi-envelope"></i> Contact</a>
          </div>

          <div class="nav-actions">
            <!-- Cart Floating Button -->
            <button class="cart-trigger-btn" (click)="openCart.emit()">
              <i class="bi bi-bag-fill"></i>
              <span class="cart-label">Order Feast</span>
              <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </button>

            <a href="#reservations" class="btn-gold btn-nav d-none-mobile">
              <i class="bi bi-bookmark-star"></i> Reserve Table
            </a>

            <button class="mobile-toggle" (click)="toggleMobileNav()">
              <i class="bi" [class.bi-list]="!mobileNavOpen" [class.bi-x-lg]="mobileNavOpen"></i>
            </button>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
    }

    .top-bar {
      background: #08090c;
      border-bottom: 1px solid rgba(212, 175, 55, 0.15);
      font-size: 0.82rem;
      color: var(--text-muted);
      padding: 6px 0;
    }

    .top-bar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contact-info {
      display: flex;
      gap: 20px;
    }

    .contact-info i {
      color: var(--accent-gold);
      margin-right: 5px;
    }

    .top-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .open-hours i {
      color: var(--accent-gold);
      margin-right: 5px;
    }

    .admin-btn {
      background: rgba(212, 175, 55, 0.12);
      color: var(--accent-gold-light);
      border: 1px solid var(--border-color);
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 500;
      transition: var(--transition);
    }

    .admin-btn:hover {
      background: var(--accent-gold);
      color: #0d0f12;
    }

    .navbar {
      background: rgba(13, 15, 18, 0.85);
      backdrop-filter: blur(15px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 14px 0;
      transition: var(--transition);
    }

    .navbar.scrolled {
      padding: 10px 0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      background: rgba(10, 11, 14, 0.95);
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 2rem;
      filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--text-main);
      background: linear-gradient(135deg, #ffffff 0%, var(--accent-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-subtitle {
      font-size: 0.68rem;
      letter-spacing: 2px;
      color: var(--accent-gold);
      text-transform: uppercase;
    }

    .nav-links {
      display: flex;
      gap: 28px;
    }

    .nav-links a {
      font-size: 0.92rem;
      font-weight: 500;
      color: #cfd4dc;
      display: flex;
      align-items: center;
      gap: 6px;
      position: relative;
    }

    .nav-links a i {
      color: var(--accent-gold);
      font-size: 0.9rem;
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0%;
      height: 2px;
      background: var(--accent-gold);
      transition: var(--transition);
    }

    .nav-links a:hover {
      color: var(--accent-gold);
    }

    .nav-links a:hover::after {
      width: 100%;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .cart-trigger-btn {
      position: relative;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold-light);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.88rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);
    }

    .cart-trigger-btn:hover {
      background: var(--accent-gold);
      color: #0d0f12;
      box-shadow: 0 4px 15px var(--accent-gold-glow);
    }

    .cart-badge {
      background: var(--accent-red);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-nav {
      padding: 8px 20px;
      font-size: 0.88rem;
    }

    .mobile-toggle {
      display: none;
      background: transparent;
      color: var(--text-main);
      font-size: 1.6rem;
    }

    @media (max-width: 992px) {
      .d-none-mobile { display: none; }
      .mobile-toggle { display: block; }
      
      .nav-links {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: #0d0f12;
        flex-direction: column;
        padding: 20px;
        gap: 16px;
        border-bottom: 1px solid var(--border-color);
        display: none;
      }

      .nav-links.active {
        display: flex;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Output() openAdmin = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>();

  isScrolled = false;
  mobileNavOpen = false;
  cartCount = 0;

  constructor(private cartService: CartService) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 40;
      });
    }
  }

  ngOnInit(): void {
    this.cartService.totalCount$.subscribe(count => (this.cartCount = count));
  }

  toggleMobileNav() {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  closeMobileNav() {
    this.mobileNavOpen = false;
  }
}
