import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="section-padding about-section">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">OUR HERITAGE & STORY</span>
          <h2>The Amma Mudda Tradition</h2>
        </div>

        <div class="about-grid">
          <!-- Image Collage -->
          <div class="about-images">
            <div class="img-wrapper main-img">
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" alt="Amma Mudda Dining Ambiance">
            </div>
            <div class="img-wrapper secondary-img">
              <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80" alt="Authentic Andhra Curry">
            </div>
            <div class="experience-badge glass-card">
              <span class="badge-number">18+</span>
              <span class="badge-text">Years of Heritage Recipes</span>
            </div>
          </div>

          <!-- Story Text -->
          <div class="about-text">
            <h3 class="story-heading">
              A Rich Feast of Authentic Telugu and Fusion Flavors
            </h3>
            
            <p class="fst-italic story-intro">
              At Amma Mudda Jubilee Hills, our kitchen pairs closely guarded, ancestral Southern recipes with contemporary culinary twists. From fiery, spice-forward coastal Andhra curries to legendary slow-cooked pulaos, every plate is a masterful celebration of authentic local spices.
            </p>

            <div class="highlights-list">
              <div class="highlight-card glass-card">
                <div class="icon-box"><i class="bi bi-fire"></i></div>
                <div>
                  <h5>Signature Classics</h5>
                  <p>Savor highly-acclaimed house favorites including our crispy Mokka Jonna Garelu, the intensely flavorful Mamsam Vepudu, Mutton Ghee Roast, and Kodi Vepudu Pulao.</p>
                </div>
              </div>

              <div class="highlight-card glass-card">
                <div class="icon-box"><i class="bi bi-cup-straw"></i></div>
                <div>
                  <h5>Refreshing Pairings</h5>
                  <p>Complement your spicy feast with nostalgic refreshments like our signature Rose Milk, or explore an innovative, world-class cocktail bar designed for bold Telugu profiles.</p>
                </div>
              </div>
            </div>

            <p class="story-footer">
              Backed by a warm, welcoming atmosphere and the timeless rhythm of classic Telugu melodies playing in the background, we offer a comforting yet lively space where conversations flow, traditions come alive, and memories are made.
            </p>

            <div class="about-cta">
              <a href="#menu" class="btn-gold">
                <i class="bi bi-arrow-right-circle"></i> Explore Signature Dishes
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      background: var(--bg-secondary);
      position: relative;
      overflow: hidden;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      gap: 60px;
      align-items: center;
    }

    .about-images {
      position: relative;
      padding-bottom: 40px;
      padding-right: 40px;
    }

    .img-wrapper {
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-dark);
    }

    .main-img img {
      width: 100%;
      height: 380px;
      object-fit: cover;
      display: block;
    }

    .secondary-img {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 240px;
      border: 3px solid var(--bg-secondary);
    }

    .secondary-img img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
    }

    .experience-badge {
      position: absolute;
      top: -20px;
      left: -20px;
      padding: 16px 22px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(13, 15, 18, 0.92);
      border: 1px solid var(--accent-gold);
    }

    .badge-number {
      font-family: var(--font-heading);
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--accent-gold);
    }

    .badge-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-main);
      max-width: 100px;
      line-height: 1.2;
    }

    .story-heading {
      font-size: 1.8rem;
      color: var(--text-main);
      margin-bottom: 16px;
      line-height: 1.3;
    }

    .story-intro {
      font-size: 1rem;
      color: var(--accent-gold-light);
      margin-bottom: 25px;
      line-height: 1.7;
    }

    .highlights-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 25px;
    }

    .highlight-card {
      display: flex;
      gap: 18px;
      padding: 18px;
    }

    .icon-box {
      width: 48px;
      height: 48px;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      color: var(--accent-gold);
      flex-shrink: 0;
    }

    .highlight-card h5 {
      color: var(--text-main);
      font-size: 1.05rem;
      margin-bottom: 4px;
    }

    .highlight-card p {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .story-footer {
      font-size: 0.92rem;
      color: var(--text-muted);
      margin-bottom: 30px;
      line-height: 1.6;
    }

    @media (max-width: 992px) {
      .about-grid { grid-template-columns: 1fr; }
      .secondary-img { display: none; }
    }
  `]
})
export class AboutComponent {}
