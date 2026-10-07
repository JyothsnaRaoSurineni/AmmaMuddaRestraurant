import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer-wrapper">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Info -->
          <div class="footer-col brand-col">
            <div class="brand-logo mb-3">
              <span class="logo-icon">🍲</span>
              <div class="brand-text">
                <span class="brand-title">AMMA MUDDA</span>
                <span class="brand-subtitle">Authentic Telugu Kitchen & Bar</span>
              </div>
            </div>
            <p class="footer-desc">
              Celebrating over 18 years of homestyle culinary excellence in Hyderabad. Serving closely guarded heirloom recipes from Guntur, Rayalaseema & Coastal Andhra with contemporary flair.
            </p>
            <div class="social-links">
              <a href="#"><i class="bi bi-facebook"></i></a>
              <a href="#"><i class="bi bi-instagram"></i></a>
              <a href="#"><i class="bi bi-youtube"></i></a>
              <a href="#"><i class="bi bi-google"></i></a>
            </div>
          </div>

          <!-- Links -->
          <div class="footer-col">
            <h4 class="col-title">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="#hero"><i class="bi bi-chevron-right"></i> Home</a></li>
              <li><a href="#about"><i class="bi bi-chevron-right"></i> About Our Story</a></li>
              <li><a href="#menu"><i class="bi bi-chevron-right"></i> Signature Menu</a></li>
              <li><a href="#reservations"><i class="bi bi-chevron-right"></i> Table Reservation</a></li>
              <li><a href="#gallery"><i class="bi bi-chevron-right"></i> Photo Gallery</a></li>
              <li><a href="#contact"><i class="bi bi-chevron-right"></i> Contact Us</a></li>
            </ul>
          </div>

          <!-- Locations -->
          <div class="footer-col">
            <h4 class="col-title">Hyderabadi Branches</h4>
            <div class="footer-branch">
              <h5><i class="bi bi-geo-alt-fill text-gold"></i> Jubilee Hills</h5>
              <p>Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033</p>
              <p class="phone">+91 91696 95566</p>
            </div>
            <div class="footer-branch mt-3">
              <h5><i class="bi bi-geo-alt-fill text-gold"></i> Kondapur</h5>
              <p>Sarath City Capital Mall, Kondapur, Hyderabad, Telangana 500084</p>
              <p class="phone">+91 91696 95577</p>
            </div>
          </div>

          <!-- Tech Architecture Ports -->
          <div class="footer-col tech-ports-col">
            <h4 class="col-title">Full Stack Ports</h4>
            <div class="port-card">
              <span class="port-tag">Frontend (Angular)</span>
              <strong>http://localhost:4200</strong>
            </div>
            <div class="port-card mt-2">
              <span class="port-tag">Backend (NestJS API)</span>
              <strong>http://localhost:3000</strong>
            </div>
            <div class="port-card mt-2">
              <span class="port-tag">Database (MySQL Server)</span>
              <strong>localhost:3306 (krishnapatnam_db)</strong>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Amma Mudda Restaurant. All Rights Reserved. Built with Angular & NestJS.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-wrapper {
      background: #08090c;
      border-top: 1px solid var(--border-color);
      padding-top: 70px;
      padding-bottom: 30px;
      color: var(--text-muted);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 50px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon { font-size: 1.8rem; }

    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .brand-subtitle {
      font-size: 0.65rem;
      color: var(--accent-gold);
      letter-spacing: 2px;
      display: block;
    }

    .footer-desc {
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .social-links {
      display: flex;
      gap: 12px;
    }

    .social-links a {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--accent-gold);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      transition: var(--transition);
    }

    .social-links a:hover {
      background: var(--accent-gold);
      color: #0d0f12;
    }

    .col-title {
      color: var(--text-main);
      font-size: 1.1rem;
      margin-bottom: 20px;
      position: relative;
      padding-bottom: 8px;
    }

    .col-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 35px;
      height: 2px;
      background: var(--accent-gold);
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a {
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .footer-links a i {
      font-size: 0.75rem;
      color: var(--accent-gold);
    }

    .footer-links a:hover {
      color: var(--accent-gold);
      transform: translateX(4px);
    }

    .footer-branch h5 {
      color: var(--text-main);
      font-size: 0.95rem;
      margin-bottom: 4px;
    }

    .footer-branch p {
      font-size: 0.82rem;
      margin-bottom: 2px;
    }

    .footer-branch .phone {
      color: var(--accent-gold-light);
      font-weight: 600;
    }

    .port-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
    }

    .port-tag {
      font-size: 0.72rem;
      color: var(--accent-gold);
      display: block;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .port-card strong {
      font-size: 0.85rem;
      color: var(--text-main);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 25px;
      text-align: center;
      font-size: 0.82rem;
    }

    @media (max-width: 992px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 576px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FooterComponent {}
