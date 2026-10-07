import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Reservation, MenuItem, Order } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-modal-backdrop" (click)="close.emit()">
      <div class="admin-modal-card glass-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="admin-header">
          <div class="header-left">
            <span class="badge-admin"><i class="bi bi-shield-lock-fill"></i> ADMIN PORTAL</span>
            <h2>Amma Mudda Restaurant & Kitchen Management</h2>
          </div>
          <button class="close-admin-btn" (click)="close.emit()"><i class="bi bi-x-lg"></i></button>
        </div>

        <!-- System Tech Badges -->
        <div class="system-status-bar">
          <div class="status-badge active-status">
            <span class="status-dot"></span> NestJS Backend: <strong>Port 3000</strong>
          </div>
          <div class="status-badge active-status">
            <span class="status-dot"></span> Angular Frontend: <strong>Port 4200</strong>
          </div>
          <div class="status-badge active-status">
            <span class="status-dot"></span> MySQL Database: <strong>Port 3306</strong> (krishnapatnam_db)
          </div>
        </div>

        <!-- Metric Overview Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-bag-check-fill"></i></div>
            <div>
              <h3>{{ orders.length }}</h3>
              <p>Active Food Orders</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-currency-rupee"></i></div>
            <div>
              <h3>₹{{ totalRevenue }}</h3>
              <p>Total Orders Revenue</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon"><i class="bi bi-calendar-check-fill"></i></div>
            <div>
              <h3>{{ reservations.length }}</h3>
              <p>Table Bookings</p>
            </div>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="admin-tabs">
          <button class="admin-tab-btn" [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">
            <i class="bi bi-fire"></i> Food Orders & Kitchen Progress ({{ orders.length }})
          </button>
          <button class="admin-tab-btn" [class.active]="activeTab === 'reservations'" (click)="activeTab = 'reservations'">
            <i class="bi bi-table"></i> Table Reservations List ({{ reservations.length }})
          </button>
          <button class="admin-tab-btn" [class.active]="activeTab === 'add-menu'" (click)="activeTab = 'add-menu'">
            <i class="bi bi-plus-square-fill"></i> Add New Menu Item
          </button>
        </div>

        <!-- Tab 1: Food Orders & Kitchen Progress -->
        <div *ngIf="activeTab === 'orders'" class="tab-content">
          <div *ngIf="loadingOrders" class="text-center py-4">
            <div class="spinner-gold"></div>
            <p class="mt-2 text-muted">Loading live orders from database...</p>
          </div>

          <div *ngIf="!loadingOrders" class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order Code</th>
                  <th>Customer Name & Phone</th>
                  <th>Type & Location</th>
                  <th>Dishes Ordered</th>
                  <th>Amount</th>
                  <th>Kitchen Progress Status</th>
                  <th>Change Progress Stage</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ord of orders">
                  <td><span class="code-badge">{{ ord.order_code }}</span></td>
                  <td>
                    <strong>{{ ord.customer_name }}</strong>
                    <div class="small-info text-muted">{{ ord.customer_phone }}</div>
                  </td>
                  <td>
                    <span class="type-pill">{{ ord.order_type }}</span>
                    <div class="small-info text-muted mt-1">{{ ord.table_or_address }}</div>
                  </td>
                  <td>
                    <div class="items-list-small">
                      <span *ngFor="let item of getItemList(ord.items_json)" class="item-tag">
                        {{ item.quantity }}x {{ item.title }}
                      </span>
                    </div>
                  </td>
                  <td><strong class="text-gold">₹{{ ord.total_amount }}</strong></td>
                  <td>
                    <span 
                      class="status-pill" 
                      [class.received]="ord.status === 'Order Received'"
                      [class.preparing]="ord.status === 'Preparing in Kitchen'"
                      [class.delivery]="ord.status === 'Out for Delivery'"
                      [class.completed]="ord.status === 'Completed'"
                      [class.cancelled]="ord.status === 'Cancelled'"
                    >
                      <i class="bi bi-circle-fill dot-icon"></i> {{ ord.status }}
                    </span>
                  </td>
                  <td>
                    <select 
                      [ngModel]="ord.status" 
                      (ngModelChange)="changeOrderStatus(ord.id!, $event)"
                      class="status-select"
                    >
                      <option value="Order Received">1. Order Received</option>
                      <option value="Preparing in Kitchen">2. Preparing in Kitchen</option>
                      <option value="Out for Delivery">3. Out for Delivery / Ready</option>
                      <option value="Completed">4. Completed / Served</option>
                      <option value="Cancelled">5. Cancelled</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: Reservations Table -->
        <div *ngIf="activeTab === 'reservations'" class="tab-content">
          <div *ngIf="loadingRes" class="text-center py-4">
            <div class="spinner-gold"></div>
            <p class="mt-2 text-muted">Loading reservations from database...</p>
          </div>

          <div *ngIf="!loadingRes" class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Booking Code</th>
                  <th>Customer Name</th>
                  <th>Phone & Email</th>
                  <th>Date & Time</th>
                  <th>Guests</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let res of reservations">
                  <td><span class="code-badge">{{ res.booking_code }}</span></td>
                  <td><strong>{{ res.name }}</strong></td>
                  <td>
                    <div class="small-info">{{ res.phone }}</div>
                    <div class="small-info text-muted">{{ res.email }}</div>
                  </td>
                  <td>{{ res.reservation_date }} at {{ res.reservation_time }}</td>
                  <td><strong>{{ res.guests }}</strong></td>
                  <td><span class="loc-pill">{{ res.location }}</span></td>
                  <td>
                    <span 
                      class="status-pill" 
                      [class.completed]="res.status === 'Confirmed'"
                      [class.received]="res.status === 'Pending'"
                      [class.cancelled]="res.status === 'Cancelled'"
                    >
                      {{ res.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons" *ngIf="res.id">
                      <button 
                        *ngIf="res.status !== 'Confirmed'" 
                        class="btn-sm btn-confirm" 
                        (click)="changeResStatus(res.id, 'Confirmed')"
                        title="Confirm Booking"
                      >
                        <i class="bi bi-check-lg"></i> Confirm
                      </button>
                      <button 
                        *ngIf="res.status !== 'Cancelled'" 
                        class="btn-sm btn-cancel" 
                        (click)="changeResStatus(res.id, 'Cancelled')"
                        title="Cancel Booking"
                      >
                        <i class="bi bi-x-lg"></i> Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: Add Menu Item Form -->
        <div *ngIf="activeTab === 'add-menu'" class="tab-content">
          <form (ngSubmit)="addMenuItem()" #addMenuForm="ngForm" class="add-menu-form">
            <div *ngIf="menuAddedSuccess" class="success-alert mb-3">
              <i class="bi bi-check-circle-fill"></i> New dish added successfully to Amma Mudda menu!
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Dish Title *</label>
                <input type="text" [(ngModel)]="newItem.title" name="title" required placeholder="e.g. Pachi Mirchi Paneer">
              </div>

              <div class="form-group">
                <label>Price (₹) *</label>
                <input type="number" [(ngModel)]="newItem.price" name="price" required placeholder="360">
              </div>

              <div class="form-group">
                <label>Category *</label>
                <select [(ngModel)]="newItem.category" name="category">
                  <option value="starters">Starters</option>
                  <option value="mains">Main Course</option>
                  <option value="biryanis">Biryanis & Pulaos</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>

              <div class="form-group">
                <label>Image URL *</label>
                <input type="url" [(ngModel)]="newItem.image_url" name="image_url" required placeholder="https://images.unsplash.com/...">
              </div>

              <div class="form-group full-width">
                <label>Description *</label>
                <textarea [(ngModel)]="newItem.description" name="description" rows="3" required placeholder="Describe ingredients, cooking style, and spices..."></textarea>
              </div>

              <div class="form-group checkbox-group full-width">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="newItem.is_veg" name="is_veg"> Pure Veg Dish
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="newItem.is_spicy" name="is_spicy"> Spicy Guntur Chili Flavor
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="newItem.is_chef_special" name="is_chef_special"> Chef's Special Highlight
                </label>
              </div>
            </div>

            <button type="submit" class="btn-gold btn-block mt-3" [disabled]="isAddingDish || addMenuForm.invalid">
              <span *ngIf="!isAddingDish"><i class="bi bi-plus-lg"></i> Add Dish to Menu</span>
              <span *ngIf="isAddingDish"><i class="bi bi-hourglass-split"></i> Adding to Database...</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .admin-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(12px);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .admin-modal-card {
      width: 100%;
      max-width: 1150px;
      max-height: 92vh;
      overflow-y: auto;
      background: #0d0f12;
      border: 1px solid var(--accent-gold);
      border-radius: var(--radius-lg);
      padding: 35px;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .badge-admin {
      background: rgba(212, 175, 55, 0.15);
      color: var(--accent-gold);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .admin-header h2 { font-size: 1.8rem; color: var(--text-main); margin-top: 6px; }

    .close-admin-btn { background: transparent; color: var(--text-muted); font-size: 1.5rem; }
    .close-admin-btn:hover { color: var(--accent-red); }

    .system-status-bar { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 25px; }

    .status-badge {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #2ecc71;
      border-radius: 50%;
      box-shadow: 0 0 8px #2ecc71;
    }

    .status-badge strong { color: var(--accent-gold-light); }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-color);
      padding: 20px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-icon {
      width: 50px;
      height: 50px;
      background: rgba(212, 175, 55, 0.12);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      color: var(--accent-gold);
    }

    .metric-card h3 { font-size: 1.6rem; color: var(--text-main); margin-bottom: 2px; }
    .metric-card p { font-size: 0.82rem; color: var(--text-muted); }

    /* Tabs */
    .admin-tabs {
      display: flex;
      gap: 12px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 25px;
      padding-bottom: 10px;
    }

    .admin-tab-btn {
      background: transparent;
      color: var(--text-muted);
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-size: 0.92rem;
      font-weight: 500;
      transition: var(--transition);
    }

    .admin-tab-btn:hover, .admin-tab-btn.active {
      background: var(--accent-gold);
      color: #0d0f12;
      font-weight: 600;
    }

    /* Table */
    .table-responsive { overflow-x: auto; }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }

    .admin-table th {
      background: rgba(255, 255, 255, 0.04);
      color: var(--accent-gold);
      text-align: left;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-color);
    }

    .admin-table td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--text-main);
    }

    .code-badge {
      background: rgba(212, 175, 55, 0.15);
      color: var(--accent-gold);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-weight: 700;
    }

    .small-info { font-size: 0.8rem; }

    .type-pill {
      font-size: 0.78rem;
      background: rgba(212, 175, 55, 0.12);
      color: var(--accent-gold);
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 600;
    }

    .items-list-small {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .item-tag {
      font-size: 0.78rem;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.03);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .status-pill {
      font-size: 0.75rem;
      padding: 3px 10px;
      border-radius: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dot-icon { font-size: 0.5rem; }

    .status-pill.received { background: rgba(52, 152, 219, 0.2); color: #3498db; }
    .status-pill.preparing { background: rgba(241, 196, 15, 0.2); color: #f1c40f; }
    .status-pill.delivery { background: rgba(155, 89, 182, 0.2); color: #9b59b6; }
    .status-pill.completed { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
    .status-pill.cancelled { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }

    .status-select {
      background: rgba(26, 30, 38, 0.9);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      outline: none;
    }

    .status-select:focus { border-color: var(--accent-gold); }

    .loc-pill {
      font-size: 0.78rem;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 8px;
      border-radius: 10px;
    }

    .action-buttons { display: flex; gap: 6px; }

    .btn-sm { padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; }
    .btn-confirm { background: #2ecc71; color: #000; font-weight: 600; }
    .btn-cancel { background: #e74c3c; color: #fff; }

    /* Form */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group.full-width { grid-column: span 2; }

    .form-group label { display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px; }

    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      background: rgba(26, 30, 38, 0.9);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      outline: none;
    }

    .checkbox-group { display: flex; gap: 25px; }

    .checkbox-label {
      color: var(--text-main);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    .btn-block { width: 100%; justify-content: center; padding: 12px; }

    .success-alert {
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid #2ecc71;
      color: #2ecc71;
      padding: 12px;
      border-radius: var(--radius-sm);
    }

    .spinner-gold {
      width: 35px;
      height: 35px;
      border: 3px solid rgba(212, 175, 55, 0.2);
      border-top: 3px solid var(--accent-gold);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .metrics-grid { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .form-group.full-width { grid-column: span 1; }
    }
  `]
})
export class AdminComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  activeTab: 'orders' | 'reservations' | 'add-menu' = 'orders';
  orders: Order[] = [];
  reservations: Reservation[] = [];
  menuCount = 14;
  totalRevenue = 0;

  loadingOrders = true;
  loadingRes = true;
  isAddingDish = false;
  menuAddedSuccess = false;

  newItem: Omit<MenuItem, 'id'> = {
    title: '',
    description: '',
    price: 360,
    category: 'starters',
    is_veg: false,
    is_spicy: true,
    is_chef_special: true,
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    rating: 4.8
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadReservations();
    this.loadMenuCount();
  }

  loadOrders() {
    this.loadingOrders = true;
    this.apiService.getOrders().subscribe({
      next: data => {
        this.orders = data;
        this.loadingOrders = false;
        this.calculateRevenue();
      },
      error: err => {
        console.error('Error fetching orders:', err);
        this.loadingOrders = false;
      }
    });
  }

  calculateRevenue() {
    this.totalRevenue = this.orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  }

  loadReservations() {
    this.loadingRes = true;
    this.apiService.getReservations().subscribe({
      next: data => {
        this.reservations = data;
        this.loadingRes = false;
      },
      error: err => {
        console.error('Error fetching reservations:', err);
        this.loadingRes = false;
      }
    });
  }

  loadMenuCount() {
    this.apiService.getMenuItems().subscribe({
      next: data => {
        this.menuCount = data.length;
      }
    });
  }

  changeOrderStatus(id: number, newStatus: any) {
    this.apiService.updateOrderStatus(id, newStatus).subscribe({
      next: updated => {
        const item = this.orders.find(o => o.id === id);
        if (item) item.status = updated.status;
      }
    });
  }

  changeResStatus(id: number, newStatus: 'Confirmed' | 'Cancelled') {
    this.apiService.updateReservationStatus(id, newStatus).subscribe({
      next: updated => {
        const item = this.reservations.find(r => r.id === id);
        if (item) item.status = updated.status;
      }
    });
  }

  getItemList(itemsJson: any): { title: string; quantity: number }[] {
    if (Array.isArray(itemsJson)) return itemsJson;
    if (typeof itemsJson === 'string') {
      try {
        return JSON.parse(itemsJson);
      } catch {
        return [];
      }
    }
    return [];
  }

  addMenuItem() {
    this.isAddingDish = true;
    this.menuAddedSuccess = false;

    // Coerce numeric & boolean fields explicitly
    const payload: Omit<MenuItem, 'id'> = {
      title: this.newItem.title.trim(),
      description: this.newItem.description.trim(),
      price: Number(this.newItem.price),
      category: this.newItem.category,
      is_veg: Boolean(this.newItem.is_veg),
      is_spicy: Boolean(this.newItem.is_spicy),
      is_chef_special: Boolean(this.newItem.is_chef_special),
      image_url: this.newItem.image_url || 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      rating: Number(this.newItem.rating) || 4.8
    };

    this.apiService.createMenuItem(payload).subscribe({
      next: () => {
        this.isAddingDish = false;
        this.menuAddedSuccess = true;
        this.menuCount++;
        
        // Notify home page menu grid to reload live items!
        this.apiService.notifyMenuUpdated();

        this.newItem = {
          title: '',
          description: '',
          price: 360,
          category: 'starters',
          is_veg: false,
          is_spicy: true,
          is_chef_special: true,
          image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
          rating: 4.8
        };
      },
      error: err => {
        this.isAddingDish = false;
        console.error('Add menu error:', err);
      }
    });
  }
}
