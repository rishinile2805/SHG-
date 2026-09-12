import { Product, Order, CategoryInfo, Offer, Review, ContactMessage, Customer } from '../types';

export const initialCategories: CategoryInfo[] = [
  {
    id: 'Papad',
    name: 'Papad',
    nameMr: 'पापड',
    nameHi: 'पापड़',
    description: 'Crispy sun-dried papads made from hand-kneaded pulses and rice grains.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    productCount: 4
  },
  {
    id: 'Achar',
    name: 'Pickles / Achar',
    nameMr: 'लोणचे',
    nameHi: 'अचार',
    description: 'Traditional earthen-pot aged pickles made with cold-pressed oil and whole spices.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    productCount: 4
  },
  {
    id: 'Chakli',
    name: 'Chakli',
    nameMr: 'चकली',
    nameHi: 'चकली',
    description: 'Spiraled savory snacks prepared from freshly roasted multi-grain bhajani flour.',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    productCount: 3
  },
  {
    id: 'Laddus',
    name: 'Laddus',
    nameMr: 'लाडू',
    nameHi: 'लड्डू',
    description: 'Mouth-melting traditional sweet roundels made with pure ghee and wholesome grains.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    productCount: 4
  },
  {
    id: 'Masala',
    name: 'Spice Mixes / Masala',
    nameMr: 'मसाले',
    nameHi: 'मसाला',
    description: 'Aromatic slow-roasted spice blends hand-pounded by Nashik women artisans.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    productCount: 4
  }
];

