// src/card.ts
import { MosaicItem, ImageItem, PdfItem, VideoItem, MarkdownItem, CustomItem, CardOverlays, CardAction, CardCallbacks} from './types';



/**
 * MosaicCard - A modular card component for mosaic grid items
 * Handles preview rendering, expanded content, overlays, and progressive loading
 */
export class MosaicCard {
  private item: MosaicItem;
  private callbacks: CardCallbacks;
  private element: HTMLDivElement;
  private isExpanded: boolean = false;
  private overlayElements: Map<string, HTMLElement> = new Map();
  private hoverTimeout: number | null = null;

  constructor(item: MosaicItem, callbacks: CardCallbacks = {}) {
    this.item = item;
    this.callbacks = callbacks;
    this.element = this.createCardElement();
    this.setupCard();
  }

  /**
   * Get the card's DOM element
   */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get the associated item
   */
  public getItem(): MosaicItem {
    return this.item;
  }

  /**
   * Check if card is currently expanded
   */
  public getExpanded(): boolean {
    return this.isExpanded;
  }

  /**
   * Create the base card element structure
   */
  private createCardElement(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = this.item.layout || 'normal';
    div.dataset.id = this.item.id;
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', `View ${this.item.title || this.item.type}`);
    
    // Create card structure with overlay containers
    div.innerHTML = `
      <div class="card-content"></div>
      <div class="card-overlay card-overlay-top-right"></div>
      <div class="card-overlay card-overlay-top-left"></div>
      <div class="card-overlay card-overlay-bottom-right"></div>
      <div class="card-overlay card-overlay-bottom-left"></div>
      <div class="card-overlay card-overlay-center"></div>
    `;

    return div;
  }

  /**
   * Setup card: render preview, attach observers, setup overlays
   */
  private setupCard(): void {
    const contentContainer = this.element.querySelector('.card-content') as HTMLElement;
    if (!contentContainer) return;

    // Render preview content
    this.renderPreview(contentContainer);

    // Setup intersection observer for lazy loading (if using background image)
    if (!this.item.previewRenderer && !this.item.previewHtml && this.callbacks.intersectionObserver) {
      this.callbacks.intersectionObserver.observe(this.element);
    }

    // Setup hover preloading for images
    if (this.item.type === 'image') {
      this.setupHoverPreload();
    }

    // Setup overlays
    this.setupOverlays();

    // Setup action buttons
    this.setupActions();
  }

  /**
   * Render preview content based on item configuration
   */
  private renderPreview(container: HTMLElement): void {
    // Priority: previewRenderer > previewHtml > preview image
    if (this.item.previewRenderer) {
      container.innerHTML = this.item.previewRenderer(this.item);
    } else if (this.item.previewHtml) {
      container.innerHTML = this.item.previewHtml;
    } else {
      // Lazy load preview images - store URL in data attribute
      this.element.dataset.previewUrl = this.item.preview;
      this.element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      // Background image will be set by intersection observer
    }
  }

  /**
   * Setup hover preloading for image items
   */
  private setupHoverPreload(): void {
    if (this.item.type !== 'image') return;
    const imageItem = this.item as ImageItem;

    this.element.addEventListener('mouseenter', () => {
      this.hoverTimeout = window.setTimeout(() => {
        this.preloadFullImage(imageItem.full);
      }, 100);
    });

    this.element.addEventListener('mouseleave', () => {
      if (this.hoverTimeout !== null) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
    });
  }

  /**
   * Preload a full image URL and cache it
   */
  private preloadFullImage(fullUrl: string): void {
    if (!this.callbacks.imageLoadCache || !this.callbacks.preloadedImages) return;

    // Check if already cached/loading
    const cached = this.callbacks.imageLoadCache.get(fullUrl);
    if (cached) {
      this.callbacks.preloadedImages.set(this.element, cached.image);
      return;
    }

    // Create new Image object to preload
    const img = new Image();
    img.src = fullUrl;

    // Store in cache
    this.callbacks.imageLoadCache.set(fullUrl, { image: img, loaded: false });
    this.callbacks.preloadedImages.set(this.element, img);

    // Mark as loaded when complete
    img.onload = () => {
      const cached = this.callbacks.imageLoadCache?.get(fullUrl);
      if (cached) {
        cached.loaded = true;
      }
    };

    // Handle errors gracefully
    img.onerror = () => {
      this.callbacks.imageLoadCache?.delete(fullUrl);
      this.callbacks.preloadedImages?.delete(this.element);
    };
  }

  /**
   * Setup custom overlays from item configuration
   */
  private setupOverlays(): void {
    if (!this.item.cardOverlays) return;

    const overlays = this.item.cardOverlays;
    
    if (overlays.topRight) {
      this.addOverlay('top-right', overlays.topRight);
    }
    if (overlays.topLeft) {
      this.addOverlay('top-left', overlays.topLeft);
    }
    if (overlays.bottomRight) {
      this.addOverlay('bottom-right', overlays.bottomRight);
    }
    if (overlays.bottomLeft) {
      this.addOverlay('bottom-left', overlays.bottomLeft);
    }
    if (overlays.center) {
      this.addOverlay('center', overlays.center);
    }
  }

