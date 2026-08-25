/**
 * Mock product catalog — enables search and price-filtering features
 * on first load without a live API. 50+ items with brand, price, seasonal
 * status, and substitute mappings.
 *
 * Trade-off: Static seed → would swap for a product API in production.
 */

export const CATALOG = [
  // Dairy
  { id: 'c01', name: 'Whole Milk',        category: 'dairy',     brand: 'Amul',       price: 1.49, inSeason: true,  substituteFor: [] },
  { id: 'c02', name: 'Almond Milk',       category: 'dairy',     brand: 'Sofit',      price: 3.49, inSeason: true,  substituteFor: ['milk', 'whole milk'] },
  { id: 'c03', name: 'Oat Milk',          category: 'dairy',     brand: 'Oatly',      price: 4.29, inSeason: true,  substituteFor: ['milk', 'whole milk'] },
  { id: 'c04', name: 'Greek Yogurt',      category: 'dairy',     brand: 'Chobani',    price: 5.99, inSeason: true,  substituteFor: ['yogurt', 'curd'] },
  { id: 'c05', name: 'Cheddar Cheese',    category: 'dairy',     brand: 'Amul',       price: 3.99, inSeason: true,  substituteFor: ['cheese'] },
  { id: 'c06', name: 'Unsalted Butter',   category: 'dairy',     brand: 'Amul',       price: 2.99, inSeason: true,  substituteFor: ['butter'] },
  { id: 'c07', name: 'Paneer',            category: 'dairy',     brand: 'Mother Dairy', price: 3.49, inSeason: true, substituteFor: ['tofu'] },

  // Produce
  { id: 'c08', name: 'Organic Apples',    category: 'produce',   brand: 'Organic Farm', price: 4.99, inSeason: true,  substituteFor: ['apples'] },
  { id: 'c09', name: 'Bananas',           category: 'produce',   brand: 'Dole',       price: 0.69, inSeason: true,  substituteFor: [] },
  { id: 'c10', name: 'Tomatoes',          category: 'produce',   brand: 'Local Farm', price: 2.49, inSeason: true,  substituteFor: [] },
  { id: 'c11', name: 'Baby Spinach',      category: 'produce',   brand: 'Fresh Greens', price: 3.99, inSeason: true, substituteFor: ['spinach', 'kale'] },
  { id: 'c12', name: 'Avocados',          category: 'produce',   brand: 'Hass',       price: 1.99, inSeason: true,  substituteFor: [] },
  { id: 'c13', name: 'Sweet Potatoes',    category: 'produce',   brand: 'Local Farm', price: 1.79, inSeason: false, substituteFor: ['potato', 'potatoes'] },
  { id: 'c14', name: 'Mangoes',           category: 'produce',   brand: 'Alphonso',   price: 2.99, inSeason: false, substituteFor: [] },
  { id: 'c15', name: 'Watermelon',        category: 'produce',   brand: 'Local Farm', price: 5.99, inSeason: false, substituteFor: [] },
  { id: 'c16', name: 'Broccoli',          category: 'produce',   brand: 'Fresh Greens', price: 2.49, inSeason: true, substituteFor: ['cauliflower'] },

  // Pantry
  { id: 'c17', name: 'Basmati Rice',      category: 'pantry',    brand: 'India Gate', price: 8.99, inSeason: true,  substituteFor: ['rice'] },
  { id: 'c18', name: 'Whole Wheat Flour', category: 'pantry',    brand: 'Aashirvaad', price: 4.49, inSeason: true,  substituteFor: ['flour'] },
  { id: 'c19', name: 'Extra Virgin Olive Oil', category: 'pantry', brand: 'Figaro',   price: 7.99, inSeason: true,  substituteFor: ['oil', 'olive oil'] },
  { id: 'c20', name: 'Penne Pasta',       category: 'pantry',    brand: 'Barilla',    price: 1.99, inSeason: true,  substituteFor: ['pasta', 'spaghetti'] },
  { id: 'c21', name: 'Red Lentils',       category: 'pantry',    brand: 'Toor Dal',   price: 3.49, inSeason: true,  substituteFor: ['lentils', 'dal'] },
  { id: 'c22', name: 'Peanut Butter',     category: 'pantry',    brand: 'Jif',        price: 3.79, inSeason: true,  substituteFor: ['almond butter'] },
  { id: 'c23', name: 'Organic Honey',     category: 'pantry',    brand: 'Dabur',      price: 6.49, inSeason: true,  substituteFor: ['honey', 'maple syrup'] },
  { id: 'c24', name: 'Soy Sauce',         category: 'pantry',    brand: 'Kikkoman',   price: 2.99, inSeason: true,  substituteFor: [] },
  { id: 'c25', name: 'Tomato Ketchup',    category: 'pantry',    brand: 'Heinz',      price: 3.49, inSeason: true,  substituteFor: ['ketchup'] },

  // Protein
  { id: 'c26', name: 'Chicken Breast',    category: 'protein',   brand: 'Fresh Farms', price: 6.99, inSeason: true, substituteFor: ['chicken'] },
  { id: 'c27', name: 'Large Eggs (12)',    category: 'protein',   brand: 'Farm Fresh', price: 3.49, inSeason: true,  substituteFor: ['eggs'] },
  { id: 'c28', name: 'Atlantic Salmon',   category: 'protein',   brand: 'Wild Catch', price: 9.99, inSeason: true,  substituteFor: ['fish', 'salmon'] },
  { id: 'c29', name: 'Firm Tofu',         category: 'protein',   brand: 'Mori-Nu',    price: 2.49, inSeason: true,  substituteFor: ['tofu', 'paneer'] },
  { id: 'c30', name: 'Turkey Bacon',      category: 'protein',   brand: 'Oscar Mayer', price: 4.99, inSeason: true, substituteFor: ['bacon'] },

  // Beverages
  { id: 'c31', name: 'Sparkling Water',   category: 'beverages', brand: 'Perrier',    price: 1.79, inSeason: true,  substituteFor: ['water'] },
  { id: 'c32', name: 'Orange Juice',      category: 'beverages', brand: 'Tropicana',  price: 4.49, inSeason: true,  substituteFor: ['juice'] },
  { id: 'c33', name: 'Green Tea',         category: 'beverages', brand: 'Lipton',     price: 3.99, inSeason: true,  substituteFor: ['tea'] },
  { id: 'c34', name: 'Ground Coffee',     category: 'beverages', brand: 'Nescafe',    price: 7.99, inSeason: true,  substituteFor: ['coffee'] },
  { id: 'c35', name: 'Coconut Water',     category: 'beverages', brand: 'Vita Coco',  price: 2.99, inSeason: true,  substituteFor: ['water'] },

  // Household
  { id: 'c36', name: 'Dish Soap',         category: 'household', brand: 'Dawn',       price: 3.49, inSeason: true,  substituteFor: [] },
  { id: 'c37', name: 'Laundry Detergent', category: 'household', brand: 'Tide',       price: 11.99, inSeason: true, substituteFor: ['detergent'] },
  { id: 'c38', name: 'Paper Towels',      category: 'household', brand: 'Bounty',     price: 5.99, inSeason: true,  substituteFor: [] },
  { id: 'c39', name: 'Toothpaste',        category: 'household', brand: 'Colgate',    price: 2.99, inSeason: true,  substituteFor: [] },
  { id: 'c40', name: 'Premium Toothpaste', category: 'household', brand: 'Sensodyne', price: 5.99, inSeason: true, substituteFor: ['toothpaste'] },
  { id: 'c41', name: 'Hand Soap',         category: 'household', brand: 'Dettol',     price: 3.49, inSeason: true,  substituteFor: ['soap'] },
  { id: 'c42', name: 'Trash Bags',        category: 'household', brand: 'Glad',       price: 6.99, inSeason: true,  substituteFor: ['garbage bags'] },

  // Snacks
  { id: 'c43', name: 'Potato Chips',      category: 'snacks',    brand: "Lay's",      price: 3.49, inSeason: true,  substituteFor: ['chips'] },
  { id: 'c44', name: 'Dark Chocolate',    category: 'snacks',    brand: 'Cadbury',    price: 2.99, inSeason: true,  substituteFor: ['chocolate'] },
  { id: 'c45', name: 'Mixed Nuts',        category: 'snacks',    brand: 'Planters',   price: 7.99, inSeason: true,  substituteFor: ['nuts', 'almonds'] },
  { id: 'c46', name: 'Granola Bars',      category: 'snacks',    brand: 'Nature Valley', price: 4.49, inSeason: true, substituteFor: ['protein bar'] },
  { id: 'c47', name: 'Popcorn',           category: 'snacks',    brand: 'Act II',     price: 2.49, inSeason: true,  substituteFor: [] },

  // Bakery
  { id: 'c48', name: 'Whole Wheat Bread', category: 'bakery',    brand: 'Britannia',  price: 2.99, inSeason: true,  substituteFor: ['bread'] },
  { id: 'c49', name: 'Sourdough Bread',   category: 'bakery',    brand: 'Artisan',    price: 4.49, inSeason: true,  substituteFor: ['bread'] },
  { id: 'c50', name: 'Tortillas',         category: 'bakery',    brand: 'Mission',    price: 3.29, inSeason: true,  substituteFor: ['naan', 'pita'] },
  { id: 'c51', name: 'Bagels (6)',        category: 'bakery',    brand: "Thomas'",    price: 4.49, inSeason: true,  substituteFor: ['bagels'] },
  { id: 'c52', name: 'Croissants (4)',    category: 'bakery',    brand: 'Artisan',    price: 5.99, inSeason: true,  substituteFor: [] },
];

/**
 * Search the catalog by query string. Matches against name, brand,
 * and category. Supports optional price ceiling.
 */
export function searchCatalog(query, maxPrice = null) {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  let results = CATALOG.filter((item) => {
    const text = `${item.name} ${item.brand} ${item.category}`.toLowerCase();
    return text.includes(lower);
  });

  if (maxPrice !== null && maxPrice > 0) {
    results = results.filter((item) => item.price <= maxPrice);
  }

  return results;
}

/**
 * Find substitute products for a given item name.
 */
export function findSubstitutes(itemName) {
  const lower = itemName.toLowerCase().trim();
  return CATALOG.filter((product) =>
    product.substituteFor.some((s) => lower.includes(s.toLowerCase()))
  );
}