export const initialProducts: Product[] = [
  // PAPAD
  {
    id: 'papad-udid',
    name: 'Traditional Udid Papad',
    nameMr: 'पारंपरिक उडीद डाळ पापड',
    nameHi: 'पारंपरिक उड़द दाल पापड़',
    category: 'Papad',
    price: 140,
    discountPrice: 160,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic Maharashtrian Udid Papad hand-rolled by Nashik SHG women using premium quality black gram lentils, black pepper and sajji khar. Sun-dried naturally for that quintessential crispiness.',
    descriptionMr: 'नाशिक महिला बचत गटाने दर्जेदार उडीद डाळ, काळे मिरे आणि हिंग वापरून हाताने लाटलेले व कडक उन्हात वाळवलेले कुरकुरीत उडीद पापड.',
    descriptionHi: 'नासिक महिला समूह द्वारा हाथ से बेले गए और प्राकृतिक धूप में सुखाए गए कुरकुरे उड़द दाल पापड़।',
    ingredients: ['Udid Dal Flour', 'Black Pepper', 'Hing (Asafoetida)', 'Sajji Khar', 'Edible Oil', 'Salt'],
    weight: '250g',
    weightOptions: [
      { weight: '250g', price: 140, discountPrice: 160 },
      { weight: '500g', price: 260, discountPrice: 300 },
      { weight: '1kg', price: 500, discountPrice: 580 }
    ],
    stock: 45,
    rating: 4.9,
    reviewsCount: 38,
    featured: true,
    available: true,
    shelfLife: '6 Months',
    spicinessLevel: 'Medium',
    madeBy: 'Jijamata SHG, Unit 1, Nashik'
  },
  {
    id: 'papad-rice',
    name: 'Steamed Rice Papad (Tandul)',
    nameMr: 'वाफेवरचे तांदळाचे पापड',
    nameHi: 'चावल के कुरकुरे पापड़',
    category: 'Papad',
    price: 130,
    discountPrice: 150,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    description: 'Thin, melt-in-the-mouth rice papads steamed in traditional bamboo sieves and sun-dried. When fried, they expand to twice their size with a delicate crunch.',
    descriptionMr: 'पारंपरिक पद्धतीने वाफेवर शिजवून उन्हात वाळवलेले पातळ व खमंग तांदळाचे पापड.',
    descriptionHi: 'पारंपरिक भाप में पकाए गए और धूप में सुखाए गए पतले और खस्ता चावल के पापड़।',
    ingredients: ['Indrayani Rice Flour', 'Cumin Seeds (Jeera)', 'Green Chillies', 'Rock Salt', 'Sesame Seeds'],
    weight: '250g',
    weightOptions: [
      { weight: '250g', price: 130, discountPrice: 150 },
      { weight: '500g', price: 240, discountPrice: 280 }
    ],
    stock: 30,
    rating: 4.8,
    reviewsCount: 24,
    featured: false,
    available: true,
    shelfLife: '12 Months',
    spicinessLevel: 'Mild',
    madeBy: 'Jijamata SHG, Unit 2, Nashik'
  },
  {
    id: 'papad-masala',
    name: 'Spicy Masala Udid Papad',
    nameMr: 'तिखट मसाला उडीद पापड',
    nameHi: 'मसालेदार उड़द पापड़',
    category: 'Papad',
    price: 150,
    discountPrice: 175,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    description: 'Infused with roasted cumin seeds, crushed black peppercorns and red chilli flakes. Perfect evening tea-time accompaniment or dinner side.',
    descriptionMr: 'भाजलेले जिरे, काळी मिरी आणि लाल तिखटाचा ठसका असलेले चटपटीत मसाला पापड.',
    descriptionHi: 'भुना हुआ जीरा, काली मिर्च और लाल मिर्च से भरपूर तीखा मसाला पापड़।',
    ingredients: ['Udid Flour', 'Crushed Black Pepper', 'Red Chilli Flakes', 'Ajwain', 'Cumin', 'Salt'],
    weight: '250g',
    weightOptions: [
      { weight: '250g', price: 150, discountPrice: 175 },
      { weight: '500g', price: 280, discountPrice: 320 }
    ],
    stock: 22,
    rating: 4.7,
    reviewsCount: 19,
    featured: false,
    available: true,
    shelfLife: '6 Months',
    spicinessLevel: 'Spicy',
    madeBy: 'Jijamata SHG, Unit 1, Nashik'
  },

  // PICKLES / ACHAR
  {
    id: 'achar-mango',
    name: 'Traditional Kairi (Mango) Pickle',
    nameMr: 'पारंपरिक घरगुती कैरीचे लोणचे',
    nameHi: 'पारंपरिक आम का खट्टा अचार',
    category: 'Achar',
    price: 180,
    discountPrice: 210,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted with raw Rajapuri green mangoes harvested from local orchards near Nashik. Blended with stone-ground mustard seeds, fenugreek, and cold-pressed groundnut oil, matured slowly in ceramic martabans.',
    descriptionMr: 'स्थानिक नाशिकच्या बागेतील राजापुरी कैरी, मोहरीची डाळ, मेथी आणि शुद्ध शेंगदाणा तेलात बरणीत मुरवलेले खमंग लोणचे.',
    descriptionHi: 'राजापुरी आम, राई की दाल और शुद्ध मूंगफली तेल में चीनी-मिट्टी की बरनी में पकाया गया पारंपरिक अचार।',
    ingredients: ['Raw Rajapuri Mango', 'Mustard Seeds', 'Fenugreek', 'Cold-Pressed Groundnut Oil', 'Turmeric', 'Red Chilli Powder', 'Rock Salt'],
    weight: '350g',
    weightOptions: [
      { weight: '350g', price: 180, discountPrice: 210 },
      { weight: '700g', price: 340, discountPrice: 400 },
      { weight: '1.5kg', price: 680, discountPrice: 800 }
    ],
    stock: 50,
    rating: 4.9,
    reviewsCount: 52,
    featured: true,
    available: true,
    shelfLife: '12 Months',
    spicinessLevel: 'Medium',
    madeBy: 'Jijamata SHG, Achar Unit, Nashik'
  },
  {
    id: 'achar-lemon',
    name: 'Sweet & Tangy Lemon Pickle (Limboo)',
    nameMr: 'गोड-आंबट लिंबू लोणचे',
    nameHi: 'खट्टा-मीठा नींबू का अचार',
    category: 'Achar',
    price: 160,
    discountPrice: 190,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
    description: 'Zero oil traditional recipe! Juicy Nashik lemons naturally preserved with organic jaggery, black rock salt, and warming spices. Aged under the sun for 40 days.',
    descriptionMr: 'तेलमुक्त पारंपरिक पद्धतीचे! नाशिकचे रसाळ लिंबू, सेंद्रिय गूळ आणि सैंधव मिठात उन्हात मुरवलेले रुचकर लोणचे.',
    descriptionHi: 'बिना तेल के शुद्ध गुड़ और सेंधा नमक में धूप में ४० दिन तक पकाया गया खट्टा-मीठा नींबू का अचार।',
    ingredients: ['Juicy Nashik Lemons', 'Organic Jaggery (Gul)', 'Black Salt', 'Kashmiri Red Chilli', 'Roasted Cumin'],
    weight: '350g',
    weightOptions: [
      { weight: '350g', price: 160, discountPrice: 190 },
      { weight: '700g', price: 300, discountPrice: 350 }
    ],
    stock: 35,
    rating: 4.8,
    reviewsCount: 31,
    featured: false,
    available: true,
    shelfLife: '18 Months',
    spicinessLevel: 'Mild',
    madeBy: 'Jijamata SHG, Achar Unit, Nashik'
  },
  {
    id: 'achar-thecha',
    name: 'Kolhapuri Green Chilli Thecha',
    nameMr: 'झणझणीत हिरव्या मिरचीचा ठेचा',
    nameHi: 'तीखा हरी मिर्च का ठेचा',
    category: 'Achar',
    price: 130,
    discountPrice: 150,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    description: 'Coarsely pounded hot green chillies, garlic cloves, roasted cumin and peanuts in pure groundnut oil. The authentic Maharashtrian village fire in every spoonful.',
    descriptionMr: 'खलबत्त्यात कुटलेली तिखट हिरवी मिरची, लसूण, भाजलेले शेंगदाणे आणि जिरे यांचा अस्सल गावरान ठेचा.',
    descriptionHi: 'सिलबट्टे पर कुटी हुई हरी मिर्च, लहसुन और भुनी मूंगफली का प्रामाणिक महाराष्ट्रीयन ठेचा।',
    ingredients: ['Fresh Green Chillies', 'Desi Garlic', 'Roasted Peanuts', 'Cumin Seeds', 'Groundnut Oil', 'Salt'],
    weight: '250g',
    weightOptions: [
      { weight: '250g', price: 130, discountPrice: 150 },
      { weight: '500g', price: 240, discountPrice: 280 }
    ],
    stock: 28,
    rating: 4.9,
    reviewsCount: 44,
    featured: true,
    available: true,
    shelfLife: '3 Months',
    spicinessLevel: 'Spicy',
    madeBy: 'Jijamata SHG, Achar Unit, Nashik'
  },

  // CHAKLI
  {
    id: 'chakli-bhajani',
    name: 'Special Bhajani Chakli (Multi-Grain)',
    nameMr: 'खमंग भाजणी चकली (दिवाळी विशेष)',
    nameHi: 'खस्ता भाजणी चकली (मल्टीग्रेन)',
    category: 'Chakli',
    price: 190,
    discountPrice: 220,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    description: 'The pride of Jijamata Gruh Udyog! Multi-grain flour made of roasted rice, chana dal, udid dal, coriander seeds and cumin. Deep-fried in fresh sunflower oil to crunchy, spiral perfection.',
    descriptionMr: 'तांदूळ, चणा डाळ, उडीद डाळ, धणे व जिरे मंद आचेवर भाजून तयार केलेल्या घरगुती भाजणीची कुरकुरीत व खमंग चकली.',
    descriptionHi: 'भुने हुए अनाज और दालों से बनी प्रामाणिक खस्ता और सुगंधित चकली।',
    ingredients: ['Bhajani Flour (Rice, Chana Dal, Udid Dal, Moong)', 'Coriander Seeds', 'Cumin', 'White Sesame (Til)', 'Ajwain', 'Vegetable Oil', 'Spices'],
    weight: '400g',
    weightOptions: [
      { weight: '400g', price: 190, discountPrice: 220 },
      { weight: '800g', price: 360, discountPrice: 420 },
      { weight: '1.5kg', price: 650, discountPrice: 750 }
    ],
    stock: 60,
    rating: 5.0,
    reviewsCount: 65,
    featured: true,
    available: true,
    shelfLife: '4 Months',
    spicinessLevel: 'Medium',
    madeBy: 'Jijamata SHG, Snack Unit, Nashik'
  },
  {
    id: 'chakli-butter',
    name: 'Poha Butter Chakli (Melt-in-Mouth)',
    nameMr: 'खमंग पोहा बटर चकली',
    nameHi: 'पोहा बटर चकली',
    category: 'Chakli',
    price: 170,
    discountPrice: 195,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    description: 'Light, non-greasy and delicate snack made with beaten rice flakes (poha), white butter and roasted sesame seeds. Loved by children and elders alike.',
    descriptionMr: 'नाशिकच्या दर्जेदार पोह्यांपासून व लोण्यापासून बनवलेली तोंडात विरघळणारी हलकी-फुलकी चकली.',
    descriptionHi: 'पोहा और मक्खन से तैयार हल्की, कुरकुरी और स्वादिष्ट चकली।',
    ingredients: ['Roasted Poha Flour', 'Rice Flour', 'White Butter', 'Sesame Seeds', 'Cumin', 'Mild Spices'],
    weight: '350g',
    weightOptions: [
      { weight: '350g', price: 170, discountPrice: 195 },
      { weight: '700g', price: 320, discountPrice: 370 }
    ],
    stock: 18,
    rating: 4.7,
    reviewsCount: 22,
    featured: false,
    available: true,
    shelfLife: '3 Months',
    spicinessLevel: 'Mild',
    madeBy: 'Jijamata SHG, Snack Unit, Nashik'
  },

  // LADDUS
  {
    id: 'laddu-besan',
    name: 'Pure Ghee Besan Laddus (Danedar)',
    nameMr: 'शुद्ध तुपातील दाणेदार बेसन लाडू',
    nameHi: 'शुद्ध घी के दानेदार बेसन लड्डू',
    category: 'Laddus',
    price: 240,
    discountPrice: 280,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    description: 'Slow-roasted gram flour in 100% pure desi cow ghee until golden amber, garnished with green cardamom, crunchy cashews and almonds. Pure home-style goodness.',
    descriptionMr: 'शुद्ध गावरान तुपात मंद आचेवर गुलाबी होईपर्यंत भाजलेले दाणेदार बेसन, वेलची पूड आणि बदाम-काजूयुक्त चवदार लाडू.',
    descriptionHi: 'शुद्ध देसी घी में धीमी आंच पर भुने हुए दानेदार बेसन, इलायची और मेवे से भरपूर लड्डू।',
    ingredients: ['Coarse Gram Flour (Besan)', 'Pure Desi Cow Ghee', 'Bura Sugar', 'Cardamom Powder', 'Cashews', 'Almonds'],
    weight: '400g (10-12 pcs)',
    weightOptions: [
      { weight: '400g (10-12 pcs)', price: 240, discountPrice: 280 },
      { weight: '800g (20-24 pcs)', price: 460, discountPrice: 540 },
      { weight: '1.5kg (Family Box)', price: 850, discountPrice: 990 }
    ],
    stock: 40,
    rating: 4.9,
    reviewsCount: 71,
    featured: true,
    available: true,
    shelfLife: '2 Months',
    spicinessLevel: 'Mild',
    madeBy: 'Jijamata SHG, Sweet Unit, Nashik'
  },
  {
    id: 'laddu-ragi',
    name: 'Nutritious Ragi & Jaggery Laddus (Nachni)',
    nameMr: 'पौष्टिक नाचणी-गूळ लाडू (लोहाने समृद्ध)',
    nameHi: 'पौष्टिक रागी और गुड़ के लड्डू',
    category: 'Laddus',
    price: 220,
    discountPrice: 250,
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    description: 'Healthy and wholesome sweet packed with calcium and iron. Made from locally harvested Nashik finger millet (nachni), organic jaggery, and crushed dry fruits in pure cow ghee.',
    descriptionMr: 'सेंद्रिय नाचणी, सेंद्रिय गूळ आणि सुका मेवा वापरून बनवलेले लोह आणि कॅल्शियमने समृद्ध पौष्टिक लाडू.',
    descriptionHi: 'नासिक की रागी, जैविक गुड़ और मेवों से भरपूर स्वास्थ्यवर्धक लड्डू।',
    ingredients: ['Sprouted Ragi (Nachni) Flour', 'Organic Jaggery', 'Pure Cow Ghee', 'Dry Dates Powder (Kharik)', 'Almonds'],
    weight: '400g',
    weightOptions: [
      { weight: '400g', price: 220, discountPrice: 250 },
      { weight: '800g', price: 420, discountPrice: 480 }
    ],
    stock: 25,
    rating: 4.8,
    reviewsCount: 29,
    featured: false,
    available: true,
    shelfLife: '3 Months',
    spicinessLevel: 'Mild',
    madeBy: 'Jijamata SHG, Sweet Unit, Nashik'
  },
  {
    id: 'laddu-dink',
    name: 'Traditional Dink (Edible Gum) Laddus',
    nameMr: 'पौष्टिक डिंकाचे लाडू (सुका मेवा विशेष)',
    nameHi: 'गोंद और सूखे मेवे के लड्डू',
    category: 'Laddus',
    price: 290,
    discountPrice: 330,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    description: 'Winter and post-partum traditional superfood recipe. Made with crunchy fried edible gum (dink), grated dried coconut, roasted poppy seeds, dates and dry fruits in pure cow ghee.',
    descriptionMr: 'तळलेला डिंक, खोबरे, खसखस, खारीक आणि भरपूर सुका मेवा शुद्ध तुपात तयार केलेले शक्तिवर्धक डिंकाचे लाडू.',
    descriptionHi: 'गोंद, सूखा नारियल, खसखस और मेवों से बने पारंपरिक शक्तिवर्धक लड्डू।',
    ingredients: ['Edible Gum (Dink)', 'Dry Coconut', 'Dry Dates Powder', 'Pure Cow Ghee', 'Poppy Seeds', 'Organic Jaggery', 'Dry Fruits'],
    weight: '400g',
    weightOptions: [
      { weight: '400g', price: 290, discountPrice: 330 },
      { weight: '800g', price: 560, discountPrice: 640 }
    ],
    stock: 15,
    rating: 4.9,
    reviewsCount: 36,
    featured: true,
    available: true,
    shelfLife: '3 Months',
    spicinessLevel: 'Mild',
    madeBy: 'Jijamata SHG, Sweet Unit, Nashik'
  },

  // SPICE MIXES / MASALA
  {
    id: 'masala-goda',
    name: 'Authentic Nashik Goda Masala',
    nameMr: 'अस्सल नाशिक काळा/गोडा मसाला',
    nameHi: 'नासिक का प्रसिद्ध गोडा मसाला',
    category: 'Masala',
    price: 160,
    discountPrice: 190,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    description: 'The soul of Maharashtrian cuisine! 24 traditional whole spices slowly roasted with stone flowers (dagad phool), sesame, and grated dry coconut. Essential for authentic Amti, Dal and Usal.',
    descriptionMr: 'दगडफूल, तीळ, सुके खोबरे आणि २४ सुगंधी मसाल्यांची मंद आचेवर भाजणी करून खलबत्त्यात कुटलेला अस्सल गोडा मसाला.',
    descriptionHi: 'पत्थर के फूल, तिल और २४ मसालों के मिश्रण से बना सुगंधित पारंपरिक गोडा मसाला।',
    ingredients: ['Coriander Seeds', 'Cumin', 'Stone Flower (Dagad Phool)', 'Dry Coconut', 'White Sesame', 'Star Anise', 'Cinnamon', 'Cloves'],
    weight: '250g',
    weightOptions: [
      { weight: '250g', price: 160, discountPrice: 190 },
      { weight: '500g', price: 300, discountPrice: 360 },
      { weight: '1kg', price: 580, discountPrice: 700 }
    ],
    stock: 55,
    rating: 5.0,
    reviewsCount: 82,
    featured: true,
    available: true,
    shelfLife: '12 Months',
    spicinessLevel: 'Medium',
    madeBy: 'Jijamata SHG, Spice Unit, Nashik'
  },
  {
    id: 'masala-misal',
    name: 'Nashik Special Misal Masala (Zanzanit)',
    nameMr: 'झणझणीत नाशिक मिसळ मसाला',
    nameHi: 'तीखा नासिक मिसल मसाला',
    category: 'Masala',
    price: 140,
    discountPrice: 165,
    image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80',
    description: 'Recreate Nashik’s world-famous fiery, aromatic Misal pav kat/tarri right in your home kitchen. Perfectly roasted Bedgi and Lavangi chillies with aromatic whole garam masalas.',
    descriptionMr: 'नाशिकची जगप्रसिद्ध झणझणीत मिसळ आणि तर्री बनवण्यासाठी खास बेळगावी व लवंगी मिरच्यांपासून तयार केलेला मसाला.',
    descriptionHi: 'नासिक की मशहूर तीखी और स्वादिष्ट मिसल तरी बनाने के लिए विशेष मसाला मिश्रण।',
    ingredients: ['Bedgi & Lavangi Chillies', 'Coriander', 'Cumin', 'Black Cardamom', 'Bay Leaves', 'Fennel', 'Cloves', 'Nutmeg'],
    weight: '250g',
    weightOptions: [
      { weight: '250g', price: 140, discountPrice: 165 },
      { weight: '500g', price: 260, discountPrice: 310 }
    ],
    stock: 38,
    rating: 4.9,
    reviewsCount: 49,
    featured: true,
    available: true,
    shelfLife: '12 Months',
    spicinessLevel: 'Spicy',
    madeBy: 'Jijamata SHG, Spice Unit, Nashik'
  },
  {
    id: 'masala-kanda-lasun',
    name: 'Gavran Kanda Lasun Masala (Onion-Garlic)',
    nameMr: 'गावरान कांदा लसूण मसाला',
    nameHi: 'कांदा लहसुन मसाला',
    category: 'Masala',
    price: 150,
    discountPrice: 175,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    description: 'Slow-fried Nashik red onions and desi garlic blended with stone-ground red chillies and whole spices. Brings rich color, thick gravy and robust aroma to any vegetable or curry.',
    descriptionMr: 'नाशिकचा लाल कांदा व गावठी लसूण तेलात सोनेरी तळून मसाल्यांसोबत एकत्र केलेला चवदार कांदा लसूण मसाला.',
    descriptionHi: 'नासिक के प्याज और देसी लहसुन के साथ पिसा हुआ पारंपरिक कांदा-लहसुन मसाला।',
    ingredients: ['Nashik Red Onions', 'Garlic Cloves', 'Red Chilli Powder', 'Coriander Seeds', 'Turmeric', 'Cinnamon', 'Oil'],
    weight: '250g',
    weightOptions: [
      { weight: '250g', price: 150, discountPrice: 175 },
      { weight: '500g', price: 280, discountPrice: 330 }
    ],
    stock: 42,
    rating: 4.8,
    reviewsCount: 37,
    featured: false,
    available: true,
    shelfLife: '9 Months',
    spicinessLevel: 'Spicy',
    madeBy: 'Jijamata SHG, Spice Unit, Nashik'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'JGU-8942',
    customerName: 'Rajesh Kulkarni',
    customerPhone: '+91 98220 44521',
    customerEmail: 'rajesh.kulkarni@gmail.com',
    address: {
      street: 'Flat 402, Anand Heights, Kothrud',
      landmark: 'Near City Pride Multiplex',
      city: 'Pune',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411038'
    },
    items: [
      {
        productId: 'chakli-bhajani',
        productName: 'Special Bhajani Chakli (Multi-Grain)',
        productImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
        weight: '400g',
        price: 190,
        quantity: 2
      },
      {
        productId: 'achar-mango',
        productName: 'Traditional Kairi (Mango) Pickle',
        productImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        weight: '350g',
        price: 180,
        quantity: 1
      },
      {
        productId: 'masala-goda',
        productName: 'Authentic Nashik Goda Masala',
        productImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
        weight: '250g',
        price: 160,
        quantity: 1
      }
    ],
    subtotal: 720,
    deliveryCharge: 0,
    discount: 72,
    total: 648,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Preparing',
    orderDate: '2026-09-10 14:30',
    estimatedDelivery: '2026-09-13',
    notes: 'Please pack the pickle in bubble wrap carefully.',
    timeline: [
      { status: 'Pending', timestamp: '10 Sep 2026, 02:30 PM', description: 'Order received and logged in system', completed: true },
      { status: 'Confirmed', timestamp: '10 Sep 2026, 03:15 PM', description: 'Order verified by Jijamata SHG office', completed: true },
      { status: 'Preparing', timestamp: '11 Sep 2026, 09:00 AM', description: 'Artisan sisters freshly preparing & weighing batch in Nashik kitchen', completed: true },
      { status: 'Packed', timestamp: 'Pending', description: 'Vacuum sealing and moisture-proof packaging', completed: false },
      { status: 'Out for Delivery', timestamp: 'Pending', description: 'Handed over to express courier partner', completed: false },
      { status: 'Delivered', timestamp: 'Pending', description: 'Delivered to your doorstep', completed: false }
    ]
  },
  {
    id: 'JGU-8920',
    customerName: 'Pooja Deshmukh',
    customerPhone: '+91 97654 32190',
    customerEmail: 'pooja.deshmukh@yahoo.com',
    address: {
      street: 'Row House 12, Sahakar Nagar, Dadar West',
      landmark: 'Behind Shivaji Park',
      city: 'Mumbai',
      district: 'Mumbai City',
      state: 'Maharashtra',
      pincode: '400028'
    },
    items: [
      {
        productId: 'laddu-besan',
        productName: 'Pure Ghee Besan Laddus (Danedar)',
        productImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        weight: '800g (20-24 pcs)',
        price: 460,
        quantity: 1
      },
      {
        productId: 'papad-udid',
        productName: 'Traditional Udid Papad',
        productImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        weight: '500g',
        price: 260,
        quantity: 2
      }
    ],
    subtotal: 980,
    deliveryCharge: 0,
    discount: 0,
    total: 980,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Out for Delivery',
    orderDate: '2026-09-09 11:20',
    estimatedDelivery: '2026-09-11',
    timeline: [
      { status: 'Pending', timestamp: '09 Sep 2026, 11:20 AM', description: 'Order placed online', completed: true },
      { status: 'Confirmed', timestamp: '09 Sep 2026, 12:00 PM', description: 'Payment verified and order accepted', completed: true },
      { status: 'Preparing', timestamp: '09 Sep 2026, 03:00 PM', description: 'Packaged fresh from morning batch', completed: true },
      { status: 'Packed', timestamp: '10 Sep 2026, 08:30 AM', description: 'Dispatched from Nashik Hub', completed: true },
      { status: 'Out for Delivery', timestamp: '11 Sep 2026, 08:45 AM', description: 'Out with delivery agent in Dadar, Mumbai', completed: true },
      { status: 'Delivered', timestamp: 'Pending', description: 'Package handed over', completed: false }
    ]
  },
  {
    id: 'JGU-8891',
    customerName: 'Anita Joshi',
    customerPhone: '+91 94231 77652',
    customerEmail: 'anita.joshi@rediffmail.com',
    address: {
      street: 'Plot 7, Gangapur Road, Near Someshwar',
      landmark: 'Opp. Bapu Bridge',
      city: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      pincode: '422013'
    },
    items: [
      {
        productId: 'masala-misal',
        productName: 'Nashik Special Misal Masala (Zanzanit)',
        productImage: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80',
        weight: '500g',
        price: 260,
        quantity: 2
      },
      {
        productId: 'achar-thecha',
        productName: 'Kolhapuri Green Chilli Thecha',
        productImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
        weight: '250g',
        price: 130,
        quantity: 2
      }
    ],
    subtotal: 780,
    deliveryCharge: 0,
    discount: 50,
    total: 730,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    status: 'Delivered',
    orderDate: '2026-09-08 16:40',
    estimatedDelivery: '2026-09-09',
    timeline: [
      { status: 'Pending', timestamp: '08 Sep 2026, 04:40 PM', description: 'Order placed by customer', completed: true },
      { status: 'Confirmed', timestamp: '08 Sep 2026, 05:00 PM', description: 'Order accepted for local Nashik fast-track', completed: true },
      { status: 'Preparing', timestamp: '08 Sep 2026, 06:15 PM', description: 'Fresh spices packaged by SHG sisters', completed: true },
      { status: 'Packed', timestamp: '09 Sep 2026, 09:30 AM', description: 'Ready for local delivery', completed: true },
      { status: 'Out for Delivery', timestamp: '09 Sep 2026, 11:00 AM', description: 'Delivery executive on bike out for delivery', completed: true },
      { status: 'Delivered', timestamp: '09 Sep 2026, 01:20 PM', description: 'Delivered with gratitude. Cash collected.', completed: true }
    ]
  },
  {
    id: 'JGU-8874',
    customerName: 'Sachin Patil',
    customerPhone: '+91 98901 23456',
    customerEmail: 'sachin.patil@outlook.com',
    address: {
      street: 'Flat B-303, Vasant Vihar, Pokhran Road 2',
      landmark: 'Near Upvan Lake',
      city: 'Thane',
      district: 'Thane',
      state: 'Maharashtra',
      pincode: '400610'
    },
    items: [
      {
        productId: 'laddu-dink',
        productName: 'Traditional Dink (Edible Gum) Laddus',
        productImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        weight: '400g',
        price: 290,
        quantity: 1
      },
      {
        productId: 'laddu-ragi',
        productName: 'Nutritious Ragi & Jaggery Laddus (Nachni)',
        productImage: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
        weight: '400g',
        price: 220,
        quantity: 1
      }
    ],
    subtotal: 510,
    deliveryCharge: 0,
    discount: 0,
    total: 510,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Confirmed',
    orderDate: '2026-09-11 08:15',
    estimatedDelivery: '2026-09-14',
    timeline: [
      { status: 'Pending', timestamp: '11 Sep 2026, 08:15 AM', description: 'Order created', completed: true },
      { status: 'Confirmed', timestamp: '11 Sep 2026, 09:30 AM', description: 'Confirmed by kitchen manager', completed: true },
      { status: 'Preparing', timestamp: 'Pending', description: 'Queued for today afternoon baking & sweet making', completed: false },
      { status: 'Packed', timestamp: 'Pending', description: 'Will be packed by evening', completed: false },
      { status: 'Out for Delivery', timestamp: 'Pending', description: 'Awaiting dispatch', completed: false },
      { status: 'Delivered', timestamp: 'Pending', description: 'Pending delivery', completed: false }
    ]
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rajesh Kulkarni',
    email: 'rajesh.kulkarni@gmail.com',
    phone: '+91 98220 44521',
    city: 'Pune',
    district: 'Pune',
    ordersCount: 4,
    totalSpent: 3120,
    lastOrderDate: '2026-09-10',
    status: 'Active'
  },
  {
    id: 'cust-2',
    name: 'Pooja Deshmukh',
    email: 'pooja.deshmukh@yahoo.com',
    phone: '+91 97654 32190',
    city: 'Mumbai',
    district: 'Mumbai City',
    ordersCount: 6,
    totalSpent: 4890,
    lastOrderDate: '2026-09-09',
    status: 'Active'
  },
  {
    id: 'cust-3',
    name: 'Anita Joshi',
    email: 'anita.joshi@rediffmail.com',
    phone: '+91 94231 77652',
    city: 'Nashik',
    district: 'Nashik',
    ordersCount: 11,
    totalSpent: 7650,
    lastOrderDate: '2026-09-08',
    status: 'Active'
  },
  {
    id: 'cust-4',
    name: 'Sachin Patil',
    email: 'sachin.patil@outlook.com',
    phone: '+91 98901 23456',
    city: 'Thane',
    district: 'Thane',
    ordersCount: 2,
    totalSpent: 1140,
    lastOrderDate: '2026-09-11',
    status: 'New'
  },
  {
    id: 'cust-5',
    name: 'Meera Gokhale',
    email: 'meera.gokhale@gmail.com',
    phone: '+91 98811 55432',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    ordersCount: 5,
    totalSpent: 4200,
    lastOrderDate: '2026-08-28',
    status: 'Active'
  }
];

