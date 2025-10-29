# Parallax Floating Component Integration

## ✅ Completed Setup

The parallax floating component has been successfully integrated into the Founders Fest website.

### Files Created

1. **`components/ui/parallax-floating.tsx`**
   - Main parallax floating component with Floating and FloatingElement exports
   - Uses `motion/react` for animations
   - Implements depth-based parallax effect with mouse tracking

2. **`hooks/use-mouse-position-ref.ts`**
   - Custom hook for tracking mouse/touch position
   - Supports relative positioning within container elements
   - Handles both mouse and touch events

3. **`components/ParallaxSection.tsx`**
   - Wrapper component using the parallax floating component
   - Contains 8 Founders Fest themed images from Unsplash
   - Styled with black/yellow theme matching the site

### Integration

- Component integrated into `pages/index.tsx` below the Hero section
- Uses Tailwind CSS for styling
- Fully responsive design
- Matches Founders Fest color scheme (black/yellow)

### Dependencies Added

- `motion` package (v10.16.4) - Required for `motion/react` imports

### Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **View the parallax section:**
   - Navigate to the home page
   - Scroll below the hero section
   - Move your mouse over the parallax section to see the floating effect

### Customization

You can customize the ParallaxSection component:
- Replace images in `foundersFestImages` array
- Adjust `depth` values for different parallax intensities
- Modify `sensitivity` prop on Floating component
- Update styling in the className props

### Project Structure

```
founders_fest/
├── components/
│   ├── ui/
│   │   └── parallax-floating.tsx  ✅ Created
│   └── ParallaxSection.tsx        ✅ Created
├── hooks/
│   └── use-mouse-position-ref.ts  ✅ Created
└── pages/
    └── index.tsx                  ✅ Updated
```

## Features

- ✨ Smooth parallax scrolling effect
- 🖱️ Mouse position tracking
- 📱 Touch device support
- 🎨 Founders Fest themed styling
- 📱 Fully responsive
- ⚡ Performance optimized with `will-change-transform`

