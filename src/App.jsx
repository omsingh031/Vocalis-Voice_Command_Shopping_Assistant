import { useCallback, useEffect, useRef, useState } from 'react';
import { createRecognizer, speak, stopRecognizer } from './lib/speech';
import { parseIntent, sanitizeItemName, extractDishName } from './lib/intentParser';
import { computeSuggestions } from './lib/suggestions';
import { categorize } from './lib/categories';
import { searchCatalog } from './lib/catalog';
import { SEED_HISTORY, SEED_ITEMS } from './lib/seedData';
import { checkInventoryGaps, checkItemInPantry, transferShoppingListToInventory, INITIAL_INVENTORY_SEED } from './lib/inventory';
import { getLocalRecipe } from './lib/recipes';
import Header from './components/Header';
import MicButton from './components/MicButton';
import ShoppingList from './components/ShoppingList';
import SuggestionsStrip from './components/SuggestionsStrip';
import SearchPanel from './components/SearchPanel';
import ToastContainer from './components/Toast';
import AIChatAssistant from './components/AIChatAssistant';
import InventoryView from './components/InventoryView';
import { useFirestore } from './hooks/useFirestore';
import { isFirebaseReady } from './lib/firebase';

// ── Persistence (localStorage) ──────────────────────────────
const STORAGE_KEYS = { items: 'vc-items', history: 'vc-history', inventory: 'vc-inventory', seeded: 'vc-seeded' };

function loadJSON(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const ERROR_MESSAGES = {
  'mic-denied': 'Microphone permission denied — use the text input instead.',
  'no-speech': "Didn't catch that — try again or type your command.",
  network: 'Connection issue — try again in a moment.',
  'parse-failed': "Couldn't understand that phrase — try rephrasing.",
};

let _nextId = Date.now();
function makeId() { return String(_nextId++); }

function normalizeItemKey(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/es$/i, '')
    .replace(/s$/i, '');
}