  /**
   * Add an overlay element to a specific position
   */
  public addOverlay(position: string, renderer: (item: MosaicItem, cardElement: HTMLElement) => HTMLElement): void {
    const overlayContainer = this.element.querySelector(`.card-overlay-${position}`) as HTMLElement;
    if (!overlayContainer) return;

    try {
      const overlayElement = renderer(this.item, this.element);
      overlayContainer.appendChild(overlayElement);
      overlayContainer.style.display = 'block';
      this.overlayElements.set(position, overlayElement);
    } catch (error) {
      console.error(`Error rendering overlay at ${position}:`, error);
    }
  }

  /**
   * Setup action buttons
   */
  private setupActions(): void {
    if (!this.item.cardActions || this.item.cardActions.length === 0) return;

    this.item.cardActions.forEach((action, index) => {
      const position = action.position || 'top-right';
      const overlayContainer = this.element.querySelector(`.card-overlay-${position}`) as HTMLElement;
      
      if (!overlayContainer) return;

      const button = document.createElement('button');
      button.className = 'card-action-button';
      button.setAttribute('aria-label', action.label);
      button.setAttribute('data-action-index', index.toString());
      
      if (action.icon) {
        button.innerHTML = action.icon;
      } else {
        button.textContent = action.label;
      }

      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        action.onClick(this.item, this.element);
        this.callbacks.onActionClick?.(this, action);
      });

      overlayContainer.appendChild(button);
      overlayContainer.style.display = 'flex';
      overlayContainer.style.gap = '4px';
      overlayContainer.style.flexDirection = position.includes('bottom') ? 'column-reverse' : 'column';
    });
  }

  /**
   * Expand the card - render full content
   */
  public async expand(): Promise<void> {
    if (this.isExpanded) return;

    this.isExpanded = true;
    this.element.classList.add('expanded');
    this.element.style.backgroundImage = 'none';

    const contentContainer = this.element.querySelector('.card-content') as HTMLElement;
    if (!contentContainer) return;

    // Render expanded content
    if (this.isSynchronousContent(this.item)) {
      const contentHTML = this.getContentSync();
      contentContainer.innerHTML = contentHTML;
      
      if (this.item.type === 'image') {
        this.setupProgressiveImageFade(contentContainer);
      }
    } else {
      contentContainer.innerHTML = this.generateInlineContent();
      await this.loadContentAsync(contentContainer);
    }

    this.callbacks.onExpand?.(this);
  }

  /**
   * Collapse the card - restore preview
   */
  public collapse(): void {
    if (!this.isExpanded) return;

    this.isExpanded = false;
    this.element.classList.remove('expanded');

    const contentContainer = this.element.querySelector('.card-content') as HTMLElement;
    if (!contentContainer) return;

    // Clear expanded content
    contentContainer.innerHTML = '';

    // Restore preview
    if (this.item.previewRenderer) {
      contentContainer.innerHTML = this.item.previewRenderer(this.item);
    } else if (this.item.previewHtml) {
      contentContainer.innerHTML = this.item.previewHtml;
    } else {
      this.element.style.backgroundImage = `url(${this.item.preview})`;
    }

    // Clean up preload reference
    this.callbacks.preloadedImages?.delete(this.element);

    this.callbacks.onCollapse?.(this);
  }

  /**
   * Check if content can be rendered synchronously
   */
  private isSynchronousContent(item: MosaicItem): boolean {
    return item.type === 'image' || item.type === 'video' || item.type === 'pdf';
  }

  /**
   * Get synchronous content HTML
   */
  private getContentSync(): string {
    switch (this.item.type) {
      case 'image':
        return this.generateProgressiveImageHTML(this.item as ImageItem);
      
      case 'video':
        const videoItem = this.item as VideoItem;
        return `<video src="${videoItem.src}" controls autoplay muted class="full-content"></video>`;
      
      case 'pdf':
        const pdfItem = this.item as PdfItem;
        return `<iframe src="${pdfItem.src}" class="full-content-iframe" title="${this.item.title || 'PDF Document'}"></iframe>`;
      
      default:
        return `<p>Unsupported content type for sync rendering.</p>`;
    }
  }

  /**
   * Generate HTML for progressive image loading
   */
  private generateProgressiveImageHTML(item: ImageItem): string {
    const alt = item.title || '';
    const previewUrl = item.preview;
    const fullUrl = item.full;
    
    // Check if image was preloaded
    let preloadedImg: HTMLImageElement | null = null;
    if (this.callbacks.preloadedImages) {
      preloadedImg = this.callbacks.preloadedImages.get(this.element) || null;
    }
    
    const isPreloaded = preloadedImg && preloadedImg.complete && preloadedImg.naturalWidth > 0;
    
    return `
      <div class="progressive-image-container">
        <img src="${previewUrl}" alt="${alt}" class="progressive-image-preview" />
        <img src="${fullUrl}" alt="${alt}" class="progressive-image-full ${isPreloaded ? 'loaded' : ''}" />
      </div>
    `;
  }

  /**
   * Setup progressive image fade-in
   */
  private setupProgressiveImageFade(container: HTMLElement): void {
    const fullImg = container.querySelector('.progressive-image-full') as HTMLImageElement;
    const previewImg = container.querySelector('.progressive-image-preview') as HTMLImageElement;
    
    if (!fullImg || !previewImg) return;
    
    // If already loaded (preloaded), trigger fade immediately
    if (fullImg.complete && fullImg.naturalWidth > 0) {
      requestAnimationFrame(() => {
        fullImg.classList.add('loaded');
        previewImg.classList.add('hidden');
      });
      return;
    }
    
    // Otherwise, wait for load event
    fullImg.addEventListener('load', () => {
      requestAnimationFrame(() => {
        fullImg.classList.add('loaded');
        previewImg.classList.add('hidden');
      });
    }, { once: true });
    
    // Handle errors
    fullImg.addEventListener('error', () => {
      console.warn('Failed to load full image:', fullImg.src);
    }, { once: true });
  }

  /**
   * Generate inline content placeholder
   */
  private generateInlineContent(): string {
    switch (this.item.type) {
      case 'image':
        const imageItem = this.item as ImageItem;
        return `<img src="${imageItem.full}" alt="${this.item.title || ''}" class="full-content">`;
      
      case 'video':
        const videoItem = this.item as VideoItem;
        return `<video src="${videoItem.src}" controls autoplay muted class="full-content"></video>`;
      
      case 'pdf':
        const pdfItem = this.item as PdfItem;
        return `<iframe src="${pdfItem.src}" class="full-content-iframe" title="${this.item.title || 'PDF Document'}"></iframe>`;
      
      case 'markdown':
        return `<div class="markdown-body">Loading Markdown...</div>`;
      
      case 'custom':
        return `<div class="markdown-body">Loading custom content...</div>`;
      
      default:
        return `<p>Unsupported content type for inline view.</p>`;
    }
  }

  /**
   * Load async content (markdown, custom)
   */
  private async loadContentAsync(container: HTMLElement): Promise<void> {
    try {
      const contentHTML = await this.getContent();
      
      // Check if still expanded before updating
      if (this.isExpanded) {
        requestAnimationFrame(() => {
          if (this.isExpanded) {
            container.innerHTML = contentHTML;
          }
        });
      }
    } catch (error) {
      if (this.isExpanded) {
        requestAnimationFrame(() => {
          if (this.isExpanded) {
            container.innerHTML = `<p>Error loading content.</p>`;
          }
        });
      }
    }
  }

  /**
   * Get content HTML (async)
   */
  private async getContent(): Promise<string> {
    if (this.item.type === 'custom') {
      const customItem = this.item as CustomItem;
      if (customItem.handler) {
        return await customItem.handler(this.item);
      }
      return `<p>Custom item missing handler.</p>`;
    }

    switch (this.item.type) {
      case 'image':
        const imageItem = this.item as ImageItem;
        return `<img src="${imageItem.full}" alt="${this.item.title || ''}" class="full-content">`;
      
      case 'video':
        const videoItem = this.item as VideoItem;
        return `<video src="${videoItem.src}" controls autoplay muted class="full-content"></video>`;
      
      case 'pdf':
        const pdfItem = this.item as PdfItem;
        return `<iframe src="${pdfItem.src}" class="full-content-iframe" title="${this.item.title || 'PDF Document'}"></iframe>`;
      
      case 'markdown':
        return await this.fetchMarkdown(this.item as MarkdownItem);
      
      default:
        return `<p>Unsupported content type.</p>`;
    }
  }

  /**
   * Fetch and render markdown content
   */
  private async fetchMarkdown(item: MarkdownItem): Promise<string> {
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

  /**
   * Handle intersection observer callback (for lazy loading)
   */
  public handleIntersection(entry: IntersectionObserverEntry): void {
    if (entry.isIntersecting && this.element.dataset.previewUrl) {
      const previewUrl = this.element.dataset.previewUrl;
      this.element.style.backgroundImage = `url(${previewUrl})`;
      this.element.removeAttribute('data-preview-url');
      this.element.style.backgroundColor = '';
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.hoverTimeout !== null) {
      clearTimeout(this.hoverTimeout);
    }
    this.callbacks.intersectionObserver?.unobserve(this.element);
    this.callbacks.preloadedImages?.delete(this.element);
    this.overlayElements.clear();
  }
}
