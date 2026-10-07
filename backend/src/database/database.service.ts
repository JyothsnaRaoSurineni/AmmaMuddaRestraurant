import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { Pool as PgPool } from 'pg';

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
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'Dine-In' | 'Delivery' | 'Takeaway';
  table_or_address: string;
  total_amount: number;
  items_json: string | OrderItem[];
  status: 'Order Received' | 'Preparing in Kitchen' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  created_at?: string;
}

export interface Reservation {
  id: number;
  booking_code: string;
  name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  location: string;
  special_request?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  created_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private mysqlPool: mysql.Pool | null = null;
  private pgPool: PgPool | null = null;
  private activeDbType: 'mysql' | 'postgres' | 'memory' = 'memory';

  private memoryMenuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Mokka Jonna Garelu',
      description: 'Crispy and golden sweet corn vadas blended with curry leaves, green chilies, and regional spices. Served with fresh ginger chutney.',
      price: 320,
      category: 'starters',
      is_veg: true,
      is_spicy: false,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 2,
      title: 'Royyala Iguru',
      description: 'Coastal Andhra style juicy prawns cooked in a thick gravy of caramelized onions, garlic, and fiery Guntur chilies.',
      price: 490,
      category: 'starters',
      is_veg: false,
      is_spicy: true,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Kodi Vepudu',
      description: 'Traditional Andhra pan-fried chicken tossed with whole cracked pepper, roasted spices, and fresh cilantro.',
      price: 410,
      category: 'starters',
      is_veg: false,
      is_spicy: true,
      is_chef_special: false,
      image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Mutton Ghee Roast',
      description: 'Succulent prime tender goat meat slow-roasted in pure aromatic cow ghee and hand-ground Kundapur spice mix.',
      price: 540,
      category: 'starters',
      is_veg: false,
      is_spicy: true,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
    },
    {
      id: 5,
      title: 'Paneer Gutti Vankaya Masala',
      description: 'Fusion stuffed tender baby eggplants and cottage cheese simmered in a creamy sesame-peanut spicy gravy.',
      price: 380,
      category: 'mains',
      is_veg: true,
      is_spicy: false,
      is_chef_special: false,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
    },
    {
      id: 6,
      title: 'Gongura Mamsam Curry',
      description: 'Legendary Rayalaseema goat meat curry braised with tangy sorrel leaves (Gongura) and secret heirloom spices.',
      price: 560,
      category: 'mains',
      is_veg: false,
      is_spicy: true,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 7,
      title: 'Nellore Chepala Pulusu',
      description: 'Authentic Nellore style fresh river fish simmered in a tangy tamarind and red chili curry in a clay pot.',
      price: 480,
      category: 'mains',
      is_veg: false,
      is_spicy: true,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      id: 8,
      title: 'Kodi Vepudu Pulao',
      description: 'Fragrant Chittimutyalu rice slow-cooked with spiced chicken fry, caramelised onions, fresh mint, and ghee.',
      price: 460,
      category: 'biryanis',
      is_veg: false,
      is_spicy: true,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
    },
    {
      id: 9,
      title: 'Amma Mudda Special Mutton Biryani',
      description: 'Aged long-grain Basmati rice dum-cooked with tender marinated goat meat, saffron, and royal herbs.',
      price: 580,
      category: 'biryanis',
      is_veg: false,
      is_spicy: true,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 10,
      title: 'Avakaya Paneer Pulao',
      description: 'Signature rice pulao layered with paneer cubes infused with spicy mango pickle (Avakaya).',
      price: 390,
      category: 'biryanis',
      is_veg: true,
      is_spicy: true,
      is_chef_special: false,
      image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
    },
    {
      id: 11,
      title: 'Signature Rose Milk',
      description: 'Chilled rich farm milk infused with natural rose extract, sabja seeds, and slivered pistachios.',
      price: 160,
      category: 'beverages',
      is_veg: true,
      is_spicy: false,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 12,
      title: 'Nannari Sharbat',
      description: 'Cooling traditional Indian sarsaparilla root elixir with fresh lemon juice and ice.',
      price: 130,
      category: 'beverages',
      is_veg: true,
      is_spicy: false,
      is_chef_special: false,
      image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
    },
    {
      id: 13,
      title: 'Elaneer Payasam',
      description: 'Decadent chilled dessert crafted with tender coconut pulp, coconut milk, cardamoms, and cashews.',
      price: 220,
      category: 'desserts',
      is_veg: true,
      is_spicy: false,
      is_chef_special: true,
      image_url: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      id: 14,
      title: 'Double Ka Meetha',
      description: 'Royal Hyderabadi fried bread pudding soaked in saffron rabri and sprinkled with dry fruits.',
      price: 200,
      category: 'desserts',
      is_veg: true,
      is_spicy: false,
      is_chef_special: false,
      image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    }
  ];

  private memoryOrders: Order[] = [
    {
      id: 1,
      order_code: 'ORD-910482',
      customer_name: 'Srinivas Rao',
      customer_phone: '+91 98490 12345',
      order_type: 'Dine-In',
      table_or_address: 'Table #7 (Jubilee Hills)',
      total_amount: 1040,
      items_json: [
        { title: 'Kodi Vepudu Pulao', price: 460, quantity: 1 },
        { title: 'Amma Mudda Special Mutton Biryani', price: 580, quantity: 1 }
      ],
      status: 'Preparing in Kitchen',
      created_at: new Date().toISOString()
    }
  ];

  private memoryReservations: Reservation[] = [
    {
      id: 1,
      booking_code: 'AM-908123',
      name: 'Rajesh Varma',
      email: 'rajesh.varma@example.com',
      phone: '+91 98765 43210',
      reservation_date: new Date().toISOString().split('T')[0],
      reservation_time: '19:30',
      guests: 4,
      location: 'Jubilee Hills, Hyderabad',
      special_request: 'Window seat preferred for anniversary dinner.',
      status: 'Confirmed',
      created_at: new Date().toISOString(),
    }
  ];

  private memoryContactMessages: ContactMessage[] = [
    {
      id: 1,
      name: 'Anand Rao',
      email: 'anand@example.com',
      subject: 'Catering Enquiry',
      message: 'Hi Amma Mudda team, I would like to enquire about bulk catering services for a private wedding event next month.',
      created_at: new Date().toISOString()
    }
  ];

  async onModuleInit() {
    const dbType = (process.env.DB_TYPE || 'mysql').toLowerCase();
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || (dbType === 'postgres' ? '5439' : '3306'), 10);
    const user = process.env.DB_USER || (dbType === 'postgres' ? 'postgres' : 'root');
    const password = process.env.DB_PASSWORD || (dbType === 'postgres' ? 'postgres' : 'root');
    const database = process.env.DB_NAME || 'ammamudda_db';

    this.logger.log(`Attempting to connect to ${dbType.toUpperCase()} on ${host}:${port}...`);

    if (dbType === 'postgres') {
      try {
        this.pgPool = new PgPool({
          host,
          port,
          user,
          password,
          database,
          connectionTimeoutMillis: 3000
        });

        const client = await this.pgPool.connect();
        client.release();
        this.activeDbType = 'postgres';
        this.logger.log(`🟢 Successfully connected to PostgreSQL database '${database}' on port ${port}!`);
        return;
      } catch (err: any) {
        this.logger.warn(`PostgreSQL connection failed on port ${port}: ${err?.message || err}.`);
      }
    }

    if (dbType === 'mysql') {
      try {
        this.mysqlPool = mysql.createPool({
          host,
          port,
          user,
          password,
          database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 2000
        });

        const connection = await this.mysqlPool.getConnection();
        connection.release();
        this.activeDbType = 'mysql';
        this.logger.log(`🟢 Successfully connected to MySQL database '${database}' on port ${port}!`);
        return;
      } catch (err: any) {
        this.logger.warn(`MySQL connection failed on port ${port}: ${err?.message || err}.`);
      }
    }

    this.activeDbType = 'memory';
    this.logger.warn('Operating in high-reliability embedded data store mode.');
  }

  get dbStatus(): string {
    return this.activeDbType;
  }

  // --- Menu Methods ---
  async getMenuItems(): Promise<MenuItem[]> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM menu_items ORDER BY id ASC');
        return res.rows.map(r => ({
          ...r,
          price: Number(r.price),
          is_veg: Boolean(r.is_veg),
          is_spicy: Boolean(r.is_spicy),
          is_chef_special: Boolean(r.is_chef_special),
          rating: Number(r.rating)
        })) as MenuItem[];
      } catch (err) {
        this.logger.error('PostgreSQL query error:', err);
      }
    }

    if (this.activeDbType === 'mysql' && this.mysqlPool) {
      try {
        const [rows] = await this.mysqlPool.query('SELECT * FROM menu_items ORDER BY id ASC');
        return (rows as any[]).map(r => ({
          ...r,
          price: Number(r.price),
          is_veg: Boolean(r.is_veg),
          is_spicy: Boolean(r.is_spicy),
          is_chef_special: Boolean(r.is_chef_special),
          rating: Number(r.rating)
        })) as MenuItem[];
      } catch (err) {
        this.logger.error('MySQL query error:', err);
      }
    }

    return this.memoryMenuItems;
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            ...r,
            price: Number(r.price),
            is_veg: Boolean(r.is_veg),
            is_spicy: Boolean(r.is_spicy),
            is_chef_special: Boolean(r.is_chef_special),
            rating: Number(r.rating)
          } as MenuItem;
        }
      } catch (err) {
        this.logger.error('PostgreSQL query error:', err);
      }
    }
    return this.memoryMenuItems.find(item => item.id === id) || null;
  }

  async createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const newItem: MenuItem = {
      id: Date.now(),
      title: item.title,
      description: item.description,
      price: Number(item.price),
      category: item.category,
      is_veg: Boolean(item.is_veg),
      is_spicy: Boolean(item.is_spicy),
      is_chef_special: Boolean(item.is_chef_special),
      image_url: item.image_url || 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      rating: Number(item.rating) || 4.8
    };

    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query(
          `INSERT INTO menu_items (title, description, price, category, is_veg, is_spicy, is_chef_special, image_url, rating) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
          [
            newItem.title,
            newItem.description,
            newItem.price,
            newItem.category,
            newItem.is_veg,
            newItem.is_spicy,
            newItem.is_chef_special,
            newItem.image_url,
            newItem.rating
          ]
        );
        if (res.rows.length > 0) {
          newItem.id = res.rows[0].id;
        }
      } catch (err) {
        this.logger.error('PostgreSQL insert error:', err);
      }
    } else if (this.activeDbType === 'mysql' && this.mysqlPool) {
      try {
        const [result]: any = await this.mysqlPool.query(
          `INSERT INTO menu_items (title, description, price, category, is_veg, is_spicy, is_chef_special, image_url, rating) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newItem.title,
            newItem.description,
            newItem.price,
            newItem.category,
            newItem.is_veg,
            newItem.is_spicy,
            newItem.is_chef_special,
            newItem.image_url,
            newItem.rating
          ]
        );
        newItem.id = result.insertId;
      } catch (err) {
        this.logger.error('MySQL insert error:', err);
      }
    }

    this.memoryMenuItems.push(newItem);
    return newItem;
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;
        Object.entries(updates).forEach(([key, val]) => {
          if (key !== 'id') {
            fields.push(`${key} = $${idx++}`);
            values.push(val);
          }
        });
        values.push(id);
        if (fields.length > 0) {
          await this.pgPool.query(`UPDATE menu_items SET ${fields.join(', ')} WHERE id = $${idx}`, values);
        }
      } catch (err) {
        this.logger.error('PostgreSQL update error:', err);
      }
    }

    const idx = this.memoryMenuItems.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.memoryMenuItems[idx] = { ...this.memoryMenuItems[idx], ...updates };
      return this.memoryMenuItems[idx];
    }
    return null;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        await this.pgPool.query('DELETE FROM menu_items WHERE id = $1', [id]);
      } catch (err) {
        this.logger.error('PostgreSQL delete error:', err);
      }
    }
    const idx = this.memoryMenuItems.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.memoryMenuItems.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- Order Methods ---
  async getOrders(): Promise<Order[]> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM orders ORDER BY created_at DESC');
        return res.rows.map(r => ({
          ...r,
          total_amount: Number(r.total_amount),
          items_json: typeof r.items_json === 'string' ? JSON.parse(r.items_json) : r.items_json
        })) as Order[];
      } catch (err) {
        this.logger.error('PostgreSQL query error:', err);
      }
    }
    return this.memoryOrders;
  }

  async createOrder(data: Omit<Order, 'id' | 'order_code' | 'status' | 'created_at'>): Promise<Order> {
    const order_code = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const itemsStr = typeof data.items_json === 'string' ? data.items_json : JSON.stringify(data.items_json);
    const itemsParsed = typeof data.items_json === 'string' ? JSON.parse(data.items_json) : data.items_json;

    const newOrder: Order = {
      id: Date.now(),
      order_code,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      order_type: data.order_type || 'Dine-In',
      table_or_address: data.table_or_address,
      total_amount: Number(data.total_amount),
      items_json: itemsParsed,
      status: 'Order Received',
      created_at: new Date().toISOString()
    };

    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query(
          `INSERT INTO orders (order_code, customer_name, customer_phone, order_type, table_or_address, total_amount, items_json, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
          [
            newOrder.order_code,
            newOrder.customer_name,
            newOrder.customer_phone,
            newOrder.order_type,
            newOrder.table_or_address,
            newOrder.total_amount,
            itemsStr,
            newOrder.status
          ]
        );
        if (res.rows.length > 0) {
          newOrder.id = res.rows[0].id;
        }
      } catch (err) {
        this.logger.error('PostgreSQL order insert error:', err);
      }
    }

    this.memoryOrders.unshift(newOrder);
    return newOrder;
  }

  async updateOrderStatus(
    id: number,
    status: 'Order Received' | 'Preparing in Kitchen' | 'Out for Delivery' | 'Completed' | 'Cancelled'
  ): Promise<Order | null> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        await this.pgPool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
      } catch (err) {
        this.logger.error('PostgreSQL order status update error:', err);
      }
    }
    const item = this.memoryOrders.find(o => o.id === id);
    if (item) {
      item.status = status;
      return item;
    }
    return null;
  }

  // --- Reservation Methods ---
  async getReservations(): Promise<Reservation[]> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM reservations ORDER BY created_at DESC');
        return res.rows as Reservation[];
      } catch (err) {
        this.logger.error('PostgreSQL query error:', err);
      }
    }
    return this.memoryReservations;
  }

  async createReservation(data: Omit<Reservation, 'id' | 'booking_code' | 'status' | 'created_at'>): Promise<Reservation> {
    const booking_code = 'AM-' + Math.floor(100000 + Math.random() * 900000);
    const newReservation: Reservation = {
      id: Date.now(),
      booking_code,
      name: data.name,
      email: data.email,
      phone: data.phone,
      reservation_date: data.reservation_date,
      reservation_time: data.reservation_time,
      guests: Number(data.guests),
      location: data.location || 'Jubilee Hills, Hyderabad',
      special_request: data.special_request || '',
      status: 'Confirmed',
      created_at: new Date().toISOString()
    };

    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query(
          `INSERT INTO reservations (booking_code, name, email, phone, reservation_date, reservation_time, guests, location, special_request, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [
            newReservation.booking_code,
            newReservation.name,
            newReservation.email,
            newReservation.phone,
            newReservation.reservation_date,
            newReservation.reservation_time,
            newReservation.guests,
            newReservation.location,
            newReservation.special_request,
            newReservation.status
          ]
        );
        if (res.rows.length > 0) {
          newReservation.id = res.rows[0].id;
        }
      } catch (err) {
        this.logger.error('PostgreSQL reservation insert error:', err);
      }
    }

    this.memoryReservations.unshift(newReservation);
    return newReservation;
  }

  async updateReservationStatus(id: number, status: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<Reservation | null> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        await this.pgPool.query('UPDATE reservations SET status = $1 WHERE id = $2', [status, id]);
      } catch (err) {
        this.logger.error('PostgreSQL reservation status update error:', err);
      }
    }
    const item = this.memoryReservations.find(r => r.id === id);
    if (item) {
      item.status = status;
      return item;
    }
    return null;
  }

  // --- Contact Message Methods ---
  async getContactMessages(): Promise<ContactMessage[]> {
    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        return res.rows as ContactMessage[];
      } catch (err) {
        this.logger.error('PostgreSQL query error:', err);
      }
    }
    return this.memoryContactMessages;
  }

  async createContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      id: Date.now(),
      ...msg,
      created_at: new Date().toISOString()
    };

    if (this.activeDbType === 'postgres' && this.pgPool) {
      try {
        const res = await this.pgPool.query(
          `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id`,
          [msg.name, msg.email, msg.subject, msg.message]
        );
        if (res.rows.length > 0) {
          newMsg.id = res.rows[0].id;
        }
      } catch (err) {
        this.logger.error('PostgreSQL contact insert error:', err);
      }
    }

    this.memoryContactMessages.unshift(newMsg);
    return newMsg;
  }
}
