// src/mosaic-grid.ts
import { MosaicItem, LayoutType, GridState, MarkdownItem, PdfItem, CustomItem, ImageItem, VideoItem, PreviewRenderHandler } from './types';

class MosaicGridWidget extends HTMLElement {
    
    private _items: MosaicItem[] = [];
    private _state: GridState = 'idle';
    private gridWrapper: HTMLDivElement | null = null;
    private expandedTile: HTMLDivElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachListeners();
    }

    public set items(data: MosaicItem[]) {
        this._items = data;
        this.populateGrid();
    }
    
    private render() {
        if (!this.shadowRoot) {
            console.error('Shadow root not available');
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                * { box-sizing: border-box; }

                /* 1. Grid Wrapper */
                .grid-wrapper {
                    display: grid;
                    grid-gap: 10px;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    grid-auto-rows: 200px;
                }

                /* 2. Grid Item (Tile) */
                .grid-wrapper > div {
                    border-radius: 5px;
                    overflow: hidden; /* This is good! */
                    background-size: cover;
                    background-position: center;
                    cursor: pointer;
                    /* GPU acceleration and containment for better performance */
                    will-change: transform, opacity;
                    contain: layout style paint;
                    /* Optimized transitions - shorter duration, use transform for GPU */
                    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                                opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                                grid-column 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                                grid-row 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    /* Force GPU acceleration */
                    transform: translateZ(0);
                }
                .grid-wrapper > div:hover {
                    transform: scale(1.02) translateZ(0); 
                }

                /* 3. Layout Classes */
                .grid-wrapper .wide { grid-column: span 2; }
                .grid-wrapper .tall { grid-row: span 2; }
                .grid-wrapper .big {
                    grid-column: span 2;
                    grid-row: span 2;
                }

                /* 4. Click Interaction Styling */
                .grid-wrapper.item-is-expanded > div:not(.expanded) {
                    opacity: 0.3;
                    transform: scale(0.9) translateZ(0);
                }
                .grid-wrapper > div.expanded {
                    grid-column: span 2;
                    grid-row: span 2;
                    z-index: 10;
                    opacity: 1;
                    transform: scale(1.05) translateZ(0);
                    /* Optimize expanded tiles */
                    will-change: transform, opacity;
                }
                @media (min-width: 768px) {
                    .grid-wrapper > div.expanded {
                        grid-column: span 3;
                        grid-row: span 3;
                    }
                }
                
                /* 5. Styles for INJECTED content */
                .full-content {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* Perfect for images */
                }
                
                /* --- NEW STYLES FOR PDF/MD --- */
                .full-content-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .markdown-body {
                    width: 100%;
                    height: 100%;
                    overflow: auto; /* Adds the scrollbar */
                    padding: 10px;
                    background: #fff; /* Give it a background */
                    color: #333;
                }
                .markdown-body pre {
                    white-space: pre-wrap;
                }
                
                /* 6. Custom HTML Preview Styling */
                /* Ensure custom preview HTML fills the tile properly */
                .grid-wrapper > div > * {
                    width: 100%;
                    height: 100%;
                    display: block;
                    box-sizing: border-box;
                }
                /* Note: For flex/grid layouts, users should set display: flex/grid inline */
            </style>
            
            <div class="grid-wrapper"></div>
        `;
        this.gridWrapper = this.shadowRoot.querySelector('.grid-wrapper');
        
        if (!this.gridWrapper) {
            console.error('Failed to find grid-wrapper element in shadow DOM');
        }
    }
    
    private populateGrid() {
        if (!this.gridWrapper) return;
        
        const wrapper = this.gridWrapper; // Store reference for TypeScript narrowing
        wrapper.innerHTML = ''; 
        
        if (this._items.length === 0) return;
        
        this._items.forEach(item => {
            const div = document.createElement('div');
            div.className = item.layout || 'normal';
            div.dataset.id = item.id;
            div.setAttribute('role', 'button');
            div.setAttribute('aria-label', `View ${item.title || item.type}`);
            
            // Custom preview rendering: priority: previewRenderer > previewHtml > preview image
            if (item.previewRenderer) {
                // Dynamic preview from function
                div.innerHTML = item.previewRenderer(item);
            } else if (item.previewHtml) {
                // Static HTML preview
                div.innerHTML = item.previewHtml;
            } else {
                // Default: background image
                div.style.backgroundImage = `url(${item.preview})`;
            }
            
            wrapper.appendChild(div);
        });
    }

    private attachListeners() {
        if (!this.shadowRoot) {
            console.error('Shadow root not available for attaching listeners');
            return;
        }

        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const clickedTile = target.closest<HTMLDivElement>('.grid-wrapper > div');

            if (clickedTile) {
                const item = this._items.find(i => i.id === clickedTile.dataset.id);
                if (item) this.onItemClick(item, clickedTile);
            } else {
                this.resetGrid();
            }
        });
    }
    
    private async onItemClick(item: MosaicItem, tile: HTMLDivElement) {
        if (item.type === 'external_link') {
            window.open(item.url, '_blank', 'noopener,noreferrer');
            return;
        }

        const isAlreadyExpanded = tile.classList.contains('expanded');
        
        // Safety check: ensure gridWrapper exists
        if (!this.gridWrapper) {
            console.error('Grid wrapper not initialized');
            return;
        }

        // If clicking the same tile, just collapse it
        if (isAlreadyExpanded) {
            // Use RAF to batch the reset
            requestAnimationFrame(() => {
                this.resetGrid();
            });
            return;
        }

        // Store previous expanded tile reference before reset
        const previousTile = this.expandedTile;

        // Batch ALL DOM operations in a single frame to minimize reflows
        requestAnimationFrame(() => {
            // Reset previous tile if it exists (batched with expansion)
            if (previousTile && previousTile !== tile) {
                this._resetTile(previousTile);
            }

            // Expand new tile - all in same frame
            this.gridWrapper!.classList.add('item-is-expanded');
            tile.classList.add('expanded');
            this.expandedTile = tile; 
            this._state = 'item-expanded';

            // Set content immediately for instant visual feedback
            tile.style.backgroundImage = 'none';

            // For synchronous content (images), render final content immediately
            // For async content (markdown, custom), show placeholder then load
            if (this._isSynchronousContent(item)) {
                const contentHTML = this._getContentSync(item);
                tile.innerHTML = contentHTML;
            } else {
                // Show placeholder, then load async content
                tile.innerHTML = this._generateInlineContent(item);
                this._loadContentAsync(item, tile);
            }
        });
    }

    private _resetTile(tile: HTMLDivElement) {
        // Optimized tile reset - avoids finding item if not needed
        tile.classList.remove('expanded');
        const itemId = tile.dataset.id;
        const item = itemId ? this._items.find(i => i.id === itemId) : null;
        if (item) {
            // Clear expanded content first
            tile.innerHTML = '';
            
            // Restore preview based on type (same priority as populateGrid)
            if (item.previewRenderer) {
                // Dynamic preview from function
                tile.innerHTML = item.previewRenderer(item);
            } else if (item.previewHtml) {
                // Static HTML preview
                tile.innerHTML = item.previewHtml;
            } else {
                // Default: background image
                tile.style.backgroundImage = `url(${item.preview})`;
            }
        }
    }

    private async _loadContentAsync(item: MosaicItem, tile: HTMLDivElement) {
        try {
            const contentHTML = await this._getContent(item);

            // Check if tile is still the expanded one before updating
            if (this.expandedTile === tile) {
                // Batch DOM update in next frame
                requestAnimationFrame(() => {
                    if (this.expandedTile === tile) {
                        tile.innerHTML = contentHTML;
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load custom content:', error);
            if (this.expandedTile === tile) {
                requestAnimationFrame(() => {
                    if (this.expandedTile === tile) {
                        tile.innerHTML = `<p>Error loading content.</p>`;
                    }
                });
            }
        }
    }
    
    private resetGrid() {
        // Batch DOM updates to minimize reflows
        if (this.expandedTile) {
            this._resetTile(this.expandedTile);
            this.expandedTile = null;
        }
        
        this.gridWrapper?.classList.remove('item-is-expanded');
        this._state = 'idle';
    }

    private _isSynchronousContent(item: MosaicItem): boolean {
        // Images, videos, and PDFs can be rendered synchronously
        return item.type === 'image' || item.type === 'video' || item.type === 'pdf';
    }

    private _getContentSync(item: MosaicItem): string {
        // Synchronous content generation (no async operations)
        switch (item.type) {
            case 'image':
                const imageItem = item as ImageItem;
                return `<img src=\"${imageItem.full}\" alt=\"${item.title || ''}\" class=\"full-content\">`;
            
            case 'video':
                const videoItem = item as VideoItem;
                return `<video src=\"${videoItem.src}\" controls autoplay muted class=\"full-content\"></video>`;
            
            case 'pdf':
                const pdfItem = item as PdfItem;
                return `<iframe src=\"${pdfItem.src}\" class=\"full-content-iframe\" title=\"${item.title || 'PDF Document'}\"\"></iframe>`;
            
            default:
                return `<p>Unsupported content type for sync rendering.</p>`;
        }
    }

    private async _getContent(item: MosaicItem): Promise<string> {
        // Handle custom type with handler
        if (item.type === 'custom') {
            const customItem = item as CustomItem;
            if (customItem.handler) {
                return await customItem.handler(item);
            }
            return `<p>Custom item missing handler.</p>`;
        }

        // Handle built-in types
        switch (item.type) {
            case 'image':
                const imageItem = item as ImageItem;
                return `<img src="${imageItem.full}" alt="${item.title || ''}" class="full-content">`;
            
            case 'video':
                const videoItem = item as VideoItem;
                return `<video src="${videoItem.src}" controls autoplay muted class="full-content"></video>`;
            
            case 'pdf':
                const pdfItem = item as PdfItem;
                return `<iframe src="${pdfItem.src}" class="full-content-iframe" title="${item.title || 'PDF Document'}""></iframe>`;
            
            case 'markdown':
                return await this._fetchMarkdown(item as MarkdownItem);
            
            default:
                return `<p>Unsupported content type.</p>`;
        }
    }

    // 3. (CHANGED) _fetchMarkdown now *returns* the HTML string
    private async _fetchMarkdown(item: MarkdownItem): Promise<string> {
        try {
            const response = await fetch(item.src);
            if (!response.ok) throw new Error('Network response was not ok');
            const mdText = await response.text();
            // In a real package, you'd bundle a parser like 'marked'
            return `<div class="markdown-body"><pre>${mdText}</pre></div>`;
        } catch (error) {
            return `<div class="markdown-body"><p>Error loading content.</p></div>`;
        }
    }
   
    // This function now handles all inline cases
    private _generateInlineContent(item: MosaicItem): string {
        switch (item.type) {
            case 'image':
                const imageItem = item as ImageItem;
                return `<img src="${imageItem.full}" alt="${item.title || ''}" class="full-content">`;
            
            case 'video':
                const videoItem = item as VideoItem;
                return `<video src="${videoItem.src}" controls autoplay muted class="full-content"></video>`;
            
            case 'pdf':
                const pdfItem = item as PdfItem;
                return `<iframe src="${pdfItem.src}" class="full-content-iframe" title="${item.title || 'PDF Document'}""></iframe>`;
            
            case 'markdown':
                return `<div class="markdown-body">Loading Markdown...</div>`;
            
            case 'custom':
                return `<div class="markdown-body">Loading custom content...</div>`;
            
            default:
                return `<p>Unsupported content type for inline view.</p>`;
        }
    }
}

customElements.define('mosaic-grid-widget', MosaicGridWidget);
