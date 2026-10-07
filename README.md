# 🌾 Amma Mudda Restaurant - Full Stack Web Application

Welcome to **Amma Mudda**, a luxury Telugu & Coastal Andhra dining full-stack web application built with **Angular 17+ (Frontend)**, **NestJS (Backend API)**, and **PostgreSQL / MySQL (Database)**.

---

## 🌟 Key Features

- **Luxury Gold & Charcoal Dark Theme UI**: High-impact, responsive Angular frontend inspired by elite fine-dining establishments.
- **Dynamic Menu Grid**: Interactive category filtering (Starters, Mains, Biryanis, Beverages, Desserts), search, and Pure Veg / Non-Veg toggles.
- **Real-Time Food Ordering Cart & Checkout**: Add items to cart with live badge counters, submit delivery/dine-in orders with automated order tracking.
- **Live Kitchen Progress Stepper**: 4-stage visual progress tracker (*Order Received* ➔ *Preparing in Kitchen* ➔ *Out for Delivery* ➔ *Completed*).
- **Admin Portal**: Instant dish management (Add new menu items, update dish prices, delete items) with real-time UI updates.
- **Table Reservations & Contact Forms**: Complete online table booking system and customer inquiry forms.
- **Dual Database Architecture**: Direct connection to **PostgreSQL** / **MySQL** with an automatic **In-Memory fallback** for zero-setup local development.

---

## 🏗️ Technology Stack

| Layer | Technology | Port |
| :--- | :--- | :--- |
| **Frontend** | Angular 17 (Standalone Components, RxJS, Bootstrap Icons) | `http://localhost:4200` |
| **Backend API** | NestJS, TypeScript, Express, Class Validator | `http://localhost:3000/api` |
| **Database** | PostgreSQL / MySQL | `5439` / `3306` |

---

## 🚀 Quick Start Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm run start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Open **`http://localhost:4200`** in your browser.

---

## 🗄️ Database Schemas & Seed Scripts

- **PostgreSQL DDL & Seed File**: [`database/schema_pg.sql`](database/schema_pg.sql)
- **MySQL DDL & Seed File**: [`database/schema.sql`](database/schema.sql)

To load PostgreSQL schema into your local database:
```bash
psql -U postgres -p 5439 -d ammamudda_db -f database/schema_pg.sql
```

---

## 📜 License
MIT License. Built with ❤️ for authentic Telugu & Southern Indian Culinary Artistry.
