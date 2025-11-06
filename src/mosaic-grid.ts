// src/mosaic-grid.ts
import { MosaicItem, GridState } from './types';
import { MosaicCard, CardCallbacks } from './card';

class MosaicGridWidget extends HTMLElement {
    
    private _items: MosaicItem[] = [];
    private _state: GridState = 'idle';
    private gridWrapper: HTMLDivElement | null = null;
    private expandedCard: MosaicCard | null = null;
    private cards: Map<string, MosaicCard> = new Map();
    private intersectionObserver: IntersectionObserver | null = null;
    // Track preloaded images: Map<tileElement, Image>
    private preloadedImages: Map<HTMLElement, HTMLImageElement> = new Map();
    // Track which full image URLs are currently loading/loaded
    private imageLoadCache: Map<string, { image: HTMLImageElement; loaded: boolean }> = new Map();

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachListeners();
        this.setupIntersectionObserver();
    }

    disconnectedCallback() {
        // Clean up observer and cards when component is removed
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
        // Clean up all cards
        this.cards.forEach(card => card.destroy());
        this.cards.clear();
    }

    public set items(data: MosaicItem[]) {
        this._items = data;
        this.populateGrid();
    }
    
    private render() {
        if (!this.shadowRoot) {
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

                /* 2. Grid Item (Tile/Card) */
                .grid-wrapper > div {
                    border-radius: 5px;
                    overflow: hidden;
                    background-size: cover;
                    background-position: center;
                    cursor: pointer;
                    position: relative;
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
                .grid-wrapper > div.expanded {
                    grid-column: span 2;
                    grid-row: span 2;
                    z-index: 10;
                    opacity: 1;
                    transform: scale(1.05) translateZ(0);
                    will-change: transform, opacity;
                }
                @media (min-width: 768px) {
                    .grid-wrapper > div.expanded {
                        grid-column: span 3;
                        grid-row: span 3;
                    }
                }
                
                /* 5. Card Content Container */
                .card-content {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                
                /* 6. Card Overlay Containers */
                .card-overlay {
                    position: absolute;
                    display: none;
                    pointer-events: none;
                    z-index: 5;
                }
                .card-overlay-top-right {
                    top: 8px;
                    right: 8px;
                }
                .card-overlay-top-left {
                    top: 8px;
                    left: 8px;
                }
                .card-overlay-bottom-right {
                    bottom: 8px;
                    right: 8px;
                }
                .card-overlay-bottom-left {
                    bottom: 8px;
                    left: 8px;
                }
                .card-overlay-center {
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                
                /* Enable pointer events for overlay children */
                .card-overlay > * {
                    pointer-events: auto;
                }
                
                /* 7. Card Action Buttons */
                .card-action-button {
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                    padding: 6px 10px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s;
                }
                .card-action-button:hover {
                    background: rgba(255, 255, 255, 1);
                }
                
                /* 8. Styles for INJECTED content */
                .full-content {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                /* 9. Styles for PDF/MD */
                .full-content-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .markdown-body {
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    padding: 10px;
                    background: #fff;
                    color: #333;
                }
                .markdown-body pre {
                    white-space: pre-wrap;
                }
                
                /* 10. Progressive Image Loading */
                .progressive-image-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                .progressive-image-preview,
                .progressive-image-full {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .progressive-image-preview {
                    opacity: 1;
                    transition: opacity 0.3s ease-in-out;
                }
                .progressive-image-full {
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                .progressive-image-full.loaded {
                    opacity: 1;
                }
                .progressive-image-preview.hidden {
                    opacity: 0;
                }
                
                /* 11. Custom HTML Preview Styling */
                .grid-wrapper > div > .card-content > * {
                    width: 100%;
                    height: 100%;
                    display: block;
                    box-sizing: border-box;
                }
            </style>
            
            <div class="grid-wrapper"></div>
        `;
        this.gridWrapper = this.shadowRoot.querySelector('.grid-wrapper');
    }
    
    private populateGrid() {
        if (!this.gridWrapper) return;
        
        // Clean up existing cards
        this.cards.forEach(card => card.destroy());
        this.cards.clear();
        
        const wrapper = this.gridWrapper;
        wrapper.innerHTML = ''; 
        
        if (this._items.length === 0) return;
        
        // Create card callbacks
        const cardCallbacks: CardCallbacks = {
            onExpand: (card) => this.handleCardExpand(card),
            onCollapse: (card) => this.handleCardCollapse(card),
            onActionClick: (card, action) => this.handleCardAction(card, action),
            intersectionObserver: this.intersectionObserver,
            imageLoadCache: this.imageLoadCache,
            preloadedImages: this.preloadedImages
        };
        
        // Create a card for each item
        this._items.forEach(item => {
            const card = new MosaicCard(item, cardCallbacks);
            const cardElement = card.getElement();
            
            this.cards.set(item.id, card);
            wrapper.appendChild(cardElement);
            
            // Setup intersection observer for lazy loading
            if (!item.previewRenderer && !item.previewHtml && this.intersectionObserver) {
                this.intersectionObserver.observe(cardElement);
            }
        });
    }

    private setupIntersectionObserver() {
        // Check if IntersectionObserver is available (not available in jsdom/test environments)
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }
        
        // Create Intersection Observer for lazy loading images
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const cardElement = entry.target as HTMLElement;
                    const cardId = cardElement.dataset.id;
                    
                    if (cardId && this.cards.has(cardId)) {
                        const card = this.cards.get(cardId)!;
                        card.handleIntersection(entry);
                    }
                });
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.01
            }
        );
    }

    private attachListeners() {
        if (!this.shadowRoot) {
            return;
        }

        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const clickedCardElement = target.closest<HTMLDivElement>('.grid-wrapper > div');

            if (clickedCardElement) {
                const cardId = clickedCardElement.dataset.id;
                if (cardId && this.cards.has(cardId)) {
                    const card = this.cards.get(cardId)!;
                    const item = card.getItem();
                    
                    // Handle external links
                    if (item.type === 'external_link') {
                        window.open((item as any).url, '_blank', 'noopener,noreferrer');
                        return;
                    }
                    
                    // Handle card click
                    this.handleCardClick(card);
                }
            } else {
                // Click outside cards - reset grid
                this.resetGrid();
            }
        });
    }
    
    private async handleCardClick(card: MosaicCard) {
        const isAlreadyExpanded = card.getExpanded();
        
        if (isAlreadyExpanded) {
            // Collapse if already expanded
            requestAnimationFrame(() => {
                this.resetGrid();
            });
            return;
        }

        // Store previous expanded card reference
        const previousCard = this.expandedCard;

        // Batch ALL DOM operations in a single frame
        requestAnimationFrame(async () => {
            // Reset previous card if it exists
            if (previousCard && previousCard !== card) {
                previousCard.collapse();
            }

            // Expand new card
            this.gridWrapper!.classList.add('item-is-expanded');
            this.expandedCard = card;
            this._state = 'item-expanded';
            
            await card.expand();
        });
    }
    
    private handleCardExpand(card: MosaicCard) {
        // Grid-level handling when a card expands
        // This is called by the card after it expands
    }
    
    private handleCardCollapse(card: MosaicCard) {
        // Grid-level handling when a card collapses
        // This is called by the card after it collapses
    }
    
    private handleCardAction(card: MosaicCard, action: any) {
        // Grid-level handling for card action clicks
        // Actions are already handled by the card, this is for grid-level coordination if needed
    }
    
    private resetGrid() {
        // Batch DOM updates to minimize reflows
        if (this.expandedCard) {
            this.expandedCard.collapse();
            this.expandedCard = null;
        }
        
        this.gridWrapper?.classList.remove('item-is-expanded');
        this._state = 'idle';
    }
}

customElements.define('mosaic-grid-widget', MosaicGridWidget);
