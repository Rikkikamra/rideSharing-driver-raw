import React, { createContext, useContext } from 'react';
import theme from '../theme';

/**
 * A simple ThemeContext that provides the colour palette and sizing
 * values defined in `frontend/theme.js`.  Many screens previously
 * imported a nonâ€‘existent `ThemeContext`; this file satisfies
 * those imports and makes it trivial to extend theming later.
 */
const ThemeContext = createContext(theme);

/**
 * Wrap your app in this provider to supply the theme to
 * descendant components.  Consumers can call `useTheme()`
 * to access the theme object.
 */
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook for accessing the current theme.  If no provider is found
 * above in the tree, the default exported theme will be used.
 */
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;