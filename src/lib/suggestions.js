/**
 * Suggestions engine — produces clean, dynamic smart recommendations:
 *   1. Low-stock: items the user buys regularly that are due for re-stock
 *   2. Frequently Bought Essentials: popular grocery essentials
 *   3. Seasonal: items in season for the current month
 *   4. Substitutes: smart alternatives for items on the current list
 */

import { findSubstitutes } from './catalog';

// Popular grocery essentials to suggest when history is light
const ESSENTIAL_RECOMMENDATIONS = [
  { item: 'Whole Milk', detail: 'Frequently bought dairy essential' },
  { item: 'Fresh Bread', detail: 'Bakery staple' },
  { item: 'Farm Eggs', detail: 'High demand protein' },
  { item: 'Organic Bananas', detail: 'Popular fruit essential' },
  { item: 'Basmati Rice', detail: 'Pantry staple' },
  { item: 'Coffee Beans', detail: 'Beverage essential' },
];

const SEASONAL_BY_MONTH = {
  0:  ['Oranges', 'Sweet Potatoes', 'Kale', 'Pomegranate'],
  1:  ['Oranges', 'Grapefruit', 'Lemons', 'Cabbage'],
  2:  ['Strawberries', 'Spinach', 'Asparagus', 'Peas'],
  3:  ['Strawberries', 'Pineapple', 'Spinach', 'Radish'],
  4:  ['Cherries', 'Mangoes', 'Watermelon', 'Cucumbers'],
  5:  ['Mangoes', 'Watermelon', 'Peaches', 'Corn', 'Blueberries'],
  6:  ['Mangoes', 'Watermelon', 'Fresh Tomatoes', 'Bell Peppers', 'Corn'],
  7:  ['Watermelon', 'Peaches', 'Fresh Tomatoes', 'Eggplant', 'Figs'],
  8:  ['Crisp Apples', 'Grapes', 'Pears', 'Sweet Potatoes'],
  9:  ['Crisp Apples', 'Pumpkin', 'Cranberries', 'Cauliflower'],
  10: ['Pomegranate', 'Cranberries', 'Sweet Potatoes', 'Pears'],
  11: ['Oranges', 'Pomegranate', 'Dates', 'Sweet Potatoes'],
};

const DAY_MS = 24 * 60 * 60 * 1000;

function cleanName(rawName) {
  if (!rawName) return '';
  let str = rawName.trim().toLowerCase();

  // Clean raw speech typos
  if (str.includes('lass of water') || str.includes('glass of water')) return 'Water';
  if (str.includes('cup of coffee')) return 'Coffee';

  // Capitalize nicely
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
}

/**
 * Compute dynamic suggestions from purchase history and current shopping list.
 */
export function computeSuggestions(history, currentItems = []) {
  const results = [];
  const currentNames = new Set(currentItems.map((i) => i.name.toLowerCase()));

  // ── 1. Low-stock Heuristic ─────────────────────────────────
  const addsByItem = {};
  for (const entry of history) {
    if (entry.action !== 'add' || !entry.itemName) continue;
    const sanitized = cleanName(entry.itemName);
    if (!sanitized || sanitized.toLowerCase().includes('lass of')) continue;

    const ts = typeof entry.timestamp === 'number'
      ? entry.timestamp
      : entry.timestamp?.toMillis?.()
        ?? entry.timestamp?.seconds * 1000
        ?? null;
    if (!ts) continue;
    (addsByItem[sanitized] ||= []).push(ts);
  }

  for (const [item, timestamps] of Object.entries(addsByItem)) {
    if (currentNames.has(item.toLowerCase())) continue;
    if (timestamps.length < 2) continue;

    const sorted = [...timestamps].sort((a, b) => a - b);
    const gaps = sorted.slice(1).map((t, i) => t - sorted[i]);
    const avgInterval = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const daysSinceLast = (Date.now() - sorted[sorted.length - 1]) / DAY_MS;
    const intervalDays = avgInterval / DAY_MS;

    if (daysSinceLast > intervalDays * 0.9) {
      results.push({
        id: `low-${item}`,
        item,
        reason: 'low-stock',
        detail: `Usually re-stocked every ${Math.round(intervalDays)} days`,
      });
    }
  }

  // ── 2. Frequently Bought Essentials ────────────────────────
  for (const ess of ESSENTIAL_RECOMMENDATIONS) {
    if (currentNames.has(ess.item.toLowerCase())) continue;
    // Don't add duplicate
    if (results.some((r) => r.item.toLowerCase() === ess.item.toLowerCase())) continue;

    results.push({
      id: `essential-${ess.item}`,
      item: ess.item,
      reason: 'low-stock',
      detail: ess.detail,
    });
  }

  // ── 3. Seasonal suggestions ───────────────────────────────
  const month = new Date().getMonth();
  const seasonalItems = SEASONAL_BY_MONTH[month] || [];

  for (const item of seasonalItems) {
    if (currentNames.has(item.toLowerCase())) continue;
    if (results.some((r) => r.item.toLowerCase() === item.toLowerCase())) continue;

    results.push({
      id: `season-${item}`,
      item,
      reason: 'seasonal',
      detail: 'Fresh in season now',
    });
  }

  // ── 4. Substitute suggestions ─────────────────────────────
  for (const listItem of currentItems) {
    const subs = findSubstitutes(listItem.name);
    if (subs.length > 0) {
      const sub = subs[0];
      if (
        sub.name.toLowerCase() !== listItem.name.toLowerCase() &&
        !currentNames.has(sub.name.toLowerCase())
      ) {
        results.push({
          id: `sub-${sub.id}`,
          item: sub.name,
          reason: 'substitute',
          detail: `Smart alternative for ${listItem.name}`,
        });
      }
    }
  }

  return results.slice(0, 10);
}
