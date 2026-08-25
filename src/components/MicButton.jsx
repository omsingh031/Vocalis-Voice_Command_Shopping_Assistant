import { useState } from 'react';
import { isVoiceSupported } from '../lib/speech';

/**
 * MicButton — the hero element of the entire UI.
 *
 * Features:
 * - Large gradient circle with emerald glow
 * - Triple concentric pulse rings while listening
 * - 5-bar waveform visualizer during listening
 * - Quick example pills for instant testing
 * - State-aware icon transitions
 * - Text input fallback
 *
 * status: "idle" | "listening" | "processing" | "error"
 */
export default function MicButton({ status, onStartListening, onTextSubmit }) {
  const [typedValue, setTypedValue] = useState('');
  const isListening = status === 'listening';
  const isProcessing = status === 'processing';
  const isDisabled = !isVoiceSupported || isProcessing;

  const quickPills = [
    "I want to cook Pasta 🍳",
    "Glass of water 🥛",
    "Add 4 kg tomatoes 🥬",
    "I want coffee 🥤",
  ];

  function handleTextSubmit(e) {
    e.preventDefault();
    if (!typedValue.trim()) return;
    onTextSubmit(typedValue.trim());
    setTypedValue('');
  }

  function handlePillClick(phrase) {
    if (isProcessing) return;
    onTextSubmit(phrase);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Voice unsupported banner */}
      {!isVoiceSupported && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-amber-400 animate-fade-in">
          <i className="ti ti-alert-triangle text-sm" />
          Voice input isn't supported — type your commands below.
        </div>
      )}

      {/* ── Mic button with pulse rings ─── */}
      <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
        {/* Pulse rings — only visible during listening */}
        {isListening && (
          <>
            <span className="mic-ring animate-pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(16, 185, 129, 0.35)' }} />
            <span className="mic-ring animate-pulse-ring-delay" style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid rgba(16, 185, 129, 0.25)' }} />
            <span className="mic-ring animate-pulse-ring-delay-2" style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid rgba(16, 185, 129, 0.15)' }} />
          </>
        )}

        <button
          type="button"
          disabled={isDisabled}
          onClick={onStartListening}
          aria-label={isListening ? 'Listening for voice command' : 'Start voice command'}
          className={`mic-btn ${isListening ? 'is-listening' : ''}`}
        >
          {isProcessing ? (
            <i className="ti ti-loader-2 text-3xl animate-spin-slow" />
          ) : isListening ? (
            <i className="ti ti-microphone text-3xl" />
          ) : (
            <i className="ti ti-microphone text-3xl" />
          )}
        </button>
      </div>

      {/* ── Waveform visualizer ─── */}
      {isListening && (
        <div className="waveform animate-fade-in">
          <div className="waveform-bar" style={{ animationDelay: '0s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.1s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.2s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.15s' }} />
          <div className="waveform-bar" style={{ animationDelay: '0.25s' }} />
        </div>
      )}

      {/* ── Status label ─── */}
      <p className="text-xs font-medium text-slate-400 h-4">
        {isListening && 'Listening...'}
        {isProcessing && 'Processing AI intent...'}
        {status === 'idle' && isVoiceSupported && 'Tap to speak'}
      </p>

      {/* ── Text input ─── */}
      <form
        onSubmit={handleTextSubmit}
        className="flex gap-2 w-full max-w-md animate-fade-in"
      >
        <input
          id="text-command-input"
          type="text"
          value={typedValue}
          onChange={(e) => setTypedValue(e.target.value)}
          placeholder='Try "glass of water" or "add 2 kg apples"'
          className="text-input"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={isProcessing || !typedValue.trim()}
          className="send-btn"
          aria-label="Send command"
        >
          <i className="ti ti-send" />
        </button>
      </form>

      {/* ── Quick Test Pills ─── */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 w-full pt-1">
        {quickPills.map((phrase, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePillClick(phrase)}
            disabled={isProcessing}
            className="text-[0.7rem] text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-2.5 py-1 rounded-full glass transition-all"
          >
            "{phrase}"
          </button>
        ))}
      </div>
    </div>
  );
}
