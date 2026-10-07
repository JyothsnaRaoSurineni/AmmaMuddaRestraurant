import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryItem {
  id: number;
  title: string;
  category: 'ambiance' | 'dishes' | 'drinks';
  imageUrl: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="gallery" class="section-padding gallery-section">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">VISUAL JOURNEY</span>
          <h2>Atmosphere & Culinary Gallery</h2>
        </div>

        <div class="gallery-filters">
          <button 
            *ngFor="let cat of filterCategories" 
            class="filter-btn" 
            [class.active]="selectedCat === cat.key"
            (click)="selectCategory(cat.key)"
          >
            {{ cat.label }}
          </button>
        </div>

        <div class="gallery-grid">
          <div 
            *ngFor="let img of filteredImages" 
            class="gallery-card glass-card"
            (click)="openLightbox(img)"
          >
            <div class="img-box">
              <img [src]="img.imageUrl" [alt]="img.title" (error)="onImgError($event)" loading="lazy">
              <div class="hover-overlay">
                <i class="bi bi-zoom-in zoom-icon"></i>
                <h5>{{ img.title }}</h5>
                <span class="cat-tag">{{ img.category | titlecase }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div *ngIf="activeModalImage" class="lightbox-modal" (click)="closeLightbox()">
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <button class="close-lightbox" (click)="closeLightbox()"><i class="bi bi-x-lg"></i></button>
          <img [src]="activeModalImage.imageUrl" [alt]="activeModalImage.title" (error)="onImgError($event)">
          <div class="lightbox-caption">
            <h4>{{ activeModalImage.title }}</h4>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gallery-section {
      background: var(--bg-primary);
    }

    .gallery-filters {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 40px;
    }

    .filter-btn {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
      padding: 8px 24px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition);
    }

    .filter-btn:hover, .filter-btn.active {
      background: var(--accent-gold);
      color: #0d0f12;
      border-color: var(--accent-gold);
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
    }

    .gallery-card {
      padding: 0;
      overflow: hidden;
      cursor: pointer;
    }

    .img-box {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }

    .hover-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(13, 15, 18, 0.85);
      backdrop-filter: blur(4px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: var(--transition);
      padding: 20px;
      text-align: center;
    }

    .gallery-card:hover .img-box img {
      transform: scale(1.1);
    }

    .gallery-card:hover .hover-overlay {
      opacity: 1;
    }

    .zoom-icon {
      font-size: 2rem;
      color: var(--accent-gold);
      margin-bottom: 10px;
    }

    .hover-overlay h5 {
      color: var(--text-main);
      font-size: 1.1rem;
      margin-bottom: 4px;
    }

    .cat-tag {
      font-size: 0.78rem;
      color: var(--accent-gold-light);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Lightbox */
    .lightbox-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 2500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .lightbox-content {
      position: relative;
      max-width: 850px;
      max-height: 90vh;
      border: 1px solid var(--accent-gold);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: #000;
    }

    .lightbox-content img {
      width: 100%;
      max-height: 75vh;
      object-fit: contain;
      display: block;
    }

    .close-lightbox {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      font-size: 1.4rem;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .lightbox-caption {
      padding: 15px 20px;
      background: rgba(13, 15, 18, 0.95);
      color: var(--text-main);
      text-align: center;
    }
  `]
})
export class GalleryComponent {
  selectedCat = 'all';
  activeModalImage: GalleryItem | null = null;

  filterCategories = [
    { key: 'all', label: 'All Photos' },
    { key: 'ambiance', label: 'Ambiance' },
    { key: 'dishes', label: 'Signature Dishes' },
    { key: 'drinks', label: 'Beverages & Bar' }
  ];

  galleryItems: GalleryItem[] = [
    { id: 1, title: 'Jubilee Hills Royal Dining Hall', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Amma Mudda Dum Mutton Biryani', category: 'dishes', imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Iconic Signature Rose Milk', category: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Royyala Iguru Coastal Prawns', category: 'dishes', imageUrl: 'https://images.unsplash.com/photo-1559742811-822863cc4c7e?auto=format&fit=crop&w=800&q=80' },
    { id: 5, title: 'Private Dining Cabana', category: 'ambiance', imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'Mokka Jonna Garelu with Chutney', category: 'dishes', imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80' },
    { id: 7, title: 'Nannari Sharbat Sarsaparilla Root Elixir', category: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
    { id: 8, title: 'Gongura Mamsam Clay Pot Curry', category: 'dishes', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80' }
  ];

  get filteredImages(): GalleryItem[] {
    if (this.selectedCat === 'all') return this.galleryItems;
    return this.galleryItems.filter(img => img.category === this.selectedCat);
  }

  selectCategory(catKey: string) {
    this.selectedCat = catKey;
  }

  openLightbox(img: GalleryItem) {
    this.activeModalImage = img;
  }

  closeLightbox() {
    this.activeModalImage = null;
  }

  onImgError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
  }
}