// ═══════════════════════════════════════════════════════════
//  APP — Fully Responsive (Mobile, Tablet & Laptop/Desktop)
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [errorReason, setErrorReason] = useState(null);
  const [lang, setLang] = useState('en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vc-theme') || 'dark';
  });

  const [items, setItems] = useState(() => loadJSON(STORAGE_KEYS.items));
  const [history, setHistory] = useState(() => loadJSON(STORAGE_KEYS.history));
  const [inventory, setInventory] = useState(() => loadJSON(STORAGE_KEYS.inventory, INITIAL_INVENTORY_SEED));

  const [activeRightTab, setActiveRightTab] = useState('shopping'); // 'shopping' | 'inventory'

  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  const {
    items: fsItems,
    history: fsHistory,
    inventory: fsInventory,
    isReady: fsReady,
    addOrUpdateItem,
    removeFirestoreItem,
    addHistoryEntry,
    moveItemsToInventory,
    clearAllItems: fsClearAllItems,
  } = useFirestore();

  useEffect(() => {
    if (isFirebaseReady && fsReady) {
      setItems(fsItems);
      setHistory(fsHistory);
      setInventory(fsInventory);
    }
  }, [fsItems, fsHistory, fsInventory, fsReady]);

  useEffect(() => {
    localStorage.setItem('vc-theme', theme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const recognizerRef = useRef(null);

  // ── Seed data on first visit ──────────────────────────────
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.seeded)) return;
    localStorage.setItem(STORAGE_KEYS.seeded, '1');

    const seededItems = SEED_ITEMS.map((item) => ({
      ...item,
      id: makeId(),
      status: 'confirmed',
      addedAt: Date.now(),
    }));
    setItems(seededItems);
    saveJSON(STORAGE_KEYS.items, seededItems);

    setHistory(SEED_HISTORY);
    saveJSON(STORAGE_KEYS.history, SEED_HISTORY);
  }, []);

  useEffect(() => { saveJSON(STORAGE_KEYS.items, items); }, [items]);
  useEffect(() => { saveJSON(STORAGE_KEYS.history, history); }, [history]);
  useEffect(() => { saveJSON(STORAGE_KEYS.inventory, inventory); }, [inventory]);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const suggestions = computeSuggestions(history, items);

  const addToast = useCallback((message, type = 'success') => {
    const id = makeId();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── CRUD ──────────────────────────────────────────────────
  function addItem(name, quantity = 1, unit = null) {
    const cleanName = sanitizeItemName(name) || (name || '').trim();
    if (!cleanName) return; // Prevent adding empty items
    
    const key = normalizeItemKey(cleanName);
    let isUpdated = false;
    let finalItem = null;

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => normalizeItemKey(i.name) === key
      );

      if (existingIdx !== -1) {
        isUpdated = true;
        const updated = [...prev];
        finalItem = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          unit: unit || updated[existingIdx].unit || null,
          status: 'confirmed',
        };
        updated[existingIdx] = finalItem;
        return updated;
      }

      finalItem = {
        id: makeId(),
        name: cleanName,
        category: categorize(name),
        quantity,
        unit: unit || null,
        status: 'confirmed',
        addedAt: Date.now(),
      };
      return [...prev, finalItem];
    });

    const historyEntry = { itemName: cleanName, action: 'add', timestamp: Date.now() };
    setHistory((prev) => [...prev, historyEntry]);

    if (isFirebaseReady) {
      setTimeout(() => {
        if (finalItem) addOrUpdateItem(finalItem);
        addHistoryEntry(historyEntry);
      }, 0);
    }

    const unitLabel = unit ? ` ${unit}` : '';
    addToast(
      `${isUpdated ? 'Updated' : 'Added'} ${cleanName}${quantity > 1 || unit ? ` ×${quantity}${unitLabel}` : ''}`,
      'success'
    );

    // Check if item is already in Home Pantry
    const pantryMatch = checkItemInPantry(name, inventory);
    if (pantryMatch) {
      addToast(
        `🏡 Pantry Note: ${pantryMatch.name} is already at home (${pantryMatch.quantity}${pantryMatch.unit ? ' ' + pantryMatch.unit : ''})`,
        'info'
      );
    }
  }

  function removeItem(itemId) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    setItems((prev) => prev.filter((i) => i.id !== itemId));
    
    const historyEntry = { itemName: item.name.toLowerCase(), action: 'remove', timestamp: Date.now() };
    setHistory((prev) => [...prev, historyEntry]);

    if (isFirebaseReady) {
      removeFirestoreItem(itemId);
      addHistoryEntry(historyEntry);
    }

    addToast(`Removed ${item.name}`, 'remove');
  }

  function clearAllItems() {
    if (items.length === 0) return;
    
    if (isFirebaseReady) {
      fsClearAllItems(items);
    }
    
    setItems([]);
    addToast('Shopping list cleared', 'info');
  }

  /**
   * Update quantity/unit of an existing item by name.
   */
  function updateItem(itemName, newQuantity, newUnit = null) {
    const key = normalizeItemKey(itemName);
    let matched = null;

    setItems((prev) => {
      const idx = prev.findIndex((i) => {
        const iKey = normalizeItemKey(i.name);
        return iKey === key || iKey.includes(key) || key.includes(iKey);
      });
      if (idx === -1) return prev;

      const updated = [...prev];
      matched = { ...updated[idx] };
      updated[idx] = {
        ...matched,
        quantity: newQuantity,
        unit: newUnit || matched.unit,
      };
      matched = updated[idx];
      return updated;
    });

    if (matched) {
      if (isFirebaseReady) {
        setTimeout(() => addOrUpdateItem(matched), 0);
      }
      const unitLabel = matched.unit ? ` ${matched.unit}` : '';
      addToast(`Updated ${matched.name} to ${newQuantity}${unitLabel}`, 'success');
    } else {
      addToast(`"${itemName}" not found on your list`, 'info');
    }

    return matched;
  }

  /**
   * Confirm Shopping List & Move all items to Home Pantry
   */
  function handleConfirmPurchaseAndMoveToPantry() {
    if (items.length === 0) return;

    const count = items.length;
    let newInventory = [];
    setInventory((prevInv) => {
      newInventory = transferShoppingListToInventory(items, prevInv);
      return newInventory;
    });
    
    if (isFirebaseReady) {
      setTimeout(() => {
        moveItemsToInventory(items, newInventory);
      }, 0);
    }

    setItems([]);

    addToast(`🎉 Purchase confirmed! Moved ${count} item${count !== 1 ? 's' : ''} to Home Pantry 🏡`, 'success');
    speak(
      lang === 'hi'
        ? `खरीदारी की पुष्टि की गई और सामग्री होम पेंट्री में स्थानांतरित कर दी गई।`
        : `Shopping confirmed! Moved ${count} items to your home pantry!`,
      lang
    );
  }

  /**
   * Smart AI Recipe Processor — compares recipe ingredients against Pantry Inventory!
   * Skips items already in stock at home and adds ONLY missing items to Shopping List.
   */
  function processRecipeWithInventory(dishTitle, ingredients) {
    if (!ingredients || ingredients.length === 0) return;

    const cleanDish = (dishTitle || '')
      .toLowerCase()
      .replace(/^i want to make\s+|^i want to cook\s+|^i want to eat\s+|^i want to have\s+|^to make\s+|^to cook\s+|^to eat\s+|^to have\s+|^for making\s+|^make\s+|^cook\s+|^eat\s+|^have\s+/gi, '')
      .trim();

    let addedCount = 0;

    ingredients.forEach((ing) => {
      const ingName = ing.name || ing.item;
      if (!ingName) return;

      const normIng = ingName.toLowerCase().trim();
      // NEVER add the high-level dish command itself as a grocery item!
      if (cleanDish && (normIng === cleanDish || normIng === `i want to cook ${cleanDish}` || normIng === `i want to make ${cleanDish}` || normIng === `i want to eat ${cleanDish}`)) {
        return;
      }

      addItem(ingName, ing.quantity ?? 1, ing.unit ?? null);
      addedCount++;
    });

    if (addedCount > 0) {
      addToast(
        `🍳 Added all ${addedCount} ingredients for ${dishTitle} to your shopping list!`,
        'success'
      );

      speak(
        lang === 'hi'
          ? `${dishTitle} के लिए ${addedCount} सामग्री आपकी खरीदारी सूची में जोड़ी गई!`
          : `Added all ${addedCount} ingredients for ${dishTitle} to your shopping list!`,
        lang
      );
    }
  }

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [clarifyingDish, setClarifyingDish] = useState(null);
  const [clarifyData, setClarifyData] = useState(null);
  const [recipeOptions, setRecipeOptions] = useState([]);
  const [initialReviewedRecipe, setInitialReviewedRecipe] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // ── Intent handling ───────────────────────────────────────
  async function handleUtterance(text) {
    setStatus('processing');
    setTranscript(text);
    setErrorReason(null); // Clear previous error reasons!

    try {
      const intent = await parseIntent(text, { inventory, currentItems: items, history });

      if (intent.action === 'interactive_consultation') {
        // Direct Add Flow: AI found ingredients for a dish — add missing ones straight to shopping list!
        const dishTitle = intent.title || 'Recipe';
        const ingredients = (intent.shortcomings || []).map((ing) => ({
          name: ing.name,
          quantity: ing.quantity ?? 1,
          unit: ing.unit ?? null,
          category: ing.category || 'pantry',
        }));

        if (ingredients.length > 0) {
          processRecipeWithInventory(dishTitle, ingredients);
        } else {
          // All ingredients already in pantry
          const pantryNames = (intent.pantryFound || []).map((p) => p.name || p).join(', ');
          addToast(`🏡 All ingredients for ${dishTitle} are already in your pantry!`, 'info');
          speak(
            lang === 'hi'
              ? `${dishTitle} के लिए सारी सामग्री आपके पास पहले से है!`
              : `Great news! All ingredients for ${dishTitle} are already in your pantry${pantryNames ? `: ${pantryNames}` : ''}!`,
            lang
          );
        }
      } else if (intent.action === 'clarify_dish_with_ingredients') {
        setConsultationData(null);
        setRecipeOptions([]);
        setClarifyData(null);
        setClarifyingDish(intent.dish);
        setInitialReviewedRecipe({
          dishTitle: intent.dish,
          ingredients: intent.ingredients || [],
        });
        setAssistantOpen(true);
        speak(
          lang === 'hi'
            ? `${intent.dish} के लिए सामग्री तैयार की गई है। कृपया समीक्षा करें।`
            : `Refined recipe ingredients for ${intent.dish}! Please review and confirm.`,
          lang
        );
      } else if (intent.action === 'recommend_recipes') {
        setConsultationData(null);
        setInitialReviewedRecipe(null);
        setRecipeOptions(intent.recipeOptions || []);
        setClarifyData({ question: intent.question });
        setClarifyingDish(null);
        setAssistantOpen(true);
        speak(intent.question || 'Here are a few tasty dishes you can make! Which one sounds good?', lang);
      } else if (intent.action === 'clarify') {
        setConsultationData(null);
        setInitialReviewedRecipe(null);
        setRecipeOptions([]);
        setClarifyData({
          phrase: intent.phrase || text,
          question: intent.question || `I heard "${text}". Did you mean to add an item or cook a recipe?`,
          suggestions: intent.suggestions || ['Add Item', 'Cook Recipe'],
        });
        setClarifyingDish(null);
        setAssistantOpen(true);
        speak(intent.question || `I heard "${text}". What would you like to do?`, lang);
      } else if (intent.action === 'clarify_dish') {
        setInitialReviewedRecipe(null);
        setRecipeOptions([]);
        setClarifyData(null);
        setClarifyingDish(intent.dish);
        setAssistantOpen(true);
        const confirmText =
          lang === 'hi'
            ? `${intent.dish} बनाने के लिए क्या सामग्री चाहिए?`
            : `I'd love to help you prepare ${intent.dish}! What ingredients do you need?`;
        speak(confirmText, lang);
      } else if (intent.action === 'recipe' && intent.ingredients?.length > 0) {
        processRecipeWithInventory(intent.dish || 'recipe', intent.ingredients);
      } else if (intent.action === 'add_multiple') {
        const addedNames = [];
        (intent.items || []).forEach((it) => {
          const itemName = it.item || it.name;
          if (itemName) {
            addItem(itemName, it.quantity ?? 1, it.unit ?? null);
            addedNames.push(itemName);
          }
        });
        const confirmText =
          lang === 'hi'
            ? `${addedNames.length} वस्तुएं जोड़ी गईं: ${addedNames.join(', ')}`
            : `Added ${addedNames.length} items: ${addedNames.join(', ')}!`;
        speak(confirmText, lang);
      } else if (intent.action === 'add') {
        addItem(intent.item, intent.quantity ?? 1, intent.unit ?? null);
        const unitLabel = intent.unit ? ` ${intent.unit}` : '';
        const confirmText =
          lang === 'hi'
            ? `${intent.item} जोड़ा गया।`
            : `Added ${intent.item}${intent.quantity > 1 ? ` times ${intent.quantity}${unitLabel}` : ''}.`;
        speak(confirmText, lang);
      } else if (intent.action === 'remove') {
        const match = items.find((i) =>
          i.name.toLowerCase().includes(intent.item.toLowerCase())
        );
        if (match) {
          removeItem(match.id);
          const confirmText = lang === 'hi' ? `${match.name} हटा दिया गया।` : `Removed ${match.name}.`;
          speak(confirmText, lang);
        } else {
          addToast(`"${intent.item}" not found on your list`, 'info');
          const confirmText = lang === 'hi' ? `${intent.item} आपकी सूची में नहीं है।` : `${intent.item} is not on your list.`;
          speak(confirmText, lang);
        }
      } else if (intent.action === 'search') {
        const results = searchCatalog(intent.item, intent.maxPrice);
        setSearchResults(results);
        setSearchQuery(intent.item);
        const confirmText =
          lang === 'hi'
            ? `${results.length} परिणाम मिले।`
            : results.length > 0
            ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for ${intent.item}.`
            : `No products found for ${intent.item}.`;
        speak(confirmText, lang);
      } else if (intent.action === 'update') {
        const matched = updateItem(intent.item, intent.quantity ?? 1, intent.unit ?? null);
        const unitLabel = intent.unit ? ` ${intent.unit}` : '';
        if (matched) {
          const confirmText =
            lang === 'hi'
              ? `${matched.name} की मात्रा ${intent.quantity}${unitLabel} हो गई।`
              : `Updated ${matched.name} to ${intent.quantity}${unitLabel}.`;
          speak(confirmText, lang);
        } else {
          const confirmText =
            lang === 'hi'
              ? `${intent.item} आपकी सूची में नहीं है।`
              : `${intent.item} is not on your list.`;
          speak(confirmText, lang);
        }
      } else if (intent.action === 'recipe_error') {
        addToast(`Could not generate ingredients for "${intent.dish}". Please check your AI API key or internet connection.`, 'info');
        speak(
          lang === 'hi'
            ? `${intent.dish} के लिए सामग्री नहीं मिल सकी।`
            : `Sorry, I couldn't fetch ingredients for ${intent.dish} right now.`,
          lang
        );
      } else if (intent.action === 'clear_all') {
        const count = items.length;
        clearAllItems();
        const confirmText =
          lang === 'hi'
            ? `${count} आइटम हटा दिए गए। सूची खाली है।`
            : count > 0
            ? `Cleared all ${count} items from your shopping list.`
            : `Your shopping list is already empty.`;
        speak(confirmText, lang);
      }
    } catch (err) {
      console.error('[App] handleUtterance failed:', err);
      const dish = extractDishName(text);
      if (dish) {
        addItem(dish, 1, null);
      } else {
        const fallbackItem = sanitizeItemName(text);
        if (fallbackItem) {
          addItem(fallbackItem, 1, null);
        } else {
          addToast('Could not understand command. Try saying "add milk" or "cook pasta".', 'info');
        }
      }
      setStatus('idle');
      setErrorReason(null);
      setTranscript('');
      return;
    }

    setStatus('idle');
    setTranscript('');
  }

  // ── Voice recognition ─────────────────────────────────────
  function startListening() {
    stopRecognizer(recognizerRef.current);

    setErrorReason(null);
    setStatus('listening');
    setTranscript('');

    recognizerRef.current = createRecognizer({
      lang,
      onResult: ({ transcript: t, isFinal }) => {
        setTranscript(t);
        if (isFinal) handleUtterance(t);
      },
      onError: (reason) => {
        setStatus('error');
        setErrorReason(reason);
        setTimeout(() => setStatus('idle'), 3000);
      },
      onEnd: () => {
        setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
      },
    });

    recognizerRef.current?.start();
  }

  function handleSearchAdd(name, qty) {
    addItem(name, qty);
    speak(`Added ${name} from search results.`, lang);
  }

  // ── Render Responsive App ─────────────────────────────────
  return (
    <div className="min-h-screen w-full flex flex-col justify-between px-4 py-4 md:px-8 md:py-8">
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
        {/* Main Grid Layout — Single Column on Mobile, Two Columns on Laptop/Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ── LEFT COLUMN: Header, Mic Controls, Suggestions & Voice Input (lg:col-span-5) ── */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
            <div className="glass-strong rounded-3xl p-5 md:p-6 flex flex-col gap-5 border border-white/10 shadow-2xl">
              {/* Header */}
              <Header
                lang={lang}
                onLangChange={setLang}
                itemCount={items.length}
                isOnline={isOnline}
                theme={theme}
                onToggleTheme={toggleTheme}
                onOpenAssistant={() => setAssistantOpen(true)}
              />

              {/* Smart Suggestions Hub */}
              <SuggestionsStrip
                suggestions={suggestions}
                onAdd={(item, qty) => {
                  addItem(item, qty);
                  speak(`Added ${item}.`, lang);
                }}
                onAddRecipe={(dishTitle, ingredients) => {
                  processRecipeWithInventory(dishTitle, ingredients);
                }}
              />

              {/* Voice / Text input zone */}
              <div className="flex flex-col items-center justify-center gap-4 py-2">
                {/* Live transcript */}
                {transcript && (
                  <p className="text-center text-slate-300 italic text-sm animate-fade-in min-h-[1.5em] px-4 py-1.5 rounded-xl glass">
                    <i className="ti ti-quote text-emerald-400 mr-1.5" />
                    "{transcript}"
                  </p>
                )}

                {/* Error message */}
                {status === 'error' && errorReason && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-rose-400 animate-fade-in">
                    <i className="ti ti-alert-circle text-sm" />
                    {ERROR_MESSAGES[errorReason] || 'Something went wrong.'}
                  </div>
                )}

                <MicButton
                  status={status}
                  onStartListening={startListening}
                  onTextSubmit={handleUtterance}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Shopping List vs Home Pantry Inventory Tabs (lg:col-span-7) ── */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="glass-strong rounded-3xl p-5 md:p-6 flex flex-col gap-5 border border-white/10 shadow-2xl min-h-[500px]">
              
              {/* Tab Selector Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 px-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveRightTab('shopping')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all ${
                      activeRightTab === 'shopping'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'glass text-slate-600 dark:text-slate-300 hover:text-emerald-500'
                    }`}
                  >
                    <i className="ti ti-shopping-cart text-sm" />
                    Shopping List ({items.length})
                  </button>

                  <button
                    onClick={() => setActiveRightTab('inventory')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all ${
                      activeRightTab === 'inventory'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'glass text-slate-600 dark:text-slate-300 hover:text-emerald-500'
                    }`}
                  >
                    <i className="ti ti-home-check text-sm" />
                    Home Pantry ({inventory.length})
                  </button>
                </div>

                {activeRightTab === 'shopping' && items.length > 0 && (
                  <button
                    onClick={clearAllItems}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass hover:bg-rose-500/10"
                    title="Clear entire list"
                  >
                    <i className="ti ti-trash text-xs" /> Clear All
                  </button>
                )}
              </div>

              {/* View Content */}
              {activeRightTab === 'shopping' ? (
                <div className="flex flex-col flex-1 justify-between gap-4">
                  <ShoppingList items={items} onRemove={removeItem} />

                  {items.length > 0 && (
                    <div className="pt-3 border-t border-white/10 mt-auto">
                      <button
                        onClick={handleConfirmPurchaseAndMoveToPantry}
                        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <i className="ti ti-check-double text-lg" />
                        Confirm Shopping & Move {items.length} Item{items.length !== 1 ? 's' : ''} to Home Pantry 🏡
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <InventoryView
                  inventory={inventory}
                  onUpdateItem={(id, updates) => {
                    setInventory((prev) =>
                      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
                    );
                  }}
                  onDeleteItem={(id) => {
                    setInventory((prev) => prev.filter((item) => item.id !== id));
                    addToast('Removed item from Pantry', 'remove');
                  }}
                  onAddItem={(name) => {
                    const newItem = {
                      id: makeId(),
                      name: name.charAt(0).toUpperCase() + name.slice(1),
                      category: categorize(name),
                      quantity: 1,
                      unit: null,
                      inStock: true,
                      addedAt: Date.now(),
                    };
                    setInventory((prev) => [newItem, ...prev]);
                    addToast(`Added ${newItem.name} to Home Pantry 🏡`, 'success');
                  }}
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Search panel overlay */}
      {searchResults !== null && (
        <SearchPanel
          results={searchResults}
          query={searchQuery}
          onAdd={handleSearchAdd}
          onClose={() => {
            setSearchResults(null);
            setSearchQuery('');
          }}
        />
      )}

      {/* Interactive AI Chat Assistant */}
      <AIChatAssistant
        dishName={clarifyingDish}
        clarifyData={clarifyData}
        recipeOptions={recipeOptions}
        initialReviewedRecipe={initialReviewedRecipe}
        consultationData={consultationData}
        inventory={inventory}
        lang={lang}
        isOpen={assistantOpen}
        onClose={() => {
          setAssistantOpen(false);
          setClarifyingDish(null);
          setClarifyData(null);
          setRecipeOptions([]);
          setInitialReviewedRecipe(null);
          setConsultationData(null);
        }}
        onAddSelectedIngredients={(dishTitle, selectedIngredients) => {
          processRecipeWithInventory(dishTitle, selectedIngredients);
          setAssistantOpen(false);
          setClarifyingDish(null);
          setClarifyData(null);
          setRecipeOptions([]);
          setInitialReviewedRecipe(null);
          setConsultationData(null);
        }}
        onSelectRecipeOption={(dishId, dishTitle) => {
          const ingredients = getLocalRecipe(dishId);
          if (ingredients && ingredients.length > 0) {
            processRecipeWithInventory(dishTitle, ingredients);
          }
          setAssistantOpen(false);
          setClarifyingDish(null);
          setClarifyData(null);
          setRecipeOptions([]);
        }}
        onAddSingleItem={(item) => {
          addItem(item, 1);
          speak(`Added ${item} to your shopping list!`, lang);
          setAssistantOpen(false);
          setClarifyData(null);
          setRecipeOptions([]);
        }}

        onAutoGenerateAI={async (dish) => {
          setIsAIGenerating(true);
          try {
            const intent = await parseIntent(`I want to cook ${dish}`);
            if (intent.ingredients?.length > 0) {
              processRecipeWithInventory(dish, intent.ingredients);
              setAssistantOpen(false);
              setClarifyingDish(null);
              setClarifyData(null);
              setRecipeOptions([]);
            }
          } catch (err) {
            console.error('AI Auto-generate failed', err);
          }
          setIsAIGenerating(false);
        }}
        isProcessing={isAIGenerating}
      />

      {/* Floating AI Companion FAB Button */}
      <button
        type="button"
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 text-white font-extrabold text-xs shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20"
        title="Open AI Personal Voice & Chat Kitchen Companion"
      >
        <i className="ti ti-sparkles text-lg animate-pulse" />
        <span>Ask AI Helper 👩‍🍳</span>
      </button>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
