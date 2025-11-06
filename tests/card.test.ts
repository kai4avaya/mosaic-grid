// tests/card.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MosaicCard, CardCallbacks } from '../src/card';
import { MosaicItem, ImageItem, PdfItem, VideoItem, MarkdownItem, CustomItem } from '../src/types';

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: ReadonlyArray<number> = [];
    private callback: IntersectionObserverCallback;
    private observedElements: Element[] = [];
    
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        if (options) {
            this.root = options.root || null;
            this.rootMargin = options.rootMargin || '';
            this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0];
        }
    }
    
    observe(target: Element): void {
        this.observedElements.push(target);
    }
    
    unobserve(target: Element): void {
        const index = this.observedElements.indexOf(target);
        if (index > -1) {
            this.observedElements.splice(index, 1);
        }
    }
    
    disconnect(): void {
        this.observedElements = [];
    }
    
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
}

global.IntersectionObserver = MockIntersectionObserver as any;

describe('MosaicCard', () => {
    let mockCallbacks: CardCallbacks;
    let imageLoadCache: Map<string, { image: HTMLImageElement; loaded: boolean }>;
    let preloadedImages: Map<HTMLElement, HTMLImageElement>;
    let intersectionObserver: IntersectionObserver;

    beforeEach(() => {
        imageLoadCache = new Map();
        preloadedImages = new Map();
        intersectionObserver = new MockIntersectionObserver(() => {}) as any;
        
        mockCallbacks = {
            intersectionObserver,
            imageLoadCache,
            preloadedImages
        };
    });

    describe('Card Creation', () => {
        it('should create a card element with correct structure', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();

            expect(element).toBeInstanceOf(HTMLDivElement);
            expect(element.dataset.id).toBe('test-1');
            expect(element.className).toBe('normal');
            expect(element.getAttribute('role')).toBe('button');
        });

        it('should apply layout class correctly', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                layout: 'big'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();

            expect(element.className).toBe('big');
        });

        it('should create overlay containers', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();

            expect(element.querySelector('.card-overlay-top-right')).not.toBeNull();
            expect(element.querySelector('.card-overlay-top-left')).not.toBeNull();
            expect(element.querySelector('.card-overlay-bottom-right')).not.toBeNull();
            expect(element.querySelector('.card-overlay-bottom-left')).not.toBeNull();
            expect(element.querySelector('.card-overlay-center')).not.toBeNull();
        });
    });

    describe('Preview Rendering', () => {
        it('should render preview image with lazy loading setup', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();

            expect(element.dataset.previewUrl).toBe('preview.jpg');
            expect(element.style.backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
        });

        it('should render custom preview HTML', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                previewHtml: '<div>Custom Preview</div>'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();
            const content = element.querySelector('.card-content');

            expect(content?.innerHTML).toContain('Custom Preview');
            expect(element.dataset.previewUrl).toBeUndefined();
        });

        it('should render preview from renderer function', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                previewRenderer: (item) => `<div>Renderer: ${item.id}</div>`
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();
            const content = element.querySelector('.card-content');

            expect(content?.innerHTML).toContain('Renderer: test-1');
        });
    });

    describe('Card Expansion', () => {
        it('should expand and render image content', async () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();

            const element = card.getElement();
            expect(element.classList.contains('expanded')).toBe(true);
            expect(card.getExpanded()).toBe(true);
            
            const content = element.querySelector('.card-content');
            expect(content?.innerHTML).toContain('progressive-image-container');
        });

        it('should expand and render PDF content', async () => {
            const item: PdfItem = {
                id: 'test-1',
                type: 'pdf',
                preview: 'preview.png',
                src: 'document.pdf',
                title: 'Test PDF'
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();

            const element = card.getElement();
            const content = element.querySelector('.card-content');
            
            expect(content?.innerHTML).toContain('iframe');
            expect(content?.innerHTML).toContain('document.pdf');
        });

        it('should expand and render video content', async () => {
            const item: VideoItem = {
                id: 'test-1',
                type: 'video',
                preview: 'preview.png',
                src: 'video.mp4'
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();

            const element = card.getElement();
            const content = element.querySelector('.card-content');
            
            expect(content?.innerHTML).toContain('video');
            expect(content?.innerHTML).toContain('video.mp4');
        });

        it('should not expand if already expanded', async () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();
            
            const expandSpy = vi.spyOn(card as any, 'getContentSync');
            await card.expand();
            
            // Should not call getContentSync again
            expect(expandSpy).not.toHaveBeenCalled();
        });
    });

    describe('Card Collapse', () => {
        it('should collapse expanded card', async () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();
            expect(card.getExpanded()).toBe(true);

            card.collapse();
            
            const element = card.getElement();
            expect(element.classList.contains('expanded')).toBe(false);
            expect(card.getExpanded()).toBe(false);
        });

        it('should restore preview HTML on collapse', async () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                previewHtml: '<div>Custom Preview</div>'
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();
            card.collapse();

            const element = card.getElement();
            const content = element.querySelector('.card-content');
            expect(content?.innerHTML).toContain('Custom Preview');
        });
    });

    describe('Overlays', () => {
        it('should render overlay at top-right position', () => {
            const overlayElement = document.createElement('div');
            overlayElement.textContent = 'Overlay Content';
            
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                cardOverlays: {
                    topRight: () => overlayElement
                }
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();
            const overlayContainer = element.querySelector('.card-overlay-top-right');

            expect(overlayContainer?.contains(overlayElement)).toBe(true);
            expect(overlayContainer?.style.display).toBe('block');
        });

        it('should render multiple overlays', () => {
            const topRightOverlay = document.createElement('div');
            topRightOverlay.textContent = 'Top Right';
            
            const bottomLeftOverlay = document.createElement('div');
            bottomLeftOverlay.textContent = 'Bottom Left';

            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                cardOverlays: {
                    topRight: () => topRightOverlay,
                    bottomLeft: () => bottomLeftOverlay
                }
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();

            expect(element.querySelector('.card-overlay-top-right')?.textContent).toBe('Top Right');
            expect(element.querySelector('.card-overlay-bottom-left')?.textContent).toBe('Bottom Left');
        });

        it('should allow programmatic overlay addition', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const overlayElement = document.createElement('div');
            overlayElement.textContent = 'Dynamic Overlay';

            card.addOverlay('top-left', () => overlayElement);

            const element = card.getElement();
            const overlayContainer = element.querySelector('.card-overlay-top-left');
            expect(overlayContainer?.contains(overlayElement)).toBe(true);
        });
    });

    describe('Card Actions', () => {
        it('should render action buttons', () => {
            const onClick = vi.fn();
            
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                cardActions: [
                    {
                        label: 'Edit',
                        icon: '✏️',
                        onClick
                    }
                ]
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();
            const actionButton = element.querySelector('.card-action-button') as HTMLButtonElement;

            expect(actionButton).not.toBeNull();
            expect(actionButton.getAttribute('aria-label')).toBe('Edit');
            expect(actionButton.innerHTML).toBe('✏️');
        });

        it('should call action onClick handler on click', () => {
            const onClick = vi.fn();
            
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                cardActions: [
                    {
                        label: 'Delete',
                        onClick
                    }
                ]
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();
            const actionButton = element.querySelector('.card-action-button') as HTMLButtonElement;

            actionButton.click();
            expect(onClick).toHaveBeenCalledWith(item, element);
        });

        it('should prevent card click when action is clicked', () => {
            const onClick = vi.fn();
            const onExpand = vi.fn();
            
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg',
                cardActions: [
                    {
                        label: 'Action',
                        onClick
                    }
                ]
            };

            const callbacks = { ...mockCallbacks, onExpand };
            const card = new MosaicCard(item, callbacks);
            const element = card.getElement();
            const actionButton = element.querySelector('.card-action-button') as HTMLButtonElement;

            // Click action button
            actionButton.click();
            
            // Card should not expand
            expect(onExpand).not.toHaveBeenCalled();
            expect(onClick).toHaveBeenCalled();
        });
    });

    describe('Image Preloading', () => {
        it('should setup hover preloading for image items', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();

            // Simulate hover
            const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
            element.dispatchEvent(mouseEnterEvent);

            // Wait for timeout
            return new Promise(resolve => {
                setTimeout(() => {
                    // Image should be in cache
                    expect(imageLoadCache.has('full.jpg')).toBe(true);
                    resolve(undefined);
                }, 150);
            });
        });
    });

    describe('Intersection Observer', () => {
        it('should handle intersection for lazy loading', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();

            // Initially no background image
            expect(element.style.backgroundImage).toBe('');
            expect(element.dataset.previewUrl).toBe('preview.jpg');

            // Simulate intersection
            const mockEntry = {
                target: element,
                isIntersecting: true,
                intersectionRatio: 1.0,
                boundingClientRect: element.getBoundingClientRect(),
                rootBounds: null,
                intersectionRect: element.getBoundingClientRect(),
                time: Date.now()
            } as IntersectionObserverEntry;

            card.handleIntersection(mockEntry);

            // Background image should be set
            expect(element.style.backgroundImage).toContain('preview.jpg');
            expect(element.dataset.previewUrl).toBeUndefined();
            expect(element.style.backgroundColor).toBe('');
        });
    });

    describe('Card Cleanup', () => {
        it('should cleanup resources on destroy', () => {
            const item: ImageItem = {
                id: 'test-1',
                type: 'image',
                preview: 'preview.jpg',
                full: 'full.jpg'
            };

            const card = new MosaicCard(item, mockCallbacks);
            const element = card.getElement();
            
            // Setup observer
            intersectionObserver.observe(element);
            expect(intersectionObserver.takeRecords().length).toBe(0); // Mock returns empty

            // Destroy card
            card.destroy();

            // Should be cleaned up (unobserved)
            expect(preloadedImages.has(element)).toBe(false);
        });
    });

    describe('Async Content Loading', () => {
        it('should handle markdown loading', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                text: async () => '# Markdown Content'
            } as Response);

            const item: MarkdownItem = {
                id: 'test-1',
                type: 'markdown',
                preview: 'preview.png',
                src: 'content.md'
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();

            const element = card.getElement();
            const content = element.querySelector('.card-content');
            
            // Should show loading state first, then content
            expect(content?.innerHTML).toContain('markdown-body');
        });

        it('should handle custom handler', async () => {
            const handler = vi.fn().mockResolvedValue('<div>Custom Content</div>');
            
            const item: CustomItem = {
                id: 'test-1',
                type: 'custom',
                preview: 'preview.png',
                handler
            };

            const card = new MosaicCard(item, mockCallbacks);
            await card.expand();

            expect(handler).toHaveBeenCalledWith(item);
        });
    });
});
