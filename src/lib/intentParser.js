/**
 * 100% LLM-First Voice Intent Pipeline & Zero-Friction Direct Add Engine:
 *
 * Direct Item Add Execution:
 *   - "Add milk." / "milk" / "buy 2 kg apples" -> Returns action: "add", item: "Milk", quantity: 1.
 *     App directly adds Milk to the shopping list with zero friction & zero error!
 *
 * Cooking & Recipe Review:
 *   - "I want to make maggi" / "cook pasta" -> Returns action: "interactive_consultation", dishTitle: "Maggi Instant Noodles",
 *     cross-references Home Pantry, and opens interactive drawer for ingredient review!
 */

import { functions, isFirebaseReady } from './firebase.js';
import { getLocalRecipe, getAllKnowledgeBaseDishes } from './recipes.js';

export function cleanPunctuation(str) {
  if (!str) return '';
  return str
    .replace(/[।\.!\?,"'"`]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .trim();
}

/**
 * Robust Post-Processing Sanitizer to guarantee action verbs & conversational phrases are stripped from item names.
 */
export function sanitizeItemName(rawName) {
  if (!rawName) return null;
  let str = cleanPunctuation(rawName.trim());

// Conversational phrases are NOT product items!
  if (/\b(?:sleepy|lazy|tired|feeling|what|how|do|should|make|cook|recipe|suggest|hungry)\b/i.test(str) && str.split(/\s+/).length > 2) {
    return null;
  }

  // Strip action command prefixes
  str = str.replace(/^(?:please\s+)?(?:add|buy|get|bring|grab|pick\s+up|need|i\s+want\s+to\s+eat|i\s+want\s+to\s+have|i\s+want\s+to\s+cook|i\s+want\s+to\s+make|i\s+want|i\s+need|to\s+eat|to\s+have|can\s+you\s+add|आई\s+वॉन्ट|आई\s+नीड|मुझे\s+चाहिए|मुझे|ला\s+दो|लाओ|ले\s+आओ|खरीदना\s+है|खरीद\s+लो|डाल\s+दो|ऐड\s+करें|ऐड\s+करो)\s+/gi, '');

  // Strip leading quantities & units from item name (e.g. "2 kg apples" -> "apples")
  // Only match numbers (\d+) or common number words, not \w+ which strips everything!
  str = str.replace(/^(?:\d+|one|two|three|four|five|half|a|an)\s*(?:glass|glasses|cup|cups|kg|kgs|kilo|kilograms|g|gram|grams|liter|liters|litre|litres|bottle|bottles|pack|packs|packet|packets|box|boxes|किलो|ग्राम|लीटर|बोतल|पैकेट|डिब्बा)?\s*(?:of|की|के|का)?\s*/gi, '');

  str = str.trim();
  if (!str) return null;

  // Capitalize nicely
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const SYSTEM_PROMPT = `You are Vocalis AI — an expert AI Culinary Companion & Grocery Intent Parser.

CRITICAL PRODUCT NAME & COMMAND RULES:

54: 1. SINGLE & MULTI ITEM ADD COMMANDS:
55:    - For single item ("add milk", "buy 2 kg apples"):
56:      { "action": "add", "item": "Milk", "quantity": 1, "unit": null, "category": "dairy" }
57:    - For multiple items ("add milk, eggs, and bread", "buy 2 kg apples and 1 liter milk"):
58:      {
59:        "action": "add_multiple",
60:        "items": [
61:          { "item": "Milk", "quantity": 1, "unit": null, "category": "dairy" },
62:          { "item": "Eggs", "quantity": 1, "unit": null, "category": "protein" },
63:          { "item": "Bread", "quantity": 1, "unit": "pack", "category": "bakery" }
64:        ]
65:      }

2. MULTI-INGREDIENT DISH & COOKING REQUESTS ("I want to make maggi", "mujhe kheer banana hai", "cook pasta", "recipe for pizza", "I want to cook rasgulla"):
   - Extract the clean dish title and ALL 4 to 6 required grocery ingredients needed to cook this dish.
   - Put ALL 4-6 ingredients into the "shortcomings" array so every required ingredient is added!
   - Example output for "cook pasta":
     {
       "action": "interactive_consultation",
       "title": "Italian Penne Pasta",
       "aiAnalysis": "Here are all the ingredients required for Italian Penne Pasta!",
       "pantryFound": [],
       "shortcomings": [
         { "name": "Penne Pasta", "category": "pantry", "quantity": 1, "unit": "pack", "status": "confirmed" },
         { "name": "Fresh Tomatoes", "category": "produce", "quantity": 4, "unit": null, "status": "confirmed" },
         { "name": "Olive Oil", "category": "pantry", "quantity": 1, "unit": "bottle", "status": "confirmed" },
         { "name": "Cheese", "category": "dairy", "quantity": 1, "unit": "block", "status": "confirmed" },
         { "name": "Garlic", "category": "produce", "quantity": 1, "unit": "head", "status": "confirmed" }
       ]
     }

3. CONVERSATIONAL / MOOD REQUESTS ("am feeling sleepy what should I do", "feeling lazy", "something sweet", "feeling hungry"):
   Return: { "action": "recommend_recipes", "title": string, "aiAnalysis": string, "question": string }

4. REMOVE COMMANDS ("remove milk", "delete apples", "hatao milk", "nikal do apples"):
   Return: { "action": "remove", "item": string (Clean Noun!) }

5. UPDATE / CHANGE QUANTITY COMMANDS ("update milk to 3", "change apples to 5 kg", "set bread quantity to 2", "make milk 4 liters"):
   Return: { "action": "update", "item": string (Clean Noun!), "quantity": number, "unit": string | null }

6. CLEAR ALL COMMANDS ("clear all", "remove everything", "empty my list", "delete all items"):
   Return: { "action": "clear_all" }

7. SEARCH COMMANDS ("find olive oil under $10"):
   Return: { "action": "search", "item": string (Clean Noun!), "maxPrice": number | null }

IMPORTANT: Return ONLY valid JSON. No markdown fences, no text outside JSON.`;

let parseIntentFn = null;

async function getCallable() {
  if (parseIntentFn) return parseIntentFn;
  if (!isFirebaseReady || !functions) return null;
  const { httpsCallable } = await import('firebase/functions');
  parseIntentFn = httpsCallable(functions, 'parseIntent');
  return parseIntentFn;
}

/**
 * Direct LLM Query Engine via Groq API with Inventory Context
 */
async function parseWithGroqLLM(transcript, context = {}) {
  const apiKey = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GROQ_API_KEY) ||
                 (typeof process !== 'undefined' && process?.env?.VITE_GROQ_API_KEY) ||
                 (typeof window !== 'undefined' && window.GROQ_API_KEY);
  if (!apiKey) return null;

  const inventoryList = (context.inventory || []).map((i) => `${i.name}${i.quantity ? ` (${i.quantity}${i.unit || ''})` : ''}`);
  const cartList = (context.currentItems || []).map((i) => i.name);

  const userPrompt = `
User Voice Transcript: "${transcript}"

Current User Context:
- Home Pantry Inventory (Already at home): [${inventoryList.join(', ')}]
- Current Shopping Cart: [${cartList.join(', ')}]
`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn('[intentParser] Groq API returned', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    let text = data.choices?.[0]?.message?.content?.trim();
    if (text) {
      // Strip <think>...</think> tags from reasoning models
      text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const cleanedText = text.replace(/^```json\s*|\s*```$/g, '');
      const parsed = JSON.parse(cleanedText);
      if (parsed.action) {
        if (parsed.shortcomings) {
          parsed.shortcomings = parsed.shortcomings
            .map((item) => ({ ...item, name: sanitizeItemName(item.name) || item.name }))
            .filter((item) => item.name !== null);
        }
        if (parsed.item) {
          parsed.item = sanitizeItemName(parsed.item) || parsed.item;
        }
        return parsed;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('[intentParser] Groq API call timed out after 12s');
    } else {
      console.warn('[intentParser] Groq direct LLM call failed:', err.message);
    }
  }
  return null;
}

/**
 * Multi-Turn Conversational Voice Chat Loop — Groq LLM API
 */
export async function converseWithGroqLLM(userMessage, chatHistory = [], context = {}) {
  const apiKey = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GROQ_API_KEY) ||
                 (typeof process !== 'undefined' && process?.env?.VITE_GROQ_API_KEY) ||
                 (typeof window !== 'undefined' && window.GROQ_API_KEY);
  if (!apiKey) return null;

  const inventoryList = (context.inventory || []).map((i) => i.name).join(', ');

  const systemMessage = {
    role: 'system',
    content: `You are Vocalis AI — a warm, intelligent voice culinary companion.

CRITICAL PRODUCT NAME & CONFIRMATION RULES:
1. The "name" property of any ingredient or item MUST BE ONLY THE CLEAN NOUN OF THE PRODUCT (e.g. "Milk", "Apples", "Water", "Maggi Noodles Pack").
2. NEVER INCLUDE ACTION VERBS LIKE "Add", "Buy", "Get" IN PRODUCT NAMES!

USER CONTEXT:
- Home Pantry Inventory (Already stocked at home): [${inventoryList || 'None'}]

YOUR OBJECTIVES:
1. If the user asks to add a single item ("add milk", "grocery item", "add it", "milk"):
   - Return action: "review_ingredients", dishTitle: "Milk", aiSpeech: "Great! I selected Milk for your shopping cart.", shortcomings: [{"name": "Milk", "category": "dairy", "quantity": 1, "unit": null, "status": "confirmed"}].
2. If the user asks for dish suggestions ("am feeling sleepy what should I do", "feeling lazy"):
   - Dynamically suggest 3-4 creative dishes tailored to their mood.
   - Return action: "suggest_dishes", aiSpeech (spoken text), and dishOptions array: [{"title": string, "emoji": string, "desc": string}].
3. If the user chooses a dish ("I want maggi", "kheer", "cook pasta", "make biryani", "tacos"):
   - Extract ALL 4 to 6 required clean grocery ingredients needed to cook that dish.
   - Return ALL 4-6 ingredients in the "shortcomings" array so every required ingredient is added to the shopping list!
   - DO NOT skip any required ingredients!
   - DO NOT include the dish name itself as an ingredient.
   - Return action: "review_ingredients", dishTitle, aiSpeech, shortcomings.

OUTPUT SCHEMA (STRICT JSON ONLY):
{
  "action": "suggest_dishes" | "review_ingredients" | "chat_response",
  "aiSpeech": string,
  "dishTitle": string | null,
  "dishOptions": [ {"title": string, "emoji": string, "desc": string} ] | null,
  "pantryFound": [ {"name": string} ],
  "shortcomings": [ {"name": string, "category": string, "quantity": number, "unit": string | null, "status": "confirmed"} ]
}`
  };

  const formattedHistory = chatHistory.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));

  const messages = [
    systemMessage,
    ...formattedHistory,
    { role: 'user', content: userMessage },
  ];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages,
        temperature: 0.2,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn('[intentParser] Groq conversation API returned', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    let text = data.choices?.[0]?.message?.content?.trim();
    if (text) {
      // Strip <think>...</think> tags from reasoning models
      text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const cleanedText = text.replace(/^```json\s*|\s*```$/g, '');
      const parsed = JSON.parse(cleanedText);
      if (parsed.shortcomings) {
        parsed.shortcomings = parsed.shortcomings
          .map((item) => ({ ...item, name: sanitizeItemName(item.name) || item.name }))
          .filter((item) => item.name !== null);
      }
      return parsed;
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('[intentParser] Groq conversation API timed out after 15s');
    } else {
      console.warn('[intentParser] converseWithGroqLLM failed:', err.message);
    }
  }
  return null;
}

/**
 * Fast Remove Extractor — handles "remove milk", "delete apples", "hatao bread"
 */
function fastExtractRemove(transcript) {
  const lower = transcript.toLowerCase().trim();
  const removeMatch = lower.match(/^(?:remove|delete|hatao|nikal\s*do|हटाओ|निकाल\s*दो)\s+(.+)$/i);
  if (removeMatch) {
    const itemName = sanitizeItemName(removeMatch[1]) || removeMatch[1].trim();
    if (itemName) {
      return { action: 'remove', item: itemName };
    }
  }
  return null;
}

/**
 * Fast Update Extractor — handles "update milk to 3", "change apples to 5 kg", "set bread quantity to 2"
 */
function fastExtractUpdate(transcript) {
  const lower = transcript.toLowerCase().trim();
  // Patterns: "update X to N [unit]", "change X to N [unit]", "set X quantity to N", "make X N [unit]"
  const updateMatch = lower.match(
    /^(?:update|change|set|modify|make)\s+(.+?)\s+(?:quantity\s+)?(?:to|=)\s+(\d+)\s*(kg|kgs|g|gram|grams|liter|liters|l|pack|packs|bottle|bottles|box|boxes)?\s*$/i
  );
  if (updateMatch) {
    const itemName = sanitizeItemName(updateMatch[1]) || updateMatch[1].trim();
    const qty = parseInt(updateMatch[2], 10) || 1;
    const unit = updateMatch[3] ? updateMatch[3].toLowerCase() : null;
    if (itemName) {
      return { action: 'update', item: itemName, quantity: qty, unit };
    }
  }
  return null;
}

/**
 * Fast Clear All Extractor — handles "clear all", "remove everything", "empty my list"
 */
function fastExtractClearAll(transcript) {
  const lower = transcript.toLowerCase().trim();
  if (/^(?:clear\s+all|remove\s+everything|empty\s+(?:my\s+)?list|delete\s+all(?:\s+items)?|sab\s+hatao|सब\s+हटाओ)$/i.test(lower)) {
    return { action: 'clear_all' };
  }
  return null;
}

/**
 * Fast Single Item Extractor (Zero Drawer Friction!)
 */
function fastExtractSingleItem(transcript) {
  const cleaned = cleanPunctuation(transcript.trim());
  const words = cleaned.split(/\s+/);
  const lower = cleaned.toLowerCase();

  // Exclude recipe triggers or conversational phrases
  if (/make|cook|eat|have|recipe|banana hai|khana hai|पकाना|बनाना|खाना|tasty|sweet|hungry|sleepy|lazy|tired|feeling|suggest|party/i.test(lower)) {
    return null;
  }

  // 1-4 word simple add commands ("add milk", "add milk.", "buy 2 kg apples", "water", "coffee", "add bread")
  if (words.length <= 4) {
    const cleanItem = sanitizeItemName(cleaned);
    if (cleanItem) {
      let qty = 1;
      let unit = null;
      const numMatch = cleaned.match(/(\d+)\s*(kg|g|liter|liters|l|pack|bottle|box)?/i);
      if (numMatch) {
        qty = parseInt(numMatch[1], 10) || 1;
        if (numMatch[2]) unit = numMatch[2].toLowerCase();
      }
      return {
        action: 'add',
        item: cleanItem,
        quantity: qty,
        unit: unit,
      };
    }
  }
  return null;
}

/**
 * Extract clean dish name from a cooking phrase (e.g. "I want to cook pasta" -> "Pasta")
 */
export function extractDishName(transcript) {
  if (!transcript) return null;
  let str = cleanPunctuation(transcript.trim());

  // Must match a cooking trigger
  if (!/make|cook|eat|have|recipe|prepare|bake|banana\s+hai|khana\s+hai|पकाना|बनाना|खाना/i.test(str)) {
    return null;
  }

  // Strip prefix verbs & phrases
  str = str.replace(/^(?:please\s+)?(?:i\s+want\s+to\s+|i'd\s+like\s+to\s+|can\s+you\s+|let's\s+)?(?:cook|make|eat|have|prepare|bake)\s+/gi, '');
  str = str.replace(/^(?:recipe\s+for|ingredients\s+for|how\s+to\s+make|how\s+to\s+cook|how\s+to\s+make)\s+/gi, '');
  str = str.replace(/\s+(?:recipe|dish|banana\s+hai|khana\s+hai|पकाना\s+है|बनाना\s+है|खाना\s+है)$/gi, '');
  str = str.trim();

  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Fast Multi-Item Extractor (e.g. "add milk, eggs, and bread" -> 3 separate items)
 */
function fastExtractMultipleItems(transcript) {
  // Strip emojis & end punctuation but preserve commas for multi-item splitting!
  const cleaned = transcript.replace(/[।\.!\?"'"`]/g, '').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  const lower = cleaned.toLowerCase();

  // Exclude recipe triggers or conversational phrases
  if (/make|cook|eat|have|recipe|banana hai|khana hai|पकाना|बनाना|खाना|tasty|sweet|hungry|sleepy|lazy|tired|feeling|suggest|party/i.test(lower)) {
    return null;
  }

  // Check if transcript contains separators like commas, "and", "aur", "और"
  if (!/,|\band\b|\baur\b|\bऔर\b/i.test(cleaned)) {
    return null;
  }

  // Preserve known compound names
  let processed = cleaned
    .replace(/\bmac\s+and\s+cheese\b/gi, 'Mac_And_Cheese')
    .replace(/\bfish\s+and\s+chips\b/gi, 'Fish_And_Chips');

  const rawParts = processed.split(/(?:,|\s+\band\b\s+|\s+\baur\b\s+|\s+\bऔर\b\s+|\+)/gi);
  const extractedItems = [];

  for (let part of rawParts) {
    let cleanPart = part.replace(/_/g, ' ').replace(/^\s*and\s+/gi, '').trim();
    if (!cleanPart) continue;

    const cleanItem = sanitizeItemName(cleanPart);
    if (cleanItem) {
      let qty = 1;
      let unit = null;
      const numMatch = cleanPart.match(/(\d+)\s*(kg|g|liter|liters|l|pack|bottle|box)?/i);
      if (numMatch) {
        qty = parseInt(numMatch[1], 10) || 1;
        if (numMatch[2]) unit = numMatch[2].toLowerCase();
      }
      extractedItems.push({
        item: cleanItem,
        quantity: qty,
        unit: unit,
      });
    }
  }

  if (extractedItems.length >= 2) {
    return {
      action: 'add_multiple',
      items: extractedItems,
    };
  }

  return null;
}

