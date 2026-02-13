# Design System — Liquid Glass

## Design Philosophy

This is NOT a generic Tailwind dashboard. The aesthetic is inspired by Apple's liquid glass design language — translucent depth, luminous surfaces, and precise typographic hierarchy. Every element should feel like it exists in a three-dimensional space with light passing through it.

**Core Principles:**
- Translucent, layered surfaces with depth
- Subtle light refraction effects (not heavy glassmorphism — refined, not frosted)
- High contrast text on soft, luminous backgrounds
- Generous whitespace with purposeful density where data demands it
- Micro-animations that feel physical and responsive
- Dark mode as the PRIMARY theme (light mode secondary)

## Color System

Use CSS custom properties for consistency. The palette is built around deep, rich backgrounds with luminous accent colors.

```css
:root {
  /* Dark mode (primary) */
  --bg-base: #09090B;                  /* Near-black base */
  --bg-elevated: #18181B;              /* Card backgrounds */
  --bg-surface: #27272A;               /* Input fields, secondary surfaces */
  --bg-glass: rgba(255, 255, 255, 0.03); /* Glass panels */
  --bg-glass-hover: rgba(255, 255, 255, 0.06);
  --bg-glass-active: rgba(255, 255, 255, 0.09);

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-strong: rgba(255, 255, 255, 0.15);
  --border-glass: rgba(255, 255, 255, 0.08);

  /* Text */
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;
  --text-muted: #52525B;

  /* Location colors — each location gets a distinct luminous accent */
  --color-manhattan: #818CF8;          /* Indigo-400 — sophisticated */
  --color-manhattan-glow: rgba(129, 140, 248, 0.15);
  --color-staten-island: #22D3EE;     /* Cyan-400 — bridge/water */
  --color-staten-island-glow: rgba(34, 211, 238, 0.15);
  --color-morris-county: #34D399;     /* Emerald-400 — suburban green */
  --color-morris-county-glow: rgba(52, 211, 153, 0.15);

  /* Status / semantic */
  --color-positive: #4ADE80;           /* Green-400 — rank up, goals met */
  --color-negative: #F87171;           /* Red-400 — rank down, alerts */
  --color-warning: #FBBF24;           /* Amber-400 */
  --color-info: #60A5FA;              /* Blue-400 */

  /* Gradients */
  --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  --gradient-glow-manhattan: radial-gradient(ellipse at top, rgba(129,140,248,0.08) 0%, transparent 60%);
  --gradient-glow-staten: radial-gradient(ellipse at top, rgba(34,211,238,0.08) 0%, transparent 60%);
  --gradient-glow-morris: radial-gradient(ellipse at top, rgba(52,211,153,0.08) 0%, transparent 60%);

  /* Shadows */
  --shadow-glass: 0 0 0 1px var(--border-glass), 0 8px 40px rgba(0,0,0,0.3);
  --shadow-elevated: 0 0 0 1px var(--border-subtle), 0 4px 24px rgba(0,0,0,0.2);
  --shadow-glow-manhattan: 0 0 30px rgba(129,140,248,0.1);
  --shadow-glow-staten: 0 0 30px rgba(34,211,238,0.1);
  --shadow-glow-morris: 0 0 30px rgba(52,211,153,0.1);

  /* Blur */
  --blur-glass: 20px;
  --blur-heavy: 40px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;

  /* Transitions */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}

/* Light mode overrides (secondary — only if toggled) */
[data-theme="light"] {
  --bg-base: #FAFAFA;
  --bg-elevated: #FFFFFF;
  --bg-surface: #F4F4F5;
  --bg-glass: rgba(255, 255, 255, 0.7);
  --border-subtle: rgba(0, 0, 0, 0.04);
  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.12);
  --text-primary: #09090B;
  --text-secondary: #52525B;
  --text-tertiary: #A1A1AA;
}
```

## Typography

Load from Google Fonts. Do NOT use Inter, Roboto, Arial, or system defaults.

**Primary Font:** `"Instrument Sans"` — Clean, geometric, slightly humanist. Excellent for data-heavy interfaces.
**Display/Heading Font:** `"Plus Jakarta Sans"` — Bolder weight for headings. Distinctive without being quirky.
**Monospace (data):** `"JetBrains Mono"` — For keyword positions, metrics, code-like data.

