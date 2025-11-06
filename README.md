# Mosaic Grid Package

A framework-agnostic web component for creating beautiful, animated mosaic-style content grids. Display images, PDFs, videos, markdown files, and external links in a responsive grid layout with smooth expand/collapse animations.

> **Inspiration**: This package was originally inspired by the beautiful mosaic grid design from [CodePen by iamsaief](https://codepen.io/iamsaief/pen/jObaoKo). We've reimagined it as a reusable, type-safe web component with enhanced features including lazy loading, custom previews, and support for multiple content types.

## Features

- **Responsive Mosaic Layout** - Automatic grid layout with customizable tile sizes (normal, wide, tall, big)
- **Multiple Content Types** - Support for images, PDFs, videos, markdown files, external links, and custom content
- **Modular Card Architecture** - Cards are separate components, making customization and testing easier
- **Card Overlays & Actions** - Add custom overlays (dropdown menus, icons, etc.) and action buttons to any card
- **Lazy Loading** - Images load automatically as they enter the viewport for optimal performance
- **Custom Previews** - Use custom HTML or render functions for tile previews (gradients, icons, etc.)
- **Smooth Animations** - CSS transitions for expand/collapse interactions
- **Shadow DOM** - Encapsulated styles and markup, preventing conflicts
- **Framework Agnostic** - Works with any framework or vanilla JavaScript
- **TypeScript** - Full type safety with discriminated unions
- **Performance Optimized** - Uses `requestAnimationFrame` and GPU acceleration for smooth interactions
- **Comprehensive Test Suite** - Full test coverage using Vitest and jsdom

## Installation

```bash
npm install mosaic-grid-widget
```

## Live Demo

Try the interactive demos with beautiful nature images and various content types:

**Run locally:**
```bash
npm install
npm run dev
```

Then open one of these URLs in your browser:
- **Main Demo**: `http://localhost:5173` - Full-featured demo with 60+ images
- **Custom Card Overlays**: `http://localhost:5173/custom-card.html` - Demo showcasing dropdown menus

### Main Demo Features (`/`)
- 60+ beautiful landscape and nature images from Unsplash
- Responsive mosaic grid layout with various tile sizes
- Click any tile to expand and view full content
- Add new images dynamically via the "+" tile
- Support for PDFs, Markdown files, and custom content types
- Smooth animations and lazy loading

The main demo showcases:
- Custom HTML previews (gradient tiles with icons)
- Lazy-loaded image previews
- Progressive image loading with fade-in effects
- Interactive modal for adding new images

### Custom Card Overlays Demo (`/custom-card.html`)
This demo demonstrates the **card overlay system** with interactive dropdown menus featuring **glassmorphism styling**:
- **Glassmorphism Design**: Beautiful frosted glass effect with backdrop blur on both the button and dropdown menu
- **Custom Dropdown Menus**: Each card has a `⋮` icon in the upper-right corner with a glass-like appearance
- **Click to Open**: Click the icon to open a dropdown menu with actions
- **Prevents Expansion**: Clicking the dropdown prevents card expansion, allowing custom interactions
- **Action Examples**: View Details, Edit, Share, Download, Delete (text-only, no emojis for clean design)
- **Real Functionality**: Includes clipboard sharing, download links, and confirmation dialogs
- **High Contrast Text**: White text with shadows for excellent readability over any background

This demo shows how to:
- Add custom overlays to cards using `cardOverlays.topRight`
- Create interactive dropdown menus that don't interfere with card expansion
- Handle click events and prevent event propagation
- Style custom overlays with modern glassmorphism effects
- Inject styles into Shadow DOM for proper styling isolation

## Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mosaic Grid Demo</title>
</head>
<body>
  <mosaic-grid-widget></mosaic-grid-widget>

  <script type="module">
    import 'mosaic-grid-widget';
    import { MosaicItem } from 'mosaic-grid-widget/types';

    const items: MosaicItem[] = [
      {
        id: '1',
        type: 'image',
        preview: 'https://example.com/thumb.jpg',
        full: 'https://example.com/full.jpg',
        layout: 'normal',
        title: 'My Image'
      },
      {
        id: '2',
        type: 'pdf',
        preview: 'https://example.com/pdf-thumb.png',
        src: 'https://example.com/document.pdf',
        layout: 'tall',
        title: 'My PDF'
      }
    ];

    document.addEventListener('DOMContentLoaded', () => {
      const grid = document.querySelector('mosaic-grid-widget');
      if (grid) {
        grid.items = items;
      }
    });
  </script>
</body>
</html>
```

## How It Works

### Architecture

The package uses a **modular architecture** with separate components for the grid and cards:

1. **MosaicGridWidget** (`mosaic-grid.ts`): The main container component that:
   - Manages grid layout and state
   - Coordinates card interactions (only one expanded at a time)
   - Handles intersection observer for lazy loading
   - Manages shared image cache and preloading

2. **MosaicCard** (`card.ts`): Individual card components that:
   - Handle their own preview and expanded content rendering
   - Manage overlays and action buttons
   - Support progressive image loading
   - Emit events for grid coordination

3. **Custom Element**: `<mosaic-grid-widget>` is registered as a custom HTML element
4. **Shadow DOM**: Styles and markup are encapsulated to prevent conflicts with your page styles
5. **CSS Grid**: Uses CSS Grid Layout for responsive, flexible positioning
6. **Type Safety**: TypeScript discriminated unions ensure type-safe content definitions

### Modular Design Benefits

- **Separation of Concerns**: Grid handles layout, cards handle content
- **Extensibility**: Easy to add custom overlays, actions, and UI elements
- **Testability**: Cards can be tested independently from the grid
- **Reusability**: Cards can potentially be used outside the grid context
- **Maintainability**: Smaller, focused modules are easier to understand and modify

### Component Lifecycle

1. **Connected**: When the element is added to the DOM, it renders the grid structure
2. **Data Assignment**: Setting the `items` property populates the grid with tiles
3. **Interaction**: Clicking a tile expands it, showing the full content inline
4. **Reset**: Clicking again or clicking the background collapses the expanded tile

### Grid Layout System

The component uses CSS Grid with `auto-fit` and `minmax` for responsive behavior:

- **Normal**: 1?1 grid cell (default)
- **Wide**: Spans 2 columns
- **Tall**: Spans 2 rows
- **Big**: Spans 2?2 cells

The grid automatically adjusts based on screen size:
- Mobile: Expanded tiles span 2?2 cells
- Desktop (?768px): Expanded tiles span 3?3 cells

### Content Type Handling

The component handles different content types through a discriminated union pattern:

- **Image**: Displays preview as background, full image on expand. Previews are lazy-loaded by default. Supports progressive loading with fade-in effects.
- **PDF**: Embeds PDF in an iframe when expanded
- **Video**: Shows video player with controls
- **Markdown**: Fetches and displays markdown content (currently as plain text)
- **External Link**: Opens URL in new tab
- **Custom**: Uses a custom handler function to render content on click

### Card Customization

Each card can be customized with overlays and actions:

- **Overlays**: Add custom HTML elements at specific positions (top-right, top-left, bottom-right, bottom-left, center)
- **Actions**: Add action buttons (e.g., dropdown menus, edit buttons) that prevent card expansion when clicked
- **Custom Content**: Overlays can contain any HTML, including interactive elements like dropdowns, modals, or forms

### Lazy Loading

Images are automatically lazy-loaded using the Intersection Observer API. Images start loading when they're within 200px of the viewport, improving initial page load performance. Custom HTML previews (`previewHtml` or `previewRenderer`) are rendered immediately and bypass lazy loading.

## API Reference

### Custom Element

```html
<mosaic-grid-widget></mosaic-grid-widget>
```

### Properties

#### `items` (setter)

Sets the grid items. Accepts an array of `MosaicItem` objects.

```typescript
grid.items = [
  { id: '1', type: 'image', preview: '...', full: '...' },
  // ... more items
];
```

### Types

#### `MosaicItem`

The base type for all grid items. Uses discriminated unions based on the `type` field.

```typescript
type MosaicItem = ImageItem | PdfItem | MarkdownItem | VideoItem | LinkItem | CustomItem
```

#### `ImageItem`

```typescript
{
  id: string;
  type: 'image';
  preview: string;      // URL for thumbnail/background (lazy-loaded)
  full: string;         // URL for full-resolution image
  title?: string;       // Optional title
  layout?: LayoutType;  // 'normal' | 'wide' | 'tall' | 'big'
  previewHtml?: string; // Optional custom HTML for preview
  previewRenderer?: PreviewRenderHandler; // Optional function to generate preview HTML
}
```

#### `PdfItem`

```typescript
{
  id: string;
  type: 'pdf';
  preview: string;      // URL for PDF thumbnail
  src: string;          // URL to PDF file
  title?: string;
  layout?: LayoutType;
}
```

#### `MarkdownItem`

```typescript
{
  id: string;
  type: 'markdown';
  preview: string;      // URL for markdown thumbnail
  src: string;          // URL to markdown file
  title?: string;
  layout?: LayoutType;
}
```

#### `VideoItem`

```typescript
{
  id: string;
  type: 'video';
  preview: string;      // URL for video thumbnail
  src: string;          // URL to video file
  title?: string;
  layout?: LayoutType;
}
```

#### `LinkItem`

```typescript
{
  id: string;
  type: 'external_link';
  preview: string;      // URL for link thumbnail
  url: string;          // URL to open
  title?: string;
  layout?: LayoutType;
}
```

#### `CustomItem`

```typescript
{
  id: string;
  type: 'custom';
  preview: string;      // Fallback preview URL (for accessibility)
  handler: CustomRenderHandler; // Function that returns HTML when tile is clicked
  previewHtml?: string; // Optional custom HTML for preview
  previewRenderer?: PreviewRenderHandler; // Optional function to generate preview HTML
  title?: string;
  layout?: LayoutType;
  cardOverlays?: CardOverlays; // Optional custom overlays
  cardActions?: CardAction[];   // Optional action buttons
}
```

#### `CardOverlays`

```typescript
{
  topRight?: OverlayRenderer;    // Custom overlay at top-right
  topLeft?: OverlayRenderer;     // Custom overlay at top-left
  bottomRight?: OverlayRenderer;  // Custom overlay at bottom-right
  bottomLeft?: OverlayRenderer;   // Custom overlay at bottom-left
  center?: OverlayRenderer;      // Custom overlay at center
}
```

#### `CardAction`

```typescript
{
  icon?: string;              // Optional icon (emoji, SVG, or class name)
  label: string;               // Accessibility label
  onClick: (item: MosaicItem, cardElement: HTMLElement) => void;
  position?: OverlayPosition;  // Where to place the button (default: 'top-right')
}
```

#### `OverlayRenderer`

```typescript
type OverlayRenderer = (item: MosaicItem, cardElement: HTMLElement) => HTMLElement;
```

Function that receives the item and card element, returns an HTMLElement to be placed in the overlay position.

#### `LayoutType`

```typescript
type LayoutType = 'normal' | 'wide' | 'tall' | 'big';
```

#### `PreviewRenderHandler`

```typescript
type PreviewRenderHandler = (item: MosaicItem) => string;
```

Synchronous function that returns HTML string for tile preview. Used for custom previews that don't require async operations.

#### `CustomRenderHandler`

```typescript
type CustomRenderHandler = (item: MosaicItem) => Promise<string>;
```

Async function that returns HTML string when a custom tile is clicked. Used for dynamic content loading.

## Examples

### Image Gallery

```typescript
const imageGallery: MosaicItem[] = [
  {
    id: 'img1',
    type: 'image',
    preview: '/thumbnails/photo1-thumb.jpg',
    full: '/photos/photo1-full.jpg',
    layout: 'big',
    title: 'Sunset over mountains'
  },
  {
    id: 'img2',
    type: 'image',
    preview: '/thumbnails/photo2-thumb.jpg',
    full: '/photos/image2-full.jpg',
    layout: 'wide',
    title: 'Ocean waves'
  }
];
```

### Custom HTML Preview

```typescript
const customTile: MosaicItem = {
  id: 'custom1',
  type: 'image',
  preview: 'data:image/svg+xml,<svg>...</svg>', // Fallback
  full: 'https://example.com/image.jpg',
  previewHtml: `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <svg width="64" height="64"><circle cx="32" cy="32" r="24" fill="white"/></svg>
    </div>
  `,
  layout: 'normal'
};
```

### Custom Preview Renderer

```typescript
const customRendererTile: MosaicItem = {
  id: 'custom2',
  type: 'image',
  preview: 'fallback.jpg',
  full: 'https://example.com/image.jpg',
  previewRenderer: (item) => {
    // Generate custom HTML based on item properties
    return `<div style="background: radial-gradient(circle, ${item.id === 'custom2' ? '#ff6b6b' : '#4ecdc4'});
                        width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px;">Custom</span>
            </div>`;
  },
  layout: 'normal'
};
```

### Custom Content Handler

```typescript
const customContentTile: CustomItem = {
  id: 'custom3',
  type: 'custom',
  preview: 'placeholder.jpg',
  handler: async (item) => {
    // Fetch or generate content dynamically
    const response = await fetch('https://api.example.com/content');
    const data = await response.json();
    return `<div class="custom-content">${data.html}</div>`;
  },
  previewHtml: '<div style="background: #667eea; color: white; padding: 20px;">Click to load</div>',
  layout: 'normal'
};
```

### Card with Dropdown Menu Overlay

See the **live demo** at `/custom-card.html` for a complete working example!

```typescript
// Helper function to create dropdown menu
function createDropdownMenu(item: MosaicItem, cardElement: HTMLElement): HTMLElement {
  const container = document.createElement('div');
  container.className = 'dropdown-container';
  
  // Menu button (three dots icon)
  const button = document.createElement('button');
  button.innerHTML = '⋮';
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card expansion
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });
  
  // Dropdown menu
  const menu = document.createElement('div');
  menu.className = 'dropdown-menu';
  menu.style.display = 'none';
  
  // Menu items
  const items = [
    { label: 'Edit', action: () => console.log('Edit', item.id) },
    { label: 'Share', action: () => console.log('Share', item.id) },
    { label: 'Delete', action: () => console.log('Delete', item.id) },
  ];
  
  items.forEach(item => {
    const menuItem = document.createElement('button');
    menuItem.textContent = item.label;
    menuItem.addEventListener('click', (e) => {
      e.stopPropagation();
      item.action();
      menu.style.display = 'none';
    });
    menu.appendChild(menuItem);
  });
  
  container.appendChild(button);
  container.appendChild(menu);
  return container;
}

