"use client";

import { createContext, useContext, useState } from "react";

const ThemeSelectContext = createContext<{
  isThemeSelectOpen: boolean;
  toggleOpen: () => void;
}>({ isThemeSelectOpen: false, toggleOpen: () => {} });

export function ThemeSelectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false);

  const toggleOpen = () => {
    setIsThemeSelectOpen((prev) => !prev);
  };

  return (
    <ThemeSelectContext.Provider value={{ isThemeSelectOpen, toggleOpen }}>
      {children}
    </ThemeSelectContext.Provider>
  );
}

export function useThemeSelect() {
  return useContext(ThemeSelectContext);
}