```css
/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

body {
  font-family: 'Instrument Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, .display {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.metric-value, .rank-position, code {
  font-family: 'JetBrains Mono', monospace;
}
```

**Type Scale:**

| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| Page title | 28px / 1.75rem | 800 | -0.02em |
| Section heading | 20px / 1.25rem | 700 | -0.01em |
| Card title | 16px / 1rem | 600 | 0 |
| Body | 14px / 0.875rem | 400 | 0 |
| Label / Caption | 12px / 0.75rem | 500 | 0.02em |
| Metric large | 36px / 2.25rem | 700 | -0.03em |
| Metric medium | 24px / 1.5rem | 600 | -0.02em |
| Metric small | 16px / 1rem | 500 | 0 |

## Glass Card Component

The primary container. Every data panel uses this:

```css
.glass-card {
  background: var(--gradient-glass);
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.glass-card:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-default);
  transform: translateY(-1px);
  box-shadow: var(--shadow-glass), 0 12px 48px rgba(0,0,0,0.15);
}

/* Location-specific glow variant */
.glass-card[data-location="manhattan"] {
  background: var(--gradient-glow-manhattan), var(--gradient-glass);
  box-shadow: var(--shadow-glass), var(--shadow-glow-manhattan);
}

.glass-card[data-location="staten-island"] {
  background: var(--gradient-glow-staten), var(--gradient-glass);
  box-shadow: var(--shadow-glass), var(--shadow-glow-staten);
}

.glass-card[data-location="morris-county"] {
  background: var(--gradient-glow-morris), var(--gradient-glass);
  box-shadow: var(--shadow-glass), var(--shadow-glow-morris);
}
```

## shadcn/ui Customization

Override shadcn defaults to match the liquid glass system. After installing each component via `npx shadcn@latest add [component]`, modify the generated files:

**Key overrides:**
- All card/dialog/sheet backgrounds → use `var(--bg-glass)` with `backdrop-filter: blur(20px)`
- All borders → use `var(--border-glass)` or `var(--border-subtle)`
- All border-radius → use `var(--radius-lg)` minimum (no sharp corners)
- Button primary → subtle gradient with location color, slight glow on hover
- Inputs → `var(--bg-surface)` background, `var(--border-default)` border, `var(--radius-md)`
- Tooltips → glass background with backdrop blur
- Tabs → underline style, not boxed. Active tab gets location color underline with glow

## Chart Styling (Recharts)

Charts must feel integrated with the glass aesthetic, not like default Recharts:

```typescript
// Shared chart theme configuration
export const chartTheme = {
  // Grid lines
  cartesianGrid: {
    strokeDasharray: '3 3',
    stroke: 'rgba(255, 255, 255, 0.04)',
    vertical: false, // Horizontal lines only for cleaner look
  },
  // Axes
  xAxis: {
    stroke: 'rgba(255, 255, 255, 0.06)',
    tick: { fill: '#71717A', fontSize: 12, fontFamily: 'Instrument Sans' },
    axisLine: false,
    tickLine: false,
  },
  yAxis: {
    stroke: 'rgba(255, 255, 255, 0.06)',
    tick: { fill: '#71717A', fontSize: 12, fontFamily: 'JetBrains Mono' },
    axisLine: false,
    tickLine: false,
    width: 40,
  },
  // Tooltip
  tooltip: {
    contentStyle: {
      background: 'rgba(24, 24, 27, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      padding: '12px 16px',
      fontFamily: 'Instrument Sans',
      fontSize: '13px',
      color: '#FAFAFA',
    },
    cursor: { stroke: 'rgba(255, 255, 255, 0.1)' },
  },
  // Location colors for series
  colors: {
    manhattan: '#818CF8',
    statenIsland: '#22D3EE',
    morrisCounty: '#34D399',
  },
  // Area chart gradients (define in SVG defs)
  areaGradients: {
    manhattan: { start: 'rgba(129, 140, 248, 0.3)', end: 'rgba(129, 140, 248, 0)' },
    statenIsland: { start: 'rgba(34, 211, 238, 0.3)', end: 'rgba(34, 211, 238, 0)' },
    morrisCounty: { start: 'rgba(52, 211, 153, 0.3)', end: 'rgba(52, 211, 153, 0)' },
  },
};
```

