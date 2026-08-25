/**
 * Speech recognition and synthesis — wraps the Web Speech API with a
 * clean callback interface. Components never touch the browser objects
 * directly. Falls back to null if the browser doesn't support it,
 * which the UI handles by showing the text-input as the primary path.
 */

const SpeechRecognitionImpl =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export const isVoiceSupported = Boolean(SpeechRecognitionImpl);

export const LANGUAGES = [
  { code: 'en', bcp: 'en-US', label: 'English',  flag: '🇺🇸' },
  { code: 'hi', bcp: 'hi-IN', label: 'हिंदी',    flag: '🇮🇳' },
  { code: 'es', bcp: 'es-ES', label: 'Español',  flag: '🇪🇸' },
  { code: 'fr', bcp: 'fr-FR', label: 'Français', flag: '🇫🇷' },
];

const _bcpMap = Object.fromEntries(LANGUAGES.map((l) => [l.code, l.bcp]));

/**
 * Create a SpeechRecognition instance with callbacks.
 * Returns the recognizer (call .start() on it) or null if unsupported.
 */
export function createRecognizer({ lang = 'en', onResult, onError, onEnd }) {
  if (!isVoiceSupported) return null;

  const recognizer = new SpeechRecognitionImpl();
  recognizer.lang = _bcpMap[lang] || _bcpMap.en;
  recognizer.interimResults = true;
  recognizer.continuous = false;

  recognizer.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((r) => r[0].transcript)
      .join(' ');
    const isFinal = event.results[event.results.length - 1].isFinal;
    onResult({ transcript, isFinal });
  };

  recognizer.onerror = (event) => {
    const reason =
      event.error === 'no-speech'
        ? 'no-speech'
        : event.error === 'not-allowed'
        ? 'mic-denied'
        : 'network';
    onError(reason);
  };

  recognizer.onend = () => onEnd?.();

  return recognizer;
}

/**
 * Stop a recognizer safely — checks for null and catches errors.
 */
export function stopRecognizer(recognizer) {
  try {
    recognizer?.stop();
  } catch {
    // Already stopped or not started — safe to ignore.
  }
}

/**
 * Speak a confirmation message using the SpeechSynthesis API.
 */
export function speak(text, lang = 'en') {
  if (!('speechSynthesis' in window)) return;
  // Cancel any currently speaking utterance.
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = _bcpMap[lang] || _bcpMap.en;
  utterance.rate = 1.05;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
