import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ContactMessage } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="contact" class="section-padding contact-section">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">GET IN TOUCH</span>
          <h2>Contact Amma Mudda</h2>
        </div>

        <div class="contact-grid">
          <!-- Info Cards -->
          <div class="info-column">
            <!-- Branch 1: Jubilee Hills -->
            <div class="branch-card glass-card">
              <div class="branch-header">
                <i class="bi bi-geo-alt-fill loc-icon"></i>
                <div>
                  <h4>Jubilee Hills Branch (Flagship)</h4>
                  <p class="loc-sub">Road No. 36, Near Metro Station, Jubilee Hills, Hyderabad</p>
                </div>
              </div>

              <div class="branch-details">
                <p><i class="bi bi-telephone-fill"></i> +91 91696 95566 / +91 40 2355 7788</p>
                <p><i class="bi bi-envelope-fill"></i> hr&#64;ammamudda.in</p>
                <p><i class="bi bi-clock-fill"></i> Mon - Sun: 12:00 PM - 11:30 PM</p>
              </div>
            </div>

            <!-- Branch 2: Kondapur -->
            <div class="branch-card glass-card">
              <div class="branch-header">
                <i class="bi bi-geo-alt-fill loc-icon"></i>
                <div>
                  <h4>Kondapur Branch</h4>
                  <p class="loc-sub">3rd Floor, Sarath City Capital Mall, Gachibowli - Miyapur Rd, Hyderabad</p>
                </div>
              </div>

              <div class="branch-details">
                <p><i class="bi bi-telephone-fill"></i> +91 91696 95577</p>
                <p><i class="bi bi-envelope-fill"></i> kondapur&#64;ammamudda.in</p>
                <p><i class="bi bi-clock-fill"></i> Mon - Sun: 12:00 PM - 11:00 PM</p>
              </div>
            </div>
          </div>

          <!-- Message Form -->
          <div class="form-column glass-card">
            <h4 class="form-heading">Send Us a Message / Catering Enquiry</h4>

            <div *ngIf="sentSuccess" class="success-alert">
              <i class="bi bi-check-circle-fill"></i> Message sent successfully! Our team will get back to you shortly.
            </div>

            <form *ngIf="!sentSuccess" (ngSubmit)="sendMessage()" #contactForm="ngForm">
              <div class="form-group">
                <label>Your Name *</label>
                <input type="text" [(ngModel)]="contactData.name" name="name" required placeholder="e.g. Anand Rao">
              </div>

              <div class="form-group">
                <label>Your Email *</label>
                <input type="email" [(ngModel)]="contactData.email" name="email" required placeholder="anand@example.com">
              </div>

              <div class="form-group">
                <label>Subject *</label>
                <input type="text" [(ngModel)]="contactData.subject" name="subject" required placeholder="e.g. Catering Enquiry / Private Event">
              </div>

              <div class="form-group">
                <label>Message *</label>
                <textarea [(ngModel)]="contactData.message" name="message" rows="4" required placeholder="Write your query details here..."></textarea>
              </div>

              <button type="submit" class="btn-gold btn-block mt-3" [disabled]="isSending || contactForm.invalid">
                <span *ngIf="!isSending"><i class="bi bi-send-fill"></i> Send Message</span>
                <span *ngIf="isSending"><i class="bi bi-hourglass-split"></i> Sending...</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      background: var(--bg-secondary);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .info-column {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .branch-card {
      padding: 25px;
    }

    .branch-header {
      display: flex;
      gap: 15px;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .loc-icon {
      font-size: 1.6rem;
      color: var(--accent-gold);
      background: rgba(212, 175, 55, 0.1);
      padding: 10px;
      border-radius: 50%;
    }

    .branch-header h4 {
      color: var(--text-main);
      font-size: 1.15rem;
      margin-bottom: 4px;
    }

    .loc-sub {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .branch-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.88rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 15px;
    }

    .branch-details i {
      color: var(--accent-gold);
      margin-right: 8px;
    }

    .form-column {
      padding: 35px;
    }

    .form-heading {
      color: var(--text-main);
      font-size: 1.25rem;
      margin-bottom: 25px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .form-group input, .form-group textarea {
      width: 100%;
      background: rgba(13, 15, 18, 0.9);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      outline: none;
      transition: var(--transition);
    }

    .form-group input:focus, .form-group textarea:focus {
      border-color: var(--accent-gold);
      box-shadow: 0 0 10px var(--accent-gold-glow);
    }

    .btn-block {
      width: 100%;
      justify-content: center;
      padding: 12px;
    }

    .success-alert {
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid #2ecc71;
      color: #2ecc71;
      padding: 15px;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
    }

    @media (max-width: 992px) {
      .contact-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  contactData: ContactMessage = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSending = false;
  sentSuccess = false;

  constructor(private apiService: ApiService) {}

  sendMessage() {
    this.isSending = true;
    this.apiService.sendContactMessage(this.contactData).subscribe({
      next: () => {
        this.isSending = false;
        this.sentSuccess = true;
      },
      error: err => {
        this.isSending = false;
        console.error('Contact message error:', err);
      }
    });
  }
}
