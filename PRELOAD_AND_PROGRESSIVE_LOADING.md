# Preload on Hover + Progressive Loading Implementation

## Overview

This implementation combines **hover preloading** and **progressive image loading** to dramatically improve the perceived performance when expanding image tiles.

## How It Works

### 1. **Hover Preloading** ???

When a user hovers over an image tile:
- After a 100ms delay (to avoid preloading on accidental hovers), the component starts downloading the full-resolution image in the background
- The image is cached so if the user clicks, it's already ready
- Multiple tiles with the same URL share the same cached image (no duplicate downloads)

**Implementation:**
- `_attachHoverPreload()` - Attaches hover listeners to image tiles
- `_preloadFullImage()` - Creates an `Image` object to preload the full URL
- `imageLoadCache` - Shared cache to prevent duplicate requests
- `preloadedImages` - Maps tiles to their preloaded images

### 2. **Progressive Loading** ??

When a user clicks an image tile:

**If image was preloaded (from hover):**
- Preview shows immediately (instant feedback)
- Full image fades in smoothly since it's already cached
- Total perceived delay: ~0ms

**If image wasn't preloaded:**
- Preview shows immediately (blurred, scaled up slightly)
- Full image downloads in background
- When loaded, preview fades out while full image fades in
- Smooth 0.4s transition creates a polished feel

**Visual Effect:**
```
[Click] ? Preview (blurred) ? [Load] ? Full Image (sharp) fades in
```

## Technical Details

### CSS Classes

- `.progressive-image-container` - Container for both images
- `.progressive-image-preview` - Preview image (blurred, shown first)
- `.progressive-image-full` - Full image (opacity 0 ? 1 when loaded)
- `.progressive-image-full.loaded` - Applied when full image is ready (triggers fade-in)
- `.progressive-image-preview.hidden` - Applied when full image loads (fades out preview)

### Key Methods

1. **`_attachHoverPreload(tile, item)`**
   - Adds `mouseenter` listener with 100ms delay
   - Calls `_preloadFullImage()` to start download

2. **`_preloadFullImage(fullUrl, tile)`**
   - Checks cache first (avoids duplicate requests)
   - Creates `new Image()` and sets `src` to start download
   - Stores in cache and maps to tile

3. **`_generateProgressiveImageHTML(item, tile)`**
   - Generates HTML with both preview and full image
   - Checks if image was preloaded and already loaded
   - If preloaded: adds `loaded` class immediately
   - If not: `loaded` class added via event listener

4. **`_setupProgressiveImageFade(tile)`**
   - Sets up event listeners for non-preloaded images
   - Waits for `load` event, then triggers fade-in
   - Handles errors gracefully (keeps preview visible)

## Performance Benefits

### Before:
- Click ? Wait for full image download ? Display
- Large images (2000px) could take 1-3 seconds
- **INP: ~1000ms+ presentation delay**

### After:
- **Hover ? Preload starts** (if user hovers)
- **Click ? Preview shows instantly** (0ms delay)
- **Full image fades in** when ready (smooth transition)
- **INP: <200ms** (instant visual feedback)

## Edge Cases Handled

1. **Image fails to load** - Preview stays visible, no broken state
2. **User clicks before hover completes** - Progressive loading still works
3. **Multiple tiles with same URL** - Shared cache prevents duplicate downloads
4. **User hovers but doesn't click** - Image stays cached for next time
5. **User clicks different tile** - Previous preload stays cached

## Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses standard `Image` API and CSS transitions
- Gracefully degrades if hover events aren't supported

## Testing Tips

1. **Test hover preloading:**
   - Hover over a tile, wait 100ms
   - Check Network tab - full image should start downloading
   - Click immediately - should show full image instantly

2. **Test progressive loading:**
   - Click a tile without hovering
   - Should see blurred preview immediately
   - Full image should fade in after download completes

3. **Test error handling:**
   - Use a broken image URL
   - Preview should stay visible (no broken image state)

## Future Optimizations

Potential improvements:
- Adjust blur amount or transition duration
- Add loading spinner during progressive load
- Preload images for visible tiles (not just on hover)
- Use `srcset` for responsive images
- Implement WebP with fallback
