-- ============================================
-- FreshMart Supermarket - Seed Data
-- ============================================

-- Insert Categories
INSERT INTO categories (name, slug, image_url) VALUES
  ('Fruits & Vegetables', 'fruits-vegetables', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'),
  ('Dairy & Eggs', 'dairy-eggs', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'),
  ('Meat & Seafood', 'meat-seafood', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400'),
  ('Bakery', 'bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  ('Beverages', 'beverages', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'),
  ('Snacks', 'snacks', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400'),
  ('Pantry', 'pantry', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400'),
  ('Frozen Foods', 'frozen-foods', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400');

-- Insert Products
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, stock, unit, is_featured) VALUES
  -- Fruits & Vegetables
  ('Fresh Bananas', 'fresh-bananas', 'Ripe yellow bananas, perfect for snacking or smoothies', 1.29, NULL, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), 150, 'bunch', true),
  ('Organic Avocados', 'organic-avocados', 'Creamy Hass avocados, organically grown', 2.49, 1.99, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), 80, 'each', true),
  ('Red Bell Peppers', 'red-bell-peppers', 'Crisp, sweet red bell peppers', 1.79, NULL, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), 100, 'each', false),
  ('Baby Spinach', 'baby-spinach', 'Fresh baby spinach leaves, pre-washed and ready to eat', 3.49, NULL, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), 60, '5oz bag', false),
  ('Fresh Strawberries', 'fresh-strawberries', 'Sweet, juicy strawberries picked at peak ripeness', 4.99, 3.99, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', (SELECT id FROM categories WHERE slug = 'fruits-vegetables'), 45, '1lb', true),
  
  -- Dairy & Eggs
  ('Whole Milk', 'whole-milk', 'Fresh whole milk from local farms', 4.29, NULL, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 200, 'gallon', true),
  ('Free Range Eggs', 'free-range-eggs', 'Large free-range eggs from happy hens', 5.99, NULL, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 120, 'dozen', true),
  ('Greek Yogurt', 'greek-yogurt', 'Thick and creamy plain Greek yogurt', 3.99, NULL, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 90, '32oz', false),
  ('Cheddar Cheese', 'cheddar-cheese', 'Sharp cheddar cheese block, aged 12 months', 6.49, 5.49, 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 70, '8oz', false),
  ('Butter', 'butter', 'Unsalted butter made from cream', 4.99, NULL, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 110, '1lb', false),

  -- Meat & Seafood
  ('Chicken Breast', 'chicken-breast', 'Boneless, skinless chicken breast', 8.99, 7.49, 'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=400', (SELECT id FROM categories WHERE slug = 'meat-seafood'), 80, 'lb', true),
  ('Ground Beef', 'ground-beef', '85% lean ground beef', 6.99, NULL, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', (SELECT id FROM categories WHERE slug = 'meat-seafood'), 60, 'lb', false),
  ('Atlantic Salmon', 'atlantic-salmon', 'Fresh Atlantic salmon fillet', 12.99, NULL, 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a345?w=400', (SELECT id FROM categories WHERE slug = 'meat-seafood'), 40, 'lb', true),
  ('Pork Chops', 'pork-chops', 'Bone-in pork chops, center cut', 7.49, NULL, 'https://images.unsplash.com/photo-1432139509613-5c4255a1d197?w=400', (SELECT id FROM categories WHERE slug = 'meat-seafood'), 55, 'lb', false),

  -- Bakery
  ('Sourdough Bread', 'sourdough-bread', 'Artisan sourdough bread, freshly baked', 5.49, NULL, 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400', (SELECT id FROM categories WHERE slug = 'bakery'), 30, 'loaf', true),
  ('Croissants', 'croissants', 'Flaky butter croissants, baked fresh daily', 3.99, NULL, 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400', (SELECT id FROM categories WHERE slug = 'bakery'), 40, '4-pack', false),
  ('Whole Wheat Bread', 'whole-wheat-bread', '100% whole wheat sandwich bread', 3.99, 3.49, 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400', (SELECT id FROM categories WHERE slug = 'bakery'), 50, 'loaf', false),

  -- Beverages
  ('Orange Juice', 'orange-juice', 'Freshly squeezed orange juice, no pulp', 5.99, NULL, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', (SELECT id FROM categories WHERE slug = 'beverages'), 70, '64oz', true),
  ('Sparkling Water', 'sparkling-water', 'Natural sparkling mineral water', 1.49, NULL, 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400', (SELECT id FROM categories WHERE slug = 'beverages'), 200, '1L', false),
  ('Green Tea', 'green-tea', 'Organic green tea bags', 4.49, NULL, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400', (SELECT id FROM categories WHERE slug = 'beverages'), 90, '20 bags', false),

  -- Snacks
  ('Trail Mix', 'trail-mix', 'Mixed nuts, dried fruits, and chocolate chips', 7.99, 6.49, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', (SELECT id FROM categories WHERE slug = 'snacks'), 65, '16oz', false),
  ('Potato Chips', 'potato-chips', 'Classic sea salt kettle-cooked potato chips', 3.99, NULL, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', (SELECT id FROM categories WHERE slug = 'snacks'), 100, '8oz', false),
  ('Dark Chocolate', 'dark-chocolate', '72% cacao dark chocolate bar', 3.49, NULL, 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400', (SELECT id FROM categories WHERE slug = 'snacks'), 80, '3.5oz', true),

  -- Pantry
  ('Extra Virgin Olive Oil', 'olive-oil', 'Cold-pressed extra virgin olive oil', 9.99, NULL, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', (SELECT id FROM categories WHERE slug = 'pantry'), 50, '500ml', true),
  ('Basmati Rice', 'basmati-rice', 'Premium aged basmati rice', 5.99, NULL, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', (SELECT id FROM categories WHERE slug = 'pantry'), 80, '2lb', false),
  ('Pasta', 'pasta', 'Italian penne pasta, bronze cut', 2.49, NULL, 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400', (SELECT id FROM categories WHERE slug = 'pantry'), 120, '16oz', false),
  ('Canned Tomatoes', 'canned-tomatoes', 'Whole peeled San Marzano tomatoes', 3.49, 2.99, 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400', (SELECT id FROM categories WHERE slug = 'pantry'), 100, '28oz', false),

  -- Frozen Foods
  ('Frozen Pizza', 'frozen-pizza', 'Margherita pizza with fresh mozzarella', 7.99, NULL, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', (SELECT id FROM categories WHERE slug = 'frozen-foods'), 40, 'each', false),
  ('Ice Cream', 'ice-cream', 'Vanilla bean ice cream, premium quality', 5.99, 4.99, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', (SELECT id FROM categories WHERE slug = 'frozen-foods'), 50, 'pint', true),
  ('Frozen Vegetables', 'frozen-vegetables', 'Mixed vegetables medley - broccoli, carrots, corn', 3.49, NULL, 'https://images.unsplash.com/photo-1580013759032-94a44305090e?w=400', (SELECT id FROM categories WHERE slug = 'frozen-foods'), 70, '16oz', false);
