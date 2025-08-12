// frontend/theme.js

export const COLORS = {
  // Base palette (unchanged)
  background: '#fff',
  burntOrange: '#bf5700',
  burntOrangeLight: '#ff7300',
  black: '#000000',
  inputBorder: '#bf5700',
  inputBg: '#fff',
  error: '#d32f2f',
  grey: '#757575',
  googleBlue: '#4285F4',
  appleBlack: '#111111',
  white: '#fff',

  // NEW semantic tokens used throughout the app & navigation
  primary: '#bf5700',            // alias of burntOrange
  accent: '#ff7300',             // alias of burntOrangeLight
  text: '#000000',               // alias of black
  muted: '#757575',              // alias of grey
  card: '#f5f5f5',               // surfaces/cards
  border: '#e0e0e0',             // hairline borders
  success: '#2e7d32',            // success state (used e.g. trip status)
  warning: '#ff7300',            // alias to accent (optional but handy)
  modalBackground: 'rgba(0,0,0,0.5)', // overlay dim for modals
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  size: {
    title: 28,
    button: 18,
    input: 16,
    link: 16,
  },
};

export const BORDERS = {
  radius: 14,
  width: 2,
};

const theme = {
  colors: COLORS,
  fonts: FONTS,
  borders: BORDERS,
};

export default theme;