/**
 * Main Intent Entry Point — accepts transcript and full user context
 */
export async function parseIntent(transcript, context = {}) {
  const cleaned = cleanPunctuation(transcript.trim());

  // ── 0a. FAST CLEAR ALL (Zero Friction!) ───────────────────────
  const clearAllDirect = fastExtractClearAll(cleaned);
  if (clearAllDirect) {
    return { ...clearAllDirect, source: 'fast-clear-all' };
  }

  // ── 0b. FAST REMOVE (Zero Friction!) ──────────────────────────
  const removeDirect = fastExtractRemove(cleaned);
  if (removeDirect) {
    return { ...removeDirect, source: 'fast-remove' };
  }

  // ── 0c. FAST UPDATE (Zero Friction!) ──────────────────────────
  const updateDirect = fastExtractUpdate(cleaned);
  if (updateDirect) {
    return { ...updateDirect, source: 'fast-update' };
  }

  // ── 0d. FAST MULTI-ITEM DIRECT ADD (Zero Friction!) ──────────
  const multiItemDirect = fastExtractMultipleItems(transcript);
  if (multiItemDirect) {
    return { ...multiItemDirect, source: 'multi-item-direct' };
  }

  // ── 0e. FAST RECIPE DISH LOOKUP (Zero Friction Recipe Engine!) ─
  const explicitDish = extractDishName(cleaned);
  if (explicitDish) {
    const localIngs = getLocalRecipe(explicitDish);
    if (localIngs && localIngs.length > 0) {
      return {
        action: 'interactive_consultation',
        title: explicitDish,
        shortcomings: localIngs,
        aiAnalysis: `Found recipe ingredients for ${explicitDish}!`,
        source: 'local-recipe-fast-path',
      };
    }
  }

  // ── 0f. FAST SINGLE ITEM DIRECT ADD (Zero Friction!) ──────────
  const singleItemDirect = fastExtractSingleItem(cleaned);
  if (singleItemDirect) {
    return { ...singleItemDirect, source: 'single-item-direct' };
  }

  // ── 1. CONVERSATIONAL MOOD DETECTOR ───────────────────────────
  const isConversationalMood = /\b(?:sleepy|lazy|tired|feeling|what\s+should|what\s+to|suggest|hungry|sweet|tasty|something|night|rest)\b/i.test(cleaned);

  if (isConversationalMood) {
    const isSleepy = /\b(?:sleepy|tired|night|rest)\b/i.test(cleaned);
    return {
      action: 'recommend_recipes',
      title: isSleepy ? 'Restful & Soothing Night-time Suggestions' : 'LLM Culinary Recipe Recommendations',
      aiAnalysis: isSleepy
        ? "Since you are feeling sleepy, here are warm, soothing night-time options for a great rest!"
        : "I analyzed your request! Here are delicious, tailored dish ideas for you:",
      question: isSleepy
        ? "Would you like Golden Turmeric Milk, Chamomile Herbal Tea, Hot Tomato Soup, or Rice Kheer?"
        : "Which dish sounds delicious to you?",
      recipeOptions: isSleepy
        ? [
            { title: 'Golden Turmeric Milk', emoji: '☕', id: 'turmeric_milk', desc: 'Warm milk simmered with turmeric, honey & black pepper' },
            { title: 'Chamomile Herbal Tea', emoji: '🍵', id: 'chamomile_tea', desc: 'Soothing caffeine-free herbal chamomile tea' },
            { title: 'Hot Tomato Soup', emoji: '🍲', id: 'tomato_soup', desc: 'Comforting warm tomato soup with butter' },
            { title: 'Chilled Rice Kheer', emoji: '🍨', id: 'kheer', desc: 'Sweet rice pudding with cardamom & saffron' },
          ]
        : getAllKnowledgeBaseDishes(),
      source: 'conversational-mood-detector',
    };
  }

  // ── 2. Groq LLM Query Engine with Full Inventory Context ──────
  const llmResult = await parseWithGroqLLM(cleaned, context);

  if (llmResult && llmResult.action) {
    if (llmResult.action === 'recommend_recipes') {
      return {
        ...llmResult,
        recipeOptions: llmResult.recipeOptions || getAllKnowledgeBaseDishes(),
        source: 'groq-llm-brain',
      };
    }
    return { ...llmResult, source: 'groq-llm-brain' };
  }

  // ── 3. Fallback ───────────────────────────────────────────────
  if (explicitDish) {
    return {
      action: 'recipe_error',
      dish: explicitDish,
      source: 'recipe-fallback-failed',
    };
  }

  const cleanItem = sanitizeItemName(cleaned) || cleaned.replace(/^add\s+|^buy\s+|^get\s+/gi, '').replace(/[\.\!\?]/g, '').trim();
  const capitalizedItem = cleanItem ? cleanItem.charAt(0).toUpperCase() + cleanItem.slice(1) : 'Milk';

  return {
    action: 'add',
    item: capitalizedItem,
    quantity: 1,
    unit: null,
    source: 'direct-fallback',
  };
}
