export const BRAND_INFO = {
  name: "Sparkel @KKL",
  tagline: "Where Every Accessory Tells Your Story.",
  secondaryTagline: "Luxury Fashion Accessories for Every Moment.",
  domain: "sparkelkkl.com",
  phone: "+91 98765 43210",
  email: "support@sparkelkkl.com",
  address: "Sparkel Luxury Boutique, MG Road, Fashion District, Mumbai 400001",
  socials: {
    instagram: "@sparkelkkl_official",
    facebook: "SparkelKKL",
    pinterest: "sparkelkkl"
  }
};

export const NAVIGATION_TREE = [
  {
    id: "hair-accessories",
    name: "Hair Accessories",
    subcategories: [
      { id: "flower-clips", name: "Flower Clips" },
      { id: "claw-clips", name: "Claw Clips" },
      { id: "mini-claws", name: "Mini Claw Clips" },
      { id: "hair-bands", name: "Hair Bands" },
      { id: "scrunchies", name: "Scrunchies" }
    ]
  },
  {
    id: "earrings",
    name: "Earrings",
    subcategories: [
      { id: "studs", name: "Studs" },
      { id: "floral-earrings", name: "Floral" },
      { id: "party-earrings", name: "Party Wear" },
      { id: "traditional-earrings", name: "Traditional" },
      { id: "pearl-earrings", name: "Pearl" }
    ]
  },
  {
    id: "necklaces",
    name: "Necklace Sets",
    subcategories: [
      { id: "daily-wear", name: "Daily Wear" },
      { id: "bridal-sets", name: "Bridal" },
      { id: "temple-style", name: "Temple Style" },
      { id: "party-wear-necklaces", name: "Party Wear" },
      { id: "chokers", name: "Choker Style" }
    ]
  },
  {
    id: "bangles",
    name: "Bangles",
    subcategories: [
      { id: "gold-bangles", name: "Gold Finish" },
      { id: "silver-bangles", name: "Silver Finish" },
      { id: "antique-bangles", name: "Antique Finish" },
      { id: "stone-bangles", name: "Stone Bangles" }
    ]
  },
  {
    id: "bracelets",
    name: "Bracelets",
    subcategories: [
      { id: "chain-bracelets", name: "Chain Bracelet" },
      { id: "stone-bracelets", name: "Stone Bracelet" },
      { id: "fashion-bracelets", name: "Fashion Bracelet" }
    ]
  },
  {
    id: "gift-sets",
    name: "Gift Sets & Combos",
    subcategories: [
      { id: "hair-combos", name: "Hair Clip Combos" },
      { id: "festival-boxes", name: "Festival Gift Box" },
      { id: "bridal-combos", name: "Bridal Combo Box" }
    ]
  }
];

export const CATEGORIES = [
  {
    id: "hair-accessories",
    name: "Hair Accessories",
    icon: "🌸",
    count: 45,
    description: "Plumeria flower clips, large & mini claw clips, silk scrunchies",
    image: "/images/plumeria_flower.jpg"
  },
  {
    id: "earrings",
    name: "Earrings",
    icon: "✨",
    count: 38,
    description: "Studs, Kundan drops, pearl earrings & party wear dangles",
    image: "/images/kundan_earrings.jpg"
  },
  {
    id: "necklaces",
    name: "Necklace Sets",
    icon: "📿",
    count: 29,
    description: "Bridal Kundan chokers, temple style gold & daily wear pendants",
    image: "/images/rose_necklace.jpg"
  },
  {
    id: "bangles",
    name: "Bangles",
    icon: "💍",
    count: 32,
    description: "Gold finish, silver stone, velvet & antique metallic bangles",
    image: "/images/pearl_bangles.jpg"
  },
  {
    id: "bracelets",
    name: "Bracelets",
    icon: "💎",
    count: 24,
    description: "Delicate zircon crystal chain bracelets & charm cuffs",
    image: "/images/black_zircon.jpg"
  },
  {
    id: "gift-sets",
    name: "Gift Sets & Combos",
    icon: "🎁",
    count: 18,
    description: "Curated boutique hampers & velvet festival gift boxes",
    image: "/images/gift_set.jpg"
  }
];

