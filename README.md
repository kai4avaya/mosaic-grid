# Mosaic Grid Package

A framework-agnostic web component for creating beautiful, animated mosaic-style content grids. Display images, PDFs, videos, markdown files, and external links in a responsive grid layout with smooth expand/collapse animations.

> **Inspiration**: This package was originally inspired by the beautiful mosaic grid design from [CodePen by iamsaief](https://codepen.io/iamsaief/pen/jObaoKo). We've reimagined it as a reusable, type-safe web component with enhanced features including lazy loading, custom previews, and support for multiple content types.

## Features

- **Responsive Mosaic Layout** - Automatic grid layout with customizable tile sizes (normal, wide, tall, big)
- **Multiple Content Types** - Support for images, PDFs, videos, markdown files, external links, and custom content
- **Lazy Loading** - Images load automatically as they enter the viewport for optimal performance
- **Custom Previews** - Use custom HTML or render functions for tile previews (gradients, icons, etc.)
- **Smooth Animations** - CSS transitions for expand/collapse interactions
- **Shadow DOM** - Encapsulated styles and markup, preventing conflicts
- **Framework Agnostic** - Works with any framework or vanilla JavaScript
- **TypeScript** - Full type safety with discriminated unions
- **Performance Optimized** - Uses `requestAnimationFrame` and GPU acceleration for smooth interactions

## Installation

```bash
npm install mosaic-grid-package
```

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
    import 'mosaic-grid-package';
    import { MosaicItem } from 'mosaic-grid-package/types';

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

The package is built as a **Web Component** using the Custom Elements API and Shadow DOM:

1. **Custom Element**: `<mosaic-grid-widget>` is registered as a custom HTML element
2. **Shadow DOM**: Styles and markup are encapsulated to prevent conflicts with your page styles
3. **CSS Grid**: Uses CSS Grid Layout for responsive, flexible positioning
4. **Type Safety**: TypeScript discriminated unions ensure type-safe content definitions

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

- **Image**: Displays preview as background, full image on expand. Previews are lazy-loaded by default.
- **PDF**: Embeds PDF in an iframe when expanded
- **Video**: Shows video player with controls
- **Markdown**: Fetches and displays markdown content (currently as plain text)
- **External Link**: Opens URL in new tab
- **Custom**: Uses a custom handler function to render content on click

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
}
```

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

### Project Structure

```
mosaic-grids/
??? src/
?   ??? mosaic-grid.ts    # Main component class
?   ??? types.ts          # TypeScript type definitions
??? demo/
?   ??? index.html        # Demo page
?   ??? main.ts           # Demo implementation
??? tests/
?   ??? mosaic-grid.test.ts  # Test suite
??? dist/                 # Built files
??? package.json
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

The component maintains internal state:
- `_items`: Array of grid items
- `_state`: Current grid state ('idle' | 'item-expanded' | 'loading')
- `expandedTile`: Reference to currently expanded tile

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
