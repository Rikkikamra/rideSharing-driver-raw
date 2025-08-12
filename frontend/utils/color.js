// frontend/utils/color.js

/**
 * Convert a hex color (e.g. "#FF6600") to an rgba() string.
 * @param {string} hex  3- or 6-digit hex, with or without leading “#”
 * @param {number} alpha 0.0–1.0 opacity
 * @returns {string} e.g. "rgba(255,102,0,0.5)"
 */
export function hexToRgba(hex, alpha = 1) {
    const cleaned = hex.replace(/^#/, '');
    const bigint = parseInt(cleaned.length === 3
      ? cleaned.split('').map(ch=>ch+ch).join('')
      : cleaned,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  