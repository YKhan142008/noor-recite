import React from 'react';

export function MosaicPattern() {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="transparent"/>
      <path d="M0 20 H40 M20 0 V40" stroke="hsl(var(--primary))" stroke-width="0.5" opacity="0.1"/>
      <circle cx="20" cy="20" r="8" stroke="hsl(var(--accent))" stroke-width="0.5" fill="none" opacity="0.1"/>
      <path d="M20 0 L40 20 L20 40 L0 20Z" stroke="hsl(var(--primary))" stroke-width="0.5" fill="none" opacity="0.1"/>
    </svg>
  `;

  const dataUrl = `url("data:image/svg+xml,${encodeURIComponent(svgString)}")`;

  return (
    <div
      className="absolute inset-0"
      style={{ backgroundImage: dataUrl, backgroundRepeat: 'repeat' }}
    />
  );
}
