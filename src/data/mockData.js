export const BRAND_INFO = {
  name: "Sparkle @kkv",
  tagline: "Where Every Accessory Tells Your Story.",
  secondaryTagline: "Luxury Fashion Accessories for Every Moment.",
  domain: "sparklekkv.com",
  phone: "+91 99491 57771",
  email: "support@sparklekkv.com",
  address: "Ayyappa Society, Madhapur, Telangana, Hyderabad",
  socials: {
    instagram: "@sparklekkvoffical",
    instagramUrl: "https://www.instagram.com/sparklekkvoffical?igsh=MW8ydzIza3oybmM2aQ==",
    facebook: "SparkleKKV",
    pinterest: "sparklekkv"
  }
};

export const NAVIGATION_TREE = [
  {
    id: "hair-accessories",
    name: "Clips",
    subcategories: [
      { id: "flower-clips", name: "Flower Clips" },
      { id: "claw-clips", name: "Claw Clips" }
    ]
  },
  {
    id: "necklaces",
    name: "Necklace Sets",
    subcategories: [
      { id: "chokers", name: "Choker Sets" },
      { id: "temple-style", name: "Traditional Temple Sets" }
    ]
  },
  {
    id: "chains",
    name: "Chains",
    subcategories: [
      { id: "daily-wear", name: "Daily Wear Chains" },
      { id: "anti-tarnish", name: "Anti-Tarnish Chains" }
    ]
  },
  {
    id: "bracelets",
    name: "Bracelets",
    subcategories: [
      { id: "chain-bracelets", name: "Chain & Kada Bracelets" },
      { id: "stone-bracelets", name: "Stone Link Bracelets" },
      { id: "fashion-bracelets", name: "Charm & Beaded Bracelets" }
    ]
  },
  {
    id: "earrings",
    name: "Ear Rings",
    subcategories: [
      { id: "traditional-earrings", name: "Traditional Chandbali" },
      { id: "studs", name: "Studs & Drops" },
      { id: "hoops", name: "Hoops & Combo Sets" }
    ]
  },
  {
    id: "bangles",
    name: "Bangles",
    subcategories: [
      { id: "kemp-bangles", name: "Kemp & Stone Bangles" },
      { id: "metal-bangles", name: "Antique & Metal Bangles" },
      { id: "chura-sets", name: "Silver & Chura Sets" }
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
    name: "Clips",
    icon: "🌸",
    count: 8,
    description: "Plumeria flower clips, cross claws, whale tail & rectangle claw clips",
    image: "images/plumeria_flower_claw_clip_drive.jpg"
  },
  {
    id: "necklaces",
    name: "Necklace Sets",
    icon: "📿",
    count: 9,
    description: "Traditional South Indian chokers, Manga Malai, Kemp & Kasu Mala sets",
    image: "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg"
  },
  {
    id: "chains",
    name: "Chains",
    icon: "⛓️",
    count: 8,
    description: "Waterproof anti-tarnish 18K gold plated chains, snake chains, & pendant necklaces",
    image: "images/green_oval_stone_chain_drive.jpg"
  },
  {
    id: "bracelets",
    name: "Bracelets",
    icon: "💎",
    count: 9,
    description: "Adjustable gold kada bracelets & beaded charm bracelets",
    image: "images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg"
  },
  {
    id: "earrings",
    name: "Ear Rings",
    icon: "✨",
    count: 5,
    description: "Traditional Kundan Chandbali, danglers, emerald drops & solitaire studs",
    image: "images/chandbali_earrings.jpg"
  },
  {
    id: "bangles",
    name: "Bangles",
    icon: "🔱",
    count: 2,
    description: "Kundhan Kadas, pearl bangles & oxidised silver bangles",
    image: "images/silver_bangles.jpg"
  },
  {
    id: "gift-sets",
    name: "Gift Sets & Combos",
    icon: "🎁",
    count: 3,
    description: "Curated boutique hampers & velvet festival gift boxes",
    image: "images/gift_set.jpg"
  }
];

export const PRODUCTS = [
  {
    id: "SPK-HC-001",
    sku: "SPK-HC-001",
    name: "Plumeria flower claw clip",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 149,
    originalPrice: 249,
    rating: 4.9,
    reviewsCount: 142,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 12,
    images: [
      "images/plumeria_flower_claw_clip_drive.jpg",
      "images/plumeria_flower_clip_drive.jpg"
    ],
    colors: [
      "Pink",
      "Peach",
      "White"
    ],
    description: "Handcrafted Plumeria flower hair claw clip with durable spring grip.",
    details: [
      "Quantity: 1 Set (12 Pieces)",
      "Purchase Rate: ₹86/Set (₹7.1/Piece)"
    ]
  },
  {
    id: "SPK-HC-002",
    sku: "SPK-HC-002",
    name: "Claw Clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 189,
    originalPrice: 299,
    rating: 4.8,
    reviewsCount: 110,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 24,
    images: [
      "images/claw_clips_drive.jpg",
      "images/cross_claw_clips_drive.jpg"
    ],
    colors: [
      "Pastel Beige",
      "Dusty Pink",
      "Sage Green"
    ],
    description: "Premium pastel claw clips set designed for secure daily hair updos.",
    details: [
      "Quantity: 2 Sets (24 Pieces)",
      "Purchase Rate: ₹125/Set (₹10.4/Piece)"
    ]
  },
  {
    id: "SPK-HC-003",
    sku: "SPK-HC-003",
    name: "Cross Claw Clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 189,
    originalPrice: 299,
    rating: 4.9,
    reviewsCount: 88,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 12,
    images: [
      "images/cross_claw_clips_drive.jpg",
      "images/rectangle_claw_clips_drive.jpg"
    ],
    colors: [
      "Rose Gold",
      "Glossy Black"
    ],
    description: "Trendy criss-cross design hair claw clip with high tension steel spring.",
    details: [
      "Quantity: 1 Set (12 Pieces)",
      "Purchase Rate: ₹125/Set (₹10.4/Piece)"
    ]
  },
  {
    id: "SPK-HC-004",
    sku: "SPK-HC-004",
    name: "Whale tail hair claw clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 189,
    originalPrice: 299,
    rating: 4.7,
    reviewsCount: 76,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: false,
    stock: 12,
    images: [
      "images/whale_tail_claw_clips_drive.jpg",
      "images/pastel_flower_claw_clips_drive.jpg"
    ],
    colors: [
      "Metallic Gold",
      "Silver"
    ],
    description: "Aesthetic whale tail shaped metallic hair claw clip for French twist updos.",
    details: [
      "Quantity: 1 Set (12 Pieces)",
      "Purchase Rate: ₹125/Set (₹10.4/Piece)"
    ]
  },
  {
    id: "SPK-HC-005",
    sku: "SPK-HC-005",
    name: "Rectangle hair claw clips",
    category: "hair-accessories",
    subcategory: "claw-clips",
    categoryName: "Clips",
    price: 199,
    originalPrice: 319,
    rating: 4.8,
    reviewsCount: 94,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 12,
    images: [
      "images/rectangle_claw_clips_drive.jpg",
      "images/hawaiian_plumeria_claw_clips_drive.jpg"
    ],
    colors: [
      "Amber Tortoise",
      "Matte Nude"
    ],
    description: "Minimalist rectangular hollow hair claw clip suitable for thick and medium hair.",
    details: [
      "Quantity: 1 Set (12 Pieces)",
      "Purchase Rate: ₹148/Set (₹12.3/Piece)"
    ]
  },
  {
    id: "SPK-HC-006",
    sku: "SPK-HC-006",
    name: "Pastel flower design hair claw clips",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 299,
    originalPrice: 499,
    rating: 5,
    reviewsCount: 165,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 12,
    images: [
      "images/pastel_flower_claw_clips_drive.jpg",
      "images/flower_claw_clips_drive.jpg"
    ],
    colors: [
      "Pastel Blossom Pink",
      "Lilac"
    ],
    description: "Boutique handcrafted pastel floral claw clip encrusted with subtle pearl accents.",
    details: [
      "Quantity: 1 Set (12 Pieces)",
      "Purchase Rate: ₹702/Set (₹58.5/Piece)"
    ]
  },
  {
    id: "SPK-HC-007",
    sku: "SPK-HC-007",
    name: "Hawaian Plumeria flower claw clips",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 179,
    originalPrice: 279,
    rating: 4.9,
    reviewsCount: 130,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 12,
    images: [
      "images/hawaiian_plumeria_claw_clips_drive.jpg",
      "images/plumeria_flower_claw_clip_drive.jpg"
    ],
    colors: [
      "White & Yellow",
      "Coral"
    ],
    description: "Tropical Hawaiian Frangipani Plumeria flower hair claws for vacation and beachwear.",
    details: [
      "Quantity: 1 Set (12 Pieces)",
      "Purchase Rate: ₹129/Set (₹10.7/Piece)"
    ]
  },
  {
    id: "SPK-HC-008",
    sku: "SPK-HC-008",
    name: "Flower claw clips",
    category: "hair-accessories",
    subcategory: "flower-clips",
    categoryName: "Clips",
    price: 189,
    originalPrice: 289,
    rating: 4.8,
    reviewsCount: 102,
    isNew: true,
    isTrending: false,
    isBestSeller: false,
    isFlashSale: true,
    stock: 12,
    images: [
      "images/flower_claw_clips_drive.jpg",
      "images/claw_clips_drive.jpg"
    ],
    colors: [
      "Multicolor Floral"
    ],
    description: "Elegant 5-petal floral claw clip set featuring matte anti-slip grip.",
    details: [
      "Quantity: 1 Set (12 Pieces)",
      "Purchase Rate: ₹137/Set (₹11.4/Piece)"
    ]
  },
  {
    id: "SPK-NK-101",
    sku: "SPK-NK-101",
    name: "Traditional South Indian Matte Gold Plated antiavue droplet choker neckalce set",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 599,
    originalPrice: 899,
    rating: 5,
    reviewsCount: 195,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg",
      "images/kundan_choker_set.jpg"
    ],
    colors: [
      "Antique Matte Gold & Ruby Droplets"
    ],
    description: "Heritage South Indian antique gold plated choker featuring delicate droplet hangings and matching earrings.",
    details: [
      "Quantity: 1 Piece Set",
      "Purchase Price: ₹150",
      "Finish: 24K Antique Matte Gold Plating"
    ]
  },
  {
    id: "SPK-NK-102",
    sku: "SPK-NK-102",
    name: "Tradational South Indian kemp floral Necklace set",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 699,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 148,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 2,
    images: [
      "images/whatsapp_image_2026_08_10_at_5_53_26_pm_jpeg_drive.jpg",
      "images/temple_necklace.jpg"
    ],
    colors: [
      "Ruby Red Kemp & Gold"
    ],
    description: "Auspicious South Indian Kemp floral motif necklace set encrusted with traditional red Kemp stones.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹202/Piece (Total: ₹404)"
    ]
  },
  {
    id: "SPK-NK-103",
    sku: "SPK-NK-103",
    name: "Manga Malai or Mango Malia",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 649,
    originalPrice: 949,
    rating: 4.9,
    reviewsCount: 160,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_6_08_20_pm_jpeg_drive.jpg",
      "images/whatsapp_image_2026_08_10_at_6_16_24_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold & Ruby Kemp"
    ],
    description: "Classic South Indian Manga Malai (Mango Mala) necklace featuring auspicious raw mango shaped pendants.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹160"
    ]
  },
  {
    id: "SPK-NK-104",
    sku: "SPK-NK-104",
    name: "Tradatinal South Indian Mango Leaf Choker",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 549,
    originalPrice: 799,
    rating: 4.8,
    reviewsCount: 112,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 2,
    images: [
      "images/whatsapp_image_2026_08_10_at_6_16_24_pm_jpeg_drive.jpg",
      "images/whatsapp_image_2026_08_10_at_6_59_59_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold & Green Kemp"
    ],
    description: "Royal mango leaf motif choker necklace set with antique copper gold micro polish.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹140/Piece (Total: ₹280)"
    ]
  },
  {
    id: "SPK-NK-105",
    sku: "SPK-NK-105",
    name: "Traditonal South Indian kemp Necklace",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 899,
    originalPrice: 1299,
    rating: 5,
    reviewsCount: 175,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 2,
    images: [
      "images/whatsapp_image_2026_08_10_at_6_59_59_pm_jpeg_drive.jpg",
      "images/whatsapp_image_2026_08_10_at_7_05_39_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Ruby & Emerald Kemp Gold"
    ],
    description: "Grand traditional South Indian temple Kemp necklace adorned with Kundan glass stones.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹320/Piece (Total: ₹640)"
    ]
  },
  {
    id: "SPK-NK-106",
    sku: "SPK-NK-106",
    name: "Traditional South Indian Atiigai choker set",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 499,
    originalPrice: 749,
    rating: 4.8,
    reviewsCount: 90,
    isNew: false,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_05_39_pm_jpeg_drive.jpg",
      "images/whatsapp_image_2026_08_10_at_7_32_09_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Gold & Ruby Kemp"
    ],
    description: "Classic South Indian Attigai (Addigai) choker necklace set with flower cluster centerpiece.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹127"
    ]
  },
  {
    id: "SPK-NK-107",
    sku: "SPK-NK-107",
    name: "Traaditional South Indian antique matte gold ruby stand",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 749,
    originalPrice: 1099,
    rating: 4.9,
    reviewsCount: 135,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_32_09_pm_jpeg_drive.jpg",
      "images/whatsapp_image_2026_08_10_at_7_46_22_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold & Ruby Beads"
    ],
    description: "Multi-strand antique matte gold necklace detailed with synthetic ruby beads.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹230"
    ]
  },
  {
    id: "SPK-NK-108",
    sku: "SPK-NK-108",
    name: "Kasu Mala",
    category: "necklaces",
    subcategory: "temple-style",
    categoryName: "Necklace Sets",
    price: 649,
    originalPrice: 949,
    rating: 5,
    reviewsCount: 210,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_46_22_pm_jpeg_drive.jpg",
      "images/whatsapp_image_2026_08_10_at_7_49_04_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Antique Gold Lakshmi Coins"
    ],
    description: "Traditional South Indian Kasu Mala (Coin Necklace) featuring engraved Goddess Lakshmi coins.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹160"
    ]
  },
  {
    id: "SPK-NK-109",
    sku: "SPK-NK-109",
    name: "Tulip Floral vine Necklace",
    category: "necklaces",
    subcategory: "chokers",
    categoryName: "Necklace Sets",
    price: 799,
    originalPrice: 1199,
    rating: 4.9,
    reviewsCount: 145,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/whatsapp_image_2026_08_10_at_7_49_04_pm_jpeg_drive.jpg",
      "images/whatsapp_image_2026_08_10_at_5_53_26_pm_jpeg_drive.jpg"
    ],
    colors: [
      "Rose Gold & Pearl Tulips"
    ],
    description: "Delicate tulip floral vine motif necklace handcrafted with micro zircon stones.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹376"
    ]
  },
  {
    id: "SPK-CN-201",
    sku: "SPK-CN-201",
    name: "Faux Pearl charm necklace",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 299,
    originalPrice: 449,
    rating: 4.8,
    reviewsCount: 84,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 2,
    images: [
      "images/faux_pearl_charm_necklace_drive.jpg",
      "images/adjustable_floral_bolo_necklace_drive.jpg"
    ],
    colors: [
      "Gold & White Faux Pearl"
    ],
    description: "Faux Pearl charm necklace from Drive. Minimalist gold chain centered with faux pearl charm.",
    details: [
      "Quantity: 2 Pieces in Stock",
      "Purchase Price: ₹72/Piece (Total: ₹144)"
    ]
  },
  {
    id: "SPK-CN-202",
    sku: "SPK-CN-202",
    name: "Adjustable Floral Bolo Necklace",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviewsCount: 62,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/adjustable_floral_bolo_necklace_drive.jpg",
      "images/green_oval_stone_chain_drive.jpg"
    ],
    colors: [
      "Rose Gold Floral"
    ],
    description: "Adjustable Floral Bolo Necklace from Drive. Bolo style chain necklace with flower slider.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹36"
    ]
  },
  {
    id: "SPK-CN-203",
    sku: "SPK-CN-203",
    name: "Green oval stone antitarnish gold plated stainless chain",
    category: "chains",
    subcategory: "anti-tarnish",
    categoryName: "Chains",
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 140,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/green_oval_stone_chain_drive.jpg",
      "images/flat_snake_chain_drive.jpg"
    ],
    colors: [
      "Emerald Green & Gold"
    ],
    description: "Green oval stone chain from Drive. Waterproof anti-tarnish stainless chain with emerald green stone.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹95"
    ]
  },
  {
    id: "SPK-CN-204",
    sku: "SPK-CN-204",
    name: "Flat Snake Chain",
    category: "chains",
    subcategory: "anti-tarnish",
    categoryName: "Chains",
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 155,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/flat_snake_chain_drive.jpg",
      "images/satellite_chain_drive.jpg"
    ],
    colors: [
      "Glossy 18K Gold"
    ],
    description: "Flat Snake Chain from Drive. Sleek liquid-smooth flat herringbone snake chain.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹110"
    ]
  },
  {
    id: "SPK-CN-205",
    sku: "SPK-CN-205",
    name: "Satellite Chain",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 249,
    originalPrice: 379,
    rating: 4.7,
    reviewsCount: 72,
    isNew: false,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/satellite_chain_drive.jpg",
      "images/crystal_heart_pendant_drive.jpg"
    ],
    colors: [
      "Gold Beaded Chain"
    ],
    description: "Satellite Chain from Drive. Cable chain featuring tiny textured gold beads.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹48"
    ]
  },
  {
    id: "SPK-CN-206",
    sku: "SPK-CN-206",
    name: "Crystal heart pendant minimal gold chain necklace",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 329,
    originalPrice: 479,
    rating: 4.8,
    reviewsCount: 98,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/crystal_heart_pendant_drive.jpg",
      "images/north_star_pendant_drive.jpg"
    ],
    colors: [
      "Clear Crystal & Rose Gold"
    ],
    description: "Crystal heart pendant necklace from Drive. Faceted crystal heart pendant on gold chain.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹85"
    ]
  },
  {
    id: "SPK-CN-207",
    sku: "SPK-CN-207",
    name: "North star pendant neckalce",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 299,
    originalPrice: 429,
    rating: 4.8,
    reviewsCount: 86,
    isNew: true,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/north_star_pendant_drive.jpg",
      "images/round_snake_necklace_drive.jpg"
    ],
    colors: [
      "Gold & Zircon Star"
    ],
    description: "North star pendant necklace from Drive. Celestial North Star compass medallion.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹75"
    ]
  },
  {
    id: "SPK-CN-208",
    sku: "SPK-CN-208",
    name: "Round Snake Neck",
    category: "chains",
    subcategory: "daily-wear",
    categoryName: "Chains",
    price: 349,
    originalPrice: 499,
    rating: 4.7,
    stock: 1,
    images: [
      "images/round_snake_necklace_drive.jpg",
      "images/faux_pearl_charm_necklace_drive.jpg"
    ],
    colors: [
      "High Polish Gold"
    ],
    description: "Round Snake Neck from Drive. Classic round flexible snake chain necklace.",
    details: [
      "Quantity: 1 Piece",
      "Purchase Price: ₹90"
    ]
  },
  {
    id: "SPK-BR-301",
    sku: "SPK-BR-301",
    name: "Beaded Charm Bracelet - Pink & Pearl Charms",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    reviewsCount: 95,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 4,
    images: [
      "images/1_beaded_charm_bracelet_1_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg"
    ],
    colors: [
      "Gold & Pearl Charms"
    ],
    description: "Playful beaded charm bracelet strung with delicate gold heart, star, and pearl charms (Pink & Pearl Edition).",
    details: [
      "Quantity: 1 Set (4 Pieces)",
      "Purchase Rate: ₹144/Set (₹36/Piece)"
    ]
  },
  {
    id: "SPK-BR-302",
    sku: "SPK-BR-302",
    name: "Beaded Charm Bracelet - Blue Evil Eye & Star Charms",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 199,
    originalPrice: 299,
    rating: 4.8,
    reviewsCount: 88,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 4,
    images: [
      "images/1_beaded_charm_bracelet_2_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_2_jpg_drive.jpg"
    ],
    colors: [
      "Gold & Crystal Charms"
    ],
    description: "Playful beaded charm bracelet strung with delicate gold heart, star, and blue evil eye charms.",
    details: [
      "Quantity: 1 Set (4 Pieces)",
      "Purchase Rate: ₹144/Set (₹36/Piece)"
    ]
  },
  {
    id: "SPK-BR-303",
    sku: "SPK-BR-303",
    name: "Beaded Charm Bracelet - Pastel Floral & Dolphin Charms",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    reviewsCount: 102,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 4,
    images: [
      "images/1_beaded_charm_bracelet_3_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_3_jpg_drive.jpg"
    ],
    colors: [
      "Gold & Pastel Charms"
    ],
    description: "Playful beaded charm bracelet strung with delicate gold heart, floral, and dolphin charms.",
    details: [
      "Quantity: 1 Set (4 Pieces)",
      "Purchase Rate: ₹144/Set (₹36/Piece)"
    ]
  },
  {
    id: "SPK-BR-304",
    sku: "SPK-BR-304",
    name: "Beaded Charm Bracelet - Silver Pandora Style Charm Bangle",
    category: "bracelets",
    subcategory: "fashion-bracelets",
    categoryName: "Bracelets",
    price: 249,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 110,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 4,
    images: [
      "images/1_beaded_charm_bracelet_4_jpg_drive.jpg",
      "images/2_adjustable_gold_plated_kada_bracelet_4_jpg_drive.jpg"
    ],
    colors: [
      "Silver & Peach Crystal Bead"
    ],
    description: "Sleek silver Pandora-style snake charm bangle with floral dangles and peach crystal center bead.",
    details: [
      "Quantity: 1 Set (4 Pieces)",
      "Purchase Rate: ₹144/Set (₹36/Piece)"
    ]
  },
  {
    id: "SPK-BR-305",
    sku: "SPK-BR-305",
    name: "Adjustable Gold Plated Kada Bracelet - Glossy 18K Gold",
    category: "bracelets",
    subcategory: "chain-bracelets",
    categoryName: "Bracelets",
    price: 499,
    originalPrice: 749,
    rating: 5,
    reviewsCount: 165,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 5,
    images: [
      "images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_1_jpg_drive.jpg"
    ],
    colors: [
      "18K Micro Gold Polish"
    ],
    description: "Statement openable flexible Kada bracelet coated in 18K micro gold polish with ball ending accents.",
    details: [
      "Quantity: 1 Set (5 Pieces)",
      "Purchase Rate: ₹860/Set (₹172/Piece)"
    ]
  },
  {
    id: "SPK-BR-306",
    sku: "SPK-BR-306",
    name: "Adjustable Gold Plated Kada Bracelet - Dual Heart Stone Accent",
    category: "bracelets",
    subcategory: "chain-bracelets",
    categoryName: "Bracelets",
    price: 499,
    originalPrice: 749,
    rating: 4.9,
    reviewsCount: 140,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 5,
    images: [
      "images/2_adjustable_gold_plated_kada_bracelet_2_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_2_jpg_drive.jpg"
    ],
    colors: [
      "18K Gold & Crystal Heart"
    ],
    description: "Statement openable flexible Kada bracelet detailed with twin heart-shaped crystal centerpieces.",
    details: [
      "Quantity: 1 Set (5 Pieces)",
      "Purchase Rate: ₹860/Set (₹172/Piece)"
    ]
  },
  {
    id: "SPK-BR-307",
    sku: "SPK-BR-307",
    name: "Adjustable Gold Plated Kada Bracelet - Textured Micro Gold",
    category: "bracelets",
    subcategory: "chain-bracelets",
    categoryName: "Bracelets",
    price: 499,
    originalPrice: 749,
    rating: 4.8,
    reviewsCount: 118,
    isNew: false,
    isTrending: true,
    isBestSeller: false,
    isFlashSale: true,
    stock: 5,
    images: [
      "images/2_adjustable_gold_plated_kada_bracelet_3_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_3_jpg_drive.jpg"
    ],
    colors: [
      "18K High Polish Gold"
    ],
    description: "Statement openable flexible Kada bracelet with fine micro-carved texturing along the band.",
    details: [
      "Quantity: 1 Set (5 Pieces)",
      "Purchase Rate: ₹860/Set (₹172/Piece)"
    ]
  },
  {
    id: "SPK-BR-308",
    sku: "SPK-BR-308",
    name: "Adjustable Gold Plated Kada Bracelet - Heart Motif Endings",
    category: "bracelets",
    subcategory: "chain-bracelets",
    categoryName: "Bracelets",
    price: 499,
    originalPrice: 749,
    rating: 5,
    reviewsCount: 155,
    isNew: true,
    isTrending: false,
    isBestSeller: true,
    isFlashSale: false,
    stock: 5,
    images: [
      "images/2_adjustable_gold_plated_kada_bracelet_4_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_4_jpg_drive.jpg"
    ],
    colors: [
      "18K Matte Gold Polish"
    ],
    description: "Statement openable flexible Kada bracelet detailed with heart motif terminals encrusted with zircons.",
    details: [
      "Quantity: 1 Set (5 Pieces)",
      "Purchase Rate: ₹860/Set (₹172/Piece)"
    ]
  },
  {
    id: "SPK-BR-309",
    sku: "SPK-BR-309",
    name: "Adjustable Gold Plated Kada Bracelet - Flower Cluster Accent",
    category: "bracelets",
    subcategory: "chain-bracelets",
    categoryName: "Bracelets",
    price: 499,
    originalPrice: 749,
    rating: 4.9,
    reviewsCount: 130,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 5,
    images: [
      "images/2_adjustable_gold_plated_kada_bracelet_5_jpg_drive.jpg",
      "images/1_beaded_charm_bracelet_1_jpg_drive.jpg"
    ],
    colors: [
      "18K Textured Gold Polish"
    ],
    description: "Statement openable flexible Kada bracelet featuring a delicate floral cluster centerpiece.",
    details: [
      "Quantity: 1 Set (5 Pieces)",
      "Purchase Rate: ₹860/Set (₹172/Piece)"
    ]
  },
  {
    id: "SPK-ER-401",
    sku: "SPK-ER-401",
    name: "Traditional Kundan Chandbali Earrings",
    category: "earrings",
    subcategory: "traditional-earrings",
    categoryName: "Ear Rings",
    price: 449,
    originalPrice: 649,
    rating: 5,
    reviewsCount: 190,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/chandbali_earrings.jpg",
      "images/kundan_earrings.jpg"
    ],
    colors: [
      "Antique Gold & Pearl Hangings"
    ],
    description: "Traditional Indian Kundan crescent moon Chandbali earrings with pearl cluster drops.",
    details: [
      "Quantity: 1 Pair",
      "Purchase Price: ₹162",
      "Finish: 24K Micro Antique Gold Finish"
    ]
  },
  {
    id: "SPK-ER-402",
    sku: "SPK-ER-402",
    name: "Kundan & Blue Sapphire Crystal Dangler Earrings",
    category: "earrings",
    subcategory: "traditional-earrings",
    categoryName: "Ear Rings",
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 130,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 1,
    images: [
      "images/kundan_earrings.jpg",
      "images/chandbali_earrings.jpg"
    ],
    colors: [
      "Royal Blue Gemstone & Silver Tone"
    ],
    description: "Elegant royal blue sapphire crystal dangler earrings set with sparkling diamond-cut zircon borders.",
    details: [
      "Quantity: 1 Pair",
      "Purchase Price: ₹120"
    ]
  },
  {
    id: "SPK-ER-403",
    sku: "SPK-ER-403",
    name: "Emerald Green Cushion Cut Dangler Earrings",
    category: "earrings",
    subcategory: "traditional-earrings",
    categoryName: "Ear Rings",
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 115,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/emerald_dangles.jpg",
      "images/kundan_earrings.jpg"
    ],
    colors: [
      "Emerald Green & Gold Polish"
    ],
    description: "Boutique emerald green gemstone dangler earrings encased in 18K micro gold halo setting.",
    details: [
      "Quantity: 1 Pair",
      "Purchase Price: ₹120"
    ]
  },
  {
    id: "SPK-ER-404",
    sku: "SPK-ER-404",
    name: "Square Halo Cubic Zirconia Stud Earrings",
    category: "earrings",
    subcategory: "studs",
    categoryName: "Ear Rings",
    price: 249,
    originalPrice: 379,
    rating: 4.8,
    reviewsCount: 95,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/pave_studs.jpg",
      "images/stud_earrings.jpg"
    ],
    colors: [
      "Rose Gold & Square Zircon"
    ],
    description: "Elegant rose gold square halo stud earrings crafted with brilliant-cut AAA cubic zirconia stones.",
    details: [
      "Quantity: 1 Pair",
      "Purchase Price: ₹60"
    ]
  },
  {
    id: "SPK-ER-405",
    sku: "SPK-ER-405",
    name: "Solitaire Round Cut Cubic Zirconia Stud Earrings",
    category: "earrings",
    subcategory: "studs",
    categoryName: "Ear Rings",
    price: 249,
    originalPrice: 379,
    rating: 4.8,
    reviewsCount: 110,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 1,
    images: [
      "images/stud_earrings.jpg",
      "images/pave_studs.jpg"
    ],
    colors: [
      "Rose Gold & Round Solitaire"
    ],
    description: "Classic 6-prong solitaire round-cut cubic zirconia stud earrings in anti-tarnish rose gold setting.",
    details: [
      "Quantity: 1 Pair",
      "Purchase Price: ₹60"
    ]
  },
  {
    id: "SPK-BG-501",
    sku: "SPK-BG-501",
    name: "Kundan & Pearl Traditional Bangle Set",
    category: "bangles",
    subcategory: "kemp-bangles",
    categoryName: "Bangles",
    price: 599,
    originalPrice: 899,
    rating: 5,
    reviewsCount: 150,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 16,
    images: [
      "images/pearl_bangles.jpg",
      "images/silver_bangles.jpg"
    ],
    colors: [
      "Antique Gold & Kundan Work"
    ],
    description: "Royal handcrafted Kundan Kada bangles embellished with uncut glass Kundan stones and velvet pouch.",
    details: [
      "Quantity: 1 Set (16 Pieces)",
      "Purchase Price: ₹150",
      "Finish: 24K Micro Antique Polish"
    ]
  },
  {
    id: "SPK-BG-502",
    sku: "SPK-BG-502",
    name: "Oxidised Silver Thin Metal Bangles Stack",
    category: "bangles",
    subcategory: "metal-bangles",
    categoryName: "Bangles",
    price: 299,
    originalPrice: 449,
    rating: 4.9,
    reviewsCount: 175,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: false,
    stock: 40,
    images: [
      "images/silver_bangles.jpg",
      "images/pearl_bangles.jpg"
    ],
    colors: [
      "Oxidised Silver Finish"
    ],
    description: "Traditional German oxidised silver metal thin bangles stack for ethnic festive wear.",
    details: [
      "Quantity: 10 Sets (40 Pieces)",
      "Purchase Rate: ₹74/Set (Total: ₹740)"
    ]
  },
  {
    id: "SPK-GS-001",
    sku: "SPK-GS-001",
    name: "Sparkle Luxury Hair Clip & Scrunchie Combo Box",
    category: "gift-sets",
    subcategory: "hair-combos",
    categoryName: "Gift Sets & Combos",
    price: 449,
    originalPrice: 649,
    rating: 5,
    reviewsCount: 185,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 20,
    images: [
      "images/gift_set.jpg",
      "images/plumeria_flower.jpg"
    ],
    colors: [
      "Blush Pink Velvet Hamper"
    ],
    description: "Boutique gift hamper containing 2 Plumeria Flower Clips, 1 Swarovski Butterfly Claw Clip, and 1 Silk Scrunchie.",
    details: [
      "Includes: 2 Plumeria Clips + 1 Butterfly Clip + 1 Silk Scrunchie"
    ]
  },
  {
    id: "SPK-GS-002",
    sku: "SPK-GS-002",
    name: "Sparkle Royal Velvet Festival Gift Box",
    category: "gift-sets",
    subcategory: "festival-boxes",
    categoryName: "Gift Sets & Combos",
    price: 1199,
    originalPrice: 1799,
    rating: 5,
    reviewsCount: 230,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 15,
    images: [
      "images/plumeria_flower.jpg",
      "images/gift_set.jpg"
    ],
    colors: [
      "Signature Velvet Chest"
    ],
    description: "Curated luxury hamper featuring 1 Kundan Earrings Set, 1 Plumeria Flower Clip, 1 Silk Scrunchie, and Gold Bangle Stack.",
    details: [
      "Includes: 4 Premium Accessories"
    ]
  },
  {
    id: "SPK-GS-003",
    sku: "SPK-GS-003",
    name: "Royal Kundan Bridal Trousseau Hamper Box",
    category: "gift-sets",
    subcategory: "bridal-combos",
    categoryName: "Gift Sets & Combos",
    price: 1699,
    originalPrice: 2499,
    rating: 5,
    reviewsCount: 160,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    isFlashSale: true,
    stock: 10,
    images: [
      "images/kundan_choker_set.jpg",
      "images/gift_set.jpg"
    ],
    colors: [
      "Ivory & Gold Velvet Trunk"
    ],
    description: "Grand bridal trousseau box including Kundan Choker Set, Heavy Jhumkas, Maang Tikka, and Hair Ornaments.",
    details: [
      "Includes: Complete 5-Piece Bridal Set"
    ]
  }
];

