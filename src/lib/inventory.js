/**
 * Inventory & Pantry Management Module — tracks items currently at home.
 * Aligns strictly with Firestore Schema.
 *
 * Features:
 *   1. checkInventoryGaps(): Filter out ingredients already in pantry before adding to cart
 *   2. transferShoppingListToInventory(): Move all purchased shopping list items to pantry upon confirmation!
 *   3. checkItemInPantry(): Checks if a single item is already in home pantry
 */

export const INITIAL_INVENTORY_SEED = [
  { id: 'inv-1', name: 'Whole Milk', category: 'dairy', quantity: 1, unit: 'liter', inStock: true, addedAt: Date.now() },
  { id: 'inv-2', name: 'Sugar', category: 'pantry', quantity: 1, unit: 'kg', inStock: true, addedAt: Date.now() },
  { id: 'inv-3', name: 'Salt', category: 'pantry', quantity: 1, unit: 'pack', inStock: true, addedAt: Date.now() },
  { id: 'inv-4', name: 'Cooking Oil', category: 'pantry', quantity: 1, unit: 'bottle', inStock: true, addedAt: Date.now() },
  { id: 'inv-5', name: 'Garlic', category: 'produce', quantity: 1, unit: 'head', inStock: true, addedAt: Date.now() },
];

function normalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/es$/i, '')
    .replace(/s$/i, '');
}

/**
 * Check recipe ingredients against home inventory.
 * Returns: { missing: Array, inStockAtHome: Array }
 */
export function checkInventoryGaps(recipeIngredients = [], currentInventory = []) {
  const missing = [];
  const inStockAtHome = [];

  const inStockMap = new Map();
  for (const item of (currentInventory || [])) {
    if (item && item.name && item.inStock !== false) {
      const k = normalize(item.name);
      if (k) inStockMap.set(k, item);
    }
  }

  for (const ing of recipeIngredients) {
    if (!ing) continue;
    const ingName = ing.name || ing.item;
    if (!ingName) continue;
    const normIng = normalize(ingName);

    let matchedInStock = null;
    if (normIng) {
      for (const [invKey, invItem] of inStockMap.entries()) {
        if (normIng === invKey || normIng.includes(invKey) || invKey.includes(normIng)) {
          matchedInStock = invItem;
          break;
        }
      }
    }

    if (matchedInStock) {
      inStockAtHome.push({
        ...ing,
        name: ingName,
        matchedPantryName: matchedInStock.name,
      });
    } else {
      missing.push({
        ...ing,
        name: ingName,
      });
    }
  }

  return { missing, inStockAtHome };
}

/**
 * Check if a single item is already in pantry.
 */
export function checkItemInPantry(itemName, currentInventory = []) {
  if (!itemName) return null;
  const norm = normalize(itemName);
  if (!norm) return null;
  return (currentInventory || []).find(
    (inv) => inv && inv.name && inv.inStock !== false && (normalize(inv.name) === norm || norm.includes(normalize(inv.name)))
  ) || null;
}

/**
 * Transfer all items from shopping list to home pantry inventory.
 * Merges quantities if item already exists in pantry!
 */
export function transferShoppingListToInventory(shoppingItems = [], currentInventory = []) {
  if (shoppingItems.length === 0) return currentInventory;

  const updatedInventory = [...currentInventory];

  for (const shopItem of shoppingItems) {
    const normShop = normalize(shopItem.name);
    const existingIdx = updatedInventory.findIndex(
      (inv) => normalize(inv.name) === normShop
    );

    if (existingIdx !== -1) {
      const existing = updatedInventory[existingIdx];
      updatedInventory[existingIdx] = {
        ...existing,
        quantity: (existing.quantity || 1) + (shopItem.quantity || 1),
        inStock: true,
        addedAt: Date.now(),
      };
    } else {
      updatedInventory.unshift({
        id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: shopItem.name,
        category: shopItem.category || 'pantry',
        quantity: shopItem.quantity || 1,
        unit: shopItem.unit || null,
        inStock: true,
        addedAt: Date.now(),
      });
    }
  }

  return updatedInventory;
}
