/**
 * Category dictionary — maps common item keywords to their category.
 * Supports both English and Hindi grocery item names.
 * Each category has an emoji, accent color class, and list of known items.
 * Used for automatic categorization.
 */

export const CATEGORIES = {
  dairy: {
    emoji: '🥛',
    label: 'Dairy',
    colorClass: 'category-dairy',
    items: [
      'milk', 'cheese', 'yogurt', 'yoghurt', 'butter', 'cream', 'paneer',
      'ghee', 'curd', 'cottage cheese', 'cream cheese', 'sour cream',
      'whipped cream', 'mozzarella', 'cheddar', 'parmesan', 'ricotta',
      'buttermilk', 'condensed milk', 'evaporated milk', 'half and half',
      'almond milk', 'oat milk', 'soy milk', 'coconut milk',
      // Hindi terms
      'दूध', 'दही', 'मक्खन', 'पनीर', 'चीज', 'चीज़', 'घी', 'छाछ', 'मलाई', 'मिल्क',
    ],
  },
  produce: {
    emoji: '🥬',
    label: 'Produce',
    colorClass: 'category-produce',
    items: [
      'apple', 'apples', 'banana', 'bananas', 'tomato', 'tomatoes',
      'onion', 'onions', 'potato', 'potatoes', 'carrot', 'carrots',
      'lettuce', 'spinach', 'broccoli', 'cucumber', 'cucumbers',
      'pepper', 'peppers', 'bell pepper', 'garlic', 'ginger',
      'lemon', 'lemons', 'lime', 'limes', 'orange', 'oranges',
      'mango', 'mangoes', 'grapes', 'strawberry', 'strawberries',
      'blueberry', 'blueberries', 'watermelon', 'pineapple',
      'avocado', 'avocados', 'cabbage', 'cauliflower', 'peas',
      'corn', 'mushroom', 'mushrooms', 'celery', 'kale', 'zucchini',
      'eggplant', 'sweet potato', 'radish', 'beet', 'beets',
      'cilantro', 'parsley', 'mint', 'basil', 'green beans',
      'asparagus', 'artichoke', 'pomegranate', 'guava', 'papaya',
      'peach', 'peaches', 'pear', 'pears', 'plum', 'plums',
      'cherry', 'cherries', 'coconut', 'fig', 'figs', 'dates',
      // Hindi terms
      'टमाटर', 'आलू', 'प्याज', 'प्याज़', 'सेब', 'केला', 'केले', 'आम',
      'पालक', 'गाजर', 'नींबू', 'निंबू', 'अदरक', 'लहसुन', 'धनिया',
      'मटर', 'गोभी', 'फूलगोभी', 'पत्तागोभी', 'खीरा', 'मिर्च', 'हरी मिर्च',
      'अंगूर', 'संतरा', 'अनार', 'तरबूज', 'पपीता', 'अमरूद', 'नारियल',
      'भिंडी', 'बैंगन', 'कद्दू', 'लौकी', 'पत्ता गोभी', 'सब्जी', 'फल',
    ],
  },
  pantry: {
    emoji: '🥫',
    label: 'Pantry',
    colorClass: 'category-pantry',
    items: [
      'rice', 'flour', 'sugar', 'oil', 'olive oil', 'vegetable oil',
      'canola oil', 'coconut oil', 'pasta', 'spaghetti', 'noodles',
      'lentils', 'dal', 'beans', 'chickpeas', 'kidney beans',
      'salt', 'pepper', 'turmeric', 'cumin', 'chili powder',
      'cinnamon', 'oregano', 'paprika', 'bay leaves',
      'soy sauce', 'vinegar', 'ketchup', 'mustard', 'mayonnaise',
      'tomato sauce', 'pasta sauce', 'peanut butter', 'jam', 'jelly',
      'honey', 'maple syrup', 'cereal', 'oats', 'oatmeal',
      'cornstarch', 'baking powder', 'baking soda', 'yeast',
      'canned tomatoes', 'canned corn', 'canned beans',
      'tuna', 'canned tuna', 'soup', 'broth', 'stock',
      'jaggery', 'molasses', 'stevia', 'brown sugar',
      // Hindi terms
      'चावल', 'आटा', 'चीनी', 'शक्कर', 'तेल', 'नमक', 'दाल', 'दालें',
      'हल्दी', 'जीरा', 'मसाला', 'मसाले', 'शहद', 'गुड़', 'बेसन', 'सूजी',
      'मैदा', 'छोले', 'राजमा', 'सरसों तेल', 'रिफाइंड तेल', 'चटनी',
    ],
  },
  protein: {
    emoji: '🍗',
    label: 'Protein',
    colorClass: 'category-protein',
    items: [
      'chicken', 'chicken breast', 'chicken thigh', 'chicken wings',
      'beef', 'ground beef', 'steak', 'pork', 'bacon', 'ham',
      'sausage', 'turkey', 'ground turkey', 'lamb',
      'fish', 'salmon', 'tuna', 'shrimp', 'prawns', 'crab',
      'tofu', 'tempeh', 'eggs', 'egg', 'paneer',
      // Hindi terms
      'अंडे', 'अंडा', 'चिकन', 'मछली', 'मीट', 'मांस', 'झींगा', 'सोया',
    ],
  },
  beverages: {
    emoji: '🥤',
    label: 'Beverages',
    colorClass: 'category-beverages',
    items: [
      'water', 'juice', 'orange juice', 'apple juice',
      'tea', 'green tea', 'coffee', 'instant coffee',
      'soda', 'cola', 'sprite', 'lemonade',
      'beer', 'wine', 'sparkling water', 'tonic water',
      'coconut water', 'smoothie', 'protein shake', 'energy drink',
      // Hindi terms
      'पानी', 'जल', 'चाय', 'कॉफी', 'जूस', 'शरबत', 'कोल्ड ड्रिंक',
      'नारियल पानी', 'ग्रीन टी', 'दूध',
    ],
  },
  household: {
    emoji: '🧴',
    label: 'Household',
    colorClass: 'category-household',
    items: [
      'soap', 'dish soap', 'hand soap', 'body wash', 'shampoo',
      'conditioner', 'toothpaste', 'toothbrush', 'mouthwash',
      'detergent', 'laundry detergent', 'fabric softener',
      'paper towels', 'toilet paper', 'tissues', 'napkins',
      'trash bags', 'garbage bags', 'aluminum foil', 'plastic wrap',
      'sponge', 'bleach', 'disinfectant', 'cleaning spray',
      'deodorant', 'lotion', 'sunscreen', 'razor', 'floss',
      // Hindi terms
      'साबुन', 'टूथपेस्ट', 'सर्फ', 'डिटर्जेंट', 'शैम्पू', 'फ़िनाइल',
      'टिशू', 'हैंड वॉश', 'फ़ेस वॉश',
    ],
  },
  snacks: {
    emoji: '🍿',
    label: 'Snacks',
    colorClass: 'category-snacks',
    items: [
      'chips', 'potato chips', 'tortilla chips', 'crackers',
      'cookies', 'biscuits', 'popcorn', 'pretzels', 'nuts',
      'almonds', 'cashews', 'peanuts', 'walnuts', 'pistachios',
      'trail mix', 'granola', 'granola bar', 'protein bar',
      'chocolate', 'candy', 'gummy bears', 'dried fruit',
      'ice cream', 'frozen yogurt', 'pudding',
      // Hindi terms
      'बिस्कुट', 'बिस्किट', 'चिप्स', 'नमकीन', 'चॉकलेट', 'बदाम',
      'काजू', 'मूंगफली', 'पिस्ता', 'अखरोट', 'ड्राई फ्रूट',
    ],
  },
  bakery: {
    emoji: '🍞',
    label: 'Bakery',
    colorClass: 'category-bakery',
    items: [
      'bread', 'white bread', 'wheat bread', 'whole wheat bread',
      'bagel', 'bagels', 'croissant', 'muffin', 'muffins',
      'cake', 'pie', 'donut', 'donuts', 'bun', 'buns',
      'tortilla', 'tortillas', 'pita', 'naan', 'rolls',
      // Hindi terms
      'ब्रेड', 'टोस्ट', 'पाव', 'केक', 'बन',
    ],
  },
  frozen: {
    emoji: '🧊',
    label: 'Frozen',
    colorClass: 'category-frozen',
    items: [
      'frozen pizza', 'frozen vegetables', 'frozen fruit',
      'frozen chicken', 'frozen fish', 'frozen shrimp',
      'ice cream', 'frozen yogurt', 'frozen waffles',
      'frozen fries', 'frozen peas', 'frozen corn',
      'frozen berries', 'frozen dinner', 'pizza rolls',
      // Hindi terms
      'आइसक्रीम', 'आइस क्रीम', 'फ्रोज़न',
    ],
  },
};

// Build a fast lookup: lowercased item → category key
const _lookup = new Map();
for (const [catKey, cat] of Object.entries(CATEGORIES)) {
  for (const item of cat.items) {
    _lookup.set(item.toLowerCase(), catKey);
  }
}

/**
 * Categorize an item name. Tries exact match first, then checks if the
 * item name contains a known keyword. Falls back to "other".
 */
export function categorize(itemName) {
  const lower = itemName.toLowerCase().trim();

  // Exact match
  if (_lookup.has(lower)) return _lookup.get(lower);

  // Substring match — e.g. "organic whole milk" matches "milk", "चार टमाटर" matches "टमाटर"
  for (const [keyword, catKey] of _lookup.entries()) {
    if (lower.includes(keyword)) return catKey;
  }

  return 'other';
}

/**
 * Get category metadata by key.
 */
export function getCategoryMeta(catKey) {
  return CATEGORIES[catKey] || {
    emoji: '📦',
    label: catKey.charAt(0).toUpperCase() + catKey.slice(1),
    colorClass: 'category-other',
  };
}
