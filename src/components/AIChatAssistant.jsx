import { useEffect, useState, useRef } from 'react';
import { converseWithGroqLLM } from '../lib/intentParser';
import { speak } from '../lib/speech';

/**
 * AIChatAssistant — Interactive Multi-Turn Conversational AI Voice Companion Drawer.
 */
export default function AIChatAssistant({
  dishName,
  clarifyData,
  recipeOptions,
  initialReviewedRecipe,
  consultationData,
  inventory = [],
  lang = 'en-US',
  isOpen,
  onClose,
  onAddSelectedIngredients,
  onAddSingleItem,
}) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [reviewedRecipe, setReviewedRecipe] = useState(null);
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [isListeningDrawer, setIsListeningDrawer] = useState(false);
  const drawerRecognizerRef = useRef(null);

  // Initialize drawer chat state whenever inputs change
  useEffect(() => {
    if (!isOpen) return;

    if (consultationData) {
      const ingredientsList = (consultationData.shortcomings || []).map((ing) => ({
        ...ing,
        name: ing.name || ing.item,
        selected: true,
      }));

      setReviewedRecipe({
        dishTitle: consultationData.title || 'AI Inventory Brain Consultation',
        aiAnalysis: consultationData.aiAnalysis,
        pantryFound: consultationData.pantryFound || [],
        ingredients: ingredientsList,
      });

      setMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          text: consultationData.aiAnalysis || consultationData.question || 'I analyzed your request against your Home Pantry. Please review the missing items below.',
        },
      ]);
    } else if (recipeOptions?.length > 0) {
      setReviewedRecipe(null);
      setDynamicOptions(recipeOptions);
      setMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          text: clarifyData?.question || "I analyzed your request! Here are delicious, tailored dish ideas for you:",
        },
      ]);
    } else if (initialReviewedRecipe && initialReviewedRecipe.ingredients?.length > 0) {
      const rawDish = initialReviewedRecipe.dishTitle || '';
      const cleanDish = rawDish
        .replace(/^i want to make\s+|^i want to cook\s+|^to make\s+|^for making\s+|^make\s+|^cook\s+/gi, '')
        .trim();
      const displayTitle = cleanDish ? cleanDish.charAt(0).toUpperCase() + cleanDish.slice(1) : rawDish;

      setReviewedRecipe({
        dishTitle: displayTitle,
        ingredients: initialReviewedRecipe.ingredients.map((ing) => ({
          ...ing,
          name: ing.name || ing.item,
          selected: true,
        })),
      });

      setMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          text: `Refined recipe ingredients for "${displayTitle}". Uncheck any item you already have or don't want to buy:`,
        },
      ]);
    } else {
      setReviewedRecipe(null);
      setDynamicOptions([]);
      setMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          text: clarifyData?.question || "Hi! I am your AI Voice Culinary Companion 👩‍🍳. Tell me what you want to add (e.g. 'Milk') or what dish you want to cook!",
        },
      ]);
    }
  }, [isOpen, consultationData, recipeOptions, clarifyData, initialReviewedRecipe]);

  if (!isOpen) return null;

  // Process user chat/voice turn through Groq LLM
  async function handleSendMessage(userText) {
    if (!userText.trim()) return;
    const textToSend = userText.trim();
    setInputText('');

    // Append user message
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const currentHistory = [...messages, userMsg];
      const llmRes = await converseWithGroqLLM(textToSend, currentHistory, { inventory });

      if (llmRes) {
        // AI speech
        const aiMsgText = llmRes.aiSpeech || llmRes.aiAnalysis || llmRes.question || "I processed your request!";
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'assistant', text: aiMsgText }]);

        // Speak aloud
        speak(aiMsgText, lang);

        // Handle suggested dishes
        if (llmRes.dishOptions && llmRes.dishOptions.length > 0) {
          setReviewedRecipe(null);
          setDynamicOptions(llmRes.dishOptions);
        }

        // Handle recipe review ingredients / missing items
        if (llmRes.shortcomings || llmRes.ingredients) {
          const list = (llmRes.shortcomings || llmRes.ingredients).map((ing) => ({
            ...ing,
            name: ing.name || ing.item,
            selected: true,
          }));

          setReviewedRecipe({
            dishTitle: llmRes.dishTitle || textToSend,
            aiAnalysis: llmRes.aiSpeech,
            pantryFound: llmRes.pantryFound || [],
            ingredients: list,
          });
        }
      } else {
        const fallbackText = "I suggest trying a soothing warm Golden Milk or Chamomile Tea! Here are options you can make right now:";
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'assistant', text: fallbackText }]);
        speak(fallbackText, lang);
        setDynamicOptions([
          { title: "Golden Turmeric Milk", emoji: "🥛", desc: "Warm soothing turmeric milk" },
          { title: "Chamomile Herbal Tea", emoji: "🍵", desc: "Relaxing warm tea" },
          { title: "Hot Tomato Soup", emoji: "🍲", desc: "Easy comforting soup" },
          { title: "Chilled Rice Kheer", emoji: "🍨", desc: "Sweet relaxing dessert" }
        ]);
      }
    } catch (err) {
      console.error('Drawer conversation error', err);
    }
    setIsThinking(false);
  }

  // Voice recognition inside assistant drawer
  function handleMicClick() {
    if (isListeningDrawer) {
      try {
        drawerRecognizerRef.current?.stop();
      } catch (e) {}
      setIsListeningDrawer(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const bcpMap = { en: 'en-US', hi: 'hi-IN', es: 'es-ES', fr: 'fr-FR' };
    const recognition = new SpeechRecognition();
    recognition.lang = bcpMap[lang] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListeningDrawer(true);
      setInputText('');
    };

    recognition.onresult = (e) => {
      const transcriptStr = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(' ');
      
      setInputText(transcriptStr);

      const isFinal = e.results[e.results.length - 1].isFinal;
      if (isFinal && transcriptStr.trim()) {
        setIsListeningDrawer(false);
        handleSendMessage(transcriptStr.trim());
      }
    };

    recognition.onerror = (e) => {
      console.warn('[AIChatAssistant] Speech recognition error:', e.error);
      setIsListeningDrawer(false);
    };

    recognition.onend = () => {
      setIsListeningDrawer(false);
    };

    drawerRecognizerRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start drawer speech recognition:', err);
      setIsListeningDrawer(false);
    }
  }

  function handleSelectOptionCard(optionTitle) {
    handleSendMessage(`I want to make ${optionTitle}`);
  }

  function toggleIngredientSelection(index) {
    setReviewedRecipe((prev) => {
      if (!prev) return null;
      const updated = [...prev.ingredients];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return { ...prev, ingredients: updated };
    });
  }

  function handleConfirmSelectedIngredients() {
    if (!reviewedRecipe) return;
    const selectedList = reviewedRecipe.ingredients.filter((ing) => ing.selected);
    if (selectedList.length === 0) return;

    onAddSelectedIngredients(reviewedRecipe.dishTitle, selectedList);
    setReviewedRecipe(null);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div className="search-overlay" onClick={onClose} />

      {/* Interactive AI Companion Drawer */}
      <div className="search-panel animate-fade-in-up flex flex-col justify-between max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <i className="ti ti-sparkles text-xl animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                Vocalis Conversational AI
                <span className="text-[0.625rem] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  Neural LLM Live
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Talk hands-free or type to refine your recipe
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close assistant"
          >
            <i className="ti ti-x text-sm" />
          </button>
        </div>

        {/* ── CONVERSATION CHAT LOG ── */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1 max-h-52">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                }`}
              >
                {msg.sender === 'user' ? ' You ' : ' 👩‍🍳 '}
              </div>

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-emerald-500/20 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}

                {/* Clarification Pill Shortcuts inside Assistant Bubble */}
                {clarifyData?.phrase && msg.sender === 'assistant' && msg.id === messages[0]?.id && (
                  <div className="mt-2.5 flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleSendMessage(`Add ${clarifyData.phrase}`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1"
                    >
                      <i className="ti ti-plus" /> Add "{clarifyData.phrase}" to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(`Cook ${clarifyData.phrase}`)}
                      className="px-3 py-1.5 rounded-xl glass text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30 hover:bg-emerald-500/10 transition-all flex items-center gap-1"
                    >
                      <i className="ti ti-wand" /> Cook "{clarifyData.phrase}"
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold animate-pulse p-2">
              <i className="ti ti-loader animate-spin text-base" />
              Vocalis AI is consulting its neural culinary database...
            </div>
          )}
        </div>

        {/* ── STEP 1: DYNAMIC RECIPE OPTIONS (Generated by LLM) ── */}
        {dynamicOptions?.length > 0 && !reviewedRecipe && (
          <div className="py-2">
            <p className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 mb-2 px-1">
              ✨ Dynamic LLM Recipe Suggestions (Tap to inspect ingredients):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
              {dynamicOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOptionCard(opt.title)}
                  className="p-2.5 rounded-xl glass glass-hover border border-emerald-500/20 text-left transition-all hover:scale-[1.02] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.emoji || '🍽️'}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{opt.title}</h4>
                      {opt.desc && <p className="text-[0.65rem] text-slate-400">{opt.desc}</p>}
                    </div>
                  </div>
                  <i className="ti ti-chevron-right text-xs text-emerald-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: PANTRY GAP & INGREDIENTS REVIEW ── */}
        {reviewedRecipe && reviewedRecipe.ingredients?.length > 0 && (
          <div className="pt-2 flex flex-col gap-3 border-t border-white/10">
            {/* Pantry Found Badges */}
            {reviewedRecipe.pantryFound?.length > 0 && (
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <p className="text-[0.68rem] font-bold text-teal-600 dark:text-teal-400 mb-1 flex items-center gap-1">
                  <i className="ti ti-home-check text-xs" />
                  Found in Home Pantry (Skipped buy):
                </p>
                <div className="flex flex-wrap gap-1">
                  {reviewedRecipe.pantryFound.map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[0.625rem] font-bold bg-teal-500/20 text-teal-300">
                      ✓ {item.name || item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Checkbox Missing Ingredients */}
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto p-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                🛒 Refined Ingredients for "{reviewedRecipe.dishTitle}":
              </p>

              {(reviewedRecipe.ingredients || []).map((ing, i) => (
                <label
                  key={i}
                  className={`flex items-center justify-between p-2.5 rounded-xl glass border cursor-pointer transition-all ${
                    ing.selected ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={Boolean(ing.selected)}
                      onChange={() => toggleIngredientSelection(i)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className={`text-xs font-semibold ${ing.selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}`}>
                      {ing.name}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-500">
                    {ing.quantity}{ing.unit ? ` ${ing.unit}` : ''}
                  </span>
                </label>
              ))}
            </div>

            {/* Confirm & Add Button */}
            <button
              type="button"
              onClick={handleConfirmSelectedIngredients}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <i className="ti ti-check-double text-sm" />
              Confirm & Add Selected Ingredients ({(reviewedRecipe.ingredients || []).filter((i) => i.selected).length}) to Cart
            </button>
          </div>
        )}

        {/* ── STEP 3: CONVERSATIONAL VOICE & TEXT INPUT BAR ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="pt-3 border-t border-white/10 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleMicClick}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all shadow-md ${
              isListeningDrawer
                ? 'bg-rose-500 animate-pulse scale-110 shadow-rose-500/30'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/20 hover:scale-105'
            }`}
            title="Speak hands-free to Vocalis AI"
          >
            <i className={`ti ${isListeningDrawer ? 'ti-microphone' : 'ti-microphone text-base'}`} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Talk to AI (e.g. "I am feeling lazy", "make it spicy", "add 2 kg apples")'
            className="text-input text-xs"
            disabled={isThinking}
          />

          <button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            className="send-btn px-4 w-auto text-xs font-bold"
          >
            <i className="ti ti-send text-sm" />
          </button>
        </form>
      </div>
    </>
  );
}
