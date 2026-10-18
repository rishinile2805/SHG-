-- ====================================================================
-- Jijamata Gruh Udyog (SHG), Nashik - Seed Data
-- ====================================================================

-- 1. Default Admin User (Password: Jijamata@Nashik2026, bcrypt hash)
-- Also a default customer demo user
INSERT INTO users (id, name, email, phone, password_hash, role, city, district)
VALUES 
  ('usr-admin-01', 'Sunita Patil (SHG Coordinator)', 'admin@jijamata.org', '+91 94222 12345', '$2b$10$tZ27bS6sJv3Xk7y2Rk0m2uWfQnQ5K9qI9sI2UeD9u4Tj2a1c1a2e3', 'admin', 'Nashik', 'Nashik'),
  ('usr-cust-01', 'Rajesh Kulkarni', 'rajesh.kulkarni@gmail.com', '+91 98220 44521', '$2b$10$tZ27bS6sJv3Xk7y2Rk0m2uWfQnQ5K9qI9sI2UeD9u4Tj2a1c1a2e3', 'customer', 'Pune', 'Pune')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Categories
INSERT INTO categories (id, name, name_mr, name_hi, description, image, product_count)
VALUES
  ('Papad', 'Papad', 'पापड', 'पापड़', 'Crispy sun-dried papads made from hand-kneaded pulses and rice grains.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 4),
  ('Achar', 'Pickles / Achar', 'लोणचे', 'अचार', 'Traditional earthen-pot aged pickles made with cold-pressed oil and whole spices.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 4),
  ('Chakli', 'Chakli', 'चकली', 'चकली', 'Spiraled savory snacks prepared from freshly roasted multi-grain bhajani flour.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', 3),
  ('Laddus', 'Laddus', 'लाडू', 'लड्डू', 'Mouth-melting traditional sweet roundels made with pure ghee and wholesome grains.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 4),
  ('Masala', 'Spice Mixes / Masala', 'मसाले', 'मसाला', 'Aromatic slow-roasted spice blends hand-pounded by Nashik women artisans.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 4)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Offers / Coupons
INSERT INTO offers (id, code, title, description, discount_percent, min_order_value, expiry_date, is_active)
VALUES
  ('offer-1', 'JIJAMATA10', 'First Order Special', 'Get flat 10% off on your homemade purchase above ₹499.', 10, 499.00, '31 Dec 2026', TRUE),
  ('offer-2', 'NASHIKFEST', 'Nashik Mahotsav', 'Flat 15% discount on all orders above ₹999.', 15, 999.00, '30 Nov 2026', TRUE),
  ('offer-3', 'SHGDIRECT', 'Direct SHG Support', 'Special 20% discount on orders above ₹1499.', 20, 1499.00, '31 Dec 2026', TRUE)
ON DUPLICATE KEY UPDATE code=VALUES(code);

-- 4. Initial Products
INSERT INTO products (
  id, name, name_mr, name_hi, category_id, price, discount_price, image,
  description, description_mr, description_hi, ingredients, weight, weight_options,
  stock, rating, reviews_count, featured, available, shelf_life, spiciness_level, made_by
)
VALUES
(
  'papad-udid',
  'Traditional Udid Papad',
  'पारंपरिक उडीद डाळ पापड',
  'पारंपरिक उड़द दाल पापड़',
  'Papad',
  140.00,
  160.00,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'Authentic Maharashtrian Udid Papad hand-rolled by Nashik SHG women using premium quality black gram lentils, black pepper and sajji khar. Sun-dried naturally for that quintessential crispiness.',
  'नाशिक महिला बचत गटाने दर्जेदार उडीद डाळ, काळे मिरे आणि हिंग वापरून हाताने लाटलेले व कडक उन्हात वाळवलेले कुरकुरीत उडीद पापड.',
  'नासिक महिला समूह द्वारा हाथ से बेले गए और प्राकृतिक धूप में सुखाए गए कुरकुरे उड़द दाल पापड़।',
  JSON_ARRAY('Udid Dal Flour', 'Black Pepper', 'Hing (Asafoetida)', 'Sajji Khar', 'Edible Oil', 'Salt'),
  '250g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '250g', 'price', 140, 'discountPrice', 160),
    JSON_OBJECT('weight', '500g', 'price', 260, 'discountPrice', 300),
    JSON_OBJECT('weight', '1kg', 'price', 500, 'discountPrice', 580)
  ),
  45, 4.90, 38, TRUE, TRUE, '6 Months', 'Medium', 'Jijamata SHG, Unit 1, Nashik'
),
(
  'papad-rice',
  'Steamed Rice Papad (Tandul)',
  'वाफेवरचे तांदळाचे पापड',
  'चावल के कुरकुरे पापड़',
  'Papad',
  130.00,
  150.00,
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Thin, melt-in-the-mouth rice papads steamed in traditional bamboo sieves and sun-dried. When fried, they expand to twice their size with a delicate crunch.',
  'पारंपरिक पद्धतीने वाफेवर शिजवून उन्हात वाळवलेले पातळ व खमंग तांदळाचे पापड.',
  'पारंपरिक भाप में पकाए गए और धूप में सुखाए गए पतले और खस्ता चावल के पापड़।',
  JSON_ARRAY('Indrayani Rice Flour', 'Cumin Seeds (Jeera)', 'Green Chillies', 'Rock Salt', 'Sesame Seeds'),
  '250g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '250g', 'price', 130, 'discountPrice', 150),
    JSON_OBJECT('weight', '500g', 'price', 240, 'discountPrice', 280)
  ),
  30, 4.80, 24, FALSE, TRUE, '12 Months', 'Mild', 'Jijamata SHG, Unit 2, Nashik'
),
(
  'papad-masala',
  'Spicy Masala Udid Papad',
  'तिखट मसाला उडीद पापड',
  'मसालेदार उड़द पापड़',
  'Papad',
  150.00,
  175.00,
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  'Infused with roasted cumin seeds, crushed black peppercorns and red chilli flakes. Perfect evening tea-time accompaniment or dinner side.',
  'भाजलेले जिरे, काळी मिरी आणि लाल तिखटाचा ठसका असलेले चटपटीत मसाला पापड.',
  'भुना हुआ जीरा, काली मिर्च और लाल मिर्च से भरपूर तीखा मसाला पापड़।',
  JSON_ARRAY('Udid Flour', 'Crushed Black Pepper', 'Red Chilli Flakes', 'Ajwain', 'Cumin', 'Salt'),
  '250g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '250g', 'price', 150, 'discountPrice', 175),
    JSON_OBJECT('weight', '500g', 'price', 280, 'discountPrice', 320)
  ),
  22, 4.70, 19, FALSE, TRUE, '6 Months', 'Spicy', 'Jijamata SHG, Unit 1, Nashik'
),
(
  'achar-mango',
  'Traditional Kairi (Mango) Pickle',
  'पारंपरिक घरगुती कैरीचे लोणचे',
  'पारंपरिक आम का अचार',
  'Achar',
  180.00,
  210.00,
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  'Hand-cut raw Rajapuri mangoes matured in pure cold-pressed groundnut oil, freshly roasted fenugreek, mustard dal and red Guntur chillies. Prepared using our grandmother’s 60-year-old preserved recipe.',
  'गावरान राजापुरी कैरीच्या फोडी, शुद्ध लाकडी घाण्याचे शेंगदाणा तेल आणि घरगुती खडे मसाले घालून तयार केलेले पारंपरिक लोणचे.',
  'राजापुरी कच्ची कैरी, शुद्ध मूंगफली तेल और घर के पीसे मसालों से बना असली पारंपरिक आम का अचार।',
  JSON_ARRAY('Raw Mangoes', 'Cold-Pressed Groundnut Oil', 'Mustard Seeds', 'Fenugreek', 'Red Chilli Powder', 'Turmeric', 'Sea Salt', 'Asafoetida'),
  '350g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '350g', 'price', 180, 'discountPrice', 210),
    JSON_OBJECT('weight', '700g', 'price', 340, 'discountPrice', 390),
    JSON_OBJECT('weight', '1.5kg (Ceramic Barni)', 'price', 680, 'discountPrice', 780)
  ),
  38, 4.95, 62, TRUE, TRUE, '12 Months', 'Spicy', 'Jijamata SHG, Unit 3, Nashik'
),
(
  'achar-lemon',
  'Sweet & Sour Nimbu (Lemon) Pickle',
  'गोड-आंबट लिंबाचे लोणचे',
  'खट्टा-मीठा नींबू का अचार',
  'Achar',
  160.00,
  190.00,
  'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
  'Oil-free digestive lemon pickle aged under the mild Nashik winter sun for 40 days with pure organic jaggery, rock salt and whole spices.',
  'तेल विरहित पाचक लोणचे. नाशिकच्या उन्हात नैसर्गिकरित्या मुरवलेले गोड-आंबट लिंबू लोणचे.',
  'बिना तेल का पाचक और स्वादिष्ट खट्टा-मीठा नींबू का पारंपरिक अचार।',
  JSON_ARRAY('Thin-Skinned Kagzi Lemons', 'Organic Jaggery (Gul)', 'Rock Salt (Sendha Namak)', 'Roasted Cumin', 'Kashmiri Chilli Powder', 'Black Salt'),
  '350g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '350g', 'price', 160, 'discountPrice', 190),
    JSON_OBJECT('weight', '700g', 'price', 300, 'discountPrice', 360)
  ),
  28, 4.85, 41, FALSE, TRUE, '18 Months', 'Mild', 'Jijamata SHG, Unit 3, Nashik'
),
(
  'chakli-bhajani',
  'Bhajani Chakli (Diwali Special Crunch)',
  'खमंग भाजणीची चकली',
  'कुरकुरी भाजणी चकली',
  'Chakli',
  190.00,
  225.00,
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  'Crispy spiral coils prepared from our signature 7-grain roasted bhajani flour. Perfectly seasoned with white sesame seeds, ajwain and a dash of turmeric.',
  '७ धान्यांची मंद आचेवर भाजणी करून खमंग तळलेली खुसखुशीत काटेरी चकली. तोंडात टाकताच विरघळणारी.',
  'सात तरह के अनाजों की पारंपरिक भुनी भाजणी से बनी कुरकुरी और स्वादिष्ट चकली।',
  JSON_ARRAY('Roasted Rice', 'Chana Dal', 'Udid Dal', 'Poha', 'Coriander Seeds', 'Cumin', 'White Sesame', 'Ajwain', 'Cold-Pressed Groundnut Oil', 'Salt'),
  '250g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '250g', 'price', 190, 'discountPrice', 225),
    JSON_OBJECT('weight', '500g', 'price', 360, 'discountPrice', 420),
    JSON_OBJECT('weight', '1kg', 'price', 700, 'discountPrice', 800)
  ),
  50, 4.96, 89, TRUE, TRUE, '3 Months', 'Medium', 'Jijamata SHG, Central Kitchen, Nashik'
),
(
  'laddu-besan',
  'Pure Desi Ghee Besan Laddu',
  'शुद्ध तुपातील रवाळ बेसन लाडू',
  'शुद्ध देशी घी बेसन के लड्डू',
  'Laddus',
  240.00,
  280.00,
  'https://images.unsplash.com/photo-1599785209796-786432b228bc?auto=format&fit=crop&w=800&q=80',
  'Traditional coarse-ground gram flour roasted for hours in pure cow desi ghee until fragrant golden brown. Studded with organic cashews, almonds and aromatic green cardamom.',
  'शुद्ध देशी गावरान तुपात तासन् तास खमंग भाजलेल्या डाळीचे रवाळ बेसन लाडू. काजू, बदाम आणि वेलचीचा अप्रतिम सुगंध.',
  'शुद्ध देशी गाय के घी में भुने हुए दानेदार और खुशबूदार बेसन के पारंपरिक लड्डू।',
  JSON_ARRAY('Gram Flour (Chana Dal)', 'Pure Cow Ghee', 'Organic Bura Sugar', 'Cashews', 'Almonds', 'Cardamom (Elaichi)', 'Nutmeg (Jaiphal)'),
  '250g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '250g', 'price', 240, 'discountPrice', 280),
    JSON_OBJECT('weight', '500g', 'price', 460, 'discountPrice', 530),
    JSON_OBJECT('weight', '1kg (Gift Box)', 'price', 900, 'discountPrice', 1050)
  ),
  35, 4.98, 97, TRUE, TRUE, '2 Months', 'Mild', 'Jijamata SHG, Central Kitchen, Nashik'
),
(
  'masala-goda',
  'Authentic Nashik Special Goda Masala',
  'पारंपरिक नाशिक स्पेशल गोडा मसाला',
  'पारंपरिक गोडा मसाला',
  'Masala',
  160.00,
  190.00,
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  'The crown jewel of Maharashtrian cuisine. Over 22 exotic whole spices roasted with cold-pressed oil and dry coconut, then hand-pounded in stone pestles.',
  '२२ पेक्षा जास्त खडे मसाले, दगडफूल, नागकेशर व सुके खोबरे वापरून कुटलेला अस्सल सुगंधी गोडा मसाला.',
  '२२ से अधिक मसालों को भूनकर तैयार किया गया महाराष्ट्र का प्रसिद्ध गोडा मसाला।',
  JSON_ARRAY('Coriander Seeds', 'Dry Coconut (Khobara)', 'Cumin', 'Sesame Seeds', 'Stone Flower (Dagad Phool)', 'Nagkeshar', 'Cinnamon', 'Cloves', 'Cardamom', 'Bay Leaf', 'Oil'),
  '200g',
  JSON_ARRAY(
    JSON_OBJECT('weight', '200g', 'price', 160, 'discountPrice', 190),
    JSON_OBJECT('weight', '500g', 'price', 380, 'discountPrice', 450),
    JSON_OBJECT('weight', '1kg', 'price', 720, 'discountPrice', 850)
  ),
  40, 4.95, 78, TRUE, TRUE, '12 Months', 'Medium', 'Jijamata SHG, Unit 4, Nashik'
)
ON DUPLICATE KEY UPDATE name=VALUES(name);
