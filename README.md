# Vocalis — Voice Command & AI Culinary Shopping Assistant 🎙️🛒

> An intelligent, voice-first shopping list manager and AI culinary companion powered by **React**, **Vite**, **Groq LLM (GPT-OSS-20B)**, and **Firebase**.

![Vocalis Banner](https://img.shields.io/badge/Vocalis-Voice%20AI-10b981?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

---

## 🌟 Highlights

- 🎙️ **Voice & Text Hands-Free Commands**: Add, remove, update quantities, or clear your list using natural voice or typed commands.
- 🍳 **AI Dish Recipe Ingredient Expansion**: Say *"I want to cook pasta"* or *"make rasgulla"* — Vocalis automatically extracts all 4–6 raw grocery ingredients and adds them directly to your shopping list!
- 🏡 **Home Pantry Inventory Gap Detection**: Tracks your stocked pantry items at home and intelligently skips items you already have.
- 📦 **Multi-Item Voice Parsing**: Effortlessly parse multi-item phrases like *"add milk, eggs, and bread"* into separate cart items with custom quantities & units.
- 🎨 **Adaptive Glassmorphic Light & Dark Design System**: Modern, high-contrast UI tailored for day and night modes with custom micro-animations.
- 🌐 **Multilingual Voice Support**: Supports English (US), Hindi (IN), Spanish (ES), and French (FR) with BCP-47 speech recognition and voice feedback.

---

## ⚡ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Vanilla CSS Design System |
| **AI / LLM Engine** | Groq API (`openai/gpt-oss-20b`) with fast-path local recipe fallbacks |
| **Voice Processing** | Web Speech Recognition API + Web SpeechSynthesis Engine |
| **Cloud & Storage** | Firebase Firestore (real-time sync) + `localStorage` offline fallback |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/Voice_Command_Shopping_App.git
cd Voice_Command_Shopping_App
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📋 Features Overview

- **Direct Voice Adding**: *"add 2 kg apples"* → Adds `Apples` (Qty: 2, Unit: kg).
- **Multi-Item Bulk Add**: *"buy 1 liter milk, 6 eggs, and bread"* → Batch-adds 3 distinct items.
- **Voice Item Updates**: *"update milk to 3 kg"* → Automatically updates quantity.
- **Voice Item Removal**: *"remove milk"* or *"clear all"* → Instant voice list management.
- **Interactive AI Assistant**: Talk hands-free to **Vocalis Conversational AI** for recipe recommendations, mood-based dish ideas, and pantry reviews.

---

## 📄 License
This project is licensed under the MIT License.
