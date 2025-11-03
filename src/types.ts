
// src/types.ts

// 1. Define all possible content types we'll support
export type ContentType = 'image' | 'pdf' | 'markdown' | 'video' | 'external_link' | 'other';

// 2. Define the possible layouts (from your original code)
export type LayoutType = 'normal' | 'wide' | 'tall' | 'big';

// 3. Define the base "stub" for any item
//    All items MUST have a type and a preview image.
interface MosaicItemBase {
  id: string; // A unique ID is crucial for state management
  type: ContentType;
  preview: string; // The image URL for the grid tile
  title?: string; // Optional title for accessibility/tooltips
  layout?: LayoutType;
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

export interface OtherItem extends MosaicItemBase {
    type: 'other';
    src?: string;
}
// 5. The final, public type. It's one of any of our "stubbed" cases.
export type MosaicItem = ImageItem | PdfItem | MarkdownItem | VideoItem | LinkItem | OtherItem

// 6. Define the component's possible states (also "stubbing")
export type GridState = 'idle' | 'item-expanded' | 'loading';
