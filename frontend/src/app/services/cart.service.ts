import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem, OrderItem } from './api.service';

export interface CartItem {
  dish: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsMap = new Map<number, CartItem>();
  cartItems$ = new BehaviorSubject<CartItem[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  totalPrice$ = new BehaviorSubject<number>(0);

  addToCart(dish: MenuItem) {
    if (this.itemsMap.has(dish.id)) {
      const item = this.itemsMap.get(dish.id)!;
      item.quantity += 1;
    } else {
      this.itemsMap.set(dish.id, { dish, quantity: 1 });
    }
    this.updateSubjects();
  }

  removeFromCart(dishId: number) {
    if (this.itemsMap.has(dishId)) {
      const item = this.itemsMap.get(dishId)!;
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.itemsMap.delete(dishId);
      }
      this.updateSubjects();
    }
  }

  clearCart() {
    this.itemsMap.clear();
    this.updateSubjects();
  }

  toOrderItems(): OrderItem[] {
    return Array.from(this.itemsMap.values()).map(item => ({
      title: item.dish.title,
      price: item.dish.price,
      quantity: item.quantity
    }));
  }

  private updateSubjects() {
    const items = Array.from(this.itemsMap.values());
    this.cartItems$.next(items);

    const count = items.reduce((acc, i) => acc + i.quantity, 0);
    this.totalCount$.next(count);

    const price = items.reduce((acc, i) => acc + i.dish.price * i.quantity, 0);
    this.totalPrice$.next(price);
  }
}
