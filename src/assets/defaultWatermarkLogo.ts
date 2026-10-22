/**
 * Clean Academic Crest Watermark for Science Studio
 * Exported as an SVG data URL for crisp, high-resolution rendering without black-edge artifacts.
 */
export const defaultScienceStudioLogoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
  </defs>

  <!-- Outer Double Rings -->
  <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="6,4" />
  <circle cx="150" cy="150" r="132" fill="none" stroke="currentColor" stroke-width="2" />
  <circle cx="150" cy="150" r="102" fill="none" stroke="currentColor" stroke-width="1.5" />

  <!-- Circular Text Path: Upper -->
  <path id="upperArc" d="M 35 150 A 115 115 0 0 1 265 150" fill="none" />
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="currentColor" letter-spacing="4">
    <textPath href="#upperArc" startOffset="50%" text-anchor="middle">
      SCIENCE STUDIO
    </textPath>
  </text>

  <!-- Circular Text Path: Lower -->
  <path id="lowerArc" d="M 265 150 A 115 115 0 0 1 35 150" fill="none" />
  <text font-family="'Hind Siliguri', sans-serif" font-size="15" font-weight="700" fill="currentColor" letter-spacing="3">
    <textPath href="#lowerArc" startOffset="50%" text-anchor="middle">
      সাইন্স স্টুডিও • শিক্ষা ও জ্ঞান
    </textPath>
  </text>

  <!-- Center Decorative Atom & Orbit -->
  <g transform="translate(150, 150)">
    <!-- Orbits -->
    <ellipse cx="0" cy="0" rx="55" ry="22" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(30)" />
    <ellipse cx="0" cy="0" rx="55" ry="22" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(-30)" />
    <ellipse cx="0" cy="0" rx="55" ry="22" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(90)" />

    <!-- Center Nucleus / Sun / Book -->
    <circle cx="0" cy="0" r="10" fill="currentColor" />
    
    <!-- Electrons -->
    <circle cx="48" cy="28" r="3.5" fill="currentColor" />
    <circle cx="-48" cy="-28" r="3.5" fill="currentColor" />
    <circle cx="-48" cy="28" r="3.5" fill="currentColor" />
    <circle cx="0" cy="55" r="3.5" fill="currentColor" />
  </g>

  <!-- Decorative Stars -->
  <polygon points="150,22 153,29 160,29 154,34 156,41 150,37 144,41 146,34 140,29 147,29" fill="currentColor" />
  <circle cx="36" cy="150" r="3" fill="currentColor" />
  <circle cx="264" cy="150" r="3" fill="currentColor" />
</svg>
`)}`;
