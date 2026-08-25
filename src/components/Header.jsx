import { LANGUAGES } from '../lib/speech';

/**
 * Header — Sophisticated Vocalis AI branding, theme toggle switch, language selector, and AI Helper launcher.
 */
export default function Header({ lang, onLangChange, itemCount, isOnline, theme, onToggleTheme, onOpenAssistant }) {
  return (
    <header className="flex flex-col gap-3">
      {/* Offline banner */}
      {!isOnline && (
        <div className="offline-banner">
          <i className="ti ti-wifi-off text-sm" />
          <span>Offline Mode — changes stored locally.</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 relative group">
            <i className="ti ti-waveform text-white text-xl group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold gradient-text tracking-tight leading-none">
                Vocalis
              </h1>
              <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Pro AI
              </span>
            </div>
            <p className="text-[0.675rem] text-slate-500 font-medium tracking-wide">
              {itemCount > 0 ? `${itemCount} active item${itemCount !== 1 ? 's' : ''}` : 'Voice & Chat AI Personal Helper'}
            </p>
          </div>
        </div>

        {/* Right controls: AI Helper + Theme Toggle + Language Dropdown */}
        <div className="flex items-center gap-2">
          {/* AI Helper Drawer Button */}
          <button
            type="button"
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            title="Chat or speak with your personal AI Kitchen Helper"
          >
            <i className="ti ti-sparkles text-sm animate-pulse" />
            <span className="hidden xs:inline">AI Helper 👩‍🍳</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <i className="ti ti-sun text-amber-400 text-lg" />
            ) : (
              <i className="ti ti-moon text-indigo-600 text-lg" />
            )}
          </button>

          {/* Language selector */}
          <select
            id="language-selector"
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            className="select-input text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-white/10 glass cursor-pointer text-slate-700 dark:text-slate-200"
            title="Select voice recognition language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
