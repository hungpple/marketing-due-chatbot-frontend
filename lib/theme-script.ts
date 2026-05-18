export function getThemeBootScript() {
  return `
    (() => {
      try {
        const key = "marketing-due-theme";
        const stored = window.localStorage.getItem(key);
        const theme = stored === "light" || stored === "dark"
          ? stored
          : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        document.documentElement.style.colorScheme = theme;
      } catch {}
    })();
  `;
}
