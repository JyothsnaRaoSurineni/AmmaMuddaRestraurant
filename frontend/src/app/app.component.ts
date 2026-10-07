import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { MenuComponent } from './components/menu/menu.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminComponent } from './components/admin/admin.component';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    MenuComponent,
    ReservationComponent,
    GalleryComponent,
    ContactComponent,
    AdminComponent,
    CartModalComponent,
    FooterComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Header Bar -->
      <app-header 
        (openAdmin)="showAdminModal = true"
        (openCart)="showCartModal = true"
      ></app-header>

      <!-- Main Content -->
      <main>
        <app-hero></app-hero>
        <app-about></app-about>
        <app-menu></app-menu>
        <app-reservation></app-reservation>
        <app-gallery></app-gallery>
        <app-contact></app-contact>
      </main>

      <!-- Footer -->
      <app-footer></app-footer>

      <!-- Cart & Checkout Modal -->
      <app-cart-modal *ngIf="showCartModal" (close)="showCartModal = false"></app-cart-modal>

      <!-- Admin Portal Modal -->
      <app-admin *ngIf="showAdminModal" (close)="showAdminModal = false"></app-admin>
    </div>
  `,
  styles: [`
    .app-layout {
      position: relative;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  showAdminModal = false;
  showCartModal = false;
}
