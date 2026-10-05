-- Supabase SQL Editor-এ পুরোটা paste করে Run করুন
create table if not exists products(
  id bigint generated always as identity primary key,
  category text not null check (category in ('veg','fruit','stap','dairy')),
  emoji text default '🛒',
  name_bn text not null, name_en text,
  unit_bn text, unit_en text,
  price numeric not null,
  in_stock boolean not null default true,
  created_at timestamptz default now());
create table if not exists orders(
  id bigint generated always as identity primary key,
  order_no text not null, name text not null, phone text not null,
  address text not null, memo text,
  items jsonb not null, subtotal numeric not null, delivery numeric not null, total numeric not null,
  status text not null default 'new' check (status in ('new','confirmed','delivered','cancelled')),
  created_at timestamptz default now());
alter table products enable row level security;
alter table orders enable row level security;
-- সবাই পণ্য দেখতে পারবে; শুধু লগইন করা অ্যাডমিন পণ্য বদলাতে পারবে
create policy "read products" on products for select using (true);
create policy "admin products" on products for all to authenticated using (true) with check (true);
-- সবাই অর্ডার দিতে পারবে কিন্তু দেখতে পারবে না; শুধু অ্যাডমিন দেখবে/বদলাবে
create policy "place order" on orders for insert to anon, authenticated with check (true);
create policy "admin orders" on orders for select to authenticated using (true);
create policy "admin update orders" on orders for update to authenticated using (true) with check (true);
insert into products(category,emoji,name_bn,name_en,unit_bn,unit_en,price) values
('veg','🍅','টমেটো','Tomato','১ কেজি','1 kg',80),
('veg','🥔','আলু','Potato','১ কেজি','1 kg',45),
('veg','🧅','পেঁয়াজ','Onion','১ কেজি','1 kg',70),
('veg','🥬','পালং শাক','Spinach','১ আঁটি','1 bunch',25),
('fruit','🍌','কলা','Banana','১ ডজন','1 dozen',70),
('fruit','🍎','আপেল','Apple','১ কেজি','1 kg',260),
('fruit','🥭','আম','Mango','১ কেজি','1 kg',120),
('fruit','🍋','লেবু','Lemon','৪ পিস','4 pcs',30),
('stap','🍚','মিনিকেট চাল','Miniket rice','৫ কেজি','5 kg',420),
('stap','🫘','মসুর ডাল','Lentils','১ কেজি','1 kg',140),
('stap','🛢️','সয়াবিন তেল','Soybean oil','১ লিটার','1 L',185),
('stap','🧂','লবণ','Salt','১ কেজি','1 kg',40),
('dairy','🥚','ডিম','Eggs','১ ডজন','1 dozen',150),
('dairy','🥛','তরল দুধ','Fresh milk','১ লিটার','1 L',95),
('dairy','🧈','মাখন','Butter','২০০ গ্রাম','200 g',190),
('dairy','🍞','পাউরুটি','Bread','১ প্যাকেট','1 pack',60);
