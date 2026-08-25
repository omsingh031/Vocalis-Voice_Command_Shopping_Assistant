# Approach Write-Up (200 words)

**Scoping decision:** With 8 hours, I prioritized a polished, working demo over breadth. Voice input, smart suggestions, and search all work end-to-end — but with a static catalog rather than a live API. This trade-off keeps the demo reliable while demonstrating the full architecture.

**Architecture:** A three-tier intent parser handles voice commands: regex fast-path for common phrases ("add milk"), Groq API with Llama 3.1 (open-source) via a Cloud Function for ambiguous phrasing ("I'm out of coffee"), and a fallback that always produces a visible result. The API key never reaches the client. Firebase Anonymous Auth scopes per-user data without requiring login.

**Smart suggestions** use an explainable heuristic: average interval between purchases, triggering when 90% of that interval has elapsed. This is transparent and debuggable — stated honestly rather than oversold as ML. Seasonal and substitute suggestions come from curated data.

**UI:** Dark glassmorphic theme with the mic button as the visual hero — pulsing rings during listening, waveform visualizer, spoken confirmations. Text input is an equal citizen, not an apologetic fallback.

**Next steps:** Real product API, collaborative filtering for suggestions, PWA with offline support, and a purchase-pattern model once there's enough per-user history.
