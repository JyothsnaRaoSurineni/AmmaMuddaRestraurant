-- Amma Mudda Restaurant PostgreSQL Database Schema
-- Port: 5432
-- Database Name: ammamudda_db

-- Run in psql or pgAdmin:
-- CREATE DATABASE ammamudda_db;
-- \c ammamudda_db;

-- 1. Menu Items Table
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TYPE IF EXISTS menu_category_enum;
CREATE TYPE menu_category_enum AS ENUM ('starters', 'mains', 'biryanis', 'desserts', 'beverages');

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category menu_category_enum NOT NULL DEFAULT 'starters',
  is_veg BOOLEAN NOT NULL DEFAULT FALSE,
  is_spicy BOOLEAN NOT NULL DEFAULT FALSE,
  is_chef_special BOOLEAN NOT NULL DEFAULT FALSE,
  image_url VARCHAR(255) DEFAULT NULL,
  rating NUMERIC(2,1) DEFAULT 4.8,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Menu Items
INSERT INTO menu_items (title, description, price, category, is_veg, is_spicy, is_chef_special, image_url, rating) VALUES
('Mokka Jonna Garelu', 'Crispy and golden sweet corn vadas blend with fresh curry leaves, green chilies, and regional spices. Served with ginger chutney.', 320.00, 'starters', TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', 4.9),
('Royyala Iguru', 'Coastal Andhra style juicy prawns cooked in a thick gravy of caramelized onions, garlic, and fiery Guntur chilies.', 490.00, 'starters', FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', 4.9),
('Kodi Vepudu', 'Traditional Andhra pan-fried chicken tossed with whole cracked pepper, roasted spices, and fresh cilantro.', 410.00, 'starters', FALSE, TRUE, FALSE, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80', 4.7),
('Mutton Ghee Roast', 'Succulent prime tender goat meat slow-roasted in pure aromatic cow ghee and hand-ground Kundapur spice mix.', 540.00, 'starters', FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', 5.0),
('Paneer Gutti Vankaya Masala', 'Fusion stuffed tender baby eggplants and cottage cheese simmered in a creamy sesame-peanut spicy gravy.', 380.00, 'mains', TRUE, FALSE, FALSE, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', 4.6),
('Gongura Mamsam Curry', 'Legendary Rayalaseema goat meat curry braised with tangy sorrel leaves (Gongura) and secret heirloom spices.', 560.00, 'mains', FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 4.9),
('Nellore Chepala Pulusu', 'Authentic Nellore style fresh river fish simmered in a tangy tamarind and red chili curry in a traditional clay pot.', 480.00, 'mains', FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', 4.8),
('Kodi Vepudu Pulao', 'Fragrant Chittimutyalu rice slow-cooked with spiced chicken fry, caramelised onions, fresh mint, and ghee.', 460.00, 'biryanis', FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', 5.0),
('Amma Mudda Special Mutton Biryani', 'Aged long-grain Basmati rice dum-cooked with tender marinated goat meat, saffron, and royal aromatic herbs.', 580.00, 'biryanis', FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', 4.9),
('Avakaya Paneer Pulao', 'Signature rice pulao layered with cottage cheese cubes infused with traditional spicy mango pickle (Avakaya).', 390.00, 'biryanis', TRUE, TRUE, FALSE, 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80', 4.7),
('Signature Rose Milk', 'Chilled rich farm milk infused with natural rose extract, basil seeds (sabja), and topped with slivered pistachios.', 160.00, 'beverages', TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 4.9),
('Nannari Sharbat', 'Cooling traditional Indian sarsaparilla root elixir with lemon juice and crushed ice.', 130.00, 'beverages', TRUE, FALSE, FALSE, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 4.6),
('Elaneer Payasam', 'Decadent chilled dessert crafted with fresh tender coconut pulp, coconut milk, cardamoms, and roasted cashews.', 220.00, 'desserts', TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', 4.9),
('Double Ka Meetha', 'Royal Hyderabadi fried bread pudding soaked in saffron-infused rabri and sprinkled with fried dry fruits.', 200.00, 'desserts', TRUE, FALSE, FALSE, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80', 4.8);


-- 2. Food Orders Table
DROP TABLE IF EXISTS orders CASCADE;
DROP TYPE IF EXISTS order_type_enum;
DROP TYPE IF EXISTS order_status_enum;

CREATE TYPE order_type_enum AS ENUM ('Dine-In', 'Delivery', 'Takeaway');
CREATE TYPE order_status_enum AS ENUM ('Order Received', 'Preparing in Kitchen', 'Out for Delivery', 'Completed', 'Cancelled');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  order_type order_type_enum NOT NULL DEFAULT 'Dine-In',
  table_or_address VARCHAR(255) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  items_json TEXT NOT NULL,
  status order_status_enum NOT NULL DEFAULT 'Order Received',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Sample Orders
INSERT INTO orders (order_code, customer_name, customer_phone, order_type, table_or_address, total_amount, items_json, status) VALUES
('ORD-910482', 'Srinivas Rao', '+91 98490 12345', 'Dine-In', 'Table #7 (Jubilee Hills)', 1040.00, '[{"title":"Kodi Vepudu Pulao","price":460,"quantity":1},{"title":"Amma Mudda Special Mutton Biryani","price":580,"quantity":1}]', 'Preparing in Kitchen'),
('ORD-882194', 'Kavitha Reddy', '+91 99887 65432', 'Delivery', 'Plot 42, Silicon Valley, Madhapur', 810.00, '[{"title":"Mokka Jonna Garelu","price":320,"quantity":1},{"title":"Royyala Iguru","price":490,"quantity":1}]', 'Out for Delivery');


-- 3. Table Reservations Table
DROP TABLE IF EXISTS reservations CASCADE;
DROP TYPE IF EXISTS reservation_status_enum;
CREATE TYPE reservation_status_enum AS ENUM ('Pending', 'Confirmed', 'Cancelled');

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  booking_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time VARCHAR(10) NOT NULL,
  guests INT NOT NULL DEFAULT 2,
  location VARCHAR(100) DEFAULT 'Jubilee Hills, Hyderabad',
  special_request TEXT DEFAULT NULL,
  status reservation_status_enum NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Sample Reservations
INSERT INTO reservations (booking_code, name, email, phone, reservation_date, reservation_time, guests, location, special_request, status) VALUES
('AM-893120', 'Ramesh Varma', 'ramesh@example.com', '+91 98765 43210', CURRENT_DATE, '19:30', 4, 'Jubilee Hills, Hyderabad', 'Window seat preferred for anniversary dinner.', 'Confirmed'),
('AM-774012', 'Priya Reddy', 'priya.r@example.com', '+91 91234 56789', CURRENT_DATE + INTERVAL '1 day', '20:00', 6, 'Kondapur, Hyderabad', 'Need high chair for a baby.', 'Confirmed');


-- 4. Contact Messages Table
DROP TABLE IF EXISTS contact_messages CASCADE;
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Sample Contact Message
INSERT INTO contact_messages (name, email, subject, message) VALUES
('Anand Rao', 'anand@example.com', 'Catering Enquiry', 'Hi Amma Mudda team, I would like to enquire about bulk catering services for a private wedding event next month.');
