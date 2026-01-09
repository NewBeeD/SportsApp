# SportsApp Centralized Color Scheme Documentation

## Overview

All colors in the SportsApp are now managed centrally through **`src/css/theme.js`**. This document explains the color system and how to use it throughout the application.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Color Meanings](#color-meanings)
3. [Usage Guide](#usage-guide)
4. [Changing Colors](#changing-colors)
5. [Color Codes](#color-codes)

---

## Color Palette

### Primary Colors (Blues)
- **`primary`**: `#2196F3` - Bright Blue (main actions, accents, headings)
- **`primaryDark`**: `#1565C0` - Darker Blue (hover states, deep emphasis)
- **`primaryLight`**: `#64B5F6` - Light Blue (backgrounds, subtle accents)

### Secondary Colors (Oranges)
- **`secondary`**: `#FF6B35` - Vibrant Orange (highlights, calls-to-action)
- **`secondaryDark`**: `#E55100` - Dark Orange (hover states, emphasis)
- **`secondaryLight`**: `#FFAB91` - Light Orange (backgrounds, accents)

### Accent Colors (Purples)
- **`accent`**: `#7C3AED` - Vivid Purple (featured content, special sections, gradient accents)
- **`accentDark`**: `#5B21B6` - Dark Purple (hover states)
- **`accentLight`**: `#C4B5FD` - Light Purple (backgrounds)

### Status & Feedback Colors
- **`success`**: `#4CAF50` - Green (success messages, positive feedback, confirmation)
- **`successLight`**: `#A5D6A7` - Light Green (success backgrounds)
- **`warning`**: `#FF9800` - Orange (warnings, cautions, attention needed)
- **`warningLight`**: `#FFE0B2` - Light Orange (warning backgrounds)
- **`error`**: `#F44336` - Red (errors, destructive actions, failures)
- **`errorLight`**: `#FFCDD2` - Light Red (error backgrounds)

### Neutral Colors (Grays & Whites)
- **`background`**: `#FFFFFF` - Pure White (main page backgrounds)
- **`lightGray`**: `#F5F5F5` - Very Light Gray (hover states, subtle backgrounds)
- **`surface`**: `#FAFAFA` - Light Gray (cards, surfaces, secondary backgrounds)
- **`surfaceDark`**: `#E0E0E0` - Medium Gray (borders, dividers)

### Text Colors
- **`textPrimary`**: `#1a1a1a` - Almost Black (main text, strong emphasis)
- **`textSecondary`**: `#555555` - Gray (secondary text, less emphasis)
- **`textTertiary`**: `#888888` - Light Gray (tertiary text, hints, helpers)
- **`textInverse`**: `#FFFFFF` - White (text on dark backgrounds)

### Border & Divider Colors
- **`border`**: `#D3E1FF` - Light Blue-tinted (borders, subtle separators)
- **`divider`**: `rgba(0, 0, 0, 0.05)` - Transparent Black (very subtle dividers)

### Legacy Colors (Backward Compatibility)
- **`color1`**: `#222629` - Dark (preserved for legacy code)
- **`color2`**: `#61892F` - Olive Green (preserved for legacy code)
- **`color3`**: `#86C232` - Light Green (preserved for legacy code)
- **`color4`**: `#474B4F` - Dark Gray (preserved for legacy code)
- **`color5`**: `#6B6E70` - Medium Gray (preserved for legacy code)

---

## Color Meanings

### Brand Identity
- **Primary (Blue)**: Main brand color used for primary actions, links, headings, and core UI elements
- **Secondary (Orange)**: Calls-to-action, highlights, and important secondary elements
- **Accent (Purple)**: Featured sections, special content, gradients, and emphasis

### User Feedback & Status
- **Success (Green)**: Positive outcomes, confirmations, "all clear" states
- **Warning (Orange)**: Cautions, alerts, "be careful" states
- **Error (Red)**: Problems, failures, destructive actions, "urgent" states

### Text Hierarchy
- **Primary Text**: Main content, headings, important information
- **Secondary Text**: Supporting content, less emphasis
- **Tertiary Text**: Hints, helpers, metadata, timestamps
- **Inverse Text**: Text that appears on dark/colored backgrounds

### Visual Elements
- **Background**: Page backgrounds, main canvas
- **Light Gray**: Hover states, subtle backgrounds, alternating rows
- **Surface**: Card backgrounds, contained elements, surfaces
- **Borders**: Element separators, subtle boundaries
- **Dividers**: Very subtle separators between sections

---

## Usage Guide

### In React Components (JSX)

#### 1. Import the Theme
```javascript
import theme from '../css/theme';
```

#### 2. Use in Inline Styles
```javascript
<Box sx={{ color: theme.colors.primary }}>
  Primary Blue Text
</Box>
```

#### 3. Use in Material-UI Components
```javascript
<Typography sx={{ color: theme.colors.textPrimary }}>
  Main heading text
</Typography>

<Button sx={{ backgroundColor: theme.colors.primary, color: theme.colors.textInverse }}>
  Action Button
</Button>
```

#### 4. Use in Gradients
```javascript
<Card sx={{
  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`
}}>
  Gradient Card
</Card>
```

#### 5. Use with Transparency
```javascript
<Box sx={{
  backgroundColor: `rgba(${parseInt(theme.colors.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.primary.slice(5, 7), 16)}, 0.1)`
}}>
  Semi-transparent Primary Color
</Box>
```

#### 6. Use in CSS Classes
```javascript
<div className="my-element" style={{ borderColor: theme.colors.border }}>
  Content
</div>
```

### In CSS Files

CSS files cannot directly import the theme.js file, so:

1. **Use inline styles when possible** (converted to JSX `sx` prop)
2. **Reference hardcoded values in comments** with a note to update both theme.js and CSS
3. **Update CSS colors alongside theme.js** when making changes

Example CSS file structure:
```css
/* 
  COLORS REFERENCED FROM: src/css/theme.js
  Primary: #2196F3
  If updating colors, modify theme.js AND this file
*/

.my-class {
  color: #2196F3; /* Update both places when changing */
  background: #F5F5F5; /* lightGray from theme */
}
```

---

## Changing Colors

### ⚠️ Global Color Change (Easy!)

To change all instances of a color throughout the app:

1. **Open** `src/css/theme.js`
2. **Find** the color variable you want to change
3. **Update** the hex value
4. **Save** the file

Example: Change primary brand color from blue to red
```javascript
// Before
primary: '#2196F3',  // Blue

// After
primary: '#FF0000',  // Red
```

### ✅ All Components Using That Color Will Update Automatically!

Components that use theme colors:
- ✅ `src/components/Video.jsx`
- ✅ `src/pages/DFA/FixturesPage.jsx`
- ✅ `src/pages/DFA/PlayerProfile.jsx`
- ✅ `src/pages/DFA/TeamPage.jsx`
- ✅ `src/GamePrediction/pages/PredictionGameDashboard.jsx`
- ✅ `src/GamePrediction/pages/GameweekStatsPage.jsx`
- ✅ `src/GamePrediction/pages/AdminMatchManagementPage.jsx`
- ✅ `src/GamePrediction/pages/LeaderboardPage.jsx`
- ✅ `src/GamePrediction/components/PredictionForm.jsx`
- ✅ `src/GamePrediction/components/PredictionComparison.jsx`
- ✅ `src/GamePrediction/components/UserStatsCard.jsx`
- ✅ `src/pages/TermsOfService.jsx`
- ✅ `src/pages/PrivacyPolicy.jsx`

### CSS File Updates

CSS files that reference theme colors (with update notes):
- `src/pages/PolicyPages.css` - Primary color changed to `#2196F3`, secondary to gradient

### Manual CSS Updates Needed

When changing colors, also update:
1. `src/pages/PolicyPages.css` - Contains inline color references
2. Any other CSS files with hardcoded colors (search for `#` followed by hex values)

---

## Color Codes

### Quick Reference Chart

| Name | Hex | Usage |
|------|-----|-------|
| primary | `#2196F3` | Main brand, links, headings |
| primaryDark | `#1565C0` | Hover states, emphasis |
| primaryLight | `#64B5F6` | Backgrounds, subtle accents |
| secondary | `#FF6B35` | Highlights, CTAs |
| secondaryDark | `#E55100` | Secondary hover states |
| secondaryLight | `#FFAB91` | Secondary backgrounds |
| accent | `#7C3AED` | Featured content, gradients |
| accentDark | `#5B21B6` | Accent hover/emphasis |
| accentLight | `#C4B5FD` | Accent backgrounds |
| success | `#4CAF50` | Success messages, confirmations |
| warning | `#FF9800` | Warnings, cautions |
| error | `#F44336` | Errors, failures, destructive |
| background | `#FFFFFF` | Main background |
| lightGray | `#F5F5F5` | Hover states, subtle backgrounds |
| surface | `#FAFAFA` | Card backgrounds |
| surfaceDark | `#E0E0E0` | Borders |
| textPrimary | `#1a1a1a` | Main text |
| textSecondary | `#555555` | Secondary text |
| textTertiary | `#888888` | Tertiary text |
| textInverse | `#FFFFFF` | Text on dark backgrounds |
| border | `#D3E1FF` | Borders |

### Color Harmony

The color scheme uses:
- **Primary (Blue)** - Cool, trustworthy, professional
- **Secondary (Orange)** - Warm, energetic, action-oriented
- **Accent (Purple)** - Premium, sophisticated, attention-grabbing
- **Success/Warning/Error** - Standard feedback colors (universally understood)

---

## Best Practices

### ✅ Do
- Use theme colors for all new components
- Use semantic color names (e.g., `success` instead of inventing a new green)
- Use `theme.colors.*` variables instead of hardcoding hex values
- Update theme.js when changing colors globally
- Use primary/secondary/accent for major visual hierarchy

### ❌ Don't
- Hardcode hex values in components (use theme instead)
- Create new color variables for single-use scenarios
- Use legacy colors (`color1`-`color5`) in new code
- Forget to update both theme.js AND CSS files together

### 💡 Tips
- Use `primaryLight` for hover backgrounds (e.g., `#F9F9F9` effect)
- Use `lightGray` for row alternation in tables
- Use `border` for subtle element separators
- Use `textTertiary` for timestamps, subtitles, and metadata
- Use transparency with primary color: `rgba(33, 150, 243, 0.1)` for subtle backgrounds

---

## Migration Status

### ✅ Components Updated to Use Theme
- Video component
- All DFA pages
- All GamePrediction pages
- Policy pages

### 🔄 Partially Updated
- Some inline styles still have hardcoded colors for backward compatibility
- Legacy color references preserved for gradual migration

### 📝 Future Updates
- Convert remaining CSS-only components to theme-based styling
- Create Material-UI theme provider for automatic Material-UI component theming
- Add dark mode support using theme variants

---

## Questions or Issues?

If a component isn't using the centralized theme:
1. Search for hex color values (`#`) in the component file
2. Import theme: `import theme from '../css/theme'`
3. Replace hex values with `theme.colors.{colorName}`
4. Test the component for visual consistency

For CSS-only components that need color updates:
1. Find the hardcoded hex values in the CSS
2. Create corresponding inline styles in the JSX component
3. Use theme color references in the inline styles

---

**Last Updated**: January 2025
**Theme File**: `src/css/theme.js`
