// src/mosaic-grid.ts
import { MosaicItem, LayoutType, GridState, MarkdownItem, PdfItem } from './types';

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
        this.shadowRoot!.innerHTML = `
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
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                                opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                                grid-column 0.5s cubic-bezier(0.23, 1, 0.32, 1),
                                grid-row 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .grid-wrapper > div:hover {
                    transform: scale(1.02); 
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
                    transform: scale(0.9);
                }
                .grid-wrapper > div.expanded {
                    grid-column: span 2;
                    grid-row: span 2;
                    z-index: 10;
                    opacity: 1;
                    transform: scale(1.05);
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
            </style>
            
            <div class="grid-wrapper"></div>
        `;
        this.gridWrapper = this.shadowRoot!.querySelector('.grid-wrapper');
    }
    
    private populateGrid() {
        if (!this.gridWrapper) return;
        this.gridWrapper.innerHTML = ''; 
        
        if (this._items.length === 0) return;
        
        this._items.forEach(item => {
            const div = document.createElement('div');
            div.className = item.layout || 'normal';
            div.style.backgroundImage = `url(${item.preview})`;
            div.dataset.id = item.id;
            div.setAttribute('role', 'button');
            div.setAttribute('aria-label', `View ${item.title || item.type}`);
            this.gridWrapper!.appendChild(div);
        });
    }

    private attachListeners() {
        this.shadowRoot!.addEventListener('click', (e) => {
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
    
    private onItemClick(item: MosaicItem, tile: HTMLDivElement) {
        if (item.type === 'external_link') {
            window.open(item.url, '_blank', 'noopener,noreferrer');
            return;
        }

        const isAlreadyExpanded = tile.classList.contains('expanded');
        this.resetGrid(); 

        if (isAlreadyExpanded) {
            return;
        }

        this.gridWrapper!.classList.add('item-is-expanded');
        tile.classList.add('expanded');
        this.expandedTile = tile; 
        this._state = 'item-expanded';

        tile.innerHTML = this._generateInlineContent(item);
        
        if (item.type === 'markdown') {
            this._fetchMarkdown(item);
        }
        
        tile.style.backgroundImage = 'none';
    }
    
    private resetGrid() {
        this.gridWrapper?.classList.remove('item-is-expanded');
        this._state = 'idle';
        
        if (this.expandedTile) {
            this.expandedTile.classList.remove('expanded');
            
            const item = this._items.find(i => i.id === this.expandedTile!.dataset.id);
            if (item) {
                this.expandedTile.style.backgroundImage = `url(${item.preview})`;
            }
            this.expandedTile.innerHTML = '';
            this.expandedTile = null;
        }
    }

    // This function now handles all inline cases
    private _generateInlineContent(item: MosaicItem): string {
        switch (item.type) {
            case 'image':
                return `<img src="${item.full}" alt="${item.title || ''}" class="full-content">`;
            case 'video':
                return `<video src="${item.src}" controls autoplay muted class="full-content"></video>`;
            case 'pdf':
                return `<iframe src="${(item as PdfItem).src}" class="full-content-iframe" title="${item.title || 'PDF Document'}"></iframe>`;
            case 'markdown':
                return `<div class="markdown-body">Loading Markdown...</div>`;
            default:
                return `<p>Unsupported content type for inline view.</p>`;
        }
    }
    
    // Async helper to fetch and render markdown
    private async _fetchMarkdown(item: MarkdownItem) {
        try {
            const response = await fetch(item.src);
            if (!response.ok) throw new Error('Network response was not ok');
            const mdText = await response.text();
            
            const mdContent = this.shadowRoot!.querySelector('.markdown-body');
            if (mdContent) {
                // In a real package, you'd bundle a parser like 'marked'
                mdContent.innerHTML = `<pre>${mdText}</pre>`;
            }
        } catch (error) {
            const mdContent = this.shadowRoot!.querySelector('.markdown-body');
            if (mdContent) mdContent.innerHTML = `<p>Error loading content.</p>`;
        }
    }
}

customElements.define('mosaic-grid-widget', MosaicGridWidget);
