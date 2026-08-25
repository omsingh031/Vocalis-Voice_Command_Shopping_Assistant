# 🎙️ Vocalis — Voice & AI-Powered Shopping Assistant

<div align="center">

![Vocalis Banner](https://img.shields.io/badge/Vocalis-PRO%20AI-00d4aa?style=for-the-badge&logo=microphone&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLM%20API-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A smart, voice-first grocery shopping assistant powered by Groq LLM AI.**  
Say or type a dish name and instantly get all required ingredients added to your shopping list.

[🌐 Live Demo](https://vocalis-voice-command-shopping-assi.vercel.app/) · [📦 GitHub Repo](https://github.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant)

</div>

---

## 📸 Screenshots

### 🏠 Main Dashboard — Voice & Text Command Interface
> The home screen with microphone button for hands-free voice control, smart suggestion chips, and a real-time shopping list on the right.

![Main Dashboard](https://raw.githubusercontent.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant/main/public/screenshots/landing.png)

---

### 🍗 Recipe Expansion — "I want to cook Butter Chicken"
> Speaking or typing a dish name automatically resolves and adds all required raw ingredients, categorized into Produce, Dairy, Protein, and Pantry sections.

![Recipe Ingredients Added](https://raw.githubusercontent.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant/main/public/screenshots/recipe.png)

---

### 🤖 AI Chat Assistant — Conversational Grocery Helper
> The "Ask AI Helper" drawer opens a live Groq LLM-backed conversational assistant for mood-based dish suggestions, smart recipe queries, and natural language grocery management.

![AI Chat Drawer](https://raw.githubusercontent.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant/main/public/screenshots/ai_chat.png)

---

### 💬 AI Breakfast Suggestion in Action
> The AI responds intelligently to mood-based queries like _"suggest me something for breakfast"_ with personalized dish ideas powered by the Groq neural LLM.

![AI Breakfast Suggestion](https://raw.githubusercontent.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant/main/public/screenshots/ai_breakfast.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎙️ **Voice Commands** | Hands-free control via Web Speech API — say any command naturally |
| 🧠 **Groq LLM Integration** | Lightning-fast AI intent parsing powered by Groq's neural LLM API |
| 🍽️ **Recipe Intelligence** | 30+ Indian & international dishes with auto ingredient expansion |
| 💬 **AI Chat Assistant** | Conversational multi-turn AI drawer for dish suggestions & grocery help |
| 🏠 **Home Pantry Tracking** | Separate pantry inventory — know what you already have at home |
| 📂 **Smart Categorization** | Ingredients auto-sorted into Produce, Dairy, Protein, Pantry, and Other |
| 🌙 **Dark / Light Mode** | Premium dark UI with one-click theme toggle |
| 🌐 **Multi-language Input** | US English, Hindi, and more via Speech API language selector |
| ⚡ **Instant Offline Fallback** | Fast local recipe database if API is unavailable |
| 📱 **Responsive Design** | Optimized for both desktop and mobile screens |

---

## 🏗️ Tech Stack

```
Frontend        React 18 + Vite 5
Styling         Vanilla CSS (custom dark theme, glassmorphism, animations)
AI Engine       Groq LLM API (openai/gpt-oss-20b model)
Voice Input     Web Speech API (browser-native)
Database        Firebase Firestore (optional cloud sync)
State           React useState / useEffect / useRef hooks
Build Tool      Vite with envPrefix for GROQ_API_KEY support
Deployment      Vercel / Netlify
```

---

## 📁 Project Structure

```
vocalis/
├── public/
│   └── screenshots/           # App screenshots
├── src/
│   ├── components/
│   │   ├── AIChatAssistant.jsx   # Groq LLM conversational AI drawer
│   │   ├── Header.jsx             # App header with theme & language toggle
│   │   ├── MicButton.jsx          # Voice command microphone button
│   │   ├── ShoppingList.jsx       # Real-time categorized shopping list
│   │   ├── InventoryView.jsx      # Home pantry inventory tracker
│   │   ├── SuggestionsStrip.jsx   # Smart suggestion chips
│   │   ├── SearchPanel.jsx        # Text command search panel
│   │   └── Toast.jsx              # Status notification toasts
│   ├── lib/
│   │   ├── intentParser.js        # Voice/text → structured intent via Groq LLM
│   │   ├── recipes.js             # 30+ recipe knowledge base (ingredients DB)
│   │   ├── catalog.js             # Product catalog & unit normalization
│   │   ├── categories.js          # Item category classification logic
│   │   ├── suggestions.js         # Smart shopping suggestions engine
│   │   ├── inventory.js           # Pantry inventory management
│   │   ├── speech.js              # Web Speech API integration
│   │   └── firebase.js            # Firebase Firestore optional sync
│   ├── hooks/                     # Custom React hooks
│   ├── App.jsx                    # Root component & global state
│   ├── index.css                  # Global dark theme & animations
│   └── main.jsx                   # React DOM entry point
├── .env.example                   # Environment variable template
├── vite.config.js                 # Vite config with GROQ_API_KEY envPrefix
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A free [Groq API key](https://console.groq.com/keys)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant.git
cd Vocalis-Voice_Command_Shopping_Assistant

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

### Configure Environment Variables

Open `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> **Get a free API key** at [console.groq.com/keys](https://console.groq.com/keys) — no credit card required.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 How to Use

### 🎙️ Voice Commands
Click the large microphone button and speak naturally:
- *"Add 2 kg tomatoes"*
- *"I want to cook Butter Chicken"*
- *"Glass of water"*
- *"I want to eat Dal Makhani"*
- *"Make biryani"*

### ⌨️ Text Commands
Type in the input box at the bottom of the command panel:
- Any dish name → all ingredients are added automatically
- Specific items → added directly with quantity and unit
- Natural language → AI parses intent and responds

### 🤖 AI Chat Helper
Click **"Ask AI Helper"** for a conversational experience:
- *"Suggest something for breakfast"*
- *"I'm feeling lazy, what should I cook?"*
- *"Make it spicy"*
- *"Add the first option"*

### ✅ Confirm Shopping
When done, click **"Confirm Shopping & Move to Home Pantry"** to transfer all items to your home pantry inventory.

---

## 🌐 Deployment (Vercel)

1. Push your repository to GitHub (ensure `.env` is in `.gitignore`)
2. Import the project in [Vercel](https://vercel.com)
3. Add Environment Variables in Vercel dashboard:
   - `GROQ_API_KEY` = `your_key_here`
   - `VITE_GROQ_API_KEY` = `your_key_here`
4. Deploy — Vercel handles the build automatically

---

## 📝 Approach & Design Decisions

Vocalis solves the friction of grocery planning by combining voice-first interaction with AI intelligence. The core approach:

**Dual-layer intent parsing**: Every command first hits a fast local recipe database (instant, offline-capable), then falls back to the Groq LLM API for complex or unknown queries. This gives sub-100ms responses for common dishes while supporting open-ended natural language.

**Recipe-first philosophy**: Instead of adding a dish name as a single item, Vocalis expands every dish into its full ingredient list, categorized and quantified — making it genuinely useful for grocery shopping rather than just a voice note-taker.

**Groq LLM for context-awareness**: The AI chat assistant uses multi-turn conversation history and pantry inventory context to give personalized suggestions — it knows what you already have at home and recommends accordingly.

---

## 📬 Deliverables

| Item | Link |
|---|---|
| 🌐 **Working Application** | [vocalis-voice-command-shopping-assi.vercel.app](https://vocalis-voice-command-shopping-assi.vercel.app/) |
| 📦 **GitHub Repository** | [github.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant](https://github.com/omsingh031/Vocalis-Voice_Command_Shopping_Assistant) |
| 🌿 **Branch** | `main` |

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq LLM API key for AI intent parsing |


---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using React, Vite, and Groq AI  
**Vocalis** — *Shop smarter, cook better.*

</div>
