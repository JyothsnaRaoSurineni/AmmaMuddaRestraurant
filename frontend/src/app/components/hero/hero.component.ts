import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-bg-image"></div>

      <div class="container hero-container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-badge">
              <i class="bi bi-heart-fill text-gold"></i>
              <span>Homestyle Telugu Cooking with Love</span>
            </div>

            <h1 class="hero-title">
              Welcome to <br>
              <span class="highlight-gold">Amma Mudda</span>
            </h1>

            <p class="hero-tagline">
              A Rich Feast of Authentic Telugu & Coastal Fusion Flavors
            </p>

            <p class="hero-description">
              At Amma Mudda Jubilee Hills & Kondapur, our master chefs pair closely guarded ancestral Southern recipes with modern culinary craftsmanship. From fiery Guntur spice-forward curries to our legendary <b>Kodi Vepudu Pulao</b> and slow-cooked <b>Mutton Ghee Roast</b>.
            </p>

            <div class="hero-actions">
              <a href="#menu" class="btn-gold">
                <i class="bi bi-journal-album"></i> Explore Menu
              </a>
              <a href="#reservations" class="btn-outline-gold">
                <i class="bi bi-calendar-event"></i> Reserve Table
              </a>
            </div>

            <!-- Stats Bar -->
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-num">4.9 ★</span>
                <span class="stat-label">Google Rating (12k+ Reviews)</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num">50K+</span>
                <span class="stat-label">Happy Diners Served</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num">100%</span>
                <span class="stat-label">Authentic Spices</span>
              </div>
            </div>
          </div>

          <!-- Hero Floating Card / Video Preview -->
          <div class="hero-media">
            <div class="media-card glass-card">
              <div class="video-preview-box">
                <img src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" alt="Amma Mudda Signature Food">
                <div class="play-pulse-btn" (click)="openVideoModal()">
                  <i class="bi bi-play-fill"></i>
                </div>
              </div>
              <div class="media-caption">
                <div class="caption-header">
                  <h4>Signature Mutton Ghee Roast</h4>
                  <span class="price-tag">₹540</span>
                </div>
                <p>Slow roasted in pure aromatic cow ghee and hand-ground Kundapur masala.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Modal -->
      <div class="video-modal" *ngIf="showVideo" (click)="closeVideoModal()">
        <div class="modal-content-box" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closeVideoModal()"><i class="bi bi-x-lg"></i></button>
          <div class="iframe-container">
            <iframe 
              width="100%" 
              height="400" 
              src="https://www.youtube.com/embed/vc9tvNkizIQ?autoplay=1" 
              title="Amma Mudda Kitchen Experience" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding-top: 130px;
      padding-bottom: 80px;
      background: #0d0f12;
      overflow: hidden;
    }

    .hero-bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80');
      background-size: cover;
      background-position: center;
      opacity: 0.22;
      filter: blur(4px);
      transform: scale(1.05);
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 30% 50%, rgba(13, 15, 18, 0.7) 0%, rgba(13, 15, 18, 0.98) 100%),
                  linear-gradient(to bottom, rgba(13, 15, 18, 0.6) 0%, #0d0f12 100%);
    }

    .hero-container {
      position: relative;
      z-index: 2;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 50px;
      align-items: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid var(--border-color);
      color: var(--accent-gold-light);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .hero-title {
      font-size: 3.8rem;
      font-weight: 800;
      line-height: 1.15;
      color: var(--text-main);
      margin-bottom: 12px;
    }

    .highlight-gold {
      background: linear-gradient(135deg, #ffffff 0%, var(--accent-gold-light) 50%, var(--accent-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 40px rgba(212, 175, 55, 0.3);
    }

    .hero-tagline {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      color: var(--accent-gold-light);
      margin-bottom: 18px;
      font-style: italic;
    }

    .hero-description {
      font-size: 1.05rem;
      color: var(--text-muted);
      margin-bottom: 35px;
      max-width: 620px;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 18px;
      margin-bottom: 45px;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 25px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 16px 24px;
      border-radius: var(--radius-md);
      max-width: fit-content;
    }

    .stat-num {
      display: block;
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--accent-gold);
    }

    .stat-label {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .stat-divider {
      width: 1px;
      height: 35px;
      background: var(--border-color);
    }

    /* Media Card */
    .media-card {
      padding: 16px;
      border-radius: var(--radius-lg);
      position: relative;
    }

    .video-preview-box {
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      height: 320px;
    }

    .video-preview-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }

    .video-preview-box:hover img {
      transform: scale(1.05);
    }

    .play-pulse-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 65px;
      height: 65px;
      background: var(--accent-gold);
      color: #0d0f12;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      cursor: pointer;
      box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(212, 175, 55, 0); }
      100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
    }

    .media-caption {
      padding: 18px 10px 6px;
    }

    .caption-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .caption-header h4 {
      color: var(--text-main);
      font-size: 1.1rem;
    }

    .price-tag {
      background: var(--accent-gold);
      color: #0d0f12;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.9rem;
    }

    .media-caption p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Modal */
    .video-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(10px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-content-box {
      position: relative;
      width: 100%;
      max-width: 800px;
      background: #000;
      border: 1px solid var(--accent-gold);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      background: transparent;
      color: #fff;
      font-size: 1.5rem;
      z-index: 10;
    }

    @media (max-width: 992px) {
      .hero-grid { grid-template-columns: 1fr; }
      .hero-title { font-size: 2.8rem; }
      .hero-stats { flex-wrap: wrap; }
    }
  `]
})
export class HeroComponent {
  showVideo = false;

  openVideoModal() {
    this.showVideo = true;
  }

  closeVideoModal() {
    this.showVideo = false;
  }
}
