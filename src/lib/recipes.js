/**
 * Culinary AI Recipe Knowledge Base & Discovery Engine — aligns strictly with the Firestore item schema:
 * {
 *   name: string,
 *   category: "produce" | "dairy" | "pantry" | "protein" | "beverages" | "household" | "snacks" | "bakery" | "frozen" | "other",
 *   quantity: number,
 *   unit: string | null,
 *   status: "confirmed"
 * }
 */

export const RECIPE_CATEGORIES = [
  { id: 'all', label: 'All Recipes', emoji: '✨' },
  { id: 'indian_sweets', label: 'Indian Sweets', emoji: '🍮' },
  { id: 'italian', label: 'Pizza & Pasta', emoji: '🍕' },
  { id: 'chinese', label: 'Chinese & Asian', emoji: '🥢' },
  { id: 'meat', label: 'Meat & Chicken', emoji: '🍗' },
  { id: 'quick_meals', label: 'Quick Meals & Maggi', emoji: '🍜' },
];

export const RECIPE_KNOWLEDGE_BASE = {
  // ── 0. Quick Meals & Maggi ──
  maggi: {
    title: 'Maggi Instant Noodles',
    category: 'quick_meals',
    emoji: '🍜',
    desc: 'Instant noodles cooked with Maggi tastemaker spices, butter, and fresh veggies.',
    ingredients: [
      { name: 'Maggi Noodles Pack', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Butter / Oil', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Water', quantity: 1, unit: 'bottle', category: 'beverages', status: 'confirmed' },
      { name: 'Chopped Onions & Peas', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
    ],
  },
  noodles: {
    title: 'Maggi Instant Noodles',
    category: 'quick_meals',
    emoji: '🍜',
    desc: 'Instant noodles cooked with Maggi tastemaker spices, butter, and fresh veggies.',
    ingredients: [
      { name: 'Maggi Noodles Pack', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Butter / Oil', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Water', quantity: 1, unit: 'bottle', category: 'beverages', status: 'confirmed' },
      { name: 'Chopped Onions & Peas', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
    ],
  },

  // ── 1. Indian Sweets ──
  rasgulla: {
    title: 'Rasgulla (Rasogulla)',
    category: 'indian_sweets',
    emoji: '🍮',
    desc: 'Soft, spongy cottage cheese balls soaked in chilled sugar syrup.',
    ingredients: [
      { name: 'Whole Milk (Chenna)', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Sugar (for Syrup)', quantity: 1, unit: 'kg', category: 'pantry', status: 'confirmed' },
      { name: 'Lemon Juice', quantity: 2, unit: null, category: 'produce', status: 'confirmed' },
      { name: 'Cardamom (Elaichi)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Rose Water', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
    ],
  },
  rasogulla: {
    title: 'Rasgulla (Rasogulla)',
    category: 'indian_sweets',
    emoji: '🍮',
    desc: 'Soft, spongy cottage cheese balls soaked in chilled sugar syrup.',
    ingredients: [
      { name: 'Whole Milk (Chenna)', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Sugar (for Syrup)', quantity: 1, unit: 'kg', category: 'pantry', status: 'confirmed' },
      { name: 'Lemon Juice', quantity: 2, unit: null, category: 'produce', status: 'confirmed' },
      { name: 'Cardamom (Elaichi)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Rose Water', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
    ],
  },
  rasmalai: {
    title: 'Rasmalai',
    category: 'indian_sweets',
    emoji: '🍮',
    desc: 'Flattened paneer discs soaked in saffron cardamom thickened milk.',
    ingredients: [
      { name: 'Whole Milk (Rabri & Chenna)', quantity: 2, unit: 'liters', category: 'dairy', status: 'confirmed' },
      { name: 'Sugar', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Saffron (Kesar)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Cardamom Powder', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Sliced Pistachios & Almonds', quantity: 1, unit: 'pack', category: 'snacks', status: 'confirmed' },
    ],
  },
  kheer: {
    title: 'Rice Kheer',
    category: 'indian_sweets',
    emoji: '🍨',
    desc: 'Traditional rice pudding simmered with cardamom, saffron, and nuts.',
    ingredients: [
      { name: 'Whole Milk', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Basmati Rice', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Sugar', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Cardamom (Elaichi)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Saffron (Kesar)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Almonds & Cashews', quantity: 1, unit: 'pack', category: 'snacks', status: 'confirmed' },
    ],
  },
  'gulab jamun': {
    title: 'Gulab Jamun',
    category: 'indian_sweets',
    emoji: '🍩',
    desc: 'Golden fried khoya dumplings soaked in rose cardamom syrup.',
    ingredients: [
      { name: 'Khoya / Mawa', quantity: 500, unit: 'g', category: 'dairy', status: 'confirmed' },
      { name: 'Sugar (for Syrup)', quantity: 1, unit: 'kg', category: 'pantry', status: 'confirmed' },
      { name: 'Cardamom Powder', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Ghee (for frying)', quantity: 1, unit: 'jar', category: 'dairy', status: 'confirmed' },
    ],
  },
  custard: {
    title: 'Fruit Custard',
    category: 'indian_sweets',
    emoji: '🍨',
    desc: 'Delicious chilled vanilla custard simmered with milk, custard powder, sugar, and fresh fruits.',
    ingredients: [
      { name: 'Whole Milk', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Custard Powder (Vanilla)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Sugar', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Mixed Fresh Fruits (Apples, Grapes, Banana, Pomegranate)', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
      { name: 'Vanilla Essence', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
    ],
  },
  'fruit custard': {
    title: 'Fruit Custard',
    category: 'indian_sweets',
    emoji: '🍨',
    desc: 'Delicious chilled vanilla custard simmered with milk, custard powder, sugar, and fresh fruits.',
    ingredients: [
      { name: 'Whole Milk', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Custard Powder (Vanilla)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Sugar', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Mixed Fresh Fruits (Apples, Grapes, Banana, Pomegranate)', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
      { name: 'Vanilla Essence', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
    ],
  },
  'gajar ka halwa': {
    title: 'Gajar Ka Halwa',
    category: 'indian_sweets',
    emoji: '🥕',
    desc: 'Rich carrot halwa cooked with fresh red carrots, milk, khoya, ghee, and nuts.',
    ingredients: [
      { name: 'Red Carrots (Gajar)', quantity: 1, unit: 'kg', category: 'produce', status: 'confirmed' },
      { name: 'Whole Milk', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Sugar', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Khoya / Mawa', quantity: 200, unit: 'g', category: 'dairy', status: 'confirmed' },
      { name: 'Pure Desi Ghee', quantity: 1, unit: 'jar', category: 'dairy', status: 'confirmed' },
      { name: 'Cashews & Almonds', quantity: 1, unit: 'pack', category: 'snacks', status: 'confirmed' },
      { name: 'Cardamom (Elaichi)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },
  'gajar halwa': {
    title: 'Gajar Ka Halwa',
    category: 'indian_sweets',
    emoji: '🥕',
    desc: 'Rich carrot halwa cooked with fresh red carrots, milk, khoya, ghee, and nuts.',
    ingredients: [
      { name: 'Red Carrots (Gajar)', quantity: 1, unit: 'kg', category: 'produce', status: 'confirmed' },
      { name: 'Whole Milk', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Sugar', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Khoya / Mawa', quantity: 200, unit: 'g', category: 'dairy', status: 'confirmed' },
      { name: 'Pure Desi Ghee', quantity: 1, unit: 'jar', category: 'dairy', status: 'confirmed' },
      { name: 'Cashews & Almonds', quantity: 1, unit: 'pack', category: 'snacks', status: 'confirmed' },
      { name: 'Cardamom (Elaichi)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },
  halwa: {
    title: 'Gajar Ka Halwa',
    category: 'indian_sweets',
    emoji: '🥕',
    desc: 'Rich carrot halwa cooked with fresh red carrots, milk, khoya, ghee, and nuts.',
    ingredients: [
      { name: 'Red Carrots (Gajar)', quantity: 1, unit: 'kg', category: 'produce', status: 'confirmed' },
      { name: 'Whole Milk', quantity: 1, unit: 'liter', category: 'dairy', status: 'confirmed' },
      { name: 'Sugar', quantity: 1, unit: 'cup', category: 'pantry', status: 'confirmed' },
      { name: 'Khoya / Mawa', quantity: 200, unit: 'g', category: 'dairy', status: 'confirmed' },
      { name: 'Pure Desi Ghee', quantity: 1, unit: 'jar', category: 'dairy', status: 'confirmed' },
      { name: 'Cashews & Almonds', quantity: 1, unit: 'pack', category: 'snacks', status: 'confirmed' },
      { name: 'Cardamom (Elaichi)', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },
  biryani: {
    title: 'Hyderabadi Biryani',
    category: 'meat',
    emoji: '🍲',
    desc: 'Aromatic basmati rice cooked with biryani spices, ghee, saffron, and fried onions.',
    ingredients: [
      { name: 'Basmati Rice', quantity: 1, unit: 'kg', category: 'pantry', status: 'confirmed' },
      { name: 'Biryani Whole Spices & Masala', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Onions & Mint Leaves', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
      { name: 'Pure Desi Ghee', quantity: 1, unit: 'jar', category: 'dairy', status: 'confirmed' },
      { name: 'Curd / Yogurt', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Saffron & Milk', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },
  tacos: {
    title: 'Mexican Tacos',
    category: 'quick_meals',
    emoji: '🌮',
    desc: 'Crispy taco shells loaded with seasoned filling, cheese, salsa, and fresh lettuce.',
    ingredients: [
      { name: 'Taco Shells / Tortillas', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Cheddar Cheese', quantity: 1, unit: 'block', category: 'dairy', status: 'confirmed' },
      { name: 'Fresh Tomatoes & Lettuce', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
      { name: 'Salsa & Sour Cream', quantity: 1, unit: 'jar', category: 'pantry', status: 'confirmed' },
      { name: 'Taco Seasoning', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },

  // ── 2. Chinese & Asian ──
  chinese: {
    title: 'Chinese Chow Mein & Manchurian',
    category: 'chinese',
    emoji: '🥢',
    desc: 'Stir-fried noodles with soy sauce, veggies, and Manchurian balls.',
    ingredients: [
      { name: 'Hakka Noodles', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Soy Sauce & Dark Vinegar', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
      { name: 'Cabbage & Carrots', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
      { name: 'Spring Onions', quantity: 1, unit: 'bunch', category: 'produce', status: 'confirmed' },
      { name: 'Chili Garlic Sauce', quantity: 1, unit: 'jar', category: 'pantry', status: 'confirmed' },
    ],
  },
  'fried rice': {
    title: 'Chinese Veg Fried Rice',
    category: 'chinese',
    emoji: '🍚',
    desc: 'Classic wok-tossed rice with spring onions and dark soy sauce.',
    ingredients: [
      { name: 'Basmati Rice', quantity: 1, unit: 'kg', category: 'pantry', status: 'confirmed' },
      { name: 'Carrots & French Beans', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
      { name: 'Soy Sauce', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
      { name: 'Spring Onions', quantity: 1, unit: 'bunch', category: 'produce', status: 'confirmed' },
      { name: 'Garlic', quantity: 1, unit: 'head', category: 'produce', status: 'confirmed' },
    ],
  },

  // ── 3. Italian (Pizza & Pasta) ──
  pasta: {
    title: 'Italian Penne Pasta',
    category: 'italian',
    emoji: '🍝',
    desc: 'Delicious pasta cooked with garlic, tomatoes, olive oil, and cheese.',
    ingredients: [
      { name: 'Penne Pasta', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
      { name: 'Fresh Tomatoes', quantity: 4, unit: null, category: 'produce', status: 'confirmed' },
      { name: 'Extra Virgin Olive Oil', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
      { name: 'Cheddar & Mozzarella Cheese', quantity: 1, unit: 'block', category: 'dairy', status: 'confirmed' },
      { name: 'Fresh Garlic', quantity: 1, unit: 'head', category: 'produce', status: 'confirmed' },
    ],
  },
  pizza: {
    title: 'Classic Mozzarella Pizza',
    category: 'italian',
    emoji: '🍕',
    desc: 'Freshly baked pizza topped with tomato sauce, bell peppers, and cheese.',
    ingredients: [
      { name: 'Pizza Base / Dough', quantity: 1, unit: 'pack', category: 'bakery', status: 'confirmed' },
      { name: 'Mozzarella Cheese', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Pizza Tomato Sauce', quantity: 1, unit: 'can', category: 'pantry', status: 'confirmed' },
      { name: 'Bell Pepper', quantity: 2, unit: null, category: 'produce', status: 'confirmed' },
      { name: 'Oregano & Chili Flakes', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },

  // ── 4. Meat & Chicken ──
  chicken: {
    title: 'Butter Chicken / Chicken Curry',
    category: 'meat',
    emoji: '🍗',
    desc: 'Tender chicken simmered in a rich tomato, butter, and spice gravy.',
    ingredients: [
      { name: 'Fresh Chicken', quantity: 1, unit: 'kg', category: 'protein', status: 'confirmed' },
      { name: 'Butter', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Fresh Tomatoes', quantity: 4, unit: null, category: 'produce', status: 'confirmed' },
      { name: 'Heavy Cream', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Garam Masala & Curry Spices', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },
  meat: {
    title: 'Rich Meat Curry / Gravy',
    category: 'meat',
    emoji: '🥩',
    desc: 'Juicy meat cooked with ginger, garlic, onions, and aromatic spices.',
    ingredients: [
      { name: 'Fresh Meat (Mutton / Beef)', quantity: 1, unit: 'kg', category: 'protein', status: 'confirmed' },
      { name: 'Onions & Ginger Garlic', quantity: 1, unit: 'pack', category: 'produce', status: 'confirmed' },
      { name: 'Cooking Oil / Ghee', quantity: 1, unit: 'bottle', category: 'pantry', status: 'confirmed' },
      { name: 'Meat Spices & Garam Masala', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },
  'butter chicken': {
    title: 'Butter Chicken',
    category: 'meat',
    emoji: '🍗',
    desc: 'Tender chicken simmered in a rich tomato, butter, and cream gravy.',
    ingredients: [
      { name: 'Fresh Chicken', quantity: 1, unit: 'kg', category: 'protein', status: 'confirmed' },
      { name: 'Butter', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Tomatoes', quantity: 4, unit: null, category: 'produce', status: 'confirmed' },
      { name: 'Heavy Cream', quantity: 1, unit: 'pack', category: 'dairy', status: 'confirmed' },
      { name: 'Garam Masala Spices', quantity: 1, unit: 'pack', category: 'pantry', status: 'confirmed' },
    ],
  },
};

/**
 * Get recipe details from knowledge base. Returns null if not found (NO dummy generator!)
 */
export function getLocalRecipe(dishName) {
  if (!dishName) return null;

  const cleaned = dishName
    .replace(/^i want to make\s+|^i want to cook\s+|^to make\s+|^for making\s+|^make\s+|^cook\s+/gi, '')
    .trim();

  const lower = cleaned.toLowerCase();

  if (RECIPE_KNOWLEDGE_BASE[lower]) {
    return RECIPE_KNOWLEDGE_BASE[lower].ingredients;
  }

  for (const [dishKey, recipeData] of Object.entries(RECIPE_KNOWLEDGE_BASE)) {
    if (lower === dishKey || lower.includes(dishKey)) {
      return recipeData.ingredients;
    }
  }

  return null;
}

/**
 * Get ALL dishes from the knowledge base for full AI dish recommendation
 */
export function getAllKnowledgeBaseDishes() {
  const dishesMap = new Map();
  for (const [key, data] of Object.entries(RECIPE_KNOWLEDGE_BASE)) {
    if (!dishesMap.has(data.title)) {
      dishesMap.set(data.title, {
        id: key,
        title: data.title,
        emoji: data.emoji,
        desc: data.desc,
        category: data.category,
      });
    }
  }
  return Array.from(dishesMap.values());
}