export const initialOffers: Offer[] = [
  {
    id: 'offer-1',
    code: 'JIJAMATA10',
    title: '10% Off on Orders Above ₹500',
    description: 'Special introductory welcome discount for genuine homemade lovers.',
    discountPercent: 10,
    minOrderValue: 500,
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'offer-2',
    code: 'FESTIVAL15',
    title: '15% Off Festive Pack',
    description: 'Celebrate festivals with authentic Maharashtrian sweets and savories.',
    discountPercent: 15,
    minOrderValue: 900,
    expiryDate: '2026-11-30',
    isActive: true
  },
  {
    id: 'offer-3',
    code: 'SHGHERO',
    title: 'SHG Patron Special - ₹50 Off',
    description: 'Flat ₹50 discount celebrating women empowerment and rural craft.',
    discountPercent: 8,
    minOrderValue: 400,
    expiryDate: '2026-10-31',
    isActive: true
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'chakli-bhajani',
    productName: 'Special Bhajani Chakli (Multi-Grain)',
    customerName: 'Sunita Ranade',
    customerCity: 'Pune',
    rating: 5,
    comment: 'Reminds me exactly of my grandmother’s Diwali preparation! Crisp, not too oily, and the roasted bhajani aroma is completely authentic. Highly recommend!',
    date: '02 Sep 2026',
    status: 'Approved'
  },
  {
    id: 'rev-2',
    productId: 'achar-mango',
    productName: 'Traditional Kairi (Mango) Pickle',
    customerName: 'Mahesh Bapat',
    customerCity: 'Mumbai',
    rating: 5,
    comment: 'The traditional ceramic jar aging really makes a difference. No chemical taste, just pure cold-pressed oil and fragrant mustard. My whole family loves it.',
    date: '28 Aug 2026',
    status: 'Approved'
  },
  {
    id: 'rev-3',
    productId: 'laddu-besan',
    productName: 'Pure Ghee Besan Laddus (Danedar)',
    customerName: 'Dr. Vandana Shinde',
    customerCity: 'Nashik',
    rating: 5,
    comment: 'Danedar texture and real cow ghee aroma! As a Nashik local, I am so proud of Jijamata Gruh Udyog women sisters for this high standard.',
    date: '05 Sep 2026',
    status: 'Approved'
  },
  {
    id: 'rev-4',
    productId: 'masala-goda',
    productName: 'Authentic Nashik Goda Masala',
    customerName: 'Kavita Chitre',
    customerCity: 'Nagpur',
    rating: 5,
    comment: 'This Goda Masala transformed our daily Katachi Amti and Bharli Vangi. It has that true traditional black spice depth you never find in store-bought packets.',
    date: '10 Sep 2026',
    status: 'Approved'
  }
];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Dilip Wagh',
    email: 'dilipwagh@gmail.com',
    phone: '+91 98234 11223',
    message: 'Can we order 25 kg Bhajani Chakli and Besan Laddus for our corporate gifting in Pune next month?',
    date: '10 Sep 2026, 04:15 PM',
    status: 'New'
  },
  {
    id: 'msg-2',
    name: 'Swaroopa Kadam',
    email: 'swaroopa.k@yahoo.co.in',
    phone: '+91 97650 99881',
    message: 'I received the Udid Papad and Mango Pickle package in Thane today. The packaging was immaculate! Thank you so much to all the sisters.',
    date: '09 Sep 2026, 01:40 PM',
    status: 'Read'
  },
  {
    id: 'msg-3',
    name: 'Vinayak Shirodkar',
    email: 'vshirodkar@gmail.com',
    phone: '+91 94225 33441',
    message: 'Do you deliver to Goa? Looking forward to ordering Goda Masala and Misal Masala.',
    date: '07 Sep 2026, 11:10 AM',
    status: 'Resolved'
  }
];
