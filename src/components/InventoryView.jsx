import { useState } from 'react';
import { getCategoryMeta, CATEGORIES } from '../lib/categories';

/**
 * InventoryView — Home Pantry & Inventory Tab
 * Manages items currently stored at home, stock status, and quantity levels.
 */
export default function InventoryView({ inventory, onUpdateItem, onDeleteItem, onAddItem }) {
  const [newItemName, setNewItemName] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  function handleAdd(e) {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim());
    setNewItemName('');
  }

  const filteredInventory = selectedCat === 'all'
    ? inventory
    : inventory.filter((item) => item.category === selectedCat);

  // Group by category
  const grouped = filteredInventory.reduce((acc, item) => {
    const key = item.category || 'other';
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Add New Pantry Item Bar */}
      <form onSubmit={handleAdd} className="flex gap-2 w-full">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder='Add item to Pantry (e.g. "Olive Oil" or "Sugar")'
          className="text-input"
        />
        <button type="submit" disabled={!newItemName.trim()} className="send-btn">
          <i className="ti ti-plus" />
        </button>
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 suggestions-scroll">
        <button
          onClick={() => setSelectedCat('all')}
          className={`text-[0.7rem] font-bold px-3 py-1 rounded-full border transition-all ${
            selectedCat === 'all'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'glass text-slate-600 dark:text-slate-300 border-white/10 hover:text-emerald-500'
          }`}
        >
          All Pantry ({inventory.length})
        </button>
        {Object.entries(CATEGORIES).map(([catKey, cat]) => (
          <button
            key={catKey}
            onClick={() => setSelectedCat(catKey)}
            className={`text-[0.7rem] font-bold px-3 py-1 rounded-full border transition-all ${
              selectedCat === catKey
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'glass text-slate-600 dark:text-slate-300 border-white/10 hover:text-emerald-500'
            }`}
          >
            <span className="mr-1">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {inventory.length === 0 ? (
        <div className="empty-state animate-fade-in-up py-8">
          <div className="empty-icon">
            <i className="ti ti-home-check" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Your pantry inventory is empty</p>
          <p className="text-xs text-slate-600">
            Add items above that you already have at home (e.g. Milk, Sugar, Salt)
          </p>
        </div>
      ) : (
        /* Categorized Inventory Items */
        <div className="flex flex-col gap-4">
          {Object.keys(grouped).map((catKey) => {
            const meta = getCategoryMeta(catKey);
            const items = grouped[catKey];

            return (
              <div key={catKey} className={`category-section ${meta.colorClass}`}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`category-badge ${meta.colorClass}`}>
                    <span className="text-sm">{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </div>
                  <span className="text-[0.65rem] text-slate-500 font-medium">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-1.5">
                  {items.map((item) => (
                    <div key={item.id} className="item-card">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Stock Toggle Checkbox */}
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateItem(item.id, { inStock: !item.inStock })
                          }
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            item.inStock !== false
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-400 dark:border-slate-600 text-transparent'
                          }`}
                          title={item.inStock !== false ? 'In Stock (Click to mark out)' : 'Out of Stock'}
                        >
                          <i className="ti ti-check text-xs" />
                        </button>

                        <span className={`text-sm font-medium truncate ${
                          item.inStock !== false
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-400 dark:text-slate-500 line-through'
                        }`}>
                          {item.name}
                        </span>

                        <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-bold ${
                          item.inStock !== false
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {item.inStock !== false ? 'In Pantry 🏡' : 'Out of Stock ⚠️'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quantity Pill */}
                        <span className="qty-badge">
                          {item.quantity}{item.unit ? ` ${item.unit}` : ''}
                        </span>

                        {/* Delete Button */}
                        <button
                          aria-label={`Delete ${item.name}`}
                          onClick={() => onDeleteItem(item.id)}
                          className="item-remove"
                        >
                          <i className="ti ti-x" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
