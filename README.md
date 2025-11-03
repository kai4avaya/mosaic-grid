# Mosaic Grid Package

A framework-agnostic web component for creating beautiful, animated mosaic-style content grids. Display images, PDFs, videos, markdown files, and external links in a responsive grid layout with smooth expand/collapse animations.

> **Inspiration**: This package was originally inspired by the beautiful mosaic grid design from [CodePen by iamsaief](https://codepen.io/iamsaief/pen/jObaoKo). We've reimagined it as a reusable, type-safe web component with enhanced features including lazy loading, custom previews, and support for multiple content types.

## Features

- ?? **Responsive Mosaic Layout** - Automatic grid layout with customizable tile sizes (normal, wide, tall, big)
- ??? **Multiple Content Types** - Support for images, PDFs, videos, markdown files, and external links
- ? **Smooth Animations** - CSS transitions for expand/collapse interactions
- ?? **Shadow DOM** - Encapsulated styles and markup, preventing conflicts
- ?? **Framework Agnostic** - Works with any framework or vanilla JavaScript
- ?? **TypeScript** - Full type safety with discriminated unions
- ? **Accessible** - ARIA labels and semantic HTML

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

- **Image**: Displays preview as background, full image on expand
- **PDF**: Embeds PDF in an iframe when expanded
- **Video**: Shows video player with controls
- **Markdown**: Fetches and displays markdown content (currently as plain text)
- **External Link**: Opens URL in new tab
- **Other**: Placeholder for custom content types

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
type MosaicItem = ImageItem | PdfItem | MarkdownItem | VideoItem | LinkItem | OtherItem
```

#### `ImageItem`

```typescript
{
  id: string;
  type: 'image';
  preview: string;      // URL for thumbnail/background
  full: string;         // URL for full-resolution image
  title?: string;       // Optional title
  layout?: LayoutType;  // 'normal' | 'wide' | 'tall' | 'big'
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

#### `LayoutType`

```typescript
type LayoutType = 'normal' | 'wide' | 'tall' | 'big';
```

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
  },
  // ... more images
];
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

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any browser supporting:
  - Custom Elements API
  - Shadow DOM
  - CSS Grid

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

### State Management

The component maintains internal state:
- `_items`: Array of grid items
- `_state`: Current grid state ('idle' | 'item-expanded' | 'loading')
- `expandedTile`: Reference to currently expanded tile

### Animation System

Animations use CSS transitions with cubic-bezier easing:
- Grid column/row changes: 0.5s transition
- Transform/opacity: 0.5s transition
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

[Add your license here]

## Links

- [GitHub Repository](https://github.com/yourusername/mosaic-grid)
- [Issue Tracker](https://github.com/yourusername/mosaic-grid/issues)
