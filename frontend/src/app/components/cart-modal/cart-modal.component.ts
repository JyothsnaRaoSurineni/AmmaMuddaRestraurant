import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { ApiService, Order, MenuItem } from '../../services/api.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cart-backdrop" (click)="close.emit()">
      <div class="cart-modal-card glass-card" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="cart-header">
          <h3>
            <i class="bi bi-bag-check-fill text-gold"></i> Your Order Feast 
            <span *ngIf="items.length > 0" class="badge-count">{{ totalCount }} Items</span>
          </h3>
          <button class="close-btn" (click)="close.emit()"><i class="bi bi-x-lg"></i></button>
        </div>

        <!-- 1. Active Placed Order Tracker -->
        <div *ngIf="activePlacedOrder" class="order-tracker-box">
          <div class="tracker-header">
            <h4><i class="bi bi-check-circle-fill text-gold"></i> Order Placed Successfully!</h4>
            <p>Order Code: <strong class="text-gold">{{ activePlacedOrder.order_code }}</strong></p>
          </div>

          <!-- Progress Stepper -->
          <div class="stepper-wrapper">
            <div 
              *ngFor="let step of progressSteps; let i = index" 
              class="step-item"
              [class.completed]="getStepIndex(activePlacedOrder.status!) >= i"
              [class.current]="getStepIndex(activePlacedOrder.status!) === i"
            >
              <div class="step-icon">
                <i [class]="step.icon"></i>
              </div>
              <span class="step-title">{{ step.label }}</span>
            </div>
          </div>

          <!-- Summary details -->
          <div class="placed-summary glass-card mt-4">
            <div class="summary-row">
              <span>Customer Name:</span>
              <strong>{{ activePlacedOrder.customer_name }} ({{ activePlacedOrder.customer_phone }})</strong>
            </div>
            <div class="summary-row">
              <span>Order Type:</span>
              <strong>{{ activePlacedOrder.order_type }} ({{ activePlacedOrder.table_or_address }})</strong>
            </div>
            <div class="summary-row">
              <span>Total Amount:</span>
              <strong class="text-gold fs-5">₹{{ activePlacedOrder.total_amount }}</strong>
            </div>
            <div class="summary-row">
              <span>Kitchen Progress:</span>
              <strong class="status-tag">{{ activePlacedOrder.status }}</strong>
            </div>
          </div>

          <div class="tracker-actions mt-4">
            <button class="btn-outline-gold" (click)="refreshOrderStatus()">
              <i class="bi bi-arrow-clockwise"></i> Refresh Live Status
            </button>
            <button class="btn-gold" (click)="resetOrderView()">
              <i class="bi bi-plus-lg"></i> Place Another Order
            </button>
          </div>
        </div>

        <!-- 2. Cart Items & Checkout Form -->
        <div *ngIf="!activePlacedOrder">
          
          <!-- Empty Cart -->
          <div *ngIf="items.length === 0" class="empty-cart text-center py-5">
            <i class="bi bi-cart-x empty-icon text-gold"></i>
            <h4>Your Cart is Empty</h4>
            <p class="text-muted">Browse our menu and add authentic Telugu delicacies to your order!</p>
            <button class="btn-gold mt-3" (click)="close.emit()">Browse Menu</button>
          </div>

          <!-- Items List -->
          <div *ngIf="items.length > 0" class="cart-content-grid">
            <div class="items-column">
              <h5 class="column-title">Selected Dishes</h5>

              <div class="cart-items-list">
                <div *ngFor="let item of items" class="cart-item-row">
                  <img [src]="item.dish.image_url" [alt]="item.dish.title" class="item-thumb" (error)="onImgError($event)">
                  <div class="item-info">
                    <h6>{{ item.dish.title }}</h6>
                    <span class="item-price">₹{{ item.dish.price }}</span>
                  </div>

                  <div class="quantity-controls">
                    <button class="qty-btn" (click)="removeOne(item.dish.id)">-</button>
                    <span class="qty-num">{{ item.quantity }}</span>
                    <button class="qty-btn" (click)="addOne(item.dish)">+</button>
                  </div>

                  <span class="item-subtotal">₹{{ item.dish.price * item.quantity }}</span>
                </div>
              </div>

              <div class="cart-total-bar mt-3">
                <span>Grand Total:</span>
                <span class="total-price">₹{{ totalPrice }}</span>
              </div>
            </div>

            <!-- Checkout Form -->
            <div class="checkout-column">
              <h5 class="column-title">Order Details</h5>

              <form (ngSubmit)="placeOrder()" #orderForm="ngForm">
                <div class="form-group">
                  <label>Your Name *</label>
                  <input type="text" [(ngModel)]="orderData.customer_name" name="customer_name" required placeholder="e.g. Srinivas Rao">
                </div>

                <div class="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" [(ngModel)]="orderData.customer_phone" name="customer_phone" required placeholder="+91 98490 12345">
                </div>

                <div class="form-group">
                  <label>Order Type *</label>
                  <select [(ngModel)]="orderData.order_type" name="order_type">
                    <option value="Dine-In">Dine-In (Table Service)</option>
                    <option value="Delivery">Home Delivery</option>
                    <option value="Takeaway">Takeaway Pickup</option>
                  </select>
                </div>

                <div class="form-group">
                  <label *ngIf="orderData.order_type === 'Dine-In'">Table Number *</label>
                  <label *ngIf="orderData.order_type === 'Delivery'">Delivery Address *</label>
                  <label *ngIf="orderData.order_type === 'Takeaway'">Pickup Time *</label>

                  <input 
                    type="text" 
                    [(ngModel)]="orderData.table_or_address" 
                    name="table_or_address" 
                    required 
                    [placeholder]="orderData.order_type === 'Dine-In' ? 'e.g. Table #5 (Jubilee Hills)' : 'e.g. Flat 301, Jubilee Hills, Rd No 36'"
                  >
                </div>

                <div *ngIf="errorMessage" class="error-alert mt-2">
                  <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMessage }}
                </div>

                <button 
                  type="submit" 
                  class="btn-gold btn-block mt-4" 
                  [disabled]="isPlacing || orderForm.invalid"
                >
                  <span *ngIf="!isPlacing"><i class="bi bi-send-check-fill"></i> Confirm & Place Order (₹{{ totalPrice }})</span>
                  <span *ngIf="isPlacing"><i class="bi bi-hourglass-split"></i> Submitting Order...</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .cart-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(10px);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .cart-modal-card {
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow-y: auto;
      background: #0d0f12;
      border: 1px solid var(--accent-gold);
      border-radius: var(--radius-lg);
      padding: 35px;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;
    }

    .cart-header h3 {
      color: var(--text-main);
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .badge-count {
      background: rgba(212, 175, 55, 0.2);
      color: var(--accent-gold-light);
      font-size: 0.8rem;
      padding: 2px 10px;
      border-radius: 12px;
    }

    .close-btn {
      background: transparent;
      color: var(--text-muted);
      font-size: 1.4rem;
    }

    .close-btn:hover { color: var(--accent-red); }

    .empty-icon { font-size: 3.5rem; margin-bottom: 15px; }

    .cart-content-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 35px;
    }

    .column-title {
      color: var(--accent-gold);
      font-size: 1.1rem;
      margin-bottom: 15px;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
      padding-bottom: 8px;
    }

    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 320px;
      overflow-y: auto;
      padding-right: 5px;
    }

    .cart-item-row {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
    }

    .item-thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: var(--radius-sm);
    }

    .item-info { flex: 1; }
    .item-info h6 { color: var(--text-main); margin-bottom: 2px; font-size: 0.92rem; }
    .item-price { font-size: 0.82rem; color: var(--accent-gold); }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0,0,0,0.4);
      padding: 2px 8px;
      border-radius: 15px;
    }

    .qty-btn {
      background: transparent;
      color: var(--accent-gold);
      font-weight: 700;
      font-size: 1.1rem;
      padding: 0 4px;
    }

    .qty-num { font-size: 0.88rem; font-weight: 600; color: #fff; }

    .item-subtotal {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--text-main);
      font-size: 0.95rem;
    }

    .cart-total-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid var(--accent-gold);
      padding: 12px 18px;
      border-radius: var(--radius-sm);
      font-size: 1.1rem;
    }

    .total-price {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--accent-gold);
    }

    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 5px; }
    .form-group input, .form-group select {
      width: 100%;
      background: rgba(26, 30, 38, 0.9);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 9px 12px;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      outline: none;
    }

    .btn-block { width: 100%; justify-content: center; padding: 12px; }

    .error-alert {
      background: rgba(230, 57, 70, 0.15);
      border: 1px solid var(--accent-red);
      color: var(--accent-red);
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.82rem;
    }

    /* Stepper Tracker */
    .order-tracker-box { padding: 10px 0; }
    .tracker-header { text-align: center; margin-bottom: 30px; }
    .tracker-header h4 { color: var(--text-main); font-size: 1.4rem; margin-bottom: 4px; }

    .stepper-wrapper {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin: 20px 0 35px;
    }

    .stepper-wrapper::before {
      content: '';
      position: absolute;
      top: 22px;
      left: 10%;
      width: 80%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }

    .step-item {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 25%;
      text-align: center;
    }

    .step-icon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: rgba(26, 30, 38, 0.9);
      border: 2px solid var(--border-color);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: var(--transition);
    }

    .step-item.completed .step-icon {
      background: #2ecc71;
      border-color: #2ecc71;
      color: #000;
    }

    .step-item.current .step-icon {
      background: var(--accent-gold);
      border-color: var(--accent-gold);
      color: #0d0f12;
      box-shadow: 0 0 15px var(--accent-gold-glow);
    }

    .step-title { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; }
    .step-item.completed .step-title, .step-item.current .step-title { color: var(--text-main); font-weight: 600; }

    .placed-summary { padding: 20px; }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
      padding: 8px 0;
    }

    .summary-row span { color: var(--text-muted); }
    .summary-row strong { color: var(--text-main); }
    .status-tag { color: var(--accent-gold); font-weight: 700; }

    .tracker-actions { display: flex; gap: 15px; justify-content: center; }

    @media (max-width: 768px) {
      .cart-content-grid { grid-template-columns: 1fr; }
      .stepper-wrapper { flex-wrap: wrap; gap: 15px; }
      .stepper-wrapper::before { display: none; }
      .step-item { width: 45%; }
    }
  `]
})
export class CartModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  items: CartItem[] = [];
  totalCount = 0;
  totalPrice = 0;
  isPlacing = false;
  errorMessage = '';

  activePlacedOrder: Order | null = null;

  orderData: Omit<Order, 'id' | 'order_code' | 'status' | 'created_at'> = {
    customer_name: '',
    customer_phone: '',
    order_type: 'Dine-In',
    table_or_address: '',
    total_amount: 0,
    items_json: []
  };

  progressSteps = [
    { label: 'Order Received', icon: 'bi bi-receipt' },
    { label: 'Kitchen Preparing', icon: 'bi bi-fire' },
    { label: 'Out for Delivery / Ready', icon: 'bi bi-truck' },
    { label: 'Served / Completed', icon: 'bi bi-check2-circle' }
  ];

  constructor(
    private cartService: CartService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => (this.items = items));
    this.cartService.totalCount$.subscribe(c => (this.totalCount = c));
    this.cartService.totalPrice$.subscribe(p => (this.totalPrice = p));
  }

  addOne(dish: MenuItem) {
    this.cartService.addToCart(dish);
  }

  removeOne(dishId: number) {
    this.cartService.removeFromCart(dishId);
  }

  placeOrder() {
    if (!this.orderData.customer_name || !this.orderData.customer_phone || !this.orderData.table_or_address) {
      this.errorMessage = 'Please complete all customer details.';
      return;
    }

    this.isPlacing = true;
    this.errorMessage = '';

    const orderPayload: Order = {
      customer_name: this.orderData.customer_name,
      customer_phone: this.orderData.customer_phone,
      order_type: this.orderData.order_type,
      table_or_address: this.orderData.table_or_address,
      total_amount: this.totalPrice,
      items_json: this.cartService.toOrderItems()
    };

    this.apiService.createOrder(orderPayload).subscribe({
      next: res => {
        this.isPlacing = false;
        this.activePlacedOrder = res;
        this.cartService.clearCart();
      },
      error: err => {
        this.isPlacing = false;
        this.errorMessage = err?.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }

  refreshOrderStatus() {
    if (this.activePlacedOrder && this.activePlacedOrder.id) {
      this.apiService.getOrders().subscribe({
        next: orders => {
          const updated = orders.find(o => o.id === this.activePlacedOrder?.id);
          if (updated) {
            this.activePlacedOrder = updated;
          }
        }
      });
    }
  }

  resetOrderView() {
    this.activePlacedOrder = null;
    this.orderData = {
      customer_name: '',
      customer_phone: '',
      order_type: 'Dine-In',
      table_or_address: '',
      total_amount: 0,
      items_json: []
    };
  }

  getStepIndex(status: string): number {
    switch (status) {
      case 'Order Received': return 0;
      case 'Preparing in Kitchen': return 1;
      case 'Out for Delivery': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  }

  onImgError(event: any) {
    event.target.src = 'assets/dishes/mokka_jonna_garelu.jpg';
  }
}