**Chart types and when to use them:**

| Data | Chart Type | Notes |
|------|-----------|-------|
| Keyword rank over time | Line chart (inverted Y — lower is better) | Smooth curves, area fill |
| Traffic trend | Area chart | Stacked for location comparison |
| Location comparison | Grouped bar chart | Side by side, 3 location colors |
| Keyword distribution | Donut chart | Show category breakdown per location |
| Competitor radar | Radar/Spider chart | Compare our ranks vs competitors |
| Health score | Radial progress | Single metric, animated on load |
| GBP actions | Horizontal bar | Compare phone/web/directions |
| Rank changes | Sparkline + delta chip | Inline in tables |

## Micro-Animations

Use Framer Motion (`framer-motion` package) for page transitions and component entrances:

```typescript
// Page entrance
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.2 } },
};

// Staggered card entrance
export const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// Number counter animation for metrics
// Use a custom hook that animates from 0 to target value on mount
export const useAnimatedValue = (target: number, duration = 800) => { ... };

// Rank change indicator
// Green up arrow slides in from below, red down arrow from above
// Position number morphs between values
```

## Layout Structure

### Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────┐                                  ┌──────────┐ │
│  │ Logo │  SEO Intelligence                │ Settings │ │
│  └──────┘                                  └──────────┘ │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  Dashboard│  [Page Content Area]                        │
│  Keywords │                                              │
│  Content  │  Cards use glass-card with location glow    │
│  Locations│  when showing location-specific data        │
│  Compete  │                                              │
│  Technical│                                              │
│  Reports  │                                              │
│          │                                              │
│          │                                              │
│  ────────│                                              │
│  Settings│                                              │
│  Logout  │                                              │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
```

- Sidebar: Fixed, 240px wide, glass background with subtle border
- Sidebar nav items: Icon + label, active state uses location-colored left border
- Main content: Scrollable, max-width 1400px, padded 32px
- Header bar within content area shows page title + date range picker + location filter

### Client Portal Layout

Simpler — no sidebar. Top navigation only:

```
┌─────────────────────────────────────────────────────────┐
│  Muchnik Elder Law    Overview  Locations  Reviews      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Full-width content area]                              │
│                                                         │
│  Focus on large, digestible metric cards                │
│  and simple trend charts                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Responsive Behavior

- **Desktop (1024px+):** Full layout with sidebar (admin) or top nav (portal)
- **Tablet (768-1023px):** Collapsible sidebar, 2-column card grid
- **Mobile (< 768px):** Bottom tab navigation, single column, cards stack vertically
- Charts resize gracefully — use Recharts' `ResponsiveContainer`
- Tables become scrollable card lists on mobile

## Key Component Patterns

### MetricCard
Displays a single KPI with trend indicator:
- Large metric value (JetBrains Mono, 36px)
- Label above (Instrument Sans, 12px, secondary color)
- Trend chip below: green/red pill with arrow + percentage/value change
- Optional sparkline in the background (very subtle, 20% opacity)

### LocationCard
Glass card with location-colored glow at top:
- Top gradient bar in location color (4px height, full width, rounded top)
- Location name + address
- 3-4 key metrics in a grid inside the card
- Click to drill into location detail

### RankBadge
Shows a keyword's current position:
- Circular badge with position number (JetBrains Mono)
- Color-coded: positions 1-3 = gold/silver/bronze, 4-10 = green, 11-20 = yellow, 21+ = red
- Small arrow indicator for change since last check

### TrendIndicator
Inline component for showing metric changes:
- Up arrow + green text for positive change
- Down arrow + red text for negative change
- Dash + gray for no change
- For rankings, INVERT the color logic (lower position = better = green)

## Do NOT Do

- No heavy drop shadows that look like 2015 Material Design
- No pure white backgrounds (even in light mode, use off-white)
- No thick borders — everything is 1px max, low opacity
- No rounded pill buttons everywhere — use subtle rectangular with generous radius
- No gratuitous color — the dark background is the hero, accents are purposeful
- No default Recharts styling — always customize
- No generic dashboard templates — every view should feel crafted
- No loading spinners — use skeleton shimmer animations matching the glass card shapes
