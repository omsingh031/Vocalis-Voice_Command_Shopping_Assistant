import { useEffect, useRef } from 'react';
import { getCategoryMeta } from '../lib/categories';

/**
 * ShoppingList — grouped by category with glassmorphic cards.
 *
 * Features:
 * - Auto-categorized sections with emoji + colored accent bar
 * - New items animate in with slide + highlight flash
 * - Quantity badges as emerald pills
 * - Hover-to-reveal remove button with red glow
 * - Beautiful empty state with floating mic icon
 * - Item count per category
 */

// Category display order — most common first
const CATEGORY_ORDER = [
  'produce', 'dairy', 'protein', 'pantry', 'bakery',
  'beverages', 'snacks', 'household', 'frozen', 'other',
];

export default function ShoppingList({ items, onRemove }) {
  const prevCountRef = useRef(items.length);
  const newItemIds = useRef(new Set());

  // Track which items are "new" for entrance animation
  useEffect(() => {
    if (items.length > prevCountRef.current) {
      // Find items that weren't in the previous render
      const existingIds = new Set(
        items.slice(0, prevCountRef.current).map((i) => i.id)
      );
      items.forEach((item) => {
        if (!existingIds.has(item.id)) {
          newItemIds.current.add(item.id);
          // Remove "new" flag after animation completes
          setTimeout(() => newItemIds.current.delete(item.id), 1800);
        }
      });
    }
    prevCountRef.current = items.length;
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="empty-state animate-fade-in-up">
        <div className="empty-icon">
          <i className="ti ti-shopping-cart" />
        </div>
        <p className="text-sm text-slate-500 font-medium">Your list is empty</p>
        <p className="text-xs text-slate-600">
          Try saying <span className="text-emerald-400">"add milk"</span> or type a command below
        </p>
      </div>
    );
  }

  // Group items by category
  const grouped = items.reduce((acc, item) => {
    const key = item.category || 'other';
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

  // Sort categories by predefined order
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {sortedCategories.map((catKey) => {
        const meta = getCategoryMeta(catKey);
        const categoryItems = grouped[catKey];

        return (
          <div key={catKey} className={`category-section ${meta.colorClass}`}>
            {/* Category header */}
            <div className="flex items-center justify-between mb-2">
              <div className={`category-badge ${meta.colorClass}`}>
                <span className="text-sm">{meta.emoji}</span>
                <span>{meta.label}</span>
              </div>
              <span className="text-[0.65rem] text-slate-600 font-medium">
                {categoryItems.length}
              </span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-1.5">
              {categoryItems.map((item) => {
                const isNew = newItemIds.current.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`item-card ${isNew ? 'is-new' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-5 h-5 rounded-md border border-white/10 flex items-center justify-center flex-shrink-0">
                        {item.status === 'pending' ? (
                          <i className="ti ti-loader-2 text-xs text-slate-600 animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-sm bg-white/10" />
                        )}
                      </div>
                      <span className="text-sm text-slate-800 dark:text-slate-200 truncate font-medium">
                        {item.name}
                      </span>
                      {(item.quantity > 1 || item.unit) && (
                        <span className="qty-badge">
                          ×{item.quantity}{item.unit ? ` ${item.unit}` : ''}
                        </span>
                      )}
                    </div>

                    <button
                      aria-label={`Remove ${item.name}`}
                      onClick={() => onRemove(item.id)}
                      className="item-remove"
                    >
                      <i className="ti ti-x" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