export const REVIEWS = [
  {
    id: "t1",
    name: "Divya",
    location: "Mumbai",
    rating: 5,
    review: "Sparkle @kkv accessories look even more luxurious in real life! The Plumeria Flower Clip and Traditional South Indian Choker have incredible shine.",
    product: "Plumeria Flower Claw Clip",
    avatar: "images/plumeria_flower_claw_clip_drive.jpg"
  },
  {
    id: "t2",
    name: "Jhansi",
    location: "Delhi",
    rating: 5,
    review: "The velvet box packaging made me feel like I was opening a high-end luxury brand in Paris. The South Indian Addigai Choker Set is lightweight and super elegant!",
    product: "Traditional South Indian Matte Gold Plated Antique Droplet Choker Necklace Set",
    avatar: "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg"
  },
  {
    id: "t3",
    name: "Meera Reddy",
    location: "Hyderabad",
    rating: 5,
    review: "Bought the Kemp South Indian temple set for Varalakshmi Vratam. The micro gold antique polish is so authentic and lightweight!",
    product: "Traditional South Indian Kemp Floral Necklace Set",
    avatar: "images/whatsapp_image_2026_08_10_at_5_53_26_pm_jpeg_drive.jpg"
  }
];

export const TESTIMONIALS = REVIEWS;

export const COUPONS = [
  { code: "SPARKLE30", discountPercent: 30, minAmount: 999, description: "30% OFF on orders over ₹999 (Automatic)" },
  { code: "LUXURY20", discountPercent: 20, minAmount: 799, description: "20% OFF on orders over ₹799" },
  { code: "SPARKLE10", discountPercent: 10, minAmount: 499, description: "10% OFF on orders over ₹499" }
];

export const PROMO_CODES = COUPONS;

export const INSTAGRAM_POSTS = [
  { id: "ig1", image: "images/plumeria_flower_claw_clip_drive.jpg", likes: "2.4k", comments: "182", tag: "@sparklekkvoffical" },
  { id: "ig2", image: "images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg", likes: "1.9k", comments: "94", tag: "#SparkleGirl" },
  { id: "ig3", image: "images/green_oval_stone_chain_drive.jpg", likes: "3.1k", comments: "210", tag: "#LuxuryEveryday" },
  { id: "ig4", image: "images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg", likes: "1.5k", comments: "88", tag: "#HairBoutique" }
];