// Use in your item
const itemWithDropdown: ImageItem = {
  id: 'img-with-menu',
  type: 'image',
  preview: 'thumb.jpg',
  full: 'full.jpg',
  cardOverlays: {
    topRight: createDropdownMenu
  }
};
```

### Card with Action Buttons

```typescript
const itemWithActions: ImageItem = {
  id: 'img-with-actions',
  type: 'image',
  preview: 'thumb.jpg',
  full: 'full.jpg',
  cardActions: [
    {
      icon: '✏️',
      label: 'Edit',
      position: 'top-right',
      onClick: (item, cardElement) => {
        console.log('Edit clicked for', item.id);
        // Open edit modal, etc.
      }
    },
    {
      icon: '🗑️',
      label: 'Delete',
      position: 'top-right',
      onClick: (item, cardElement) => {
        if (confirm('Delete this item?')) {
          // Delete logic
        }
      }
    }
  ]
};
```

### Mixed Content Grid

```typescript
const mixedContent: MosaicItem[] = [
  {
    id: 'doc1',
    type: 'pdf',
    preview: '/thumbnails/report-thumb.png',
    src: '/documents/annual-report.pdf',
    layout: 'tall',
    title: 'Annual Report 2024'
  },
  {
    id: 'readme',
    type: 'markdown',
    preview: '/thumbnails/readme-thumb.png',
    src: 'https://raw.githubusercontent.com/user/repo/main/README.md',
    layout: 'normal',
    title: 'Project README'
  },
  {
    id: 'video1',
    type: 'video',
    preview: '/thumbnails/video-thumb.jpg',
    src: '/videos/demo.mp4',
    layout: 'wide',
    title: 'Product Demo'
  },
  {
    id: 'link1',
    type: 'external_link',
    preview: '/thumbnails/external-thumb.png',
    url: 'https://example.com',
    layout: 'normal',
    title: 'Visit Website'
  }
];
```

## Styling

The component uses Shadow DOM, so styles are encapsulated. However, you can style the component's container:

```css
mosaic-grid-widget {
  display: block;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
```

The internal grid uses:
- CSS Grid with auto-fit columns
- Smooth CSS transitions for animations
- Hover effects on tiles
- Responsive breakpoints at 768px
- GPU acceleration for smooth transforms

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any browser supporting:
  - Custom Elements API
  - Shadow DOM
  - CSS Grid
  - Intersection Observer API (for lazy loading)

## Development

### Building

```bash
npm run build
```

Builds the package to `dist/` directory with both ES module and UMD formats.

### Development Server

```bash
npm run dev
```

Starts Vite dev server with the demo page.

### Testing

```bash
npm test
```

Runs Vitest test suite with jsdom environment.

#### How We Test Front-End UI Without Playwright

This project uses **Vitest** with **jsdom** to test the web component without needing a real browser or Playwright. Here's how it works:

**1. jsdom Environment**
- **jsdom** is a JavaScript implementation of the DOM and HTML standards
- It provides a virtual browser environment in Node.js
- We can create DOM elements, attach event listeners, and query the DOM just like in a real browser

**2. Shadow DOM Testing**
- Web Components use Shadow DOM, which jsdom fully supports
- We can access shadow roots using `element.shadowRoot`
- Tests query elements within the shadow DOM to verify rendering

**3. Mock IntersectionObserver**
- The Intersection Observer API isn't available in jsdom by default
- We create a mock implementation that simulates intersection events
- This allows us to test lazy loading behavior

**4. Event Simulation**
- We simulate user interactions using `element.click()`, `element.dispatchEvent()`, etc.
- `requestAnimationFrame` is available in jsdom, allowing us to test async DOM updates
- We use `await` with `requestAnimationFrame` to ensure DOM updates complete

**5. What We Test**
- **Card Creation**: Verify cards are created with correct structure and attributes
- **Preview Rendering**: Test different preview types (HTML, renderer, lazy-loaded images)
- **Expansion/Collapse**: Verify cards expand and collapse correctly
- **Overlays & Actions**: Test custom overlays and action buttons render and function
- **Grid Coordination**: Test that only one card expands at a time
- **Lazy Loading**: Verify images load when they intersect the viewport
- **Content Types**: Test all content types (image, PDF, video, markdown, custom)

**6. Test Structure**
```
tests/
├── card.test.ts          # Unit tests for MosaicCard class
├── mosaic-grid.test.ts   # Integration tests for MosaicGridWidget
```

**Benefits of This Approach:**
- ✅ **Fast**: No browser startup overhead, tests run in milliseconds
- ✅ **Reliable**: No flaky browser-related timing issues
- ✅ **CI/CD Friendly**: Works in any environment without browser dependencies
- ✅ **Comprehensive**: Can test all logic, DOM manipulation, and component behavior
- ✅ **Easy Debugging**: Simple console.log debugging, no browser DevTools needed

**Limitations:**
- ❌ **Visual Testing**: Can't verify actual visual appearance (colors, spacing, etc.)
- ❌ **Browser-Specific Bugs**: Won't catch browser-specific rendering issues
- ❌ **Performance**: Can't measure real-world performance metrics

For visual regression testing or browser-specific testing, you could add Playwright/Cypress as an additional test layer, but for component logic and behavior, jsdom is sufficient and much faster.

### Project Structure

```
mosaic-grids/
├── src/
│   ├── mosaic-grid.ts    # Main grid component (MosaicGridWidget)
│   ├── card.ts           # Card component (MosaicCard)
│   └── types.ts          # TypeScript type definitions
├── demo/
│   ├── index.html        # Demo page
│   └── main.ts           # Demo implementation
├── tests/
│   ├── card.test.ts      # Card component tests
│   └── mosaic-grid.test.ts  # Grid integration tests
├── dist/                 # Built files
└── package.json
```

## Technical Details

### Shadow DOM Isolation

The component uses Shadow DOM with `mode: 'open'` to:
- Isolate styles from the parent page
- Prevent CSS conflicts
- Encapsulate component internals

### Performance Optimizations

The component includes several performance optimizations:

- **Lazy Loading**: Images load on-demand using Intersection Observer
- **requestAnimationFrame**: DOM updates are batched using RAF to prevent layout thrashing
- **GPU Acceleration**: CSS transforms use `translateZ(0)` to trigger hardware acceleration
- **CSS Containment**: Tiles use `contain: layout style paint` for rendering isolation

### State Management

The grid component maintains internal state:
- `_items`: Array of grid items
- `_state`: Current grid state ('idle' | 'item-expanded' | 'loading')
- `expandedCard`: Reference to currently expanded card instance
- `cards`: Map of card instances by item ID
- `imageLoadCache`: Shared cache for preloaded images across all cards
- `preloadedImages`: Map of preloaded images by card element

Each card maintains its own state:
- `isExpanded`: Whether the card is currently expanded
- `overlayElements`: Map of overlay elements by position

### Animation System

Animations use CSS transitions with cubic-bezier easing:
- Grid column/row changes: 0.3s transition
- Transform/opacity: 0.3s transition
- Hover effects: Immediate transform scale

### Type Safety

TypeScript discriminated unions ensure:
- Type-specific properties are available based on `type` field
- Compile-time checking prevents invalid configurations
- Better IDE autocomplete and error detection

## Limitations

- **Markdown Rendering**: Currently displays markdown as plain text. For full markdown rendering, integrate a library like `marked` or `markdown-it`.
- **PDF Support**: Relies on browser's built-in PDF viewer. Some browsers may require additional configuration.
- **No Server-Side Rendering**: Web Components require client-side JavaScript.

## Contributing

Contributions are welcome! Please ensure:
- TypeScript types are maintained
- Tests pass (`npm test`)
- Code follows existing patterns
- New features include tests
- Card and grid components remain modular and testable

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

When adding new features:
1. Add unit tests in `tests/card.test.ts` for card-specific functionality
2. Add integration tests in `tests/mosaic-grid.test.ts` for grid-level behavior
3. Test both the happy path and edge cases
4. Mock external dependencies (fetch, IntersectionObserver, etc.)
5. Use `requestAnimationFrame` for async DOM updates in tests

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
