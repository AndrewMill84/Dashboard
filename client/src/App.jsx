import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import ProjectDetail from "./components/ProjectDetail";
import SettingsModal from "./components/SettingsModal";

const THEME_STORAGE_KEY = "devdashboard-theme";

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState(getInitialTheme);

  const handleDirectoriesChanged = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const nextThemeLabel = theme === "dark" ? "Light mode" : "Dark mode";

  return (
    <BrowserRouter>
      <header className="header">
        <div className="container header-inner">
          <h1>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Dev<span>Dashboard</span>
            </Link>
          </h1>
          <div className="header-actions">
            <button
              className="header-theme-btn"
              onClick={toggleTheme}
              title={`Switch to ${nextThemeLabel.toLowerCase()}`}
              aria-label={`Switch to ${nextThemeLabel.toLowerCase()}`}
            >
              {nextThemeLabel}
            </button>
            <button
              className="header-settings-btn"
              onClick={() => setShowSettings(true)}
              title="Settings"
              aria-label="Open settings"
            >
              &#9881;
            </button>
          </div>
        </div>
      </header>
      <main className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
        <Routes>
          <Route path="/" element={<ProjectList key={refreshKey} />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </main>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onDirectoriesChanged={handleDirectoriesChanged}
        />
      )}
    </BrowserRouter>
  );
}
