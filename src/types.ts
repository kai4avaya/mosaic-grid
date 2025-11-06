
// src/types.ts

export type ContentType = 'image' | 'pdf' | 'markdown' | 'video' | 'external_link' | 'custom';

export type LayoutType = 'normal' | 'wide' | 'tall' | 'big';

export type CustomRenderHandler = (item: MosaicItem) => Promise<string>;

// Preview renderer for custom tile previews (synchronous for performance)
export type PreviewRenderHandler = (item: MosaicItem) => string;

// Overlay position types for card customization
export type OverlayPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';

// Overlay renderer function - receives item and card element, returns HTMLElement
export type OverlayRenderer = (item: MosaicItem, cardElement: HTMLElement) => HTMLElement;

export interface CardCallbacks {
  onExpand?: (card: MosaicCard) => void;
  onCollapse?: (card: MosaicCard) => void;
  onActionClick?: (card: MosaicCard, action: CardAction) => void;
  intersectionObserver?: IntersectionObserver | null;
  imageLoadCache?: Map<string, { image: HTMLImageElement; loaded: boolean }>;
  preloadedImages?: Map<HTMLElement, HTMLImageElement>;
}

// Card action definition
export interface CardAction {
  icon?: string; // Optional icon (can be emoji, SVG, or class name)
  label: string; // Accessibility label
  onClick: (item: MosaicItem, cardElement: HTMLElement) => void;
  position?: OverlayPosition; // Where to place the action button
}

// Card overlay configuration
export interface CardOverlays {
  topRight?: OverlayRenderer;
  topLeft?: OverlayRenderer;
  bottomRight?: OverlayRenderer;
  bottomLeft?: OverlayRenderer;
  center?: OverlayRenderer;
}

// 3. Define the base "stub" for any item
//    All items MUST have a type and a preview image.
interface MosaicItemBase {
  id: string; // A unique ID is crucial for state management
  type: ContentType;
  preview: string; // The image URL for the grid tile (fallback for accessibility/loading)
  previewHtml?: string; // Optional static HTML for custom tile preview
  previewRenderer?: PreviewRenderHandler; // Optional function to generate custom preview HTML
  title?: string; // Optional title for accessibility/tooltips
  layout?: LayoutType;
  // Card customization options
  cardOverlays?: CardOverlays; // Custom overlay elements
  cardActions?: CardAction[]; // Action buttons (e.g., dropdown menus)
}

// 4. Create specific interfaces for each "case"
//    This uses TypeScript's "Discriminated Unions"

export interface ImageItem extends MosaicItemBase {
  type: 'image';
  full: string; // URL for the full-res image in the modal
}

export interface PdfItem extends MosaicItemBase {
  type: 'pdf';
  src: string; // URL to the .pdf file
}

export interface MarkdownItem extends MosaicItemBase {
  type: 'markdown';
  src: string; // URL to the .md file (we'll fetch it)
}

export interface VideoItem extends MosaicItemBase {
  type: 'video';
  src: string; // URL to the .mp4 file
}

export interface LinkItem extends MosaicItemBase {
    type: 'external_link';
    url: string; // URL to open in a new tab
}

export interface CustomItem extends MosaicItemBase {
    type: 'custom';
    handler: CustomRenderHandler; // Required for custom items
}
// 5. The final, public type. It's one of any of our "stubbed" cases.
export type MosaicItem = ImageItem | PdfItem | MarkdownItem | VideoItem | LinkItem | CustomItem

// 6. Define the component's possible states (also "stubbing")
export type GridState = 'idle' | 'item-expanded' | 'loading';
