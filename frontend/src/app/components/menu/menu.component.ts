import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService, MenuItem } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="menu" class="section-padding menu-section">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">EXPLORE CULINARY DELIGHTS</span>
          <h2>Our Special Menu</h2>
        </div>

        <!-- Filter & Search Bar -->
        <div class="menu-controls">
          <div class="category-tabs">
            <button 
              *ngFor="let cat of categories" 
              class="tab-btn" 
              [class.active]="selectedCategory === cat.key"
              (click)="selectCategory(cat.key)"
            >
              <i [class]="cat.icon"></i> {{ cat.label }}
            </button>
          </div>

          <div class="search-and-toggle">
            <div class="search-box">
              <i class="bi bi-search search-icon"></i>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="onSearchChange()" 
                placeholder="Search dishes (e.g. Biryani, Garelu)..."
              >
              <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="veg-toggle-box">
              <button 
                class="veg-btn" 
                [class.active-veg]="vegFilter === true" 
                (click)="toggleVegFilter(true)"
              >
                <span class="veg-dot">●</span> Pure Veg
              </button>
              <button 
                class="nonveg-btn" 
                [class.active-nonveg]="vegFilter === false" 
                (click)="toggleVegFilter(false)"
              >
                <span class="nonveg-dot">▲</span> Non-Veg
              </button>
              <button 
                *ngIf="vegFilter !== null" 
                class="reset-filter-btn" 
                (click)="toggleVegFilter(null)"
              >
                Show All
              </button>
            </div>
          </div>
        </div>

        <!-- Toast Alert Notification -->
        <div *ngIf="addedToastDish" class="toast-notification">
          <i class="bi bi-cart-check-fill text-gold"></i>
          <span>Added <strong>{{ addedToastDish }}</strong> to your order feast!</span>
        </div>

        <!-- Loading Spinner -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-gold"></div>
          <p class="mt-3 text-muted">Fetching Amma Mudda menu items...</p>
        </div>

        <!-- Menu Grid -->
        <div *ngIf="!loading" class="menu-grid">
          <div *ngFor="let item of menuItems" class="menu-card glass-card">
            <div class="card-image-box">
              <img [src]="getItemImage(item)" [alt]="item.title" (error)="onImgError($event, item)" loading="lazy">
              <span class="item-rating">
                <i class="bi bi-star-fill"></i> {{ item.rating }}
              </span>
              <span *ngIf="item.is_chef_special" class="chef-badge">
                <i class="bi bi-patch-check-fill"></i> Chef's Choice
              </span>
            </div>

            <div class="card-body">
              <div class="item-header">
                <div class="title-with-badge">
                  <span [class]="item.is_veg ? 'badge-veg' : 'badge-nonveg'">
                    {{ item.is_veg ? '● VEG' : '▲ NON-VEG' }}
                  </span>
                  <h4>{{ item.title }}</h4>
                </div>
                <span class="price">₹{{ item.price }}</span>
              </div>

              <p class="description">{{ item.description }}</p>

              <div class="card-footer-box">
                <span *ngIf="item.is_spicy" class="badge-spicy">
                  <i class="bi bi-fire"></i> Spicy Guntur
                </span>
                <span *ngIf="!item.is_spicy" class="badge-mild">
                  <i class="bi bi-heart"></i> Mild Flavor
                </span>

                <div class="action-btn-group">
                  <button class="add-cart-btn" (click)="addToCart(item)">
                    <i class="bi bi-cart-plus-fill"></i> Add to Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && menuItems.length === 0" class="empty-state glass-card">
          <i class="bi bi-search-heart empty-icon"></i>
          <h4>No dishes found</h4>
          <p>Try searching for a different dish or select another category filter.</p>
          <button class="btn-gold mt-3" (click)="resetAllFilters()">Reset Filters</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .menu-section {
      background: var(--bg-primary);
      position: relative;
    }

    .menu-controls {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 45px;
    }

    .category-tabs {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .tab-btn {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
      padding: 10px 22px;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-btn i {
      color: var(--accent-gold);
    }

    .tab-btn:hover, .tab-btn.active {
      background: var(--accent-gold);
      color: #0d0f12;
      border-color: var(--accent-gold);
      box-shadow: 0 4px 15px var(--accent-gold-glow);
    }

    .tab-btn.active i {
      color: #0d0f12;
    }

    .search-and-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 280px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--accent-gold);
    }

    .search-box input {
      width: 100%;
      background: rgba(20, 23, 29, 0.9);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 12px 40px 12px 45px;
      border-radius: 25px;
      font-size: 0.95rem;
      outline: none;
      transition: var(--transition);
    }

    .search-box input:focus {
      border-color: var(--accent-gold);
      box-shadow: 0 0 15px var(--accent-gold-glow);
    }

    .clear-btn {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .veg-toggle-box {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .veg-btn, .nonveg-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      transition: var(--transition);
    }

    .veg-dot { color: #2ecc71; margin-right: 4px; }
    .nonveg-dot { color: #e74c3c; margin-right: 4px; }

    .veg-btn.active-veg {
      background: rgba(46, 204, 113, 0.2);
      border-color: #2ecc71;
      color: #2ecc71;
    }

    .nonveg-btn.active-nonveg {
      background: rgba(231, 76, 60, 0.2);
      border-color: #e74c3c;
      color: #e74c3c;
    }

    .reset-filter-btn {
      background: transparent;
      color: var(--accent-gold);
      font-size: 0.82rem;
      text-decoration: underline;
    }

    /* Toast */
    .toast-notification {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(13, 15, 18, 0.95);
      border: 1px solid var(--accent-gold);
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      color: var(--text-main);
      padding: 12px 24px;
      border-radius: 30px;
      z-index: 2000;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translate(-50%, 20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }

    /* Grid */
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 30px;
    }

    .menu-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-image-box {
      position: relative;
      height: 220px;
      overflow: hidden;
    }

    .card-image-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }

    .menu-card:hover .card-image-box img {
      transform: scale(1.06);
    }

    .item-rating {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(13, 15, 18, 0.85);
      backdrop-filter: blur(5px);
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .chef-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, var(--accent-gold) 0%, #b89128 100%);
      color: #0d0f12;
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 0.78rem;
      font-weight: 700;
    }

    .card-body {
      padding: 22px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 15px;
    }

    .title-with-badge h4 {
      font-size: 1.15rem;
      color: var(--text-main);
      margin-top: 4px;
    }

    .price {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--accent-gold);
    }

    .description {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 20px;
      flex: 1;
    }

    .card-footer-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .badge-mild {
      font-size: 0.75rem;
      color: #3498db;
      background: rgba(52, 152, 219, 0.12);
      padding: 3px 8px;
      border-radius: 4px;
    }

    .action-btn-group {
      display: flex;
      gap: 8px;
    }

    .add-cart-btn {
      background: var(--accent-gold);
      color: #0d0f12;
      border: none;
      padding: 6px 14px;
      border-radius: 18px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .add-cart-btn:hover {
      background: var(--accent-gold-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--accent-gold-glow);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--accent-gold);
      margin-bottom: 15px;
    }

    .spinner-gold {
      width: 45px;
      height: 45px;
      border: 4px solid rgba(212, 175, 55, 0.2);
      border-top: 4px solid var(--accent-gold);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  loading = true;
  selectedCategory = 'all';
  searchQuery = '';
  vegFilter: boolean | null = null;
  addedToastDish: string | null = null;

  private menuSub!: Subscription;

  categories = [
    { key: 'all', label: 'All Items', icon: 'bi bi-grid-fill' },
    { key: 'starters', label: 'Starters', icon: 'bi bi-egg-fried' },
    { key: 'mains', label: 'Main Course', icon: 'bi bi-bowl' },
    { key: 'biryanis', label: 'Biryanis & Pulaos', icon: 'bi bi-fire' },
    { key: 'beverages', label: 'Beverages', icon: 'bi bi-cup-straw' },
    { key: 'desserts', label: 'Desserts', icon: 'bi bi-pie-chart-fill' }
  ];

  constructor(
    private apiService: ApiService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadMenu();

    // Re-fetch menu items whenever admin updates/adds a dish!
    this.menuSub = this.apiService.menuUpdated$.subscribe(() => {
      this.loadMenu();
    });
  }

  ngOnDestroy(): void {
    if (this.menuSub) {
      this.menuSub.unsubscribe();
    }
  }

  loadMenu() {
    this.loading = true;
    this.apiService
      .getMenuItems(
        this.selectedCategory,
        this.searchQuery,
        this.vegFilter !== null ? this.vegFilter : undefined
      )
      .subscribe({
        next: data => {
          this.menuItems = data;
          this.loading = false;
        },
        error: err => {
          console.error('Error fetching menu items:', err);
          this.loading = false;
        }
      });
  }

  addToCart(dish: MenuItem) {
    this.cartService.addToCart(dish);
    this.addedToastDish = dish.title;
    setTimeout(() => {
      this.addedToastDish = null;
    }, 2500);
  }

  selectCategory(catKey: string) {
    this.selectedCategory = catKey;
    this.loadMenu();
  }

  onSearchChange() {
    this.loadMenu();
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadMenu();
  }

  toggleVegFilter(val: boolean | null) {
    this.vegFilter = val;
    this.loadMenu();
  }

  resetAllFilters() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.vegFilter = null;
    this.loadMenu();
  }

  private readonly defaultDishImages: { [key: string]: string } = {
    'mokka jonna garelu': 'assets/dishes/mokka_jonna_garelu.jpg',
    'royyala iguru': 'assets/dishes/royyala_iguru.jpg',
    'kodi vepudu': 'assets/dishes/kodi_vepudu.jpg',
    'mutton ghee roast': 'assets/dishes/mutton_ghee_roast.jpg',
    'paneer gutti vankaya masala': 'assets/dishes/paneer_gutti_vankaya.jpg',
    'paneer gutti vankaya': 'assets/dishes/paneer_gutti_vankaya.jpg',
    'gongura mamsam curry': 'assets/dishes/gongura_mamsam.jpg',
    'gongura mamsam': 'assets/dishes/gongura_mamsam.jpg',
    'nellore chepala pulusu': 'assets/dishes/nellore_chepala_pulusu.jpg',
    'kodi vepudu pulao': 'assets/dishes/kodi_vepudu_pulao.jpg',
    'amma mudda special mutton biryani': 'assets/dishes/mutton_biryani.jpg',
    'mutton biryani': 'assets/dishes/mutton_biryani.jpg',
    'avakaya paneer pulao': 'assets/dishes/avakaya_paneer_pulao.jpg',
    'signature rose milk': 'assets/dishes/signature_rose_milk.jpg',
    'rose milk': 'assets/dishes/signature_rose_milk.jpg',
    'nannari sharbat': 'assets/dishes/nannari_sharbat.jpg',
    'elaneer payasam': 'assets/dishes/elaneer_payasam.jpg',
    'double ka meetha': 'assets/dishes/double_ka_meetha.jpg'
  };

  getItemImage(item: MenuItem): string {
    if (item.image_url && !item.image_url.includes('unsplash.com')) {
      return item.image_url;
    }
    const titleKey = item.title?.toLowerCase().trim();
    if (titleKey && this.defaultDishImages[titleKey]) {
      return this.defaultDishImages[titleKey];
    }
    for (const [key, path] of Object.entries(this.defaultDishImages)) {
      if (titleKey && (titleKey.includes(key) || key.includes(titleKey))) {
        return path;
      }
    }
    return item.image_url || 'assets/dishes/mokka_jonna_garelu.jpg';
  }

  onImgError(event: any, item?: MenuItem) {
    if (item) {
      const fallback = this.getItemImage(item);
      if (event.target.src !== fallback && !event.target.src.endsWith(fallback)) {
        event.target.src = fallback;
        return;
      }
    }
    event.target.src = 'assets/dishes/mokka_jonna_garelu.jpg';
  }
}