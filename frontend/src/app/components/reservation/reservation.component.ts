import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Reservation } from '../../services/api.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="reservations" class="section-padding reservation-section">
      <div class="container">
        <div class="reservation-box glass-card">
          <div class="reservation-grid">
            
            <!-- Left Info Panel -->
            <div class="info-panel">
              <span class="subtitle">RESERVE YOUR TABLE</span>
              <h2>Book an Unforgettable Feast</h2>
              <p>Experience authentic Telugu heritage dining with live acoustic Telugu melodies, signature Guntur spice delicacies, and royal hospitality.</p>

              <div class="perks-list">
                <div class="perk-item">
                  <i class="bi bi-clock-history"></i>
                  <div>
                    <h5>Instant Confirmation</h5>
                    <p>Receive immediate table confirmation code via SMS/Email.</p>
                  </div>
                </div>

                <div class="perk-item">
                  <i class="bi bi-people-fill"></i>
                  <div>
                    <h5>Family & Group Seating</h5>
                    <p>Dedicated high-capacity dining sections in Jubilee Hills & Kondapur.</p>
                  </div>
                </div>

                <div class="perk-item">
                  <i class="bi bi-cup-hot-fill"></i>
                  <div>
                    <h5>Special Celebrations</h5>
                    <p>Anniversaries, birthdays, and corporate dinners tailored for you.</p>
                  </div>
                </div>
              </div>

              <div class="contact-direct">
                <p><i class="bi bi-headset"></i> Need assistance with large bookings?</p>
                <a href="tel:+919169695566" class="phone-link">+91 91696 95566</a>
              </div>
            </div>

            <!-- Right Booking Form or Confirmation Card -->
            <div class="form-panel">
              <!-- Confirmation Card -->
              <div *ngIf="confirmedBooking" class="confirmation-card text-center">
                <div class="success-icon"><i class="bi bi-check-circle-fill"></i></div>
                <h3>Table Reserved Successfully!</h3>
                <p class="booking-ref">Booking Code: <span>{{ confirmedBooking.booking_code }}</span></p>

                <div class="details-summary">
                  <div class="detail-row">
                    <span>Guest Name:</span>
                    <strong>{{ confirmedBooking.name }}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Date & Time:</span>
                    <strong>{{ confirmedBooking.reservation_date }} at {{ confirmedBooking.reservation_time }}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Party Size:</span>
                    <strong>{{ confirmedBooking.guests }} Guests</strong>
                  </div>
                  <div class="detail-row">
                    <span>Location:</span>
                    <strong>{{ confirmedBooking.location }}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Status:</span>
                    <strong class="text-gold">{{ confirmedBooking.status }}</strong>
                  </div>
                </div>

                <button class="btn-gold mt-4" (click)="resetForm()">
                  <i class="bi bi-plus-circle"></i> Make Another Reservation
                </button>
              </div>

              <!-- Form -->
              <form *ngIf="!confirmedBooking" (ngSubmit)="submitReservation()" #resForm="ngForm">
                <h4 class="form-title">Enter Reservation Details</h4>

                <div class="form-grid">
                  <div class="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.name" 
                      name="name" 
                      required 
                      placeholder="e.g. Ramesh Varma"
                      #nameInput="ngModel"
                    >
                  </div>

                  <div class="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      [(ngModel)]="formData.phone" 
                      name="phone" 
                      required 
                      placeholder="+91 98765 43210"
                    >
                  </div>

                  <div class="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      [(ngModel)]="formData.email" 
                      name="email" 
                      required 
                      placeholder="ramesh@example.com"
                    >
                  </div>

                  <div class="form-group">
                    <label>Branch Location *</label>
                    <select [(ngModel)]="formData.location" name="location">
                      <option value="Jubilee Hills, Hyderabad">Jubilee Hills (Road No. 36)</option>
                      <option value="Kondapur, Hyderabad">Kondapur (Sarath City Capital Mall)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Reservation Date *</label>
                    <input 
                      type="date" 
                      [(ngModel)]="formData.reservation_date" 
                      name="reservation_date" 
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>Time Slot *</label>
                    <select [(ngModel)]="formData.reservation_time" name="reservation_time">
                      <option value="12:30">12:30 PM (Lunch)</option>
                      <option value="13:30">01:30 PM (Lunch)</option>
                      <option value="19:00">07:00 PM (Dinner)</option>
                      <option value="20:00">08:00 PM (Dinner)</option>
                      <option value="21:00">09:00 PM (Dinner)</option>
                      <option value="22:00">10:00 PM (Late Dinner)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Number of Guests *</label>
                    <select [(ngModel)]="formData.guests" name="guests">
                      <option *ngFor="let g of guestOptions" [value]="g">{{ g }} {{ g === 1 ? 'Guest' : 'Guests' }}</option>
                    </select>
                  </div>

                  <div class="form-group full-width">
                    <label>Special Requests (Optional)</label>
                    <textarea 
                      [(ngModel)]="formData.special_request" 
                      name="special_request" 
                      rows="3" 
                      placeholder="High chair needed, window seat, birthday celebration..."
                    ></textarea>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="error-alert">
                  <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMessage }}
                </div>

                <button 
                  type="submit" 
                  class="btn-gold btn-block mt-3" 
                  [disabled]="isSubmitting || resForm.invalid"
                >
                  <span *ngIf="!isSubmitting"><i class="bi bi-bookmark-check-fill"></i> Confirm Reservation</span>
                  <span *ngIf="isSubmitting"><i class="bi bi-hourglass-split"></i> Reserving...</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .reservation-section {
      background: var(--bg-secondary);
      position: relative;
    }

    .reservation-box {
      padding: 50px;
    }

    .reservation-grid {
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      gap: 50px;
    }

    .info-panel .subtitle {
      font-size: 0.85rem;
      color: var(--accent-gold);
      font-weight: 600;
      letter-spacing: 2px;
      display: block;
      margin-bottom: 8px;
    }

    .info-panel h2 {
      font-size: 2.2rem;
      color: var(--text-main);
      margin-bottom: 15px;
    }

    .info-panel p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .perks-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 35px;
    }

    .perk-item {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }

    .perk-item i {
      font-size: 1.5rem;
      color: var(--accent-gold);
      background: rgba(212, 175, 55, 0.1);
      padding: 10px;
      border-radius: 50%;
    }

    .perk-item h5 {
      color: var(--text-main);
      font-size: 1rem;
      margin-bottom: 2px;
    }

    .perk-item p {
      font-size: 0.85rem;
      margin-bottom: 0;
    }

    .contact-direct {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 15px 20px;
      border-radius: var(--radius-md);
    }

    .contact-direct p {
      font-size: 0.85rem;
      margin-bottom: 5px;
      color: var(--text-main);
    }

    .phone-link {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--accent-gold);
    }

    /* Form Styles */
    .form-panel {
      background: rgba(13, 15, 18, 0.95);
      border: 1px solid var(--border-color);
      padding: 35px;
      border-radius: var(--radius-md);
    }

    .form-title {
      color: var(--text-main);
      font-size: 1.3rem;
      margin-bottom: 25px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    .form-group label {
      display: block;
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      background: rgba(26, 30, 38, 0.9);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      outline: none;
      transition: var(--transition);
    }

    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: var(--accent-gold);
      box-shadow: 0 0 10px var(--accent-gold-glow);
    }

    .btn-block {
      width: 100%;
      justify-content: center;
      padding: 14px;
      font-size: 1rem;
    }

    .error-alert {
      background: rgba(230, 57, 70, 0.15);
      border: 1px solid var(--accent-red);
      color: var(--accent-red);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-top: 15px;
    }

    /* Confirmation Box */
    .confirmation-card {
      padding: 20px 0;
    }

    .success-icon {
      font-size: 4rem;
      color: #2ecc71;
      margin-bottom: 15px;
    }

    .confirmation-card h3 {
      color: var(--text-main);
      margin-bottom: 8px;
    }

    .booking-ref {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 25px;
    }

    .booking-ref span {
      color: var(--accent-gold);
      font-weight: 700;
    }

    .details-summary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 20px;
      text-align: left;

      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
      padding-bottom: 8px;
    }

    .detail-row span { color: var(--text-muted); }
    .detail-row strong { color: var(--text-main); }

    @media (max-width: 992px) {
      .reservation-grid { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .form-group.full-width { grid-column: span 1; }
      .reservation-box { padding: 25px; }
    }
  `]
})
export class ReservationComponent {
  guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];
  
  formData: Reservation = {
    name: '',
    phone: '',
    email: '',
    location: 'Jubilee Hills, Hyderabad',
    reservation_date: new Date().toISOString().split('T')[0],
    reservation_time: '19:30',
    guests: 4,
    special_request: ''
  };

  isSubmitting = false;
  errorMessage = '';
  confirmedBooking: Reservation | null = null;

  constructor(private apiService: ApiService) {}

  submitReservation() {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.apiService.createReservation(this.formData).subscribe({
      next: res => {
        this.isSubmitting = false;
        this.confirmedBooking = res;
      },
      error: err => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Failed to submit reservation. Please check fields.';
      }
    });
  }

  resetForm() {
    this.confirmedBooking = null;
    this.formData = {
      name: '',
      phone: '',
      email: '',
      location: 'Jubilee Hills, Hyderabad',
      reservation_date: new Date().toISOString().split('T')[0],
      reservation_time: '19:30',
      guests: 4,
      special_request: ''
    };
  }
}
