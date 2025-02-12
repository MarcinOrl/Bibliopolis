import { useEffect } from "react";
import chroma from "chroma-js";
import apiClient from "./api";

export const applyColors = (primary: string, secondary: string, accent: string) => {
  const root = document.documentElement;

  // Wyliczanie jaśniejszych i ciemniejszych wersji kolorów
  const primaryLight = chroma(primary).brighten(1).hex();
  const secondaryDark = chroma(secondary).darken(1).hex();
  const accentLight = chroma(accent).brighten(1).hex();

  // Ustawienie wyliczonych kolorów jako zmienne CSS
  root.style.setProperty("--primary-color", primary);
  root.style.setProperty("--secondary-color", secondary);
  root.style.setProperty("--accent-color", accent);

  root.style.setProperty("--primary-light", primaryLight);
  root.style.setProperty("--secondary-dark", secondaryDark);
  root.style.setProperty("--accent-light", accentLight);
};

const ThemeManager = () => {
  useEffect(() => {
    apiClient.get("/themes/select/")
      .then(response => {
        const { primary_color, secondary_color, accent_color } = response.data;
        applyColors(primary_color, secondary_color, accent_color);
      })
      .catch(() => {
          apiClient.get("/theme/default/")
            .then(response => {
              const { primary_color, secondary_color, accent_color } = response.data;
              applyColors(primary_color, secondary_color, accent_color);
            })
            .catch(() => {
              // pass
            });
        });
  }, []);

  return null;
};

export default ThemeManager;
