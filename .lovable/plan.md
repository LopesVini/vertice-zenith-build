

## Plan: Replace Logo and Add Prominence

### What changes

1. **Copy the transparent PNG logo** (`WhatsApp_Image_2026-03-27_at_21.26.53-removebg-preview.png`) to `src/assets/logo-vertice.png`, replacing the current generated logo.

2. **Copy the JPEG version** (`WhatsApp_Image_2026-03-27_at_21.26.53.jpeg`) to `src/assets/logo-vertice-full.jpg` for use in the hero section.

3. **Navbar** (`src/components/Navbar.tsx`): Increase logo height from `h-10` to `h-14` so it's more visible in the navigation bar.

4. **HeroSection** (`src/components/HeroSection.tsx`): Add the transparent logo prominently above the hero headline text, large size (~`h-32` to `h-40`), with a subtle fade-in animation. This gives the logo strong visual presence on first load.

5. **Footer** (`src/components/Footer.tsx`): Increase logo from `h-12` to `h-16` for better visibility.

### Technical details

- The transparent PNG will be the primary logo used everywhere (navbar, hero, footer).
- The JPEG version serves as a fallback reference but the transparent version is preferred for clean integration against dark/colored backgrounds.
- In the hero, the logo will be placed centered above the main headline with `motion.img` for a smooth entrance animation.
- The `brightness-0 invert` filter on the footer logo will be reviewed — since the real logo has navy/blue colors, it may need adjustment for dark backgrounds.