export const PRODUCTS = [
  {
    id: "SPK-HC-001",
    sku: "SPK-HC-001",
    name: "Hawaiian Plumeria Tropical Flower Clips Set",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Hair Accessories",
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    reviewsCount: 142,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 35,
    images: [
      "/images/plumeria_flower.jpg",
      "/images/butterfly_clip.jpg",
      "/images/hero_model.jpg"
    ],
    colors: ["Pink", "Peach", "Blue", "Yellow", "White", "Green", "Orange", "Multicolor"],
    description: "Handcrafted Hawaiian Frangipani Plumeria flower hair clips set as featured in boutique collection. Non-slip alligator clip grip.",
    details: [
      "SKU: SPK-HC-001",
      "Colors: Pink, Peach, Blue, Yellow, White, Green, Orange, Multicolor",
      "Material: Premium Matte Resin & Rust-Free Stainless Steel Clip",
      "Ideal for: Vacations, Weddings, Daily Wear & Festivals",
      "Packaging: Velvet Sparkel Gift Pouch"
    ]
  },
  {
    id: "SPK-CC-002",
    sku: "SPK-CC-002",
    name: "Matte & Transparent Large Butterfly Hair Claws",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Hair Accessories",
    price: 179,
    originalPrice: 249,
    rating: 4.9,
    reviewsCount: 128,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 40,
    images: [
      "/images/butterfly_clip.jpg",
      "/images/plumeria_flower.jpg"
    ],
    colors: ["Black", "Brown", "Cream", "White", "Grey", "Beige", "Transparent", "Coffee"],
    description: "Extra strong hold large claw clips in matte aesthetic and crystal transparent finishes.",
    details: [
      "SKU: SPK-CC-002",
      "Colors: Black, Brown, Cream, White, Grey, Beige, Transparent, Coffee",
      "Spring mechanism: Heavy-duty spring for thick & thin hair",
      "Size: 11 cm x 5 cm"
    ]
  },
  {
    id: "SPK-NK-007",
    sku: "SPK-NK-007",
    name: "Royal Kundan & Pearl Bridal Choker Set",
    category: "necklaces",
    subcategory: "bridal-sets",
    categoryName: "Necklace Sets",
    price: 899,
    originalPrice: 1299,
    rating: 5.0,
    reviewsCount: 94,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 12,
    images: [
      "/images/rose_necklace.jpg",
      "/images/hero_model.jpg"
    ],
    colors: ["Gold & Pearl", "Rose Gold", "Silver"],
    description: "Royal Indian Kundan choker necklace set mounted on white display card with matching drop earrings.",
    details: [
      "SKU: SPK-NK-007",
      "Includes: 1 Kundan Choker Necklace + 1 Pair Matching Drop Earrings",
      "Finish: 18K Micro Gold Plated & Anti-Tarnish Coating",
      "Adjustable Dori/Link chain for custom neck fit"
    ]
  },
  {
    id: "SPK-BG-010",
    sku: "SPK-BG-010",
    name: "Traditional Gold & Metallic Velvet Bangle Stack",
    category: "bangles",
    subcategory: "gold-bangles",
    categoryName: "Bangles",
    price: 499,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 85,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 25,
    images: [
      "/images/pearl_bangles.jpg"
    ],
    colors: ["Gold", "Silver", "Antique Finish", "Velvet Red"],
    description: "Complete stack of 24 metallic gold, silver and antique finish glass-velvet bangles as displayed in stock.",
    details: [
      "SKU: SPK-BG-010",
      "Available Sizes: 2.4 (Small), 2.6 (Medium), 2.8 (Large)",
      "Finish: Metallic Gold & Filigree Embossed"
    ]
  },
  {
    id: "SPK-SC-004",
    sku: "SPK-SC-004",
    name: "Mulberry Silk & Velvet Scrunchie Combo Box",
    category: "hair-accessories",
    subcategory: "scrunchies",
    categoryName: "Hair Accessories",
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 156,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 50,
    images: [
      "/images/silk_scrunchies.jpg"
    ],
    colors: ["Pink", "Purple", "Grey", "Black", "Brown", "Green", "White"],
    description: "22-Momme Mulberry Silk & soft velvet hair scrunchies pack. Gentle elasticity prevents hair breakage.",
    details: [
      "SKU: SPK-SC-004",
      "Pack of 4 luxurious scrunchies",
      "Colors: Pink, Purple, Grey, Black, Brown, Green, White"
    ]
  },
  {
    id: "SPK-ER-005",
    sku: "SPK-ER-005",
    name: "Kundan & Pearl Drop Traditional Earrings",
    category: "earrings",
    subcategory: "traditional-earrings",
    categoryName: "Earrings",
    price: 329,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 110,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 30,
    images: [
      "/images/kundan_earrings.jpg"
    ],
    colors: ["Gold & Pearl White", "Silver", "Antique Gold"],
    description: "Royal Jhumka Kundan drop earrings mounted on white jewelry cards. Perfect for weddings & festive drapes.",
    details: [
      "SKU: SPK-ER-005",
      "Fastening: Push Back Stud",
      "Hypoallergenic nickel-free lead-free alloy"
    ]
  },
  {
    id: "SPK-BR-012",
    sku: "SPK-BR-012",
    name: "Zirconia Crystal Night Party Bracelet",
    category: "bracelets",
    subcategory: "stone-bracelets",
    categoryName: "Bracelets",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewsCount: 78,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: false,
    stock: 20,
    images: [
      "/images/black_zircon.jpg"
    ],
    colors: ["Gold", "Silver", "Black Zircon"],
    description: "Delicate cubic zirconia crystal chain bracelet with lobster clasp. Tarnish resistant.",
    details: [
      "SKU: SPK-BR-012",
      "Chain Length: 16 cm + 4 cm extender",
      "Finish: High-polish Rose Gold / Silver"
    ]
  },
  {
    id: "SPK-GS-013",
    sku: "SPK-GS-013",
    name: "Sparkel Luxury Velvet Festival Gift Box",
    category: "gift-sets",
    subcategory: "festival-boxes",
    categoryName: "Gift Sets & Combos",
    price: 1199,
    originalPrice: 1799,
    rating: 5.0,
    reviewsCount: 230,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 15,
    images: [
      "/images/gift_set.jpg"
    ],
    colors: ["Rose Pink Velvet Box", "Gold Velvet Box"],
    description: "Curated luxury hamper containing 1 Plumeria Clip, 1 Large Claw Clip, 1 Kundan Earrings Set & Gold Bangles.",
    details: [
      "SKU: SPK-GS-013",
      "Includes personalized printed gift message card",
      "Velvet drawer box wrapped in satin bow ribbon"
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Ananya Sharma",
    location: "Mumbai",
    rating: 5,
    review: "Sparkel @KKL accessories look even more luxurious in real life! The Plumeria Flower Clip and Kundan Choker have incredible shine.",
    product: "Hawaiian Plumeria Floral Hair Clip Set",
    avatar: "/images/hero_model.jpg"
  },
  {
    id: "t2",
    name: "Rhea Kapoor",
    location: "Delhi",
    rating: 5,
    review: "The velvet box packaging made me feel like I was opening a high-end luxury brand in Paris. The Choker Set is lightweight and super elegant!",
    product: "Royal Kundan & Pearl Bridal Choker Set",
    avatar: "/images/plumeria_flower.jpg"
  },
  {
    id: "t3",
    name: "Pooja Varma",
    location: "Bangalore",
    rating: 5,
    review: "Ordered the Deluxe Gift Box for my sister's birthday. She was in tears! The silk scrunchies and bangles are top quality.",
    product: "Sparkel Luxury Velvet Festival Gift Box",
    avatar: "/images/hero_model.jpg"
  }
];

export const COUPONS = [
  { code: "SPARKEL10", discountPercent: 10, minAmount: 499, description: "10% OFF on orders over ₹499" },
  { code: "LUXURY20", discountPercent: 20, minAmount: 999, description: "20% OFF on orders over ₹999" },
  { code: "FESTIVE30", discountPercent: 30, minAmount: 1499, description: "30% OFF on orders over ₹1499" }
];

export const INSTAGRAM_POSTS = [
  { id: "ig1", image: "/images/hero_model.jpg", likes: "2.4k", comments: "182", tag: "@sparkelkkl_official" },
  { id: "ig2", image: "/images/butterfly_clip.jpg", likes: "1.9k", comments: "94", tag: "#SparkelGirl" },
  { id: "ig3", image: "/images/rose_necklace.jpg", likes: "3.1k", comments: "210", tag: "#LuxuryEveryday" },
  { id: "ig4", image: "/images/plumeria_flower.jpg", likes: "1.5k", comments: "88", tag: "#HairBoutique" }
];
