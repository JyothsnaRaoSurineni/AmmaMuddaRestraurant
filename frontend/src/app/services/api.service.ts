import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: 'starters' | 'mains' | 'biryanis' | 'desserts' | 'beverages';
  is_veg: boolean;
  is_spicy: boolean;
  is_chef_special: boolean;
  image_url: string;
  rating: number;
}

export interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: number;
  order_code?: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'Dine-In' | 'Delivery' | 'Takeaway';
  table_or_address: string;
  total_amount: number;
  items_json: string | OrderItem[];
  status?: 'Order Received' | 'Preparing in Kitchen' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  created_at?: string;
}

export interface Reservation {
  id?: number;
  booking_code?: string;
  name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  location: string;
  special_request?: string;
  status?: 'Pending' | 'Confirmed' | 'Cancelled';
  created_at?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/api';
  
  // Event subject to trigger menu refresh when admin adds/deletes a dish
  menuUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  notifyMenuUpdated() {
    this.menuUpdated$.next();
  }

  // --- Menu Endpoints ---
  getMenuItems(category?: string, search?: string, isVeg?: boolean): Observable<MenuItem[]> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    if (search) {
      params = params.set('search', search);
    }
    if (isVeg !== undefined) {
      params = params.set('is_veg', String(isVeg));
    }
    return this.http.get<MenuItem[]>(`${this.baseUrl}/menu`, { params });
  }

  createMenuItem(item: Omit<MenuItem, 'id'>): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.baseUrl}/menu`, item);
  }

  updateMenuItem(id: number, item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.baseUrl}/menu/${id}`, item);
  }

  deleteMenuItem(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/menu/${id}`);
  }

  // --- Order Endpoints ---
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, order);
  }

  updateOrderStatus(
    id: number,
    status: 'Order Received' | 'Preparing in Kitchen' | 'Out for Delivery' | 'Completed' | 'Cancelled'
  ): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/orders/${id}/status`, { status });
  }

  // --- Reservation Endpoints ---
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations`);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, reservation);
  }

  updateReservationStatus(id: number, status: 'Pending' | 'Confirmed' | 'Cancelled'): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/reservations/${id}/status`, { status });
  }

  // --- Contact Endpoints ---
  getContactMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.baseUrl}/contact`);
  }

  sendContactMessage(msg: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(`${this.baseUrl}/contact`, msg);
  }
}
