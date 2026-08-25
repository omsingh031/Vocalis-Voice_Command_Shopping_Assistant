import { useState } from 'react';
import { RECIPE_CATEGORIES, RECIPE_KNOWLEDGE_BASE } from '../lib/recipes';

/**
 * SuggestionsStrip — Ultimate Smart Suggestions Hub
 *
 * Covers ALL required problem statement features:
 *   1. Product Recommendations (Low-Stock History Heuristic)
 *   2. Seasonal Recommendations (Current Month Produce & Deals)
 *   3. Substitutes (Smart Product Alternatives)
 *   4. AI Recipe Discovery (One-tap Dish Ingredient Auto-Adder)
 */
export default function SuggestionsStrip({ suggestions = [], onAdd, onAddRecipe }) {
  const [activeTab, setActiveTab] = useState('all');
  const [activeRecipeCategory, setActiveRecipeCategory] = useState('all');
  const [addedIds, setAddedIds] = useState(new Set());

  // Featured Dish Recipes for AI Discovery
  const featuredDishes = [
    { id: 'rasgulla', title: 'Rasgulla', emoji: '🍮', category: 'indian_sweets', desc: 'Milk, Sugar Syrup, Lemon, Elaichi, Rose Water' },
    { id: 'rasmalai', title: 'Rasmalai', emoji: '🍮', category: 'indian_sweets', desc: 'Milk, Sugar, Kesar, Elaichi, Pistachios' },
    { id: 'kheer', title: 'Kheer', emoji: '🍨', category: 'indian_sweets', desc: 'Milk, Rice, Sugar, Elaichi, Kesar, Nuts' },
    { id: 'gulab jamun', title: 'Gulab Jamun', emoji: '🍩', category: 'indian_sweets', desc: 'Khoya, Sugar Syrup, Elaichi, Ghee' },
    { id: 'pizza', title: 'Pizza', emoji: '🍕', category: 'italian', desc: 'Pizza Base, Mozzarella, Sauce, Peppers' },
    { id: 'pasta', title: 'Pasta', emoji: '🍝', category: 'italian', desc: 'Penne, Tomatoes, Olive Oil, Cheese, Garlic' },
    { id: 'chinese', title: 'Chinese Noodles', emoji: '🥢', category: 'chinese', desc: 'Noodles, Soy Sauce, Veggies, Spring Onions' },
    { id: 'chicken', title: 'Butter Chicken', emoji: '🍗', category: 'meat', desc: 'Chicken, Butter, Tomatoes, Cream, Spices' },
  ];

  // Group problem statement suggestions by reason
  const lowStockItems = suggestions.filter((s) => s.reason === 'low-stock');
  const seasonalItems = suggestions.filter((s) => s.reason === 'seasonal');
  const substituteItems = suggestions.filter((s) => s.reason === 'substitute');

  function handleSingleAdd(s) {
    if (addedIds.has(s.id)) return;
    setAddedIds((prev) => new Set([...prev, s.id]));
    onAdd(s.item, 1);
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(s.id);
        return next;
      });
    }, 1500);
  }

  function handleRecipeAdd(dish) {
    const recipeData = RECIPE_KNOWLEDGE_BASE[dish.id];
    if (!recipeData) return;

    setAddedIds((prev) => new Set([...prev, dish.id]));
    onAddRecipe(dish.title, recipeData.ingredients);

    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(dish.id);
        return next;
      });
    }, 1500);
  }

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      {/* Top Hub Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 suggestions-scroll">
        <button
          onClick={() => setActiveTab('all')}
          className={`text-[0.725rem] font-bold px-3 py-1 rounded-full transition-all border ${
            activeTab === 'all'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'glass text-slate-600 dark:text-slate-300 border-white/10 hover:text-emerald-500'
          }`}
        >
          ✨ Smart Suggestions ({suggestions.length})
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className={`text-[0.725rem] font-bold px-3 py-1 rounded-full transition-all border ${
            activeTab === 'recipes'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'glass text-slate-600 dark:text-slate-300 border-white/10 hover:text-emerald-500'
          }`}
        >
          🍳 AI Recipes & Dishes
        </button>

        {seasonalItems.length > 0 && (
          <button
            onClick={() => setActiveTab('seasonal')}
            className={`text-[0.725rem] font-bold px-3 py-1 rounded-full transition-all border ${
              activeTab === 'seasonal'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'glass text-slate-600 dark:text-slate-300 border-white/10 hover:text-emerald-500'
            }`}
          >
            🌿 In Season ({seasonalItems.length})
          </button>
        )}

        {substituteItems.length > 0 && (
          <button
            onClick={() => setActiveTab('substitutes')}
            className={`text-[0.725rem] font-bold px-3 py-1 rounded-full transition-all border ${
              activeTab === 'substitutes'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'glass text-slate-600 dark:text-slate-300 border-white/10 hover:text-emerald-500'
            }`}
          >
            🔄 Substitutes ({substituteItems.length})
          </button>
        )}
      </div>

      {/* ── TAB 1: ALL SMART SUGGESTIONS (Low-Stock History, Substitutes, Seasonal) ── */}
      {activeTab === 'all' && (
        <div className="flex gap-2 overflow-x-auto pb-1.5 -mx-1 px-1 suggestions-scroll">
          {suggestions.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-1 px-2">
              <i className="ti ti-sparkles text-emerald-500" />
              <span>Tap a recipe tab above or start adding items to see smart recommendations.</span>
            </div>
          ) : (
            suggestions.map((s, i) => {
              const isAdded = addedIds.has(s.id);
              const chipTypeClass =
                s.reason === 'low-stock'
                  ? 'low-stock'
                  : s.reason === 'substitute'
                  ? 'substitute'
                  : 'seasonal';

              const icon =
                s.reason === 'low-stock'
                  ? 'ti-box'
                  : s.reason === 'substitute'
                  ? 'ti-arrows-exchange'
                  : 'ti-leaf';

              const prefix =
                s.reason === 'low-stock'
                  ? 'Running low:'
                  : s.reason === 'substitute'
                  ? 'Try:'
                  : 'In season:';

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSingleAdd(s)}
                  title={s.detail}
                  className={`suggestion-chip ${chipTypeClass} ${isAdded ? 'is-added' : ''} animate-chip-in`}
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                >
                  <i className={`ti ${isAdded ? 'ti-check' : icon} text-sm`} />
                  <span>
                    {isAdded ? 'Added!' : `${prefix} ${s.item}`}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* ── TAB 2: AI RECIPE DISCOVERY ── */}
      {activeTab === 'recipes' && (
        <div className="flex flex-col gap-2.5">
          {/* Sub-categories */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {RECIPE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveRecipeCategory(cat.id)}
                className={`text-[0.675rem] font-medium px-2.5 py-0.5 rounded-full border transition-all ${
                  activeRecipeCategory === cat.id
                    ? 'bg-emerald-500 text-white font-bold border-transparent shadow-sm shadow-emerald-500/25'
                    : 'glass text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10 hover:text-emerald-500'
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Recipe Dish Cards */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 suggestions-scroll">
            {featuredDishes
              .filter((d) => activeRecipeCategory === 'all' || d.category === activeRecipeCategory)
              .map((dish, i) => {
                const isAdded = addedIds.has(dish.id);
                return (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => handleRecipeAdd(dish)}
                    className={`flex flex-col items-start gap-1 p-2.5 min-w-[165px] rounded-2xl border transition-all text-left glass glass-hover ${
                      isAdded ? 'border-emerald-500/50 bg-emerald-500/10 scale-95' : 'border-white/10'
                    } animate-chip-in`}
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
                        <span className="text-base">{dish.emoji}</span>
                        <span>{dish.title}</span>
                      </div>
                      <span className={`text-[0.625rem] px-2 py-0.5 rounded-full font-semibold ${
                        isAdded ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {isAdded ? '✓ Added' : '+ Add'}
                      </span>
                    </div>
                    <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                      {dish.desc}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── TAB 3: SEASONAL RECOMMENDATIONS ── */}
      {activeTab === 'seasonal' && (
        <div className="flex gap-2 overflow-x-auto pb-1.5 -mx-1 px-1 suggestions-scroll">
          {seasonalItems.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleSingleAdd(s)}
              className="suggestion-chip seasonal animate-chip-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <i className="ti ti-leaf text-sm" />
              <span>In season: {s.item}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── TAB 4: SUBSTITUTES ── */}
      {activeTab === 'substitutes' && (
        <div className="flex gap-2 overflow-x-auto pb-1.5 -mx-1 px-1 suggestions-scroll">
          {substituteItems.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleSingleAdd(s)}
              className="suggestion-chip substitute animate-chip-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <i className="ti ti-arrows-exchange text-sm" />
              <span>Try: {s.item}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
